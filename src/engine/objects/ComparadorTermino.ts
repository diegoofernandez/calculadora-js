import Termino from './Termino';

export default class ComparadorTermino{

    static comparar(termA: Termino, termB: Termino): number{
        

        const gradoTotalA = this.calcularGradoTotal(termA);
        const gradoTotalB = this.calcularGradoTotal(termB);
        
        if (gradoTotalA > gradoTotalB) return 1;
        if (gradoTotalA < gradoTotalB) return -1;
        
        return this.compararLexicografico(termA, termB);

    }
    
    private static calcularGradoTotal(termino: Termino): number{

        const vars = termino.getVariables();
        return Object.values(vars).reduce((sum, grado) => sum + grado, 0);

    }
    
    private static compararLexicografico(termA: Termino, termB: Termino): number{

        const orden = ['x', 'y', 'z', 'w', 'v', 'u'];
        const varsA = termA.getVariables();
        const varsB = termB.getVariables();
        
        for (let variable of orden){

            const gradoA = varsA[variable] || 0;
            const gradoB = varsB[variable] || 0;
            
            console.log(`   ${variable}: ${gradoA} vs ${gradoB}`);
            
            if (gradoA > gradoB) return 1;
            if (gradoA < gradoB) return -1;

        }
        
        return 0;

    }
    
    static esMayor(termA: Termino, termB: Termino): boolean{

        return this.comparar(termA, termB) === 1;
    
    }
    
    static esMenor(termA: Termino, termB: Termino): boolean{

        return this.comparar(termA, termB) === -1;

    }
    
    static sonIguales(termA: Termino, termB: Termino): boolean{

        return this.comparar(termA, termB) === 0;

    }

}