import Parser from './parser/Shuntingyard';
import { Fraccion, FraccionSumar, OperandoFraccion, Operar, ProcesamientoFraccion } from './objects/Fraccion';
import { Operacion} from './objects/OperacionesElementales';

export class FacadeDriver{

	protected parser: Parser; 
	protected tipoOperacion: number; 
	//complex indica si es una operacion elemental, o requerirá objetos matemáticos
	constructor(complex: number, info: string){
		this.tipoOperacion = complex; 
		this.parser = new Parser(info, complex);
	}

	

	public runOp(): any{
		let tomandoParser = this.parser.goConversion(); 
		
		if(this.tipoOperacion == 0){

			let operacion = new Operacion(); 
			let resultado = operacion.operar(tomandoParser); 

			return resultado; 
		}else{
			return 0; 
		}

	} 

}