export interface VisitorElemental{

    visitorNumber(node: NumberNode): number;
    visitorVariable(node: VariableNode): string; 
    visitorOperador(node: OperadorNode): number | NodeElem;  

}

export class Visitor implements VisitorElemental{

    visitorNumber(node: NumberNode): number {
        return node.numero; 
    }

    visitorVariable(node: VariableNode): string {
        return node.variable;
    }

    visitorOperador(node: OperadorNode):  number | NodeElem{
        const izquierda = node.izquierda.accept(this); 
        const derecha = node.derecha.accept(this); 
        const operador = node.operador; 

        //REGLAS DE OPERACIONES ELEMENTALES
        //SUMA DE CERO
        if(operador == "+" && izquierda.numero == 0){
            return derecha; 
        }
        if(operador == "+" && derecha.numero == 0){
            return izquierda; 
        }

        return new OperadorNode(operador, izquierda, derecha); 


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


