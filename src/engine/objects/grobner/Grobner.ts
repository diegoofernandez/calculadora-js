import Fraccion from "../Fraccion";
type Termino = {
    coeficiente: Fraccion;  
    variables: Array<[string, number]>;
};

type Polinomio = Termino[];


export default class GrobnerRobusto {
    private base: Polinomio[] = [];
    private paresProcesados = new Set<string>();
    //private variablesOrden = ['w', 'x', 'y', 'z', 'a', 'b', 'c']; // Hasta 7 variables
    //modificación 
    private variablesOrden: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    //fin de modificación
    private infoUsuario = 'Comenzando\n';
    private basesCasosUso: any = [];  

    constructor() {
        localStorage.setItem('groebner_pasos', '...'); 
        // Inicializamos vacío
        this.base = [];
        this.infoUsuario = 'Comenzando\n';
        this.basesCasosUso = [];
        
    }

    //modificación con initAsync
    // MÉTODOS ASÍNCRONOS Y LÍMITES
    public async initAsync(ast: any): Promise<void> {
        this.infoUsuario += "🚀 INICIANDO MOTOR GRÖBNER ASÍNCRONO |\n";
        
        const polinomiosIniciales = this.extraerPolinomios(ast);
        
        // Verificación de integridad de tu motor original
        this.verificarIntegridadBigInt(polinomiosIniciales);
        
        this.extraerVariablesDinamicas(polinomiosIniciales);
        const { varsCount, maxGrado } = this.analizarSistema(polinomiosIniciales);
        
        // 🎯 LÍMITES INTELIGENTES PARA EMPRESAS
        let limiteBases = Infinity;
        if (varsCount > 7) {
            if (maxGrado > 2) limiteBases = 3;
            else if (maxGrado === 2) limiteBases = 7;
        }

        this.infoUsuario += `📊 Análisis: ${varsCount} variables, Grado Max: ${maxGrado}. Límite extra: ${limiteBases} |\n`;
        localStorage.setItem('groebner_pasos', this.infoUsuario);

        // Llamamos a TU motor robusto, pero en versión asíncrona
        this.base = await this.buchbergerRobustoAsync(polinomiosIniciales, limiteBases);
        
        this.verificarIntegridadBigInt(this.base);
        this.mostrarResultado();
    }
    private analizarSistema(polinomios: Polinomio[]) {
        let maxGrado = 0;
        const variablesUnicas = new Set<string>();
        
        for (const p of polinomios) {
            for (const t of p) {
                let gradoTermino = 0;
                for (const [v, exp] of t.variables) {
                    variablesUnicas.add(v);
                    gradoTermino += exp;
                }
                if (gradoTermino > maxGrado) maxGrado = gradoTermino;
            }
        }
        return { varsCount: variablesUnicas.size, maxGrado };
    }
    private extraerVariablesDinamicas(polinomios: Polinomio[]) {
        const vars = new Set<string>();
        polinomios.forEach(p => p.forEach(t => t.variables.forEach(([v]) => vars.add(v))));
        this.variablesOrden = Array.from(vars).sort(); // Orden lexicográfico básico
    }

    
    private async buchbergerRobustoAsync(polinomios: Polinomio[], limiteBases: number): Promise<Polinomio[]> {
        this.infoUsuario += "🔄 EJECUTANDO BUCHBERGER ROBUSTO ASÍNCRONO |"; 
        localStorage.setItem('groebner_pasos', this.infoUsuario); 
        
        let base = polinomios.map(p => this.normalizarPolinomio(p));
        let iteracion = 0;
        
        //Si no hay límite (Infinity), usamos 50 por seguridad. Si hay, le sumamos el tamaño inicial.
        const MAX_BASE = limiteBases === Infinity ? 50 : polinomios.length + limiteBases;
        
        // Cola de pares a procesar
        const colaPares: [number, number][] = [];
        for (let i = 0; i < base.length; i++) {
            for (let j = i + 1; j < base.length; j++) {
                colaPares.push([i, j]);
            }
        }

        while (colaPares.length > 0 && base.length < MAX_BASE) {
            iteracion++;
            
            //Dejamos que el navegador respire cada 5 ciclos
            if (iteracion % 5 === 0) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
            
            // Actualizar interfaz del frontend
            localStorage.setItem('simulation_status', `📐 Gröbner: Iteración ${iteracion} | Cola: ${colaPares.length} | Bases: ${base.length}`);

            this.infoUsuario += `=== ITERACIÓN ${iteracion} === (Base: ${base.length}, Cola: ${colaPares.length}) |`; 
            localStorage.setItem('groebner_pasos', this.infoUsuario); 

            const [i, j] = colaPares.shift()!;
            const parKey = `${i},${j}`;
            
            if (this.paresProcesados.has(parKey)) continue;
            this.paresProcesados.add(parKey);
            
            // CRITERIO DE BUCHBERGER: Términos coprimos (Tu código de élite)
            if (this.sonCoprimos(base[i][0].variables, base[j][0].variables)) {
                this.infoUsuario += `   🚫 Par (${i+1},${j+1}): Términos coprimos - omitido |`; 
                continue;
            }
            
            this.infoUsuario += `🔍 Par (${i+1}, ${j+1}) |`;
            
            const sPol = this.calcularSPolinomio(base[i], base[j]);
            const reducido = this.reducir(sPol, base);
            
            if (!this.esCero(reducido)) {
                const normalizado = this.normalizarPolinomio(reducido);
                
                if (!this.esRedundante(normalizado, base)) {
                    const nuevoIdx = base.length;
                    base.push(normalizado);
                    this.infoUsuario += `   ✅ AGREGADO P${nuevoIdx + 1}: ${this.polinomioAString(normalizado)} |`;
                    
                    for (let k = 0; k < nuevoIdx; k++) {
                        colaPares.push([k, nuevoIdx]);
                    }
                } else {
                    this.infoUsuario += `   🚫 REDUNDANTE - no agregado |`; 
                }
            } else {
                this.infoUsuario += `   ✅ Se redujo a 0 |`;
            }
        }

        if (base.length >= MAX_BASE) {
            this.infoUsuario += `⚠️ LÍMITE DE BASE ALCANZADO (${MAX_BASE} polinomios) |`;
            localStorage.setItem('simulation_status', `⚠️ Límite de computo alcanzado. Inter-reduciendo...`);
        } else {
            this.infoUsuario += `✅ CONVERGENCIA - Cola vacía |`; 
            localStorage.setItem('simulation_status', `✅ Convergencia lograda. Inter-reduciendo...`);
        }

        // Respirar un toque antes de inter-reducir porque es un proceso pesado
        await new Promise(resolve => setTimeout(resolve, 10));

        this.infoUsuario += "🔧 INTER-REDUCCIÓN A FORMA CANÓNICA... |"; 
        return this.interReducir(base);
    }

    // 🎯 TRAZABILIDAD EN VECTORIZACIÓN
    public obtenerBaseVectorialOptima() {
        const baseMonomial = this.obtenerBaseMonomial(this.base); // Ej: ["x^2", "xy", "y"]
        const optimalVectors = this.base.map(poli => this.vectorizarPolinomio(poli, baseMonomial));

        return { 
            optimalVectors, 
            baseMonomial, 
            isViable: optimalVectors.length > 0 
        };
    }
    //fin de modificaciones




    // ========================================================================
    // VECTORIZACIÓN DE BASES 
    // ========================================================================


    private obtenerBaseMonomial(polinomios: Polinomio[]): string[] {
        const monomiosSet = new Set<string>();
        for (const poli of polinomios) {
            for (const termino of poli) {
                const clave = this.claveVariables(termino.variables);
                monomiosSet.add(clave);
            }
        }

        // Ordenar el conjunto de monomios usando el mismo orden monomial (Term Order)
        // que usa el motor, garantizando que los vectores son consistentes.
        const monomiosArray = Array.from(monomiosSet).map(clave => this.decodificarClave(clave));
  
        // Convertimos las claves de vuelta para ordenar y luego las volvemos a cadena
        monomiosArray.sort((a, b) => this.compararTerminosParaOrden(a, b)); 
  
        return monomiosArray.map(vars => this.claveVariables(vars));
    }

    // Función auxiliar para ordenar (copia la lógica de tu método 'ordenar')
    private compararTerminosParaOrden(varsA: Array<[string, number]>, varsB: Array<[string, number]>): number {
        for (const variable of this.variablesOrden) {
            const expA = varsA.find(([v]) => v === variable)?.[1] || 0;
            const expB = varsB.find(([v]) => v === variable)?.[1] || 0;
            if (expA !== expB) return expB - expA;
        }
        return 0;
    }

    /**
    * Convierte un Polinomio en un vector de coeficientes Fraccion.
    * @param poli El Polinomio a vectorizar.
    * @param baseMonomial El array ordenado de las claves de los monomios (la base de R^n).
    * @returns Vector de coeficientes Fraccion.
    */
    private vectorizarPolinomio(poli: Polinomio, baseMonomial: string[]): Fraccion[] {
      const vector: Fraccion[] = new Array(baseMonomial.length).fill(new Fraccion(0n));
      const mapaCoeficientes = new Map<string, Fraccion>();

      // 1. Mapear los coeficientes del polinomio a su monomio clave
      for (const termino of poli) {
        const clave = this.claveVariables(termino.variables);
        mapaCoeficientes.set(clave, termino.coeficiente);
      }

      // 2. Llenar el vector según el orden de la base monomial
      for (let i = 0; i < baseMonomial.length; i++) {
        const clave = baseMonomial[i];
        const coeficiente = mapaCoeficientes.get(clave);
        if (coeficiente) {
          vector[i] = coeficiente;
        }
      }

      return vector;
    }

    // ========================================================================
    // FIN DE VECTORIZACIÓN DE BASES
    // ========================================================================

    // ========================================================================
    // VERIFICACIÓN DE INTEGRIDAD BIGINT
    // ========================================================================
    private verificarIntegridadBigInt(polinomios: Polinomio[]): void {
        for (let i = 0; i < polinomios.length; i++) {
            const poli = polinomios[i];
            for (let j = 0; j < poli.length; j++) {
                const term = poli[j];
                
                // Verificar que el coeficiente sea una Fraccion válida
                if (!(term.coeficiente instanceof Fraccion)) {
                    throw new Error(`❌ Coeficiente inválido en P${i+1}, término ${j+1}`);
                }
                
                // Verificar que numerador y denominador sean bigint
                const num = term.coeficiente.getNumerador();
                const den = term.coeficiente.getDenominador();
                
                if (typeof num !== 'bigint' || typeof den !== 'bigint') {
                    throw new Error(
                        `❌ Contaminación flotante detectada en P${i+1}, término ${j+1}: ` +
                        `num=${typeof num}, den=${typeof den}`
                    );
                }
                
                if (den === 0n) {
                    throw new Error(`❌ Denominador cero en P${i+1}, término ${j+1}`);
                }
            }
        }
    }

    // ========================================================================
    // EXTRACCIÓN DESDE AST
    // ========================================================================
    private extraerPolinomios(ast: ASTNodeG): Polinomio[] {
        const polinomios: Polinomio[] = [];
        if (ast.type === 'Grobner' && ast.hijos) {
            for (const poliNode of ast.hijos) {
                if (poliNode.type === 'Polinomio') {
                    const poli = this.extraerPolinomio(poliNode);
                    if (poli.length > 0) polinomios.push(poli);
                }
            }
        }
        return polinomios;
    }

    private extraerPolinomio(poliNode: ASTNodeG): Polinomio {
        const terminos: Termino[] = [];
        if (poliNode.hijos) {
            for (const monoNode of poliNode.hijos) {
                if (monoNode.type === 'Monomio') {
                    const term = this.extraerTermino(monoNode);
                    if (term && !term.coeficiente.esCero()) {
                        terminos.push(term);
                    }
                }
            }
        }
        return this.ordenarYSimplificar(terminos);
    }

    private extraerTermino(monoNode: ASTNodeG): Termino | null {
        let coeficiente = new Fraccion(1n, 1n);
        const variables: Array<[string, number]> = [];
        const signo = monoNode.negativoPositivo || 1;

        if (monoNode.hijos) {
            for (const hijo of monoNode.hijos) {
                if (hijo.type === 'Numero') {
                    const valorBigInt = this.obtenerValor(hijo);
                    // MULTIPLICAR BIGINT POR BIGINT
                    const signoNumBigInt = signo < 0 ? -1n : 1n;
                    coeficiente = new Fraccion(signoNumBigInt * valorBigInt, 1n);
                } else if (hijo.type === 'Variable') {
                    const nombre = String(hijo.representacion || '');
                    if (nombre && !this.esNumero(nombre)) {
                        variables.push([nombre, 1]);
                    } else if (this.esNumero(nombre)) {
                        const valorBigInt = BigInt(parseInt(nombre, 10));
                        const signoNumBigInt = signo < 0 ? -1n : 1n;
                        coeficiente = new Fraccion(signoNumBigInt * valorBigInt, 1n);
                    }
                } else if (hijo.type === 'Potencia' && hijo.hijos && hijo.hijos.length >= 2) {
                    const base = String(hijo.hijos[0].representacion || '');
                    const exp = parseInt(String(hijo.hijos[1].representacion || '1'), 10);
                    if (base && !isNaN(exp)) variables.push([base, exp]);
                } else if (hijo.type === 'Fraccion' && hijo.hijos && hijo.hijos.length >= 2) {
                    const numBigInt = this.obtenerValor(hijo.hijos[0]);
                    const denBigInt = this.obtenerValor(hijo.hijos[1]);
                    // CREAR FRACCIÓN CON BIGINT PURO
                    const frac = new Fraccion(numBigInt, denBigInt);
                    coeficiente = signo === -1 ? frac.negar() : frac;
                }
            }
        }

        if (coeficiente.esUno() && variables.length > 0 && signo === -1) {
            coeficiente = new Fraccion(-1n, 1n);
        }

        return coeficiente.esCero() ? null : { coeficiente, variables };
    }

    private obtenerValor(node: ASTNodeG): bigint {
        // RETORNAR SIEMPRE BIGINT, NUNCA NUMBER
        if (node.representacion === undefined) return 1n;
        
        if (typeof node.representacion === 'bigint') {
            return node.representacion;
        }
        
        if (typeof node.representacion === 'number') {
            // Convertir number a bigint (solo para enteros)
            return BigInt(Math.floor(node.representacion));
        }
        
        if (typeof node.representacion === 'string') {
            const parsed = parseInt(node.representacion, 10);
            return isNaN(parsed) ? 1n : BigInt(parsed);
        }
        
        return 1n;
    }

    private esNumero(str: string): boolean {
        // Verificar si es un número entero válido
        const num = parseInt(str, 10);
        return !isNaN(num) && String(num) === str.trim();
    }

    // ========================================================================
    // ALGORITMO DE BUCHBERGER ROBUSTO
    // ========================================================================
    private buchbergerRobusto(polinomios: Polinomio[]): Polinomio[] {
        //console.log("\n🔄 EJECUTANDO BUCHBERGER ROBUSTO");
        this.infoUsuario += "🔄 EJECUTANDO BUCHBERGER ROBUSTO |"; 
        localStorage.setItem('groebner_pasos', this.infoUsuario); 
        
        let base = polinomios.map(p => this.normalizarPolinomio(p));
        let iteracion = 0;
        const MAX_BASE = 50; // Límite de seguridad para 6 variables
        
        // Cola de pares a procesar
        const colaPares: [number, number][] = [];
        for (let i = 0; i < base.length; i++) {
            for (let j = i + 1; j < base.length; j++) {
                colaPares.push([i, j]);
            }
        }

        while (colaPares.length > 0 && base.length < MAX_BASE) {
            iteracion++;
            //console.log(`\n=== ITERACIÓN ${iteracion} === (Base: ${base.length}, Cola: ${colaPares.length})`);
            this.infoUsuario += `=== ITERACIÓN ${iteracion} === (Base: ${base.length}, Cola: ${colaPares.length}) |`; 
            localStorage.setItem('groebner_pasos', this.infoUsuario); 

            const [i, j] = colaPares.shift()!;
            const parKey = `${i},${j}`;
            
            if (this.paresProcesados.has(parKey)) continue;
            this.paresProcesados.add(parKey);
            
            // CRITERIO DE BUCHBERGER: Términos coprimos
            if (this.sonCoprimos(base[i][0].variables, base[j][0].variables)) {
                //console.log(`   🚫 Par (${i+1},${j+1}): Términos coprimos - omitido`);
                this.infoUsuario += `   🚫 Par (${i+1},${j+1}): Términos coprimos - omitido |`; 

                localStorage.setItem('groebner_pasos', this.infoUsuario); 
                continue;
            }
            
            //console.log(`\n🔍 Par (${i+1}, ${j+1})`);
            this.infoUsuario += `🔍 Par (${i+1}, ${j+1}) |`;
            localStorage.setItem('groebner_pasos', this.infoUsuario); 
            
            const sPol = this.calcularSPolinomio(base[i], base[j]);
            const reducido = this.reducir(sPol, base);
            
            if (!this.esCero(reducido)) {
                const normalizado = this.normalizarPolinomio(reducido);
                
                if (!this.esRedundante(normalizado, base)) {
                    const nuevoIdx = base.length;
                    base.push(normalizado);
                    //console.log(`   ✅ AGREGADO P${nuevoIdx + 1}: ${this.polinomioAString(normalizado)}`);
                    this.infoUsuario += `   ✅ AGREGADO P${nuevoIdx + 1}: ${this.polinomioAString(normalizado)} |`;
                    localStorage.setItem('groebner_pasos', this.infoUsuario); 
                    
                    // Agregar nuevos pares con el polinomio recién agregado
                    for (let k = 0; k < nuevoIdx; k++) {
                        colaPares.push([k, nuevoIdx]);
                    }
                } else {
                    //console.log(`   🚫 REDUNDANTE - no agregado`);
                    this.infoUsuario += `   🚫 REDUNDANTE - no agregado |`; 
                    localStorage.setItem('groebner_pasos', this.infoUsuario); 
                }
            } else {
                //console.log(`   ✅ Se redujo a 0`);
                this.infoUsuario += `   ✅ Se redujo a 0 |`;
                localStorage.setItem('groebner_pasos', this.infoUsuario); 
            }
        }

        if (base.length >= MAX_BASE) {
            //console.log(`\n⚠️ LÍMITE DE BASE ALCANZADO (${MAX_BASE} polinomios)`);
            this.infoUsuario += `⚠️ LÍMITE DE BASE ALCANZADO (${MAX_BASE} polinomios) |`;
            localStorage.setItem('groebner_pasos', this.infoUsuario); 
        } else {
            //console.log(`\n✅ CONVERGENCIA - Cola vacía`);
            this.infoUsuario += `✅ CONVERGENCIA - Cola vacía |`; 
            localStorage.setItem('groebner_pasos', this.infoUsuario); 
        }

        //console.log("\n🔧 INTER-REDUCCIÓN A FORMA CANÓNICA...");
        this.infoUsuario += "🔧 INTER-REDUCCIÓN A FORMA CANÓNICA... |"; 
        localStorage.setItem('groebner_pasos', this.infoUsuario); 
        return this.interReducir(base);
    }

    // ========================================================================
    // CRITERIOS DE OPTIMIZACIÓN
    // ========================================================================
    private sonCoprimos(varsA: Array<[string, number]>, varsB: Array<[string, number]>): boolean {
        const setA = new Set(varsA.map(([v]) => v));
        const setB = new Set(varsB.map(([v]) => v));
        for (const v of setA) {
            if (setB.has(v)) return false;
        }
        return true;
    }

    private esRedundante(polinomio: Polinomio, base: Polinomio[]): boolean {
        const poliNorm = this.normalizarPolinomio(polinomio);
        
        for (const existente of base) {
            const existenteNorm = this.normalizarPolinomio(existente);
            if (this.sonIguales(poliNorm, existenteNorm)) {
                return true;
            }
        }
        
        const reducido = this.reducir(polinomio, base);
        return this.esCero(reducido);
    }

    // ========================================================================
    // OPERACIONES PRINCIPALES
    // ========================================================================
    private calcularSPolinomio(f: Polinomio, g: Polinomio): Polinomio {
        if (f.length === 0 || g.length === 0) return [];
        
        const ltF = f[0];
        const ltG = g[0];
        
        const mcm = this.calcularMCMVariables(ltF.variables, ltG.variables);
        const coefF = this.dividirVariables(mcm, ltF.variables);
        const coefG = this.dividirVariables(mcm, ltG.variables);
        
        const fMult = this.multiplicarPolinomio(f, { coeficiente: new Fraccion(1n, 1n), variables: coefF });
        const gMult = this.multiplicarPolinomio(g, { coeficiente: new Fraccion(1n, 1n), variables: coefG });
        
        return this.restar(fMult, gMult);
    }

    private reducir(p: Polinomio, base: Polinomio[]): Polinomio {
        let resto = this.clonarPolinomio(p);
        let pasos = 0;
        const MAX_PASOS = 100;
        
        while (pasos < MAX_PASOS && resto.length > 0) {
            const terminoLider = resto[0];
            let reducido = false;
            
            for (const divisor of base) {
                if (divisor.length === 0) continue;
                const ltDivisor = divisor[0];
                
                if (this.esDivisible(terminoLider.variables, ltDivisor.variables)) {
                    const cociente = this.dividirTerminos(terminoLider, ltDivisor);
                    const aRestar = this.multiplicarPolinomio(divisor, cociente);
                    resto = this.restar(resto, aRestar);
                    resto = this.ordenarYSimplificar(resto);
                    reducido = true;
                    pasos++;
                    break;
                }
            }
            
            if (!reducido) break;
        }
        
        return resto;
    }

    private interReducir(base: Polinomio[]): Polinomio[] {
        //console.log("🔧 INTER-REDUCCIÓN A FORMA CANÓNICA");
        this.infoUsuario += "🔧 INTER-REDUCCIÓN A FORMA CANÓNICA |";
        localStorage.setItem('groebner_pasos', this.infoUsuario);
        
        let resultado = base.map(p => this.clonarPolinomio(p));
        let cambio = true;
        let iter = 0;
        const MAX_ITER = 20;
        
        while (cambio && iter < MAX_ITER) {
            iter++;
            cambio = false;
            
            for (let i = resultado.length - 1; i >= 0; i--) {
                const actual = resultado[i];
                const otros = resultado.filter((_, idx) => idx !== i);
                
                const reducido = this.reducir(actual, otros);
                const normalizado = this.normalizarPolinomio(reducido);
                
                if (this.esCero(normalizado)) {
                    //console.log(`   🗑️ Eliminando P${i+1}`);
                    this.infoUsuario += `   🗑️ Eliminando P${i+1} |`;
                    localStorage.setItem('groebner_pasos', this.infoUsuario);
                    resultado.splice(i, 1);
                    cambio = true;
                } else if (!this.sonIguales(actual, normalizado)) {
                    //console.log(`   🔄 Reduciendo P${i+1}`);
                    this.infoUsuario += `   🔄 Reduciendo P${i+1} |`; 
                    localStorage.setItem('groebner_pasos', this.infoUsuario);
                    resultado[i] = normalizado;
                    cambio = true;
                }
            }
        }
        
        // Eliminar múltiplos escalares
        const final: Polinomio[] = [];
        for (const poli of resultado) {
            const poliNorm = this.normalizarPolinomio(poli);
            if (!final.some(p => this.sonIguales(this.normalizarPolinomio(p), poliNorm))) {
                final.push(poliNorm);
            }
        }
        
        //console.log(`📊 Inter-reducción: ${base.length} → ${final.length} polinomios`);
        this.infoUsuario += `📊 Inter-reducción: ${base.length} → ${final.length} polinomios |`;
        localStorage.setItem('groebner_pasos', this.infoUsuario);
        return final;
    }

    // ========================================================================
    // OPERACIONES AUXILIARES
    // ========================================================================
    private calcularMCMVariables(varsA: Array<[string, number]>, varsB: Array<[string, number]>): Array<[string, number]> {
        const mapa = new Map<string, number>();
        for (const [v, e] of varsA) mapa.set(v, e);
        for (const [v, e] of varsB) mapa.set(v, Math.max(mapa.get(v) || 0, e));
        return Array.from(mapa.entries()).filter(([, e]) => e > 0).sort(([a], [b]) => a.localeCompare(b));
    }

    private dividirVariables(mcm: Array<[string, number]>, vars: Array<[string, number]>): Array<[string, number]> {
        const mapa = new Map(vars);
        const resultado: Array<[string, number]> = [];
        for (const [v, eMcm] of mcm) {
            const eVar = mapa.get(v) || 0;
            const diff = eMcm - eVar;
            if (diff > 0) resultado.push([v, diff]);
        }
        return resultado;
    }

    private dividirTerminos(a: Termino, b: Termino): Termino {
        const coef = a.coeficiente.dividir(b.coeficiente);
        const vars = this.dividirVariables(a.variables, b.variables);
        return { coeficiente: coef, variables: vars };
    }

    private multiplicarPolinomio(p: Polinomio, t: Termino): Polinomio {
        return p.map(term => this.multiplicarTerminos(term, t));
    }

    private multiplicarTerminos(a: Termino, b: Termino): Termino {
        const coef = a.coeficiente.multiplicar(b.coeficiente);
        const mapa = new Map<string, number>();
        for (const [v, e] of a.variables) mapa.set(v, e);
        for (const [v, e] of b.variables) mapa.set(v, (mapa.get(v) || 0) + e);
        const vars = Array.from(mapa.entries()).filter(([, e]) => e > 0).sort(([a], [b]) => a.localeCompare(b));
        return { coeficiente: coef, variables: vars };
    }

    private restar(a: Polinomio, b: Polinomio): Polinomio {
        const bNeg = b.map(t => ({ coeficiente: t.coeficiente.negar(), variables: t.variables }));
        return this.ordenarYSimplificar([...a, ...bNeg]);
    }

    private ordenarYSimplificar(terminos: Termino[]): Polinomio {
        const mapa = new Map<string, Fraccion>();
        
        for (const term of terminos) {
            const clave = this.claveVariables(term.variables);
            const coefActual = mapa.get(clave) || new Fraccion(0n, 1n);
            const nuevoCoef = coefActual.sumar(term.coeficiente);
            
            if (nuevoCoef.esCero()) {
                mapa.delete(clave);
            } else {
                mapa.set(clave, nuevoCoef);
            }
        }
        
        const resultado: Polinomio = [];
        for (const [clave, coef] of mapa) {
            const vars = this.decodificarClave(clave);
            resultado.push({ coeficiente: coef, variables: vars });
        }
        
        return this.ordenar(resultado);
    }

    private ordenar(terminos: Polinomio): Polinomio {
        return terminos.sort((a, b) => {
            // Orden lexicográfico puro
            for (const variable of this.variablesOrden) {
                const expA = a.variables.find(([v]) => v === variable)?.[1] || 0;
                const expB = b.variables.find(([v]) => v === variable)?.[1] || 0;
                if (expA !== expB) return expB - expA;
            }
            return 0;
        });
    }

    private normalizarPolinomio(p: Polinomio): Polinomio {
        if (p.length === 0) return p;
        
        const lt = p[0];
        if (!lt.coeficiente.esPositivo()) {
            return p.map(t => ({ coeficiente: t.coeficiente.negar(), variables: t.variables }));
        }
        
        if (!lt.coeficiente.esUno()) {
            return p.map(t => ({ coeficiente: t.coeficiente.dividir(lt.coeficiente), variables: t.variables }));
        }
        
        return p;
    }

    private esDivisible(varsA: Array<[string, number]>, varsB: Array<[string, number]>): boolean {
        const mapaB = new Map(varsB);
        for (const [v, eB] of mapaB) {
            const eA = varsA.find(([var_]) => var_ === v)?.[1] || 0;
            if (eA < eB) return false;
        }
        return true;
    }

    private sonIguales(p1: Polinomio, p2: Polinomio): boolean {
        if (p1.length !== p2.length) return false;
        for (let i = 0; i < p1.length; i++) {
            if (!p1[i].coeficiente.equals(p2[i].coeficiente)) return false;
            if (this.claveVariables(p1[i].variables) !== this.claveVariables(p2[i].variables)) return false;
        }
        return true;
    }

    private esCero(p: Polinomio): boolean {
        return p.length === 0 || p.every(t => t.coeficiente.esCero());
    }

    private clonarPolinomio(p: Polinomio): Polinomio {
        return p.map(t => ({
            coeficiente: new Fraccion(t.coeficiente.getNumerador(), t.coeficiente.getDenominador()),
            variables: t.variables.map(([v, e]) => [v, e] as [string, number])
        }));
    }

    private claveVariables(vars: Array<[string, number]>): string {
        return vars.map(([v, e]) => `${v}^${e}`).join('*');
    }

    private decodificarClave(clave: string): Array<[string, number]> {
        if (clave === '') return [];
        return clave.split('*').map(parte => {
            const [v, e] = parte.split('^');
            return [v, parseInt(e)] as [string, number];
        });
    }

    private polinomioAString(p: Polinomio): string {
        if (this.esCero(p)) return "0";
        return p.map((t, i) => {
            let str = t.coeficiente.toString();
            if (t.variables.length > 0) {
                if (str === "1") str = "";
                else if (str === "-1") str = "-";
                str += t.variables.map(([v, e]) => e === 1 ? v : `${v}^${e}`).join('');
            }
            return i > 0 && !str.startsWith('-') ? '+' + str : str;
        }).join('');
    }

    private mostrarResultado(): void {
        //console.log("\n" + "=".repeat(60));
        //console.log("🎉 BASE DE GRÖBNER EN FORMA CANÓNICA");
        this.infoUsuario += "🎉 BASE DE GRÖBNER EN FORMA CANÓNICA |"; 
        localStorage.setItem('groebner_pasos', this.infoUsuario);
        //console.log("=".repeat(60));
        
        this.base.forEach((p, i) => {
            //console.log(`G${i+1} = ${this.polinomioAString(p)}`);
            this.infoUsuario += `G${i+1} = ${this.polinomioAString(p)} |`;
            this.basesCasosUso.push(this.polinomioAString(p)); 
            localStorage.setItem('groebner_pasos', this.infoUsuario);
        });
        
        /*console.log(`\n📊 Total: ${this.base.length} polinomios`);
        console.log(`🔢 Pares procesados: ${this.paresProcesados.size}`);
        console.log("=".repeat(60));*/
        this.infoUsuario += `📊 Total: ${this.base.length} polinomios`; 
        this.infoUsuario += `🔢 Pares procesados: ${this.paresProcesados.size} |`; 
        localStorage.setItem('groebner_pasos', this.infoUsuario);
    }

    getBase(): Polinomio[] { return this.basesCasosUso; }
}