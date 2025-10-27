import { Euclides } from "../utils/Euclides";
import Fraccion from "./Fraccion";


type Termino = {
    coeficiente: number | Fraccion, 
    variables: Array<[string, number]>
}

export interface ProcesamientoPolinomio{

    operacion(polinomio1: Polinomio, polinomio2: Polinomio): string;

}

export default class Polinomio{

	private p: Termino[][] = []; 


	constructor(...polins: Termino[][]){

		if(polins){
			polins.forEach(pI => {
				this.p.push(pI);
			});
		}

	}

	public static monomioMayor(){ 

		

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