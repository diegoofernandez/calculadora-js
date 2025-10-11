import Termino from './Termino';

export default class OperadorTermino {
    static multiplicar(termA: Termino, termB: Termino): Termino {
        console.log(`✖️ Multiplicando: ${termA.toString()} * ${termB.toString()}`);
        
        // Coeficiente
        const coefA = termA.getCoeficiente();
        const coefB = termB.getCoeficiente();
        const nuevoCoef = coefA * coefB;
        
        // Variables
        const varsA = termA.getVariables();
        const varsB = termB.getVariables();
        const nuevasVars: {[key: string]: number} = {};
        
        // Combinar variables de A
        for (let [variable, grado] of Object.entries(varsA)) {
            nuevasVars[variable] = grado;
        }
        
        // Sumar variables de B
        for (let [variable, grado] of Object.entries(varsB)) {
            nuevasVars[variable] = (nuevasVars[variable] || 0) + grado;
        }
        
        // Crear nuevo término
        return this.crearTerminoDesdePartes(nuevoCoef, nuevasVars);
    }
    
    static dividir(termA: Termino, termB: Termino): Termino {
        console.log(`➗ Dividiendo: ${termA.toString()} / ${termB.toString()}`);
        
        // Verificar divisibilidad
        if (!this.esDivisible(termA, termB)) {
            throw new Error(`No se puede dividir: ${termA.toString()} / ${termB.toString()}`);
        }
        
        // Coeficiente
        const coefA = termA.getCoeficiente();
        const coefB = termB.getCoeficiente();
        const nuevoCoef = coefA / coefB;
        
        // Variables
        const varsA = termA.getVariables();
        const varsB = termB.getVariables();
        const nuevasVars: {[key: string]: number} = {};
        
        for (let [variable, gradoA] of Object.entries(varsA)) {
            const gradoB = varsB[variable] || 0;
            const nuevoGrado = gradoA - gradoB;
            if (nuevoGrado > 0) {
                nuevasVars[variable] = nuevoGrado;
            }
        }
        
        return this.crearTerminoDesdePartes(nuevoCoef, nuevasVars);
    }
    
    static esDivisible(termA: Termino, termB: Termino): boolean {
        const varsA = termA.getVariables();
        const varsB = termB.getVariables();
        
        for (let [variable, gradoB] of Object.entries(varsB)) {
            const gradoA = varsA[variable] || 0;
            if (gradoA < gradoB) {
                console.log(`   ❌ No divisible: ${variable}^${gradoA} < ${variable}^${gradoB}`);
                return false;
            }
        }
        
        // No dividir por cero
        if (termB.getCoeficiente() === 0) {
            return false;
        }
        
        return true;
    }
    
    private static crearTerminoDesdePartes(coef: number, vars: {[key: string]: number}): Termino {
        // Convertir las partes a string representation que entienda Termino
        let repr = '';
        
        if (coef !== 1 && coef !== -1) {
            repr += coef;
        } else if (coef === -1) {
            repr += '-';
        }
        
        for (let [variable, grado] of Object.entries(vars)) {
            if (grado === 1) {
                repr += variable;
            } else {
                repr += `|${variable}^${grado}|`;
            }
        }
        
        return new Termino(repr || '1');
    }
}