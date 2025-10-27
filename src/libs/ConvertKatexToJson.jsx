class ConvertKatexToJson{

    katexToSystem = (katexInput) => {
        const cleanInput = katexInput.trim();
        
        // Detectar operación
        let operationType = "ECUL";
        let expression = cleanInput;
        
        const prefixes = {
            'G': 'Grobner',
            'F': 'Fracciones', 
            'P': 'Polinomios',
            'ECUL': 'EcuacionesLineales',
            'ECURA': 'EcuacionesRacionales',
            'PO': 'Potencias',
            'RA': 'Raices'
        };
        
        for (const [prefix, opType] of Object.entries(prefixes)) {
            if (cleanInput.startsWith(prefix + ' ')) {
            operationType = opType;
            expression = cleanInput.substring(prefix.length + 1).trim();
            break;
            }
        }
        
        if (operationType === 'Grobner') {
            return this.parseGrobnerSystem(expression);
        }
        
        return this.parseKatexExpression(expression, operationType);
    };

    parseGrobnerSystem = (expression) => {
        const equations = expression.split(';').map(eq => eq.trim()).filter(eq => eq.length > 0);
        const result = [[{operacion: "Grobner"}]];
        
        equations.forEach(equation => {
            // Verificar que no contenga fracciones ni raíces para Gröbner
            if (equation.includes('\\frac') || equation.includes('\\sqrt')) {
            throw new Error('Gröbner no soporta fracciones ni raíces. Use solo polinomios básicos.');
            }
            
            const monomials = this.parseEquation(equation);
            result.push(monomials);
        });
        
        return result;
    };

    parseEquation = (equation) => {
        const equalIndex = this.findMainEqualSign(equation);
        
        if (equalIndex === -1) {
            throw new Error('No se encontró signo igual en la ecuación: ' + equation);
        }
        
        const leftSide = equation.substring(0, equalIndex).trim();
        const rightSide = equation.substring(equalIndex + 1).trim();
        
        const leftMonomials = this.parsePolynomial(leftSide);
        const rightMonomials = this.parsePolynomial(rightSide);
        
        const finalMonomials = [
            ...leftMonomials,
            ...rightMonomials.map(monomio => ({
            ...monomio,
            coeficiente: -monomio.coeficiente
            }))
        ];
        
        return this.combineLikeTerms(finalMonomials);
    };

    parseKatexExpression = (katexExpr, operationType) => {
        const monomials = this.parseEquation(katexExpr);
        return [[{operacion: operationType}], monomials];
    };

    parsePolynomial = (expr) => {
        const monomials = [];
        
        let workingExpr = expr.replace(/\s+/g, '');
        if (workingExpr[0] !== '+' && workingExpr[0] !== '-') {
            workingExpr = '+' + workingExpr;
        }
        
        let i = 0;
        while (i < workingExpr.length) {
            if (workingExpr[i] === '+' || workingExpr[i] === '-') {
            const sign = workingExpr[i] === '+' ? 1 : -1;
            i++;
            
            let j = i;
            let braceCount = 0;
            let bracketCount = 0;
            let parenCount = 0;
            
            while (j < workingExpr.length) {
                const char = workingExpr[j];
                if (char === '{') braceCount++;
                else if (char === '}') braceCount--;
                else if (char === '[') bracketCount++;
                else if (char === ']') bracketCount--;
                else if (char === '(') parenCount++;
                else if (char === ')') parenCount--;
                else if (braceCount === 0 && bracketCount === 0 && parenCount === 0 && 
                        (char === '+' || char === '-')) {
                break;
                }
                j++;
            }
            
            const term = workingExpr.substring(i, j);
            const monomio = this.parseSimpleTerm(term, sign);
            
            if (monomio) {
                monomials.push(monomio);
            }
            
            i = j;
            } else {
            i++;
            }
        }
        
        return monomials;
    };

    parseSimpleTerm = (term, sign) => {
        if (!term) return null;
        
        let coefficient = sign;
        let remainingTerm = term;
        const parts = [];
        
        // Extraer coeficiente numérico
        const numMatch = remainingTerm.match(/^([0-9]*\.?[0-9]+)/);
        if (numMatch) {
            coefficient = sign * parseFloat(numMatch[1]);
            remainingTerm = remainingTerm.substring(numMatch[1].length);
            
            if (remainingTerm.startsWith('\\cdot') || remainingTerm.startsWith('*')) {
            remainingTerm = remainingTerm.substring(remainingTerm.startsWith('\\cdot') ? 5 : 1);
            }
        }
        
        // Parsear variables simples
        if (remainingTerm) {
            let i = 0;
            while (i < remainingTerm.length) {
            if (remainingTerm[i].match(/[a-zA-Z]/)) {
                const varName = remainingTerm[i];
                i++;
                
                let exponent = 1;
                if (i < remainingTerm.length && remainingTerm[i] === '^') {
                i++;
                if (remainingTerm[i] === '{') {
                    const expContent = this.extractBracesContent(remainingTerm, i);
                    if (expContent) {
                    exponent = parseFloat(expContent[0]) || 1;
                    i += expContent[1];
                    }
                } else if (remainingTerm[i].match(/[0-9]/)) {
                    exponent = parseInt(remainingTerm[i]);
                    i++;
                }
                }
                
                parts.push({
                objeto: "Potencia",
                base: varName,
                exponente: exponent
                });
            } else {
                i++;
            }
            }
        }
        
        // Determinar formato del coeficiente según el AST del backend
        let coeficienteFinal;
        if (parts.length === 0) {
            coeficienteFinal = [coefficient];
        } else {
            coeficienteFinal = coefficient;
        }
        
        return {
            type: "Monomio",
            coeficiente: coeficienteFinal,
            partes: parts
        };
    };

    findMainEqualSign = (expr) => {
        let bracketCount = 0;
        let braceCount = 0;
        let parenCount = 0;
        
        for (let i = 0; i < expr.length; i++) {
            const char = expr[i];
            
            if (char === '{') braceCount++;
            else if (char === '}') braceCount--;
            else if (char === '[') bracketCount++;
            else if (char === ']') bracketCount--;
            else if (char === '(') parenCount++;
            else if (char === ')') parenCount--;
            else if (char === '=' && braceCount === 0 && bracketCount === 0 && parenCount === 0) {
            return i;
            }
        }
        
        return -1;
    };

    extractBracesContent = (str, startIndex) => {
        if (str[startIndex] !== '{') return null;
        
        let count = 1;
        let content = '';
        let i = startIndex + 1;
        
        while (i < str.length && count > 0) {
            if (str[i] === '{') count++;
            else if (str[i] === '}') count--;
            
            if (count > 0) content += str[i];
            i++;
        }
        
        return count === 0 ? [content, i - startIndex] : null;
    };

    combineLikeTerms = (monomials) => {
        const combined = {};
        
        monomials.forEach(monomio => {
            const key = monomio.partes
            .map(p => `${p.base}^${p.exponente}`)
            .sort()
            .join('*');
            
            if (combined[key]) {
            if (Array.isArray(combined[key].coeficiente) && Array.isArray(monomio.coeficiente)) {
                combined[key].coeficiente[0] += monomio.coeficiente[0];
            } else if (Array.isArray(combined[key].coeficiente)) {
                combined[key].coeficiente[0] += monomio.coeficiente;
            } else if (Array.isArray(monomio.coeficiente)) {
                combined[key].coeficiente = [combined[key].coeficiente + monomio.coeficiente[0]];
            } else {
                combined[key].coeficiente += monomio.coeficiente;
            }
            } else {
            combined[key] = {...monomio};
            }
        });
        
        return Object.values(combined).filter(m => {
            if (Array.isArray(m.coeficiente)) {
            return Math.abs(m.coeficiente[0]) > 1e-10;
            }
            return Math.abs(m.coeficiente) > 1e-10;
        });
    };

}

export default ConvertKatexToJson; 