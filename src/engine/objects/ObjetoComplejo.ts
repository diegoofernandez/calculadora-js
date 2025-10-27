import Fraccion from "./Fraccion";
import { Potencia } from "./Potencia";

export default class ObjetoComplejo{ 

    

    public static setStrategy(izquierda: string, derecha?: string, operador?: string, grobner: boolean = false): string | number{

        const fraccionRegex = /(.+)\/(.+)/;
        const potenciaRegex = /\|(.+)\^(.+)\|/;
        const raizRegex = /\\(.+)\\(.+)/;

        

        if(grobner == true){

            

        }

        if(operador !== undefined && grobner == undefined){

            if(fraccionRegex.test(izquierda)){
                //simplificar fraccion
                

            }else if(potenciaRegex.test(izquierda)){
                
                let limpieza = izquierda.split("^");
                let base = limpieza[0].substring(1); 
                let exponente = limpieza[1].split("|");
                let solucion = new Potencia(base, String(exponente)); 

                return solucion.resolver(); 


            }else if(raizRegex.test(izquierda)){
                //calcular raíz
            }

        }else{

            let objeto1; 
            let objeto2; 

            if(fraccionRegex.test(izquierda) && fraccionRegex.test(derecha!)){

                objeto1 = izquierda.split('/');
                objeto2 = derecha?.split('/');
                let fraccion1 = new Fraccion(objeto1[0], objeto1[1]); 
                let fraccion2 = new Fraccion(objeto2![0], objeto2![1]);
                let strategy; 
                
                /*switch(operador){
                    case '+':
                        strategy = new FraccionSumar(); 
                        return strategy.operacion(fraccion1, fraccion2); 
                    case '-':
                        strategy = new FraccionRestar(); 
                        return strategy.operacion(fraccion1, fraccion2); 
                    case ':':
                        strategy = new FraccionDividir(); 
                        return strategy.operacion(fraccion1, fraccion2); 
                    case '*':
                        strategy = new FraccionMultiplicar(); 
                        return strategy.operacion(fraccion1, fraccion2); 
                }*/

            }

        }

        

        return ""; 

    }



}