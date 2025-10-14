import { NumberNode, OperadorNode, EvaluarVisitor, StringNode} from "../tree/TreeElemental";

export class Operacion{

    public pilaTree: Array<NumberNode | OperadorNode | StringNode> = []; 
    public enteros = /^\d+$/;

    operar(operacion: Array<string>, tipo?: number): any{

        this.pilaTree = []; 
        let i = 0; 

        if(tipo !== undefined){

            while(i < operacion.length){
                if(operacion[i] != '+' && operacion[i] != '-' && operacion[i] != ':' && operacion[i] != '*' && operacion[i] != '='){
                    this.pilaTree.push(new StringNode(operacion[i])); 
                    i++; 
                    continue; 
                }else{
                    let derecha = this.pilaTree.pop(); 
                    let izquierda = this.pilaTree.pop()
                    this.pilaTree.push(new OperadorNode(operacion[i], izquierda!, derecha!)); 
                    i++; 
                    continue; 
                }
            }

        }else{
            while(i < operacion.length){

                if(this.enteros.test(operacion[i])){
                    this.pilaTree.push(new NumberNode(Number(operacion[i]))); 
                    i++; 
                    continue; 
                }else{
                    let izquierda = this.pilaTree.pop(); 
                    let derecha = this.pilaTree.pop()
                    this.pilaTree.push(new OperadorNode(operacion[i], izquierda!, derecha!)); 
                    i++; 
                    continue; 
                }
            }
        }
        
        let impresor = new EvaluarVisitor();
        let arbolSimplificado = this.pilaTree[0].accept(impresor); 

        return arbolSimplificado;

    }
}
