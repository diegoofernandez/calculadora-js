import Parser from './parser/Shuntingyard';
import { Operacion} from './objects/OperacionesElementales';
import ASTConstrucG from './libs/ASTConstructG';
import GrobnerRobusto from './objects/grobner/Grobner';

export default class FacadeDriver{

	protected parser?: Parser; 
	protected tipoOperacion?: number; 
	private respuesta: any; 
	
	//complex indica si es una operacion elemental, o requerirá objetos matemáticos
	constructor(complex?: number, info?: string){
		
		if(complex && info){
			this.tipoOperacion = complex; 
			this.parser = new Parser(info, complex); 
		}


	}

	public async init(input: any){

		if(this.verifyOp(input) === 'G'){
    let nuevoAST = ASTConstrucG.construirAST(input); 
    
    let bases = new GrobnerRobusto(); // 1. Creamos la instancia vacía
    await bases.initAsync(nuevoAST);  // 2. Ejecutamos el motor pesado (con await)
    
    localStorage.setItem('bases', JSON.stringify(bases.getBase(), null, 2)); 
}
		/*if(this.verifyOp(input) === 'G'){

			let nuevoAST = ASTConstrucG.construirAST(input); 
			let bases = new GrobnerRobusto(nuevoAST); 

			localStorage.setItem('bases', JSON.stringify(bases.getBase(), null, 2)); 

		}*/else if(this.verifyOp(input) === 'F'){
			console.log("Se operarán fracciones, desde FacadeDriver");
			console.log(JSON.stringify(input, null, 2)); 
		}else if(this.verifyOp(input) === 'P'){
			console.log("Se operarán polinomios, desde FacadeDriver");
			console.log(JSON.stringify(input, null, 2)); 
		}else if(this.verifyOp(input) === 'EC'){
			console.log('Se operará una ecuación lineal');
			console.log(JSON.stringify(input, null, 2)); 
		}else if(this.verifyOp(input) === 'ER'){
			console.log('Se operará una ecuación racional');
			console.log(JSON.stringify(input, null, 2)); 
		}else if(this.verifyOp(input) === 'PO'){
			console.log('Se operará una potencia'); 
			console.log(JSON.stringify(input, null, 2));
		}else if(this.verifyOp(input) === 'RA'){
			console.log('Se operará una raíz'); 
			console.log(JSON.stringify(input, null, 2));
		}

	}

	private verifyOp(input: any): any{

		let stop = 1; 
		for (let i = 0; i < stop; i++) {

			let actual = input[i]; 
			if(actual[0].operacion == "Grobner"){
				return "G"; 
			}else if(actual[0].operacion == "Fracciones"){
				return "F";
			}else if(actual[0].operacion == "Polinomios"){
				return "P"; 
			}else if(actual[0].operacion == "EcuacionesLineales"){
				return "EC"; 
			}else if(actual[0].operacion == "EcuacionesRacionales"){
				return "ER"; 
			}else if(actual[0].operacion == "Potencias"){
				return "PO"; 
			}else if(actual[0].operacion == "Raices"){
				return "RA"; 
			}else if(actual[0].operacion == "Simplificar"){
				return "S"; 
			}else if(actual[0].operacion == "Evaluar"){
				return "SOL"; 
			}
			
		}

		return "No se reconocio operacion"; 

	}

	public runOp(): any{
		let tomandoParser = this.parser?.goConversion(); 
		let operacion = new Operacion(); 		
		if(this.tipoOperacion == 0){

			let resultado = operacion.operar(tomandoParser); 

			return resultado; 
		}else{
			
			let resultado = operacion.operar(tomandoParser, 1); 
			this.respuesta = resultado; 
			return resultado; 


		}

	}
	
	getRespuesta(){
		return this.respuesta; 
	}

}