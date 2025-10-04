import { ObjetoMatematico } from "./ObjetoMatematico";

export interface ProcesamientoFraccion{

    operacion(fraccion1: Fraccion, fraccion2: Fraccion): Fraccion;

}
export class Fraccion extends ObjetoMatematico{

    protected numerador: string | number | ObjetoMatematico; 
    protected denominador: string | number | ObjetoMatematico; 

    constructor(numerador: string | number | ObjetoMatematico, denominador: string | number | ObjetoMatematico){

        super(); 
        this.numerador = numerador; 
        this.denominador = denominador; 

        if(denominador == 0){
            throw new Error("El denominador no puede ser Cero"); 
        }

    }

    evaluar(): Fraccion{

        if(this.numerador instanceof ObjetoMatematico || this.denominador instanceof ObjetoMatematico){

            return new Fraccion(
                this.numerador instanceof ObjetoMatematico ? this.numerador.evaluar() : this.numerador, 
                this.denominador instanceof ObjetoMatematico ? this.denominador.evaluar() : this.denominador
            );

        } 

        return new Fraccion(this.numerador as number, this.denominador as number); 

    }

    simplficar(): Fraccion{

        const evaluar = this.evaluar(); 

        return evaluar; 

    }

    toString(): string {
        return "hola"; 
    }

    toTree() {
        
    }

    getNumerador(){
        return this.numerador; 
    }
    getDenominador(){
        return this.denominador; 
    }

}
export class FraccionSumar implements ProcesamientoFraccion{

    operacion(fraccion1: Fraccion, fraccion2: Fraccion): Fraccion{

        if(fraccion1.getDenominador() == fraccion2.getDenominador()){
            let numerador1 = fraccion1.getNumerador() as number; 
            let numerador2 = fraccion2.getNumerador() as number; 
            return new Fraccion(numerador1 + numerador2, fraccion1.getDenominador()); 
        }else{
            let numerador1 = fraccion1.getNumerador() as number; 
            let denominador1 = fraccion1.getDenominador() as number;
            let numerador2 = fraccion2.getNumerador() as number;
            let denominador2 = fraccion2.getDenominador() as number; 

            return new Fraccion((numerador1 * denominador2) + (numerador2 * denominador1), denominador1 * denominador2);

        }

    }

}

export class FraccionRestar implements ProcesamientoFraccion{

    operacion(fraccion1: Fraccion, fraccion2: Fraccion): Fraccion{

        //aquí van las operaciones de una fraccion que esta restando
        return new Fraccion(20, 50); 

    }

}

export class FraccionMultiplicar implements ProcesamientoFraccion{

    operacion(fraccion1: Fraccion, fraccion2: Fraccion): Fraccion{

        //aquí van las operaciones de una fraccion que esta multiplicando
        return new Fraccion(20, 50); 

    }

}

export class FraccionDividir implements ProcesamientoFraccion{

    operacion(fraccion1: Fraccion, fraccion2: Fraccion): Fraccion{

         
        return new Fraccion(20, 20); 

    }

}

export abstract class OperandoFraccion{

    private tipoOperacion: ProcesamientoFraccion; 
    
    constructor(tipoOperacion: ProcesamientoFraccion){
        this.tipoOperacion = tipoOperacion; 
    }

    public realizar(fr: Fraccion, fr2: Fraccion): Fraccion{
        return this.tipoOperacion.operacion( fr, fr2);
    }

}

export class Operar extends OperandoFraccion{}