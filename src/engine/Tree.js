//nodo base
class Nodo{
	constructor(tipo){
		this.tipo = tipo; //numero, operador, variable
	}
}
//nodo númerico
class NumeroNodo extends Nodo{
	constructor(valor){
		super('numero'); 
		this.valor = parseFloat(valor); 
	}
	accept(visitor){
		return visitor.visitNumero(this); 
	}
}
//nodo variable
class VariableNodo extends Nodo{
	constructor(nombre){
		super('variable'); 
		this.nombre = nombre; 
	}
	accept(visitor){
		return visitor.visitVariable(this); 
	}
}
//nodo operador
class OperadorNodo extends Nodo{
	constructor(operador, izquierda, derecha){
		super('operador'); 
		this.operador = operador;
		this.izquierda = izquierda; 
		this.derecha = derecha; 
	}
	accept(visitor){
		return visitor.visitOperador(this); 
	}
}

/*-----------------------*/
//patron "visitor" base
class Visitor{ 
	visitNumero(node){}
	visitVariable(node){}
	visitOperador(node){}
}

//mostrar el resultado
class ImprVisitor extends Visitor{
	visitNumero(nodo){
		return nodo.valor.toString();
	}
	visitVariable(nodo){
		return nodo.nombre; 
	}
	visitOperador(nodo){
		const izquierdaStr = node.izquierda.accept(this);
		const derechaStr = node.derecha.accept(this); 
		return `(${izquierdaStr} ${node.operador} ${derechaStr})`; 
	}
}
//clase simplificadora
class SimplificacionVisitor extends Visitor{
	visitNumero(node){ 
		return node; 
	}
	visitVariable(node){ 
		return node; 
	}
	visitOperador(node){
		const simplIzquierdo = node.izquierda.accept(this); 
		const simplDerecho = node.deracha.accept(this); 

		//REGLAS
		//0 + x = x 
		if(node.operador == "+" && simplIzquierdo.tipo == 'numero' && simplIzquierdo.valor == 0){
			return simplDerecho; 
		}
		//x + 0 = x
		if(node.operador == "+" && simplDerecho.tipo == 'numero' && simplDerecho.valor == 0){
			return simplIzquierdo; 
		}
		//0 * x = 0
		if(node.operador == "*" && simplIzquierdo.tipo == 'numero' && simplIzquierdo.valor == 0){
			return new NumeroNodo(0); 
		}
		// 3 + 5 = 8 (suma constantes)
		if(node.operador == '+' && simplIzquierdo.tipo == 'numero' && simplDerecho.tipo == 'numero'){
			return new NumeroNodo(simplIzquierdo.valor + simplDerecho.valor);
		}
		// 3 - 5 = 8 (resta constantes)
		if(node.operador == '-' && simplIzquierdo.tipo == 'numero' && simplDerecho.tipo == 'numero'){
			return new NumeroNodo(simplIzquierdo.valor - simplDerecho.valor);
		}

	}
}


