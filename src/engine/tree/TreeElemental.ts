import ObjetoComplejo from "../objects/ObjetoComplejo";

export interface VisitorElemental{

    visitorNumber(node: NumberNode): number | string;
    visitorVariable(node: VariableNode): string | string; 
    visitorOperador(node: OperadorNode): number | NodeElem | string;  
    visitorStringObj(node: StringNode): string; 
    visitorMonomio(node: MonomioNode): string; 

}

// Visitor para evaluar la expresión
export class EvaluarVisitor implements VisitorElemental {

    visitorVariable(node: VariableNode): string | string {
        return node.variable; 
    }

    visitorNumber(node: NumberNode): number {
        return node.numero;
    }
    
    visitorOperador(node: OperadorNode, grobner?: boolean): number | string{
        const izquierda = node.izquierda.accept(this);
        const derecha = node.derecha.accept(this);
        
        if(izquierda.length > 1 && derecha.length > 1 && grobner == false){

            let resolver = ObjetoComplejo.setStrategy(izquierda, derecha, node.operador); 
            return resolver; 

        }else{

            switch (node.operador) {
                case '+': return izquierda + derecha;
                case '-': return izquierda - derecha;
                case '*': return izquierda * derecha;
                case '/': return izquierda / derecha;
                default: throw new Error(`Operador desconocido: ${node.operador}`);
            }

        }

        if(grobner == true){

            const izquierda = node.izquierda.accept(this); 
            const derehca = node.derecha.accept(this); 

            let resolver = ObjetoComplejo.setStrategy(izquierda, derecha, node.operador, true); 
            return resolver; 

        }

    }

    visitorMonomio(node: MonomioNode): string{
        return node.monomio; 
    }

    visitorStringObj(node: StringNode): string{

        return node.stringObj; 

    }
}


export class NodeElem{
    
    protected tipo: string; 
    constructor(tipo: string){
        this.tipo = tipo; 
    }

    public accept(visitor: VisitorElemental): any{}

}

export class NumberNode extends NodeElem{

    public numero: number; 

    constructor(numero: number){
        super('numero'); 
        this.numero = numero; 
    }

    accept(visitor: VisitorElemental){
        return visitor.visitorNumber(this); 
    }

}


export class VariableNode extends NodeElem{

    public variable: string; 

    constructor(variable: string){
        super('variable'); 
        this.variable = variable;
    }

    accept(visitor: VisitorElemental){
        return visitor.visitorVariable(this); 
    }

}

export class OperadorNode extends NodeElem{

    public operador: string; 
    public izquierda: NodeElem; 
    public derecha: NodeElem; 

    constructor(operador: string, izquierda: NodeElem, derecha: NodeElem){
        
        super('operador'); 
        this.operador = operador; 
        this.izquierda = izquierda; 
        this.derecha = derecha; 

    }

    accept(visitor: VisitorElemental){
        return visitor.visitorOperador(this); 
    }

}

export class StringNode extends NodeElem{

    public stringObj: string;
    
    constructor(stringObj: string){
        super('objetoString'); 
        this.stringObj = stringObj; 
    }

    accept(visitor: VisitorElemental) {
        return visitor.visitorStringObj(this); 
    }

}

export class MonomioNode extends NodeElem{

    public monomio: string; 

    constructor(stringObj: string){
        super('monomio'); 
        this.monomio = stringObj; 
    }

    accept(visitor: VisitorElemental) {
        return visitor.visitorMonomio(this); 
    }

}




