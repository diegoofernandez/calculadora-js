import { NumberNode, OperadorNode, EvaluarVisitor} from "../tree/TreeElemental";

export class Operacion{

    public pilaTree: Array<NumberNode | OperadorNode> = []; 
    public enteros = /^\d+$/;

    operar(operacion: Array<string>): any{

        this.pilaTree = []; 
        let i = 0; 

        while(i < operacion.length){

            if(this.enteros.test(operacion[i])){
                this.pilaTree.push(new NumberNode(Number(operacion[i]))); 
                i++; 
                continue; 
            }else if(operacion[i] == "+"){
                let izquierda = this.pilaTree.pop(); 
                let derecha = this.pilaTree.pop()
                this.pilaTree.push(new OperadorNode('+', izquierda!, derecha!)); 
                i++; 
                continue; 
            }else if(operacion[i] == '-'){
                let izquierda = this.pilaTree.pop(); 
                let derecha = this.pilaTree.pop()
                this.pilaTree.push(new OperadorNode('-', izquierda!, derecha!)); 
                i++;
                continue; 
            }else if(operacion[i] == '*'){
                let izquierda = this.pilaTree.pop(); 
                let derecha = this.pilaTree.pop()
                this.pilaTree.push(new OperadorNode('*', izquierda!, derecha!)); 
                i++;
                continue;
            }else if(operacion[i] == '/'){
                let izquierda = this.pilaTree.pop(); 
                let derecha = this.pilaTree.pop()
                this.pilaTree.push(new OperadorNode('/', izquierda!, derecha!)); 
                i++;
                continue;
            }
        }

        
        let impresor = new EvaluarVisitor();
        let arbolSimplificado = this.pilaTree[0].accept(impresor); 

        return arbolSimplificado;

    }
}
