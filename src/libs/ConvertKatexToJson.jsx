class ConvertKatexToJson {
    
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
            'RA': 'Raices',
            'SIM': 'Simplificar',
            'EVAL': 'Evaluar'
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
            const monomials = this.parseEquation(equation);
            result.push(monomials);
        });
        
        return result;
    };

    parseKatexExpression = (katexExpr, operationType) => {
        // Para operaciones que no son sistemas de ecuaciones
        if (['Simplificar', 'Evaluar', 'Fracciones', 'Potencias', 'Raices'].includes(operationType)) {
            const parsed = this.parseComplexExpression(katexExpr);
            return [[{operacion: operationType}], parsed];
        }
        
        // Para ecuaciones
        const monomials = this.parseEquation(katexExpr);
        return [[{operacion: operationType}], monomials];
    };

    // NUEVO: Parseador de expresiones complejas
    parseComplexExpression = (expr) => {
        return this.parseExpressionRecursive(expr.trim());
    };

    parseExpressionRecursive = (expr) => {
        if (!expr) return null;

        // Quitar paréntesis externos si existen
        expr = this.removeOuterParentheses(expr);

        // Buscar operadores por nivel de precedencia
        const operators = [
            { regex: /\+/, type: "Suma" },
            { regex: /-/, type: "Resta" },
            { regex: /\\cdot|\\times|\*/, type: "Multiplicacion" },
            { regex: /\\div|\//, type: "Division" },
            { regex: /\^/, type: "Potencia" }
        ];

        for (const op of operators) {
            const position = this.findOperatorPosition(expr, op.regex);
            if (position !== -1) {
                const left = expr.substring(0, position).trim();
                const right = expr.substring(position + 1).trim();
                
                return {
                    type: op.type,
                    izquierda: this.parseExpressionRecursive(left),
                    derecha: this.parseExpressionRecursive(right)
                };
            }
        }

        // Si no hay operadores, es un término simple
        return this.parseSimpleTermComplex(expr);
    };

    // NUEVO: Parsear términos simples (fracciones, raíces, números, variables)
    parseSimpleTermComplex = (term) => {
        term = term.trim();

        // Fracción \frac{a}{b}
        const fractionMatch = term.match(/^\\frac\{([^}]+)\}\{([^}]+)\}$/);
        if (fractionMatch) {
            return {
                type: "Fraccion",
                numerador: this.parseExpressionRecursive(fractionMatch[1]),
                denominador: this.parseExpressionRecursive(fractionMatch[2])
            };
        }

        // Raíz cuadrada \sqrt{a} o \sqrt[n]{a}
        const rootMatch = term.match(/^\\sqrt(\[([^\]]+)\])?\{([^}]+)\}$/);
        if (rootMatch) {
            return {
                type: "Raiz",
                indice: rootMatch[2] ? this.parseExpressionRecursive(rootMatch[2]) : { type: "Numero", valor: 2 },
                radicando: this.parseExpressionRecursive(rootMatch[3])
            };
        }

        // Potencia con base compleja
        const powerMatch = term.match(/^(.+)\^\{([^}]+)\}$/);
        if (powerMatch) {
            return {
                type: "Potencia",
                base: this.parseExpressionRecursive(powerMatch[1]),
                exponente: this.parseExpressionRecursive(powerMatch[2])
            };
        }

        // Número (entero o decimal)
        const numberMatch = term.match(/^-?\d*\.?\d+$/);
        if (numberMatch) {
            return {
                type: "Numero",
                valor: parseFloat(term)
            };
        }

        // Variable simple
        const variableMatch = term.match(/^[a-zA-Z]$/);
        if (variableMatch) {
            return {
                type: "Variable",
                nombre: term
            };
        }

        // Paréntesis
        if (term.startsWith('(') && term.endsWith(')')) {
            return this.parseExpressionRecursive(term.substring(1, term.length - 1));
        }

        // Si no coincide con nada, retornar como string
        return {
            type: "Literal",
            valor: term
        };
    };

    // MÉTODOS AUXILIARES
    findOperatorPosition = (expr, regex) => {
        let parenCount = 0;
        let braceCount = 0;
        let bracketCount = 0;

        for (let i = 0; i < expr.length; i++) {
            const char = expr[i];
            
            if (char === '(') parenCount++;
            else if (char === ')') parenCount--;
            else if (char === '{') braceCount++;
            else if (char === '}') braceCount--;
            else if (char === '[') bracketCount++;
            else if (char === ']') bracketCount--;

            if (parenCount === 0 && braceCount === 0 && bracketCount === 0) {
                const remaining = expr.substring(i);
                const match = remaining.match(regex);
                if (match && match.index === 0) {
                    return i;
                }
            }
        }
        return -1;
    };

    removeOuterParentheses = (expr) => {
        let count = 0;
        let canRemove = true;

        for (let i = 0; i < expr.length; i++) {
            if (expr[i] === '(') count++;
            else if (expr[i] === ')') count--;

            if (count === 0 && i < expr.length - 1) {
                canRemove = false;
                break;
            }
        }

        if (canRemove && expr.startsWith('(') && expr.endsWith(')')) {
            return expr.substring(1, expr.length - 1);
        }
        return expr;
    };

    // MÉTODOS ORIGINALES (preservados)
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