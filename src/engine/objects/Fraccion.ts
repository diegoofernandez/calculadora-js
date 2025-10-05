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
            let resultado = new Fraccion(numerador1 + numerador2, fraccion1.getDenominador());
            /*let mcd= Euclides.maximoComunDivisor(Number(resultado.getNumerador()), Number(resultado.getDenominador)); 
            let simplificada = (Number(resultado.getNumerador()) / mcd) + "/" + (Number(resultado.getDenominador) / mcd);   
            return String(simplificada); */
            return resultado.getNumerador() + "/" + resultado.getDenominador();
        }else{
            let numerador1 = fraccion1.getNumerador() as number; 
            let denominador1 = fraccion1.getDenominador() as number;
            let numerador2 = fraccion2.getNumerador() as number;
            let denominador2 = fraccion2.getDenominador() as number; 
            let resultado = new Fraccion((numerador1 * denominador2) + (numerador2 * denominador1), denominador1 * denominador2);
            /*let mcd= Euclides.maximoComunDivisor(Number(resultado.getNumerador()), Number(resultado.getDenominador)); 
            let simplificada = (Number(resultado.getNumerador()) / mcd) + "/" + (Number(resultado.getDenominador) / mcd);   
            return String(simplificada); */
            return resultado.getNumerador() + "/" + resultado.getDenominador();

        }

    }

}

export class FraccionRestar implements ProcesamientoFraccion{

    operacion(fraccion1: Fraccion, fraccion2: Fraccion): string{

        if(fraccion1.getDenominador() == fraccion2.getDenominador()){

            let numerador1 = fraccion1.getNumerador() as number; 
            let numerador2 = fraccion2.getNumerador() as number; 
            let resultado = new Fraccion(numerador1 - numerador2, fraccion1.getDenominador());
        
            return resultado.getNumerador() + "/" + resultado.getDenominador();

        }else{

            let numerador1 = fraccion1.getNumerador() as number; 
            let denominador1 = fraccion1.getDenominador() as number;
            let numerador2 = fraccion2.getNumerador() as number;
            let denominador2 = fraccion2.getDenominador() as number; 
            let resultado = new Fraccion((numerador1 * denominador2) - (numerador2 * denominador1), denominador1 * denominador2);
            
            return resultado.getNumerador() + "/" + resultado.getDenominador();

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
        
        return resultado.getNumerador() + "/" + resultado.getDenominador();

    }

}

export class FraccionDividir implements ProcesamientoFraccion{

    operacion(fraccion1: Fraccion, fraccion2: Fraccion): string{

        let numerador1 = fraccion1.getNumerador() as number; 
        let denominador1 = fraccion1.getDenominador() as number;
        let numerador2 = fraccion2.getNumerador() as number; 
        let denominador2 = fraccion2.getDenominador() as number;
        let resultado = new Fraccion(numerador1 * denominador2, numerador2 * denominador1);
        
        return resultado.getNumerador() + "/" + resultado.getDenominador();

    }

}

