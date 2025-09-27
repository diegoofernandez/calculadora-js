import Parser from './parser/Shuntingyard';

export class FacadeDriver{

	protected parser: Parser; 


	constructor(complex: number, info: string){
		this.parser = new Parser(info, complex);
	}

	

}