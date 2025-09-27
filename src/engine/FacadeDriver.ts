import Parser from './parser/Shuntingyard';
import { Fraccion, FraccionSumar, Operar, ProcesamientoFraccion } from './objects/Fraccion';
import { ResolviendoElemental } from './objects/OperacionesElementales';

export class FacadeDriver{

	protected parser: Parser; 
	protected tipoOperacion: number; 
	//complex indica si es una operacion elemental, o requerirá objetos matemáticos
	constructor(complex: number, info: string){
		this.tipoOperacion = complex; 
		this.parser = new Parser(info, complex);
	}

	

	public runOp(): string{
		let tomandoParser = this.parser.goConversion(); 
		
		if(this.tipoOperacion == 0){

			

			return ""; 
		}else{
			return "Aún no realizo operaciones complejas"; 
		}

	} 

}