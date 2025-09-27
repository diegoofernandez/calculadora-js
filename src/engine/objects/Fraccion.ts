export interface ProcesamientoFraccion{

    operacion(fraccion1: Fraccion, fraccion2: Fraccion): Fraccion;

}
export class Fraccion{

    protected numerador: string | number | Fraccion; 
    protected denominador: string | number | Fraccion; 

    constructor(numerador: string | number | Fraccion, denominador: string | number | Fraccion){
        this.numerador = numerador; 
        this.denominador = denominador
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