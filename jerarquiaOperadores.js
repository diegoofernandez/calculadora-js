let infija; 
let posfija = []; 
let pila = []; 


let operadores = {
	"+": 1, 
	"-": 1, 
	"*": 2,
	"/": 2
}; 

function tokenization(operacion){

	if(operacion){
		infija = operacion.split(""); 
		conversion();
	}
}

function conversion(){

	for(var i = 0; i < infija.length; i++){

		//situaciones básicas de inserción a pila y posfija
		if(!isNaN(Number(infija[i]))){
			posfija.push(infija[i]); 
		}else if(infija[i] == "("){
			pila.push(infija[i]); 
		}else if(infija[i] == ")"){//leyendo array al reves, extrayendo hasta encontrar un "("
			for(var j = pila.length - 1; j >= 0; j--){
				if(pila[j] != "("){
					posfija.push(pila.splice(j, 1)[0]); 
				}else{
					pila.pop(); 
					break; 
				}
			}
		}else if(pila.length == 0 || pila[pila.length-1] == "("){//insertando y comparando operadores
			pila.push(infija[i]); 
		}else if(operadores[infija[i]] > operadores[pila[pila.length-1]]){
			pila.push(infija[i]); 
		}else if(operadores[infija[i]] <= operadores[pila[pila.length-1]]){
			while(operadores[infija[i]] <= operadores[pila[pila.length-1]]){
				posfija.push(pila.pop()); 
			}
			pila.push(infija[i]);
		}

	}
	//extrayendo todos los datos restantes de la pila
	while(pila.length > 0){
		posfija.push(pila.pop());
	}
}