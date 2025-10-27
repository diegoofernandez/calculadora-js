type NodeType = 'Numero'|'Variable'|'Fraccion'|'Potencia'|'Polinomio'|'Grobner'|'Monomio';

interface ASTNodeG {
    type: NodeType; 
    negativoPositivo?: number;
    hijos?: ASTNodeG[];
    operable: boolean;
    representacion?: string | bigint | number;
    meta?: { 
        gradoMonomio?: number;
        vars?: string[];
        varsElevadas?: Map<string, number>;
    };
}