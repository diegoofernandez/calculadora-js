export default class Grobner{

    private basesG: Termino[][] = [[
        { coeficiente: 1, variables: [['x', 3]] },
        { coeficiente: -2, variables: [['x', 1], ['y', 1]] }
    ],
    [
        { coeficiente: 1, variables: [['x', 2], ['y', 1]] },
        { coeficiente: -1, variables: [['y', 2]] }
    ]];

    constructor(polinomios: Termino[][]){
        this.basesG = polinomios; 
        this.construirBaseGroebner();
        this.mostrarBaseFinal();
    }

    private mostrarProcesoSPolinomio(i: number, j: number, base: Termino[][], resto: Termino[]): void{

        console.log(`\n S-polinomio de (P${i}, P${j}):`);
        console.log(`   P${i}:`, base[i].map(t => this.terminoAString(t)).join(" + "));
        console.log(`   P${j}:`, base[j].map(t => this.terminoAString(t)).join(" + "));
        console.log(`   Resto:`, resto.map(t => this.terminoAString(t)).join(" + "));
        console.log(`   Es cero?:`, this.esCero(resto));

    }

    private encontrarTerminoLider(polinomio: Termino[]): Termino{ 

        let terminoLider = polinomio[0];
    
        for (let i = 1; i < polinomio.length; i++){

            if (this.compararTerminos(polinomio[i], terminoLider) > 0){

                terminoLider = polinomio[i];  

            }
        }
        
        return terminoLider;

    }

    private compararTerminos(a: Termino, b: Termino): number{

        // Primero por grado total
        const gradoA = this.calcularGradoTotal(a);
        const gradoB = this.calcularGradoTotal(b);
        
        if (gradoA > gradoB) return 1;
        if (gradoA < gradoB) return -1;
        
        // Mismo grado - orden lexicográfico
        return this.compararLexicografico(a, b);

    }

    private calcularGradoTotal(termino: Termino): number{

        return termino.variables.reduce((sum, [_, exp]) => sum + exp, 0);

    }

    private compararLexicografico(a: Termino, b: Termino): number{

        const strA = this.terminoAString(a);
        const strB = this.terminoAString(b);
        return strB.localeCompare(strA); // Descendente

    }

    private terminoAString(termino: Termino): string{

        let resultado = "";
        
        if (termino.coeficiente !== 1 || termino.variables.length === 0){

            resultado += termino.coeficiente;

        }
        
        for (let [v, exp] of termino.variables){

            if (exp === 1){

                resultado += v;

            }else{

                resultado += v + "^" + exp;

            }

        }
        
        return resultado;

    }

    private calcularMCM(a: Termino, b: Termino): Termino{

        
        const mcmCoef = this.mcmNumerico(
            Math.abs(a.coeficiente), 
            Math.abs(b.coeficiente)
        );
        
        
        const todasVariables = new Set<string>();
        a.variables.forEach(([v, _]) => todasVariables.add(v));
        b.variables.forEach(([v, _]) => todasVariables.add(v));
        
        const varsMCM: [string, number][] = [];
        
        for (let variable of todasVariables){

            const expA = this.obtenerExponente(a, variable);
            const expB = this.obtenerExponente(b, variable);
            const maxExp = Math.max(expA, expB);
            
            if (maxExp > 0){

                varsMCM.push([variable, maxExp]);

            }

        }
        
        return{
            coeficiente: mcmCoef,  
            variables: varsMCM
        };

    }

    private obtenerExponente(termino: Termino, variable: string): number{

        const found = termino.variables.find(([v, _]) => v === variable);
        return found ? found[1] : 0;

    }

    private mcmNumerico(a: number, b: number): number{

        return (a * b) / this.mcdNumerico(a, b);

    }

    private mcdNumerico(a: number, b: number): number{

        while (b !== 0){

            const temp = b;
            b = a % b;
            a = temp;

        }

        return a;

    }

    private dividirTerminos(dividendo: Termino, divisor: Termino): Termino{

        const nuevoCoef = dividendo.coeficiente / divisor.coeficiente;
        
        const nuevasVars: [string, number][] = [];
        
        for (let [varD, expD] of dividendo.variables){

            const expDivisor = this.obtenerExponente(divisor, varD);
            const nuevoExp = expD - expDivisor;

            if(nuevoExp > 0){

                nuevasVars.push([varD, nuevoExp]);

            }

        }
        
        return {
            coeficiente: nuevoCoef,
            variables: nuevasVars
        };

    }

    private multiplicarPolinomioPorTermino(polinomio: Termino[], termino: Termino): Termino[]{

        const resultado: Termino[] = [];
        
        for (let term of polinomio){


            const producto = this.multiplicarTerminos(term, termino);
            resultado.push(producto);

        }
        
        return resultado;

    }

    private multiplicarTerminos(a: Termino, b: Termino): Termino{

        
        const nuevoCoef = a.coeficiente * b.coeficiente;
        
        
        const todasVariables = new Map<string, number>();
        
        
        for (let [v, exp] of a.variables){

            todasVariables.set(v, exp);

        }
        
        
        for (let [v, exp] of b.variables){

            const expActual = todasVariables.get(v) || 0;
            todasVariables.set(v, expActual + exp);

        }
        
        
        const nuevasVars: [string, number][] = [];

        for (let [v, exp] of todasVariables){

            nuevasVars.push([v, exp]);

        }
        
        return{
            coeficiente: nuevoCoef,
            variables: nuevasVars
        };

    }

    private restarPolinomios(poliA: Termino[], poliB: Termino[]): Termino[]{

        const poliBNegado: Termino[] = [];

        for (let term of poliB){

            poliBNegado.push({
                coeficiente: -term.coeficiente,
                variables: [...term.variables] 
            });

        }
        
       
        const todosTerminos = [...poliA, ...poliBNegado];
        
        
        return this.simplificarPolinomio(todosTerminos);

    }

    private simplificarPolinomio(terminos: Termino[]): Termino[]{

        const combinados: Termino[] = [];
        
        for (let term of terminos){

            let encontrado = false;
            
            for (let i = 0; i < combinados.length; i++){

                if (this.sonEquivalentes(term, combinados[i])){

                    // Combinar coeficientes
                    combinados[i].coeficiente += term.coeficiente;
                    encontrado = true;
                    break;

                }

            }
            
            if (!encontrado){

                combinados.push({...term}); 

            }

        }
        
        return combinados.filter(term => term.coeficiente !== 0);

    }

    private sonEquivalentes(a: Termino, b: Termino): boolean{

        
        if (a.variables.length !== b.variables.length) return false;
        
        
        const varsA = [...a.variables].sort(([v1], [v2]) => v1.localeCompare(v2));
        const varsB = [...b.variables].sort(([v1], [v2]) => v1.localeCompare(v2));
        
        for (let i = 0; i < varsA.length; i++){

            if (varsA[i][0] !== varsB[i][0] || varsA[i][1] !== varsB[i][1]){

                return false;

            }

        }
        
        return true;

    }

    private reducirPolinomioConBase(polinomio: Termino[], base: Termino[][]): Termino[]{

        let resto = [...polinomio]; 
        let seRedujo = true;

        while (seRedujo && !this.esCero(resto)){

            seRedujo = false;
            const termLiderResto = this.encontrarTerminoLider(resto); 
            
            for (let basePoly of base){

                const termLiderBase = this.encontrarTerminoLider(basePoly);
                
                if (this.esDivisible(termLiderResto, termLiderBase)){ 

                    const cociente = this.dividirTerminos(termLiderResto, termLiderBase); 
                    const aRestar = this.multiplicarPolinomioPorTermino(basePoly, cociente); 
                    resto = this.restarPolinomios(resto, aRestar); // ← resto - a_restar
                    seRedujo = true;
                    break;

                }
            }

        }
        
        return resto;

    }

    private esDivisible(a: Termino, b: Termino): boolean{

        
        for (let [varB, expB] of b.variables){

            const expA = this.obtenerExponente(a, varB);
            if (expA < expB) return false;

        }

        return b.coeficiente !== 0; 

    }

    private esCero(polinomio: Termino[]): boolean{

        return polinomio.length === 0;

    }

    private esConstanteNoCero(polinomio: Termino[]): boolean{

        return polinomio.length === 1 && 
            polinomio[0].variables.length === 0 &&
            polinomio[0].coeficiente !== 0;

    }

    private mostrarBaseFinal(): void{

        console.log("\n BASE DE GRÖBNER FINAL:");
        this.basesG.forEach((polinomio, i) => {
            console.log(`   P${i + 1}:`, polinomio.map(t => this.terminoAString(t)).join(" + "));
        });

    }

    construirBaseGroebner(): void{

    let base = [...this.basesG];
    let cambiado = true;
    
    console.log(" Construyendo base de Gröbner...");

    while (cambiado){

        cambiado = false;
        const nuevosPares: [number, number][] = [];
        
        
        for (let i = 0; i < base.length; i++){

            for (let j = i + 1; j < base.length; j++){

                nuevosPares.push([i, j]);

            }

        }
        
        for (let [i, j] of nuevosPares){

            console.log(`\nProcesando par (${i}, ${j})`);
            
        
            const mcm = this.calcularMCM(
                this.encontrarTerminoLider(base[i]),
                this.encontrarTerminoLider(base[j])
            );

            const coef1 = this.dividirTerminos(mcm, this.encontrarTerminoLider(base[i]));
            const coef2 = this.dividirTerminos(mcm, this.encontrarTerminoLider(base[j]));
            
            const poli1Mult = this.multiplicarPolinomioPorTermino(base[i], coef1);
            const poli2Mult = this.multiplicarPolinomioPorTermino(base[j], coef2);
            const sPolinomio = this.restarPolinomios(poli1Mult, poli2Mult);
            
            
            const resto = this.reducirPolinomioConBase(sPolinomio, base);

            this.mostrarProcesoSPolinomio(i, j, base, resto);
            
            
            if (this.esCero(resto)){

                console.log("   S-polinomio se redujo a 0");

            } else if (this.esConstanteNoCero(resto)){

                console.log("    SISTEMA INCONSISTENTE");
                this.basesG = [resto];
                return;

            } else{

                console.log("    Agregando nuevo polinomio a la base");
                base.push(resto);
                cambiado = true; 
                break; 

            }

        }

    }
    
    this.basesG = base;
    console.log(" Base de Gröbner completada");
}


}
