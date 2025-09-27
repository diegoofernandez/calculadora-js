export interface VisitorElemental{

    visitorNumber(node: number): string | number;
    visitorVariable(node: string): string | number; 
    visitorOperador(node: ObjElemental): string | number | NumberNode | VariableNode | OperadorNode;  

}

export class Visitor implements VisitorElemental{

    visitorNumber(node: number): number {
        return node; 
    }

    visitorVariable(node: string): string {
        return node;
    }

    visitorOperador(node: ObjElemental): string | number | NumberNode | VariableNode | OperadorNode{
        const izquierda = node.izquierda; 
        const derecha = node.derecha; 
        const operador = node.operador; 

        //REGLAS DE OPERACIONES ELEMENTALES
        //SUMA DE CERO
        if(operador == "+" && izquierda == 0){
            return derecha; 
        }

        return new OperadorNode(operador, izquierda, derecha); 


    }

}

export class NodeElem{

    protected tipo: string; 
    constructor(tipo: string){
        this.tipo = tipo; 
    }

}

export class NumberNode extends NodeElem{

    protected numero: number; 

    constructor(numero: number){
        super('numero'); 
        this.numero = numero; 
    }

    accept(visitor: VisitorElemental){
        return visitor.visitorNumber(this.numero); 
    }

}

export class VariableNode extends NodeElem{

    protected variable: string; 

    constructor(variable: string){
        super('variable'); 
        this.variable = variable;
    }

    accept(visitor: VisitorElemental){
        return visitor.visitorVariable(this.variable); 
    }

}

export class OperadorNode extends NodeElem{

    protected operador: string; 
    protected izquierda: number; 
    protected derecha: number; 

    constructor(operador: string, izquierda: number, derecha: number){
        
        super('operador'); 
        this.operador = operador; 
        this.izquierda = izquierda; 
        this.derecha = derecha; 

    }

    accept(visitor: VisitorElemental){
        let pasar = {"izquierda": this.izquierda, "derecha": this.derecha, "operador": this.operador};
        return visitor.visitorOperador(pasar); 
    }

}


