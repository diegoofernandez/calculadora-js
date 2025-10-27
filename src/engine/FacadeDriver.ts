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

	public init(input: any){


		if(this.verifyOp(input) === 'G'){

			let nuevoAST = ASTConstrucG.construirAST(input); 
			let bases = new GrobnerRobusto(nuevoAST); 

		}

	}

	private verifyOp(input: any): any{

		let stop = 1; 

		for (let i = 0; i < stop; i++) {

			let actual = input[i]; 
			if(actual[0].operacion == "Grobner"){
				return "G"; 
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