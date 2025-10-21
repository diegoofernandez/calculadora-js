type NodeType = 'Numero'|'Variable'|'Fraccion'|'Id'|'+'|'-'|'*'|':'|'='|'Potencia'|'Raiz'|'Polinomio'|'Ecuacion'|'Grobner'|'Monomio'|'Binomio'|'Trinomio'|'Error';



interface ASTNode{

    type: NodeType; 
    negativoPositivo?: number; // -1 o 1 representan el estado
    hijos?: ASTNode[]; //el Shunting Yard ordena nodos de forma posfija, para respetar jerarquía
    operable: boolean; //Si es solo un monomio 'true' (false por defecto), el nodo se resuelve a si mismo, es decir, sino tiene otros monomios hermanos
    // datos concretos
    representacion?: string | bigint; //para identificación, ejemplo, en sus hijos podrá tener los objetos que desee, pero aquí habrá un string que representé a sus hijos, no operable, solo informativo
    meta?:{ 

        gradoMonomio?: number; 
        gradorMonomioVar?: string; 
        vars?: string[]; 
        varsElevadas?: Map<string, number>; 
        originalValue?: string; 
        modificado?: boolean; 
        monomioMayorPolinomio?: Map<string, number>; 
        fuePolinomioReducido?: boolean;
        valoresTipos?:{
            indice?: number | string; 
            radicando?: number | string | NodeType;
            numerador?: bigint | string | NodeType;
            denominador?: bigint | string | NodeType; 
            numerico?: number; 
            variable?: string;  
            base?: number | string | NodeType; 
            exponente?: number | string | NodeType; 
            mcm?: number | bigint;
            mcd?: number | bigint; 

        }

    };

    leyes?:{
        generales?: {
            enteroPotenciaCero: boolean; // true: objeto es = objeto
            potenciaUno: boolean; // true: a la potencia de 1 = objeto actual
        }; 
        fraccion?:{
            numeradorCero: boolean; // true: resultado = 0
            elevadaCero: boolean; // true: 1
            mismoDenominador: boolean; 
            equivalenciaEntero: boolean; //true: si numerador y denominador son iguales
        };
        exponente?:{
            fraccionario: boolean; //true: si contiene una fracción como exponente
            negativo: boolean; //true: si el exponente es negativo
        };
        raiz?:{
            raizDeRaiz: boolean; //true: si esta dentro de otra raíz
            productoEnRaiz: boolean; //true: si el radicando tiene un producto
            cancelacionConPotencia: boolean; //true: si el radicando es una potencia de mismo indice
        }
    }
}

export default class CreadorAst implements ASTNode{

    public type; 
    public operable; 

    constructor(tipo: NodeType, operable: boolean){

        this.type = tipo; 
        this.operable = operable; 

    }

}

//desde el front, los datos serán del siguiente formato: 
let dataInput = [
    [{operacion: "Grobner"}],
    [
        {type: "Monomio", partes: [{objeto: "Potencia", base: "x", exponente:"2"}, {objeto: "Fraccion", numerador: "4", denominador: "6"}]},
        {type: "Monomio", partes: [{objeto: "Potencia", base: "y", exponente:"2"}]},
        {type: "Monomio", coeficiente: ["x", "y"], partes: [{objeto: "Potencia", base: "z", exponente:"2"}]},
        {type: "Monomio", coeficiente:["-1"]}
    ],
    [
        {type: "Monomio", partes: [{objeto: "Potencia", base: "x", exponente:"3"}]},
        {type: "Monomio", partes: [{objeto: "Potencia", base: "y", exponente:"322"}]},
        {type: "Monomio", partes: [{objeto: "Potencia", base: "z", exponente:"3"}]},
        {type: "Monomio", coeficiente:["-1"]}
    ],
    [
        {type: "Monomio", partes: [{objeto: "Potencia", base: "x", exponente:"3"}, {objeto: "Fraccion", numerador:[{objeto: "Potencia", base:"7", exponente: "2"}], denominador: "2"}]},
        {type: "Monomio", partes: [{objeto: "Potencia", base: "y", exponente:"322"}]},
        {type: "Monomio", partes: [{objeto: "Potencia", base: "z", exponente:"3"}]},
        {type: "Monomio", coeficiente:["21","a"], partes: [{objeto: "Potencia", base: "x", exponente:"15"}]},
        {type: "Monomio", partes: [{objeto: "Potencia", base: "22", exponente:"15"}]},
        {type: "Monomio", partes: [{objeto: "Potencia", base: "3", exponente:"4"}]},
        {type: "Monomio", coeficiente:["-1"]}
    ]
]; 


function construirASTDesdeEntrada(dataInput: any[]): ASTNode{
    const polinomiosAST: ASTNode[] = [];

    // Iterar polinomios (desde índice 1)
    for(let i = 1; i < dataInput.length; i++){

        const polinomio = dataInput[i];
        const monomiosAST: ASTNode[] = [];

        // Iterar monomios
        for(let j = 0; j < polinomio.length; j++){

            const monomio = polinomio[j];
            const hijos: ASTNode[] = [];

            // Coeficientes
            if(monomio.coeficiente){

                if(Array.isArray(monomio.coeficiente)){

                    for (let k = 0; k < monomio.coeficiente.length; k++){

                        hijos.push({
                            type: 'Variable',
                            operable: true,
                            representacion: monomio.coeficiente[k]
                        } as ASTNode);

                    }

                } else {
                    hijos.push({
                        type: 'Numero',
                        operable: true, 
                        representacion: monomio.coeficiente
                    } as ASTNode);
                }
            }

            // Partes
            if (monomio.partes) {
                for (let k = 0; k < monomio.partes.length; k++) {
                    const parte = monomio.partes[k];
                    
                    if (parte.objeto === "Potencia") {
                        hijos.push({
                            type: 'Potencia',
                            operable: false,
                            hijos: [
                                { type: 'Variable', operable: true, representacion: parte.base } as ASTNode,
                                { type: 'Numero', operable: true, representacion: parte.exponente } as ASTNode
                            ]
                        } as ASTNode);
                    }
                    
                    if (parte.objeto === "Fraccion") {
                        hijos.push({
                            type: 'Fraccion', 
                            operable: false,
                            hijos: [
                                { type: 'Numero', operable: true, representacion: parte.numerador } as ASTNode,
                                { type: 'Numero', operable: true, representacion: parte.denominador } as ASTNode
                            ]
                        } as ASTNode);
                    }
                }
            }

            if (hijos.length > 0) {
                monomiosAST.push({
                    type: 'Monomio',
                    operable: false,
                    hijos: hijos
                } as ASTNode);
            }
        }

        polinomiosAST.push({
            type: 'Polinomio',
            operable: false, 
            hijos: monomiosAST
        } as ASTNode);
    }

    return {
        type: 'Grobner',
        operable: false,
        hijos: polinomiosAST
    } as ASTNode;
}

// Usar
const ast = construirASTDesdeEntrada(dataInput);
console.log("✅ LISTO:", ast);

// EJECUTAR TODO EL PROCESAMIENTO
console.log("🎯 PROCESANDO ESTRUCTURA COMPLETA:");
procesarEntradaCompleta(dataInput);

console.log("\n🌳 CONSTRUYENDO AST:");
const astCompleto = construirASTDesdeEntrada(dataInput);
mostrarASTCompleto(astCompleto);

function procesarEntradaCompleta(dataInput: any[]): void {
    console.log("🚀 PROCESANDO ENTRADA");
    
    // Configuración
    if (dataInput[0] && dataInput[0][0]) {
        console.log("⚙️ Operación:", dataInput[0][0].operacion);
    }
    
    // Polinomios
    for (let i = 1; i < dataInput.length; i++) {
        console.log(`\n📦 POLINOMIO ${i}:`);
        const polinomio = dataInput[i];

        // CALCULAR ESTADÍSTICAS
        const stats = calcularMonomios(polinomio);
        
        // ORDENAR MONOMIOS
        const polinomioOrdenado = ordenarMonomios(polinomio);
        
        // Mostrar ordenado
        console.log("📐 ORDEN FINAL:");
        
        // Monomios
        for (let j = 0; j < polinomio.length; j++) {
            const monomio = polinomio[j];
            console.log(`  🧮 MONOMIO ${j + 1}: ${monomio.type}`);
            
            const grado = calcularGradoMonomio(monomio);
            console.log(`   ${j + 1}. Grado ${grado}:`, 
                monomio.coeficiente ? `Coef: ${monomio.coeficiente}` : '',
                monomio.partes ? `Partes: ${monomio.partes.length}` : 'Constante'
            );

            // Coeficiente
            if (monomio.coeficiente) {
                console.log(`    ➕ Coeficiente:`, monomio.coeficiente);
            }
            
            // Partes
            if (monomio.partes) {
                for (let k = 0; k < monomio.partes.length; k++) {
                    const parte = monomio.partes[k];
                    console.log(`    📍 ${parte.objeto}:`);
                    
                    if (parte.objeto === "Potencia") {
                        console.log(`      Base: ${parte.base}, Expo: ${parte.exponente}`);
                    }
                    
                    if (parte.objeto === "Fraccion") {
                        console.log(`      Numerador: ${parte.numerador}, Denominador: ${parte.denominador}`);
                    }
                }
            }
        }
    }
}

// USAR
procesarEntradaCompleta(dataInput);

function calcularMonomios(monomios: any[]): any {
    console.log("🧮 CALCULANDO MONOMIOS");
    
    const resultados = {
        totalMonomios: monomios.length,
        conCoeficiente: 0,
        conPartes: 0,
        tiposObjetos: new Map<string, number>(),
        grados: [] as number[]
    };

    for (let i = 0; i < monomios.length; i++) {
        const monomio = monomios[i];
        
        // Contar coeficientes
        if (monomio.coeficiente) resultados.conCoeficiente++;
        
        // Contar partes
        if (monomio.partes && monomio.partes.length > 0) {
            resultados.conPartes++;
            
            // Calcular grado del monomio
            let grado = 0;
            for (let j = 0; j < monomio.partes.length; j++) {
                const parte = monomio.partes[j];
                
                // Contar tipos de objetos
                resultados.tiposObjetos.set(
                    parte.objeto, 
                    (resultados.tiposObjetos.get(parte.objeto) || 0) + 1
                );
                
                // Sumar al grado
                if (parte.objeto === "Potencia") {
                    grado += parseInt(parte.exponente) || 1;
                } else if (parte.objeto === "Variable") {
                    grado += 1;
                }
            }
            resultados.grados.push(grado);
        }
    }
    
    console.log("📊 ESTADÍSTICAS:");
    console.log("   Total monomios:", resultados.totalMonomios);
    console.log("   Con coeficiente:", resultados.conCoeficiente);
    console.log("   Con partes:", resultados.conPartes);
    console.log("   Grados encontrados:", resultados.grados);
    console.log("   Tipos de objetos:", Object.fromEntries(resultados.tiposObjetos));
    
    return resultados;
}

function ordenarMonomios(monomios: any[], orden: string = 'grado', variables: string[] = ['x', 'y', 'z']): any[] {
    const monomiosOrdenados = [...monomios];
    
    monomiosOrdenados.sort((a, b) => {
        if (orden === 'lex') {
            return compararLex(a, b, variables);
        } else {
            // Orden por grado total (como antes)
            const gradoA = calcularGradoMonomio(a);
            const gradoB = calcularGradoMonomio(b);
            return gradoB - gradoA;
        }
    });
    
    return monomiosOrdenados;
}

function calcularGradoMonomio(monomio: any): number {
    let grado = 0;
    
    if (monomio.partes) {
        for (let i = 0; i < monomio.partes.length; i++) {
            const parte = monomio.partes[i];
            
            if (parte.objeto === "Potencia") {
                grado += parseInt(parte.exponente) || 1;
            } else if (parte.objeto === "Variable") {
                grado += 1;
            }
            // Fracciones y otros no suman al grado
        }
    }
    
    return grado;
}

function compararLex(terminoA: any, terminoB: any, ordenVars: string[] = ['x', 'y', 'z']): number {
    const gradoA = obtenerGradoPorVariable(terminoA, ordenVars);
    const gradoB = obtenerGradoPorVariable(terminoB, ordenVars);
    
    for (let i = 0; i < ordenVars.length; i++) {
        const varName = ordenVars[i];
        if (gradoA[varName] !== gradoB[varName]) {
            return gradoB[varName] - gradoA[varName]; // Mayor exponente primero
        }
    }
    return 0;
}

function obtenerGradoPorVariable(monomio: any, ordenVars: string[]): {[key: string]: number} {
    const grado: {[key: string]: number} = {};
    ordenVars.forEach(v => grado[v] = 0);
    
    if (monomio.partes) {
        monomio.partes.forEach((parte: any) => {
            if (parte.objeto === "Potencia" && ordenVars.includes(parte.base)) {
                grado[parte.base] += parseInt(parte.exponente) || 1;
            } else if (parte.objeto === "Variable" && ordenVars.includes(parte.nombre)) {
                grado[parte.nombre] += 1;
            }
        });
    }
    
    return grado;
}


// AGREGAR ESTA FUNCIÓN AL FINAL DE TU CÓDIGO (sin modificar nada más)

function mostrarASTCompleto(ast: ASTNode, nivel: number = 0): void {
    // VERIFICAR SI EL NODO ES VÁLIDO
    if (!ast) {
        console.log('  '.repeat(nivel) + '❌ NODO UNDEFINED');
        return;
    }
    
    const indentacion = '  '.repeat(nivel);
    const tipo = ast.type;
    const operable = ast.operable ? 'OPERABLE' : 'NO_OPERABLE';
    
    console.log(`${indentacion}${tipo} [${operable}]`);
    
    if (ast.representacion) {
        console.log(`${indentacion}  representacion: "${ast.representacion}"`);
    }
    if (ast.negativoPositivo !== undefined) {
        console.log(`${indentacion}  signo: ${ast.negativoPositivo}`);
    }
    
    if (ast.meta) {
        console.log(`${indentacion}  meta:`, ast.meta);
    }
    
    if (ast.leyes) {
        console.log(`${indentacion}  leyes:`, ast.leyes);
    }
    
    if (ast.hijos && ast.hijos.length > 0) {
        console.log(`${indentacion}  hijos:`);
        ast.hijos.forEach((hijo, index) => {
            console.log(`${indentacion}  [${index}]:`);
            mostrarASTCompleto(hijo, nivel + 2);
        });
    }
    
    if (nivel === 0) {
        console.log('='.repeat(50));
    }
}



/*

    TIPOS DE OBJETOS
    |base^exponente| 
    \\indice\\radicando
    F(num/den)
    P <monomio> + <monomio> - <monomio>, 
    G <monomio> + <monomio> - <monomio>, 
    ECU <monomio> + <monomio> + <monomio> = <monomio> ....
    ECURA <monomio> + <monomio> + <monomio> = <monomio> ....


    JERARQUÍA: 
    - Polinomio | Grobner | Ecuacion
    | - - Trinomio 
    | - - - Binomio 
    | - - - - Monomio
    | - - - - - Exponente | Raiz | Fraccion     
    | - - - - - - Numero | Variable

*/