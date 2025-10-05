import { Euclides } from "../utils/Euclides";
export interface ProcesamientoFraccion{

    operacion(fraccion1: Fraccion, fraccion2: Fraccion): string;

}
export class Fraccion{

    protected numerador: string | number; 
    protected denominador: string | number; 

    constructor(numerador: string | number , denominador: string | number ){

        this.numerador = numerador; 
        this.denominador = denominador; 

        if(denominador == 0){
            throw new Error("El denominador no puede ser Cero"); 
        }

    }

    simplificacion(){

        let mcd= Euclides.maximoComunDivisor(this.numerador as number, this.denominador as number); 
        let simplificada = (this.numerador as number / mcd) + "/" + (this.denominador as number / mcd);   
        return simplificada;

    }

    getNumerador(){
        return this.numerador; 
    }
    getDenominador(){
        return this.denominador; 
    }

}
export class FraccionSumar implements ProcesamientoFraccion{

    operacion(fraccion1: Fraccion, fraccion2: Fraccion): string{

        if(fraccion1.getDenominador() == fraccion2.getDenominador()){
            let numerador1 = fraccion1.getNumerador() as number; 
            let numerador2 = fraccion2.getNumerador() as number; 
            let resultado = new Fraccion(Number(numerador1) + Number(numerador2), fraccion1.getDenominador());
             
            return resultado.simplificacion();

        }else{
            let numerador1 = fraccion1.getNumerador() as number; 
            let denominador1 = fraccion1.getDenominador() as number;
            let numerador2 = fraccion2.getNumerador() as number;
            let denominador2 = fraccion2.getDenominador() as number; 
            let resultado = new Fraccion((numerador1 * denominador2) + (numerador2 * denominador1), denominador1 * denominador2);
            
            return resultado.simplificacion();

        }

    }

}

export class FraccionRestar implements ProcesamientoFraccion{

    operacion(fraccion1: Fraccion, fraccion2: Fraccion): string{

        if(fraccion1.getDenominador() == fraccion2.getDenominador()){

            let numerador1 = fraccion1.getNumerador() as number; 
            let numerador2 = fraccion2.getNumerador() as number; 
            let resultado = new Fraccion(numerador1 - numerador2, fraccion1.getDenominador());
        
            return resultado.simplificacion();

        }else{

            let numerador1 = fraccion1.getNumerador() as number; 
            let denominador1 = fraccion1.getDenominador() as number;
            let numerador2 = fraccion2.getNumerador() as number;
            let denominador2 = fraccion2.getDenominador() as number; 
            let resultado = new Fraccion((numerador1 * denominador2) - (numerador2 * denominador1), denominador1 * denominador2);

            return resultado.simplificacion();

        }

    }

}

export class FraccionMultiplicar implements ProcesamientoFraccion{

    operacion(fraccion1: Fraccion, fraccion2: Fraccion): string{

        let numerador1 = fraccion1.getNumerador() as number; 
        let denominador1 = fraccion1.getDenominador() as number;
        let numerador2 = fraccion2.getNumerador() as number; 
        let denominador2 = fraccion2.getDenominador() as number;
        let resultado = new Fraccion(numerador1 * numerador2, denominador1 * denominador2);
        
        return resultado.simplificacion();

    }

}

export class FraccionDividir implements ProcesamientoFraccion{

    operacion(fraccion1: Fraccion, fraccion2: Fraccion): string{

        let numerador1 = fraccion1.getNumerador() as number; 
        let denominador1 = fraccion1.getDenominador() as number;
        let numerador2 = fraccion2.getNumerador() as number; 
        let denominador2 = fraccion2.getDenominador() as number;
        let resultado = new Fraccion(numerador1 * denominador2, numerador2 * denominador1);
        
        return resultado.simplificacion();

    }

}

