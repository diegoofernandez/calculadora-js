type NodeType = 'Numero'|'Variable'|'Fraccion'|'Id'|'+'|'-'|'*'|':'|'='|'Potencia'|'Raiz'|'Polinomio'|'Ecuacion'|'Grobner'|'Monomio'|'Binomio'|'Trinomio';

interface ASTNode{

    type: NodeType; 
    negativoPositivo?: number; // -1 o 1 representan el estado
    hijos?: ASTNode[]; //el Shunting Yard ordena nodos de forma posfija, para respetar jerarquía
    operable: boolean; //Si es solo un monomio 'true' (false por defecto), el nodo se resuelve a si mismo, es decir, sino tiene otros monomios hermanos
    // datos concretos
    representacion?: string | bigint; //para identificación, ejemplo, en sus hijos podrá tener los objetos que desee, pero aquí habrá un string que representé a sus hijos, no operable, solo informativo
    meta?: { 
        gradoMonomio?: number; 
        gradorMonomioVar?: string; 
        vars?: string[]; 
        originalValue?: string; 
        modificado?: boolean; 
        monomioMayorPolinomio?: Map<string, number>; 
        fuePolinomioReducido?: boolean;
        valoresTipos?: {
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
    leyes?: {
        generales?: {
            enteroPotenciaCero: boolean; // true: objeto es = objeto
            potenciaUno: boolean; // true: a la potencia de 1 = objeto actual
        }; 
        fraccion?: {
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