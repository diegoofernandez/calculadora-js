export interface ProcesamientoRaiz{

    operacion(raiz1: Raiz, raiz2: Raiz): string;

}
export class Raiz{

    protected indice: string | number; 
    protected radicando: string | number; 

    constructor(indice: string | number , radicando: string | number ){

        this.indice = indice; 
        this.radicando = radicando; 

        if(radicando == 0){
            throw new Error("El denominador no puede ser Cero"); 
        }

    }

    resolver(){

       

    }

    getIndice(){
        return this.indice; 
    }
    getRadicando(){
        return this.radicando; 
    }

}
export class RaizSumar implements ProcesamientoRaiz{

    operacion(raiz1: Raiz, raiz2: Raiz): string{

        return ""; 

    }

}

export class RaizRestar implements ProcesamientoRaiz{

    operacion(raiz1: Raiz, raiz2: Raiz): string{

        return ""; 

    }

}

export class RaizMultiplicar implements ProcesamientoRaiz{

    operacion(raiz1: Raiz, raiz2: Raiz): string{

        return ""; 

    }

}

export class RaizDividir implements ProcesamientoRaiz{

    operacion(raiz1: Raiz, raiz2: Raiz): string{

        return ""; 

    }

}

