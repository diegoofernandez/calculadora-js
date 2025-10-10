export default class Termino{
    private coeficiente: number;
    private variables: {[key: string]: number}; 
    
    constructor(representacion: string){

        this.coeficiente = this.extraerCoeficiente(representacion);
        this.variables = this.extraerVariables(representacion);

    }
    
    private extraerCoeficiente(representacion: string): number{
        
        if(representacion.startsWith('-')){

            const sinSigno = representacion.substring(1);
            const coincidencia = sinSigno.match(/^(\d*)/);
            return coincidencia && coincidencia[1] ? -parseInt(coincidencia[1]) : -1;
        
        }else{

            const coincidencia = representacion.match(/^(\d*)/);
            return coincidencia && coincidencia[1] ? parseInt(coincidencia[1]) : 1;
        
        }

    }
    
    private extraerVariables(representacion: string): {[key: string]: number}{

        const resultado: {[key: string]: number} = {};
        
        
        const patronPotencia = /\|([a-z])\^(\d+)\|/g;
        let coincidencia;

        while((coincidencia = patronPotencia.exec(representacion)) !== null){

            const variable = coincidencia[1];
            const exponente = parseInt(coincidencia[2]);
            resultado[variable] = (resultado[variable] || 0) + exponente;

        }
        
        
        const patronSimple = /(?<!\|)[a-z](?![\^|\d])/g;
        const variablesSimples = representacion.match(patronSimple) || [];

        for(let variable of variablesSimples){

            resultado[variable] = (resultado[variable] || 0) + 1;

        }
        
        return resultado;

    }
    
    
    getCoeficiente(): number{ 

        return this.coeficiente; 

    }

    getVariables():{[key: string]: number}{ 

        return {...this.variables}; 

    }
    
    toString(): string{

        let resultado = '';

        if(this.coeficiente !== 1 && this.coeficiente !== -1){

            resultado += this.coeficiente;

        }else if(this.coeficiente === -1){

            resultado += '-';

        }
        
        const varsArray = Object.keys(this.variables).sort();

        for(let variable of varsArray){

            const exp = this.variables[variable];

            if(exp === 1){

                resultado += variable;

            }else{

                resultado += `|${variable}^${exp}|`;

            }

        }
        
        return resultado === '' ? '1' : resultado;

    }

}