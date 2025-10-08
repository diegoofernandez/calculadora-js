export interface ProcesamientoPotencia{

    operacion(potencia1: Potencia, potencia2: Potencia): string;

}
export class Potencia{

    protected base: string | number; 
    protected exponente: string | number; 

    constructor(base: string | number , exponente: string | number ){

        this.base = base; 
        this.exponente = exponente; 

        if(base == 0){
            throw new Error("El denominador no puede ser Cero"); 
        }

    }

    resolver(){

        let resultadoFinal = Math.pow(this.base as number, this.exponente as number);

        return String(resultadoFinal) as string; 

    }

    getBase(){
        return this.base; 
    }
    getExponente(){
        return this.exponente; 
    }

}
export class PotenciaSumar implements ProcesamientoPotencia{

    operacion(potencia1: Potencia, potencia2: Potencia): string{

        let resultado1 = Math.pow(potencia1.getBase() as number, potencia1.getExponente() as number); 
        let resultado2 = Math.pow(potencia2.getBase() as number, potencia2.getExponente() as number); 
        let resultadoFinal = Number(resultado1) + Number(resultado2); 

        return String(resultadoFinal) as string; 

    }

}

export class PotenciaRestar implements ProcesamientoPotencia{

    operacion(potencia1: Potencia, potencia2: Potencia): string{

        let resultado1 = Math.pow(potencia1.getBase() as number, potencia1.getExponente() as number); 
        let resultado2 = Math.pow(potencia2.getBase() as number, potencia2.getExponente() as number); 
        let resultadoFinal = Number(resultado1) - Number(resultado2); 

        return String(resultadoFinal) as string; 

    }

}

export class PotenciaMultiplicar implements ProcesamientoPotencia{

    operacion(potencia1: Potencia, potencia2: Potencia): string{

        if(potencia1.getBase() == potencia2.getBase()){

            let nuevaPotencia = new Potencia(potencia1.getBase(), Number(potencia1.getExponente()) + Number(potencia2.getExponente())); 
            return "|" + nuevaPotencia.getBase() + "^" + nuevaPotencia.getExponente(); 

        }else{

            let resultado1 = Math.pow(potencia1.getBase() as number, potencia1.getExponente() as number); 
            let resultado2 = Math.pow(potencia2.getBase() as number, potencia2.getExponente() as number); 
            let resultadoFinal = Number(resultado1) * Number(resultado2); 

            return String(resultadoFinal) as string;  

        }

    }

}

export class PotenciaDividir implements ProcesamientoPotencia{

    operacion(potencia1: Potencia, potencia2: Potencia): string{

        if(potencia1.getBase() == potencia2.getBase()){

            let nuevaPotencia = new Potencia(potencia1.getBase(), Number(potencia1.getExponente()) / Number(potencia2.getExponente())); 
            return "|" + nuevaPotencia.getBase() + "^" + nuevaPotencia.getExponente(); 

        }else{
            
            let resultado1 = Math.pow(potencia1.getBase() as number, potencia1.getExponente() as number); 
            let resultado2 = Math.pow(potencia2.getBase() as number, potencia2.getExponente() as number); 
            let resultadoFinal = Number(resultado1) / Number(resultado2); 

            return String(resultadoFinal) as string; 

        }

    }

}

