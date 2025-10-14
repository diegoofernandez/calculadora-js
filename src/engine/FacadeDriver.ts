import Parser from './parser/Shuntingyard';
import { Operacion} from './objects/OperacionesElementales';

export default class FacadeDriver{

	protected parser: Parser; 
	protected tipoOperacion: number; 
	private respuesta: any; 
	
	//complex indica si es una operacion elemental, o requerirá objetos matemáticos
	constructor(complex: number, info: string){
		
		this.tipoOperacion = complex; 
		this.parser = new Parser(info, complex); 

	}

	

	public runOp(): any{
		let tomandoParser = this.parser.goConversion(); 
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