export interface ResolviendoElemental{

    operar(operacion: []): string;

}

export class Operacion implements ResolviendoElemental{
    operar(operacion: []): string{

        return "";

    }
}

export abstract class Operando{

    private operador: ResolviendoElemental; 
    
    constructor(operacion: ResolviendoElemental){
        this.operador = operacion; 
    }

    public resolver(data: []){
        return this.operador.operar(data); 
    }


}