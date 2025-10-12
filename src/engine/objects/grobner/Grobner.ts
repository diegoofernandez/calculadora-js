import ComparadorTermino from "../ComparadorTermino";
import OperadorTermino from "../OperadorTermino";
import Termino from "../Termino";
import { SPolinomio } from "../Polinomios";
import MCMTerminos from "../MCMTerminos";

export interface ProcesamientoGrobner{

    operacion(fraccion1: Grobner, s: Grobner): string;

}

export default class Grobner{ 

	private idealesG: Array<{ polinomio: string[], terminoLider: string}> = []; 
	private baseCompleta: boolean = false; 
	

	constructor(...polinomios: string[][]){

        polinomios.forEach(polinom => {
            let ordenado = this.ordenarPolinomio(polinom);
            this.idealesG.push({
                polinomio: ordenado,
                terminoLider: ordenado[0]
            });
        });

    }

    public crearBases(){

        //buscando mcm monomios lideres
        let monomiosLideres: Termino[] = []; 
        let cantidadCoeficientes: Termino[]; 
        let iteradorCoeficientes = 0; 

        for(var i = 0; i < this.idealesG.length; i++){

            monomiosLideres.push(new Termino(this.idealesG[i].terminoLider)); 

        }

        let monomiosMCM = MCMTerminos.calcularMCMMultiple(monomiosLideres); 

        //division monomios x mcm de monomio:
        let resultadosDivisionMonomios = OperadorTermino.dividirMultiple(monomiosMCM, monomiosLideres); 

        let nuevaBase = this.generarSPolinomio(resultadosDivisionMonomios); 


    }

    private buscarMonomioLider(polinomio: string[]): string{

        let monomioActual = polinomio[0];

        for(let i = 1; i < polinomio.length; i++){

            let termA = new Termino(monomioActual);
            let termB = new Termino(polinomio[i]);

            if(ComparadorTermino.comparar(termA, termB)){

                monomioActual = termA.toString();

            }

        }

        return monomioActual; 

    }

    private ordenarTerminos(terminos: Termino[]): Termino[] {

        return terminos.sort((a, b) => ComparadorTermino.comparar(b, a));

    }

    private ordenarPolinomio(polinomio: string[]): string[] {
        
        const terminos = polinomio.map(str => new Termino(str));
        const ordenados = terminos.sort((a, b) => ComparadorTermino.comparar(b, a));
        
        return ordenados.map(term => term.toString());
    
    }

    private generarSPolinomio(monomiosDivididos: Termino[]): Array<{ polinomio: string[], terminoLider: string}>{

        let sPolinomio = new SPolinomio(this.idealesG, monomiosDivididos);

        return [{polinomio: [""], terminoLider: ""}];

    }



}
