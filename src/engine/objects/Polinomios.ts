import { Euclides } from "../utils/Euclides";
import Termino from './Termino'; 
import MCMTerminos from "./MCMTerminos";


export interface ProcesamientoPolinomio{

    operacion(polinomio1: Polinomio, polinomio2: Polinomio): string;

}

export default class Polinomio{

	private p: string[][] = []; 


	constructor(...polin: string[][]){

		if(polin){
			polin.forEach(pI => {
				this.p.push(pI);
			});
		}else{
			this.p.push(["vacío"]); 
		}

	}


}

export class SPolinomio{

	private listadoPols: Array<{ polinomio: string[], terminoLider: string}> = [];
	private coeficientes: Termino[] = []; 

	constructor(datos: Array<{ polinomio: string[], terminoLider: string}>, monomios: Termino[]){

		this.listadoPols = datos; 
		this.coeficientes = monomios; 

	}

	public operacion(){

		

	}

	private multiplicarCoeficientePorEcuacion(){



	}

}

export class SumarPolinomio implements ProcesamientoPolinomio{


	operacion(p1: Polinomio, p2: Polinomio): string{

		return ""; 

	}


}

export class RestarPolinomio implements ProcesamientoPolinomio{


	operacion(p1: Polinomio, p2: Polinomio): string{

		return ""; 

	}


}

export class MultiplicarPolinomio implements ProcesamientoPolinomio{


	operacion(p1: Polinomio, p2: Polinomio): string{

		return ""; 

	}


}

export class DividirPolinomio implements ProcesamientoPolinomio{


	operacion(p1: Polinomio, p2: Polinomio): string{

		return ""; 

	}


}