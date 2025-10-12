import { Euclides } from "../utils/Euclides";
import Termino from './Termino'; 
import MCMTerminos from "./MCMTerminos";
import OperadorTermino from "./OperadorTermino";
import ComparadorTermino from "./ComparadorTermino";


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

		let multiplicaciones: Array<{ polinomio: string[], terminoLider: string}> = this.multiplicarCoeficientePorEcuacion(); 

		return multiplicaciones; 

	}

	private multiplicarCoeficientePorEcuacion(): Array<{ polinomio: string[], terminoLider: string}>{

		let tempPolinomio: Array<{ polinomio: string[], terminoLider: string}> = [];

		for (let i = 0; i < this.coeficientes.length; i++) {
			
			let resultadoOperaciones: string[] = []; 

			for (let t = 0; t < this.listadoPols[i].polinomio.length; t++) {
				
				let multiplicacion = OperadorTermino.multiplicar(this.coeficientes[i], new Termino(this.listadoPols[i].polinomio[t])); 
				resultadoOperaciones.push(multiplicacion.toString()); 

			}

			let ordenTerminos = OperadorTermino.ordenarPolinomio(resultadoOperaciones);

			resultadoOperaciones.forEach(p => {

				tempPolinomio.push({
					polinomio: ordenTerminos,
					terminoLider: ordenTerminos[0]
				})

			});
			
		}

		return this.reducirPolinomios(tempPolinomio);

	}

	private reducirPolinomios(datos: Array<{ polinomio: string[], terminoLider: string}>) {

		let tempPolinomio: string[] = [];  

		for (let i = 0; i < datos[0].polinomio.length; i++) {
			let termA = new Termino(datos[0].polinomio[i]);
			let termB = new Termino(datos[1].polinomio[i]);
			
			let resultado = OperadorTermino.restar(termA, termB);
			
			// Verificar si el resultado NO es cero
			if (resultado.getCoeficiente() !== 0) {
				tempPolinomio.push(resultado.toString());
			}
		}
    
    	// Verificar si el polinomio resultante está vacío (es cero)
		if (tempPolinomio.length === 0) {
			
			return [{
				polinomio: ["Reducido", "Listo"],
				terminoLider: 0
			}];
			
		}
		
		let ordenado = OperadorTermino.ordenarPolinomio(tempPolinomio); 

		return [{
			polinomio: ordenado,
			terminoLider: ordenado[0]
		}];

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