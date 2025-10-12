import Termino from './Termino';
import OperadorTermino from './OperadorTermino'; 

export default class MCMTerminos{

    static calcularMCMMultiple(terminos: Termino[]): Termino {
        if (terminos.length === 0) return new Termino("1");
        if (terminos.length === 1) return terminos[0];
        
        let mcmActual = terminos[0];
        
        for (let i = 1; i < terminos.length; i++) {
            mcmActual = this.calcularMCM(mcmActual, terminos[i]);
        }
        
        return mcmActual;
    }

    static calcularMCM(termA: Termino, termB: Termino): Termino {
        
        
        const coefA = Math.abs(termA.getCoeficiente());
        const coefB = Math.abs(termB.getCoeficiente());
        let mcmCoef = 1;
        
        // Solo calcular MCM numérico si AMBOS tienen coeficiente ≠ 1
        if (coefA !== 1 || coefB !== 1) {
            mcmCoef = this.mcmNumerico(coefA, coefB);
        }
        // 2. Combinar todas las variables con máximo exponente
        const varsA = termA.getVariables();
        const varsB = termB.getVariables();
        const varsMCM: {[key: string]: number} = {};
        
        // Todas las variables de ambos términos
        const todasVariables = new Set([
            ...Object.keys(varsA),
            ...Object.keys(varsB)
        ]);
        
        for (let variable of todasVariables) {
            const expA = varsA[variable] || 0;
            const expB = varsB[variable] || 0;
            varsMCM[variable] = Math.max(expA, expB);
        }
        
        
        return OperadorTermino.crearTerminoDesdePartes(mcmCoef, varsMCM);
    }
    
    private static mcmNumerico(a: number, b: number): number {
        if (a === 1) return b;
        if (b === 1) return a;
        return (a * b) / this.mcdNumerico(a, b);
    }
    
    private static mcdNumerico(a: number, b: number): number {
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

}