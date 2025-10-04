import Parser from './parser/Shuntingyard';
import { Fraccion, FraccionSumar, Operar, ProcesamientoFraccion } from './objects/Fraccion';
import { Operacion} from './objects/OperacionesElementales';

export default class FacadeDriver{

	protected parser: Parser; 
	protected tipoOperacion: number; 
	
	//complex indica si es una operacion elemental, o requerirá objetos matemáticos
	constructor(complex: number, info: string){
		this.tipoOperacion = complex; 
		if(this.tipoOperacion == 1){

			this.parser = new Parser(info, complex); 

		}else{

			this.parser = new Parser(info, complex);
		
		}
	}

	

	public runOp(): any{		
		if(this.tipoOperacion == 0){

			let tomandoParser = this.parser.goConversion(); 
			let operacion = new Operacion(); 
			let resultado = operacion.operar(tomandoParser); 

			return resultado; 
		}else{
			
			let tomandoParser = this.parser.goConversion(); 

		}

	} 

}