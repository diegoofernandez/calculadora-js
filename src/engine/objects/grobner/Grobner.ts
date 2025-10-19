import FacadeDriver from "../../FacadeDriver";


type Fraccion = {
    numerador: bigint;
    denominador: bigint;
};

type Termino = {
    coeficiente: Fraccion;  
    variables: Array<[string, number]>
}
type TerminoEntrada = {
    coeficiente: number; 
    variables: Array<[string, number]>
}

export default class Grobner{

    private pasoPasoUsuarioG: any;

    private basesG: Termino[][] = [];

    constructor(polinomios: TerminoEntrada[][]){
        this.basesG = this.convertirAFracciones(polinomios);
        localStorage.removeItem('groebner_pasos');
        localStorage.setItem('groebner_pasos', "");
        this.construirBaseGroebner();
        this.mostrarBaseFinal();
    }

   private convertirAFracciones(polinomios: TerminoEntrada[][]): Termino[][] {
        return polinomios.map(poli => 
            poli.map(termino => ({
                coeficiente: this.decimalToFraccion(termino.coeficiente), 
                variables: termino.variables
            }))
        );
    }

private decimalToFraccion(decimal: number): Fraccion {
    if (Number.isInteger(decimal)) {
        return this.crearFraccion(BigInt(decimal), 1n); 
    }

    const s = decimal.toString();
    const decimalIndex = s.indexOf('.');
    
    if (decimalIndex === -1) {
        return this.crearFraccion(BigInt(decimal), 1n);
    }

    const numDecimals = s.length - 1 - decimalIndex;
    

    const denominador = BigInt(10) ** BigInt(numDecimals);
    

    const numeradorString = s.replace('.', '');
    const numerador = BigInt(numeradorString);
    

    return this.crearFraccion(numerador, denominador);
}


    private crearFraccion(numerador: number | bigint, denominador: number | bigint = 1): Fraccion {
    let num = BigInt(numerador);
    let den = BigInt(denominador);
    

    if (den === 0n) throw new Error("Denominador cero");
    if (den < 0n) { num = -num; den = -den; } // Normalización de signo
    const mcd = this.mcdBigInt(num, den);
    
    return {
        numerador: num / mcd,
        denominador: den / mcd
    };
}

private mcdBigInt(a: bigint, b: bigint): bigint {
    a = a < 0n ? -a : a; // Valor absoluto para BigInt
    b = b < 0n ? -b : b;
    while (b !== 0n) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

private mcmBigInt(a: bigint, b: bigint): bigint {
    if (a === 0n || b === 0n) return 0n;
    // Usa el MCD de BigInt
    return (a * b) / this.mcdBigInt(a, b); 
}

    private fraccionAString(frac: Fraccion): string {
        if (frac.denominador === 1n) return frac.numerador.toString();
        return `${frac.numerador}/${frac.denominador}`;
    }

    private multiplicarFracciones(a: Fraccion, b: Fraccion): Fraccion {
        return this.crearFraccion(
            a.numerador * b.numerador,
            a.denominador * b.denominador
        );
    }

    private dividirFracciones(a: Fraccion, b: Fraccion): Fraccion {
        return this.crearFraccion(
            a.numerador * b.denominador,
            a.denominador * b.numerador
        );
    }

    private sumarFracciones(a: Fraccion, b: Fraccion): Fraccion {
        return this.crearFraccion(
            a.numerador * b.denominador + b.numerador * a.denominador,
            a.denominador * b.denominador
        );
    }

    private restarFracciones(a: Fraccion, b: Fraccion): Fraccion {
        return this.crearFraccion(
            a.numerador * b.denominador - b.numerador * a.denominador,
            a.denominador * b.denominador
        );
    }

    private esCeroFraccion(frac: Fraccion): boolean {
        return frac.numerador === 0n;
    }

    private esUnoFraccion(frac: Fraccion): boolean {
        return frac.numerador === 1n && frac.denominador === 1n;
    }

    private negarFraccion(frac: Fraccion): Fraccion {
        return this.crearFraccion(-frac.numerador, frac.denominador);
    }

    private mostrarProcesoSPolinomio(i: number, j: number, base: Termino[][], resto: Termino[]): void{

        console.log(`\n S-polinomio de (P${i}, P${j}):|`);
        console.log(`   
            P${i}:`, base[i].map(t => this.terminoAString(t)).join(" + "));
        console.log(`   |P${j}: `, base[j].map(t => this.terminoAString(t)).join(" + "));
        console.log(`   |Resto: `, resto.map(t => this.terminoAString(t)).join(" + "));
        console.log(`   |Es cero?: `, this.esCero(resto));

        let pasoPasoUsuario = `\n |S-polinomio de (P${i}, P${j}): `; 
        pasoPasoUsuario += `   |P${i}: `; 
        pasoPasoUsuario += base[i].map(t => this.terminoAString(t)).join(" + "); 
        pasoPasoUsuario += `   |P${j}: `; 
        pasoPasoUsuario += base[j].map(t => this.terminoAString(t)).join(" + "); 
        pasoPasoUsuario += `   |Resto: `; 
        pasoPasoUsuario += resto.map(t => this.terminoAString(t)).join(" + "); 
        pasoPasoUsuario += `   |Es cero?: `; 
        pasoPasoUsuario += this.esCero(resto);

        this.pasoPasoUsuarioG += pasoPasoUsuario;  
        localStorage.setItem('groebner_pasos', this.pasoPasoUsuarioG);

    }

    private encontrarTerminoLider(polinomio: Termino[]): Termino {
    if (this.esCero(polinomio)) {
        // Devuelve el monomio cero
        return { coeficiente: this.crearFraccion(0n, 1n), variables: [] };
    }
    // Asumimos que el polinomio está ordenado de mayor a menor término.
    return polinomio[0]; 
}

    private compararTerminos(t1: Termino, t2: Termino): number {
    // 1. Usa tu orden monomial (el más importante).
    const cmpVariables = this.compararVariables(t1.variables, t2.variables);
    if (cmpVariables !== 0) {
        return cmpVariables;
    }

    // 2. Si las variables son iguales, compara coeficientes (solo para orden determinista, no afecta la aritmética).
    const t1_pos = this.esPositivo(t1.coeficiente);
    const t2_pos = this.esPositivo(t2.coeficiente);
    
    // Si ambos son positivos o ambos negativos/cero (y son iguales por sonFraccionesIguales), son iguales.
    // Aquí solo necesitamos establecer un desempate estable.
    if (t1_pos && !t2_pos) return 1;    // t1 positivo es mayor
    if (!t1_pos && t2_pos) return -1;   // t2 positivo es mayor
    
    // De lo contrario, son iguales en variables y signo (se asume que los coeficientes son iguales aquí)
    return 0;
}

    private calcularGradoTotal(termino: Termino): number{

        return termino.variables.reduce((sum, [_, exp]) => sum + exp, 0);

    }

    private compararLexicografico(a: Termino, b: Termino): number{

        const maxVars = Math.max(a.variables.length, b.variables.length);
    
        for (let i = 0; i < maxVars; i++) {
            const varA = a.variables[i];
            const varB = b.variables[i];
            
            // Si un término no tiene más variables, el otro es mayor
            if (!varA) return -1;  // b tiene más variables
            if (!varB) return 1;   // a tiene más variables
            
            // Comparar nombre de variable
            if (varA[0] !== varB[0]) {
                return varA[0].localeCompare(varB[0]);
            }
            
            // Misma variable, comparar exponentes
            if (varA[1] !== varB[1]) {
                return varB[1] - varA[1];  // Mayor exponente primero
            }
        }
    
        return 0; // Términos idénticos

    }

    private terminoAString(termino: Termino): string {
        let resultado = "";
        
        if (!this.esUnoFraccion(termino.coeficiente) || termino.variables.length === 0) {
            resultado += this.fraccionAString(termino.coeficiente);
        }
        
        for (let [v, exp] of termino.variables) {
            if (exp === 1) {
                resultado += v;
            } else {
                resultado += v + "^" + exp;
            }
        }
        
        return resultado;
    }


        private calcularMCM(a: Termino, b: Termino): Termino {
        
        const mcmCoef = this.mcmFracciones(a.coeficiente, b.coeficiente);
        
        const todasVariables = new Set<string>();
        a.variables.forEach(([v, _]) => todasVariables.add(v));
        b.variables.forEach(([v, _]) => todasVariables.add(v));
        
        const varsMCM: [string, number][] = [];
        for (let variable of todasVariables) {
            const expA = this.obtenerExponente(a, variable);
            const expB = this.obtenerExponente(b, variable);
            const maxExp = Math.max(expA, expB);
            if (maxExp > 0) varsMCM.push([variable, maxExp]);
        }
        
        return { coeficiente: mcmCoef, variables: varsMCM };
    }
    private mcmFracciones(a: Fraccion, b: Fraccion): Fraccion {
        // MCM de fracciones = MCM(numeradores) / MCD(denominadores)
        const mcmNum = this.mcmBigInt(a.numerador, b.numerador);
        const mcdDen = this.mcdBigInt(a.denominador, b.denominador);
        return this.crearFraccion(mcmNum, mcdDen);
    }

    private obtenerExponente(termino: Termino, variable: string): number{

        const found = termino.variables.find(([v, _]) => v === variable);
        return found ? found[1] : 0;

    }

    private mcmNumerico(a: number, b: number): number{

        const aInt = Math.round(a);
    const bInt = Math.round(b);
    return (aInt * bInt) / this.mcdNumerico(aInt, bInt);

    }

    private mcdNumerico(a: number, b: number): number{

        while (b !== 0){

            const temp = b;
            b = a % b;
            a = temp;

        }

        return a;

    }

private dividirTerminos(dividendo: Termino, divisor: Termino): Termino {
        
        const nuevoCoef = this.dividirFracciones(dividendo.coeficiente, divisor.coeficiente);
        
        const nuevasVars: [string, number][] = [];
        for (let [varD, expD] of dividendo.variables) {
            const expDivisor = this.obtenerExponente(divisor, varD);
            const nuevoExp = expD - expDivisor;
            if (nuevoExp > 0) nuevasVars.push([varD, nuevoExp]);
        }
        
        return { coeficiente: nuevoCoef, variables: nuevasVars };
    }


private aFraccionAproximada(decimal: number): number {
    // Conversión simple a fracción aproximada
    const fracciones = [
        [0.5, 1/2], [0.333, 1/3], [0.666, 2/3], [0.25, 1/4], 
        [0.75, 3/4], [0.2, 1/5], [0.4, 2/5], [0.6, 3/5], [0.8, 4/5]
    ];
    
    for (let [dec, frac] of fracciones) {
        if (Math.abs(decimal - dec) < 0.01) return frac;
    }
    
    return Math.round(decimal * 100) / 100; // Mantener decimal como último recurso
}

    private multiplicarPolinomioPorTermino(polinomio: Termino[], termino: Termino): Termino[]{

        const resultado: Termino[] = [];
        
        for (let term of polinomio){

9
            const producto = this.multiplicarTerminos(term, termino);
            resultado.push(producto);

        }
        
        return resultado;

    }
   private multiplicarTerminos(a: Termino, b: Termino): Termino {
        
        const nuevoCoef = this.multiplicarFracciones(a.coeficiente, b.coeficiente);
        
        const todasVariables = new Map<string, number>();
        for (let [v, exp] of a.variables) {
            todasVariables.set(v, exp);
        }
        for (let [v, exp] of b.variables) {
            const expActual = todasVariables.get(v) || 0;
            todasVariables.set(v, expActual + exp);
        }
        
        // Obtener la lista de variables y ORDENAR ALFABÉTICAMENTE
    const nuevasVars: [string, number][] = Array.from(todasVariables.entries())
        .filter(([, exp]) => exp > 0) // (Opcional) Ignorar variables con exponente 0
        .sort(([v1], [v2]) => v1.localeCompare(v2)); 
    
    return { coeficiente: nuevoCoef, variables: nuevasVars };
    }

     private restarPolinomios(poliA: Termino[], poliB: Termino[]): Termino[] {
    const poliBNegado: Termino[] = [];
    for (let term of poliB) {
        poliBNegado.push({
            coeficiente: this.negarFraccion(term.coeficiente),
            variables: [...term.variables] // <- Esto es solo una copia superficial, ¡debería bastar!
        });
    }
    
    const todosTerminos = [...poliA, ...poliBNegado];
    return this.simplificarPolinomio(todosTerminos); // ✅ Esto llama a simplificar/ordenar
}

   private simplificarPolinomio(terminos: Termino[]): Termino[] {
    // La lógica de combinación y filtrado de ceros es correcta.
    const combinados: Termino[] = [];
    
    for (let term of terminos) {
        let encontrado = false;
        
        for (let i = 0; i < combinados.length; i++) {
            if (this.sonEquivalentes(term, combinados[i])) { 
                combinados[i].coeficiente = this.sumarFracciones(combinados[i].coeficiente, term.coeficiente);
                encontrado = true;
                break;
            }
        }
        
        if (!encontrado) {
            // CRÍTICO: Usamos la copia 'term' ya simplificada si es posible, o una copia nueva.
            // Asumiendo que 'term' no necesita simplificación interna.
            combinados.push({...term}); 
        }
    }
    
    // 1. Filtrar términos cero
    let simplificado = combinados.filter(term => !this.esCeroFraccion(term.coeficiente));
    
    
    // Ordenar de mayor a menor término. 
    // Si 'compararTerminos' devuelve 1 si t1 > t2, necesitamos que el mayor vaya primero.
    simplificado.sort((a, b) => this.compararTerminos(b, a)); 
    
    return simplificado;
}

    private esPositivo(frac: Fraccion): boolean {
    // Si el numerador es > 0, la fracción es positiva.
    return frac.numerador > 0n; 
}

    private sonFraccionesIguales(f1: Fraccion, f2: Fraccion): boolean {
    // Usar BigInt en la multiplicación cruzada
    return f1.numerador * f2.denominador === f2.numerador * f1.denominador;
}

    private sonEquivalentes(t1: Termino, t2: Termino): boolean {
    // Si la cantidad total de elementos variable/exponente es diferente, no pueden ser iguales
    if (t1.variables.length !== t2.variables.length) return false;
    
    // Crear mapas de variables para una búsqueda eficiente
    const map1 = new Map(t1.variables);
    const map2 = new Map(t2.variables);
    
    // 1. Verificar que todas las variables de t1 estén en t2 con el mismo exponente
    for (const [variable, exp1] of map1) {
        const exp2 = map2.get(variable) || 0;
        if (exp1 !== exp2) {
            return false;
        }
    }
    
    // 2. Verificar que todas las variables de t2 estén en t1 (ya cubierto si length es igual y paso 1 pasa)
    
    return true;
}

    private reducirPolinomioConBase(polinomio: Termino[], base: Termino[][]): Termino[] {
    let p_restante = this.simplificarPolinomio(polinomio); // Asegura que empieza limpio
    let TL_p = this.encontrarTerminoLider(p_restante);

    // Bucle clave: Continúa mientras el resto no sea cero y el TL del resto sea divisible por ALGO en la base.
    while (!this.esCero(p_restante) && this.esDivisiblePorBase(TL_p, base)) { 
        
        // 1. Encontrar TODOS los divisores válidos en la base
        const divisoresValidos = base.filter(d => 
            this.esDivisible(TL_p.variables, this.encontrarTerminoLider(d).variables)
        );
        
        
        if (divisoresValidos.length === 0) {
            break; 
        }

        
        divisoresValidos.sort((a, b) => 
            this.compararTerminos(this.encontrarTerminoLider(b), this.encontrarTerminoLider(a))
        );
        
        const divisor = divisoresValidos[0];
        const TL_d = this.encontrarTerminoLider(divisor);
        
        const cociente = this.dividirTerminos(TL_p, TL_d); 
        
        const q = this.multiplicarPolinomioPorTermino(divisor, cociente);

        p_restante = this.restarPolinomios(p_restante, q);
        p_restante = this.simplificarPolinomio(p_restante); // ¡Elimina términos cero y ordena!

        TL_p = this.encontrarTerminoLider(p_restante);
    }

    return p_restante;
}

private esDivisiblePorBase(terminoLider: Termino, base: Termino[][]): boolean {
    return base.some(polinomio => {
        const TL_divisor = this.encontrarTerminoLider(polinomio);
        // y que 'esDivisible' lo gestiona.
        return this.esDivisible(terminoLider.variables, TL_divisor.variables);
    });
}

        

    private esDivisible(vars_num: Array<[string, number]>, vars_den: Array<[string, number]>): boolean {
    const map_num = new Map(vars_num);
    const map_den = new Map(vars_den);

    // Cada exponente del divisor (den) debe ser menor o igual que el exponente del numerador (num).
    for (const [variable, exp_den] of map_den) {
        const exp_num = map_num.get(variable) || 0;
        if (exp_num < exp_den) {
            return false;
        }
    }
    // Si todos los exponentes del divisor están en el numerador y son menores o iguales, es divisible.
    return true;
}

    private esCero(polinomio: Termino[]): boolean{

        return polinomio.every(termino => termino.coeficiente.numerador === 0n);

    }

   private esConstanteNoCero(polinomio: Termino[]): boolean {
        return polinomio.length === 1 && 
            polinomio[0].variables.length === 0 &&
            !this.esCeroFraccion(polinomio[0].coeficiente);
    }

    public mostrarBaseFinal(): void{

        console.log("\n BASE DE GRÖBNER FINAL:");
        this.pasoPasoUsuarioG += "\n |BASE DE GRÖBNER FINAL:";  
        localStorage.setItem('groebner_pasos', this.pasoPasoUsuarioG);

        this.basesG.forEach((polinomio, i) => {
            console.log(`   P${i + 1}:`, polinomio.map(t => this.terminoAString(t)).join(" + "));
            this.pasoPasoUsuarioG += `  | P${i + 1}:`;
            this.pasoPasoUsuarioG +=  polinomio.map(t => this.terminoAString(t)).join(" + "); 
        });

        localStorage.setItem('groebner_pasos', this.pasoPasoUsuarioG);

    }

    construirBaseGroebner(): void{
    let base = [...this.basesG];
    let cambiado = true;
    let iteracion = 0;
    const MAX_ITERACIONES = 100; // seguridad anti-loop infinito
    
    console.log(" Construyendo base de Gröbner...");
    this.pasoPasoUsuarioG += " |Construyendo base de Gröbner...";
    localStorage.setItem('groebner_pasos', this.pasoPasoUsuarioG);

    while (cambiado && iteracion < MAX_ITERACIONES){
        iteracion++;
        cambiado = false;
        const nuevosPares: [number, number][] = [];
        
        for (let i = 0; i < base.length; i++){
            for (let j = i + 1; j < base.length; j++){
                if (this.parEsNecesario(base[i], base[j], base)) {
                    nuevosPares.push([i, j]);
                }
                //nuevosPares.push([i, j]);
            }
        }
        
        let polinomioAgregadoEnEstaIteracion = false;
        
        for (let [i, j] of nuevosPares){
            console.log(`\nProcesando par (${i}, ${j})`);
            this.pasoPasoUsuarioG += `\n |Procesando par (${i}, ${j})`; 
            localStorage.setItem('groebner_pasos', this.pasoPasoUsuarioG);
        
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
                this.pasoPasoUsuarioG += "   |S-polinomio se redujo a 0";
                localStorage.setItem('groebner_pasos', this.pasoPasoUsuarioG);

            } else if (this.esConstanteNoCero(resto)){
                console.log("    SISTEMA INCONSISTENTE");
                this.pasoPasoUsuarioG += "    |SISTEMA INCONSISTENTE"; 
                localStorage.setItem('groebner_pasos', this.pasoPasoUsuarioG);
                this.basesG = [resto];
                return;

            } else {
                console.log("    Agregando nuevo polinomio a la base");
                this.pasoPasoUsuarioG += "    |Agregando nuevo polinomio a la base"; 
                localStorage.setItem('groebner_pasos', this.pasoPasoUsuarioG);
                base.push(resto);
                cambiado = true;
                polinomioAgregadoEnEstaIteracion = true;
            }
        }
        
        if (!polinomioAgregadoEnEstaIteracion) {
            cambiado = false;
        }
    }
    
    //this.basesG = base;
    //this.basesG = this.reducirBaseInternamente(this.basesG);
    this.basesG = base; // Asegúrate de que this.basesG tenga la base generada.

console.log(" Aplicando normalización y reducción final...");
this.pasoPasoUsuarioG += " |Aplicando normalización y reducción final...";
localStorage.setItem('groebner_pasos', this.pasoPasoUsuarioG);

// 1. Normalización: Coeficiente líder a 1
this.basesG = this.basesG.map(poli => this.normalizarPolinomio(poli));

// 2. Reducción Cruzada (La limpieza interna)
this.basesG = this.interReducirBase(this.basesG); 

// 3. Ordenar la base para la forma canónica (útil para la triangularización)
this.basesG.sort((a, b) => this.compararPolinomios(a, b));
    

    console.log(" Base de Gröbner completada");
    this.pasoPasoUsuarioG += " |Base de Gröbner completada"; 
    localStorage.setItem('groebner_pasos', this.pasoPasoUsuarioG);
}

private compararPolinomios(a: Termino[], b: Termino[]): number {
    const tlA = this.encontrarTerminoLider(a);
    const tlB = this.encontrarTerminoLider(b);
    // Usar la misma comparación de términos (TLB vs TLA porque queremos el de grado más bajo al final)
    return this.compararTerminos(tlB, tlA); 
}

private sonBasesIguales(base1: Termino[][], base2: Termino[][]): boolean {
    if (base1.length !== base2.length) return false;
    return base1.every((poli, i) => this.sonPolinomiosIguales(poli, base2[i]));
}

private reducirBaseInternamente(base: Termino[][]): Termino[][] {
    let baseReducida = [...base];
    let cambiado = true;
    
    while (cambiado) {
        cambiado = false;
        
        for (let i = 0; i < baseReducida.length; i++) {
            const baseSinI = baseReducida.filter((_, idx) => idx !== i);
            const reducido = this.reducirPolinomioConBase(baseReducida[i], baseSinI);
            
            // Verificar si cambió (forma simple)
            const strOriginal = baseReducida[i].map(t => this.terminoAString(t)).join("+");
            const strReducido = reducido.map(t => this.terminoAString(t)).join("+");
            
            if (strOriginal !== strReducido) {
                baseReducida[i] = reducido;
                cambiado = true;
            }
        }
        
        // Eliminar polinomios cero
        baseReducida = baseReducida.filter(poli => !this.esCero(poli));
    }
    
    return baseReducida;
}

private reducirBaseGroebner(base: Termino[][]): Termino[][] {
    console.log(" Aplicando reducción final...");
    
    // 1. Eliminar polinomios cero
    let baseReducida = base.filter(poli => !this.esCero(poli));
    
    // 2. Normalizar coeficientes líderes a 1
    baseReducida = baseReducida.map(poli => this.normalizarPolinomio(poli));
    
    // 3. Reducción cruzada
    let cambiado = true;
    while (cambiado) {
        cambiado = false;
        
        for (let i = 0; i < baseReducida.length; i++) {
            const baseSinI = baseReducida.filter((_, idx) => idx !== i);
            const reducido = this.reducirPolinomioConBase(baseReducida[i], baseSinI);
            
            // Normalizar el resultado
            const reducidoNormalizado = this.normalizarPolinomio(reducido);
            
            // Verificar si cambió
            if (!this.sonPolinomiosIguales(baseReducida[i], reducidoNormalizado)) {
                baseReducida[i] = reducidoNormalizado;
                cambiado = true;
            }
        }
        
        // Eliminar posibles ceros después de reducción
        baseReducida = baseReducida.filter(poli => !this.esCero(poli));
    }
    
    return baseReducida;
}

private normalizarPolinomio(polinomio: Termino[]): Termino[] {
    if (this.esCero(polinomio)) return polinomio;
    
    const terminoLider = this.encontrarTerminoLider(polinomio);
    const coefLider = terminoLider.coeficiente; // Es una Fraccion
    
    if (this.esUnoFraccion(coefLider)) return polinomio;
    
    return polinomio.map(termino => ({
        coeficiente: this.dividirFracciones(termino.coeficiente, coefLider),
        variables: [...termino.variables]
    }));
}

private calcularGrado(variables: Array<[string, number]>): number {
    return variables.reduce((sum, [, exponente]) => sum + exponente, 0);
}

private compararVariables(
    vars1: Array<[string, number]>, 
    vars2: Array<[string, number]>
): number {
    const grado1 = this.calcularGrado(vars1);
    const grado2 = this.calcularGrado(vars2);

    if (grado1 !== grado2) {
        return grado1 > grado2 ? 1 : -1; 
    }
    
    const map1 = new Map(vars1);
    const map2 = new Map(vars2);
    const todasLasVariables = Array.from(new Set([...map1.keys(), ...map2.keys()])).sort(); 

    for (const variable of todasLasVariables) {
        const exp1 = map1.get(variable) || 0;
        const exp2 = map2.get(variable) || 0;

        if (exp1 !== exp2) {
            return exp1 > exp2 ? 1 : -1; 
        }
    }

    return 0; 
}
private sonPolinomiosIguales(p1: Termino[], p2: Termino[]): boolean {
    // Si la longitud es diferente, no son iguales.
    if (p1.length !== p2.length) return false;

    for (let i = 0; i < p1.length; i++) {
        const t1 = p1[i];
        const t2 = p2[i];
        
        if (this.compararVariables(t1.variables, t2.variables) !== 0) {
            return false;
        }

        if (!this.sonFraccionesIguales(t1.coeficiente, t2.coeficiente)) {
            return false;
        }
    }
    return true;
}



private parEsNecesario(poliA: Termino[], poliB: Termino[], base: Termino[][]): boolean {
    const termLiderA = this.encontrarTerminoLider(poliA);
    const termLiderB = this.encontrarTerminoLider(poliB);
    
    const mcm = this.calcularMCM(termLiderA, termLiderB);
    
    // Criterio de Buchberger: el par es necesario si el MCM no es divisible
    // por el término líder de ningún otro polinomio en la base
    for (let poliC of base) {
        if (poliC === poliA || poliC === poliB) continue;
        
        const termLiderC = this.encontrarTerminoLider(poliC);
        if (this.esDivisible(mcm.variables, termLiderC.variables)) {
            return false; // Par redundante
        }
    }
    
    return true; // Par necesario
}
private interReducirBase(base: Termino[][]): Termino[][] {
    console.log(" Aplicando inter-reducción...");
    let baseReducida = [...base];
    let cambiado = true;
    
    baseReducida = baseReducida.map(poli => this.simplificarPolinomio(poli));
    
    while (cambiado) {
        cambiado = false;
        
        baseReducida = baseReducida.map(poli => this.normalizarPolinomio(poli));
        
        baseReducida = baseReducida.map(poli => this.simplificarPolinomio(poli)); 

        for (let i = baseReducida.length - 1; i >= 0; i--) {
            const poliOriginal = baseReducida[i]; 
            const baseSinI = baseReducida.filter((_, idx) => idx !== i);
            
            let reducido = this.reducirPolinomioConBase(poliOriginal, baseSinI);
            
            reducido = this.normalizarPolinomio(reducido); 
            reducido = this.simplificarPolinomio(reducido); 

            if (this.esCero(reducido)) {
                baseReducida.splice(i, 1);
                cambiado = true;
            } 
            else if (!this.sonPolinomiosIguales(poliOriginal, reducido)) {
                baseReducida[i] = reducido; 
                cambiado = true;
            }
        }
        
        if (cambiado) {
            baseReducida.sort((a, b) => this.compararPolinomios(a, b));
        }
    }
    return baseReducida;
}


}