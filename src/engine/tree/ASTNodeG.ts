type NodeType = 'Numero'|'Variable'|'Fraccion'|'Potencia'|'Polinomio'|'Grobner'|'Monomio';

interface ASTNode {
    type: NodeType; 
    negativoPositivo?: number;
    hijos?: ASTNode[];
    operable: boolean;
    representacion?: string | bigint | number;
    meta?: { 
        gradoMonomio?: number;
        vars?: string[];
        varsElevadas?: Map<string, number>;
    };
}