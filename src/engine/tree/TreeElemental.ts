export interface VisitorElemental{

    visitorNumber(node: NumberNode): number | string;
    visitorVariable(node: VariableNode): string | string; 
    visitorOperador(node: OperadorNode): number | NodeElem | string;  

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
        //SUMA
        if(operador == '+' && derecha.numero != 0){
            return new NumberNode(derecha.numero + izquierda.numero); 
        }
        //RESTA DE CERO
        if(operador == '-' && izquierda.numero == 0){
            return izquierda;
        }
        if(operador == '-' && derecha.numero == 0){
            return derecha;
        }
        //RESTA
        if(operador == '-' && izquierda.numero != 0){
            return new NumberNode(izquierda.numero - derecha.numero);
        }
        //MULTIPLICACION POR CERO
        if(operador == '*' && izquierda.numero == 0){
            return new NumberNode(0);
        }
        //MULTIPLICACION 
        if(operador == '*' && izquierda.numero != 0){
            return new NumberNode(izquierda.numero * derecha.numero);
        }
        //DIVISION POR CERO
        if(operador == '/' && izquierda.numero == 0){
            return new NumberNode(0);
        }
        //DIVISION
        if(operador == '/' && derecha.numero != 0){
            return new NumberNode(izquierda.numero / derecha.numero);
        }

        return new OperadorNode(operador, izquierda, derecha); 


    }

}

// Visitor para evaluar la expresión
export class EvaluarVisitor implements VisitorElemental {

    visitorVariable(node: VariableNode): string | string {
        return node.variable; 
    }

    visitorNumber(node: NumberNode): number {
        return node.numero;
    }
    
    visitorOperador(node: OperadorNode): number {
        const izquierda = node.izquierda.accept(this);
        const derecha = node.derecha.accept(this);
        
        switch (node.operador) {
            case '+': return izquierda + derecha;
            case '-': return izquierda - derecha;
            case '*': return izquierda * derecha;
            case '/': return izquierda / derecha;
            default: throw new Error(`Operador desconocido: ${node.operador}`);
        }
    }
}

export class Imprimir implements VisitorElemental{

    visitorNumber(node: NumberNode): string{
        return node.numero.toString();
    }

    visitorVariable(node: VariableNode): string {
        return node.variable;
    }

    visitorOperador(node: OperadorNode): string{
        const leftStr = node.izquierda.accept(this);
        const rightStr = node.derecha.accept(this);
        return `(${leftStr} ${node.operador} ${rightStr})`;
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




