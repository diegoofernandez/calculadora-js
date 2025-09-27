export default class Parser{

    protected infija: string[]= [];
    protected posfixConversion: string[] = [];
    protected pila: string[] = [];
    protected cadena: string; 

    private enteros = /^\d+$/; 

    
    protected operadores: Record<Operador, number> = {
        "+": 1, 
        "-": 1, 
        "*": 2,
        "/": 2
    }; 
    protected context = "|"; 
    protected objetoMatematico = ["frac", "expo", "eculin", "ecurac", "pol"]; 

    constructor(data: string, road: number){
        this.cadena = data; 
        this.tokenization(this.cadena); 
        if(road == 1){
            //objetos complejos
        }else{
            this.conversionElem(); 
        }
    }

    //tokenizacion de la cadena
    protected tokenization(cadena: string){
        this.infija = cadena.split("");
    }

    //obtenemos todos los digitos de un entero de más de 1 digito. Ej: 3889
    protected tokenizNumeros(posicionAcual: number): any{
        if(this.enteros.test(this.infija[posicionAcual])){
            return 1 + this.tokenizNumeros(posicionAcual +1)
        }
    }

    //SHUNTHING-YARD ALGORITMO
    private conversionElem(){

        for(var i = 0; i < this.infija.length; i++){

            //situaciones básicas de inserción a pila y posfija
            if(this.enteros.test(this.infija[i])){

                let actualPosicion = parseInt(this.infija[i]);
                let retornoNumeroCompleto = this.tokenizNumeros(i); 
                let tempArray = this.infija.splice(actualPosicion, retornoNumeroCompleto);
                let tempNumber = ""; 

                for(let x = 0; tempArray.length; x ++){//el for recorrerá todo el número entero
                    tempNumber = tempNumber + tempArray[x];
                }
                this.posfixConversion.push(tempNumber); //agregamos si es un número
            
            }else if(this.infija[i] == "("){

                this.pila.push(this.infija[i]); //parentesis de apertura a la pila
            
            }else if(this.infija[i] == ")"){//leyendo array al reves, extrayendo hasta encontrar un "("

                for(var j = this.pila.length - 1; j >= 0; j--){

                    if(this.pila[j] != "("){

                        this.posfixConversion.push(this.pila.splice(j, 1)[0]); //extraemos operadores hacia posfija
                    
                    }else{

                        this.pila.pop(); 
                        break; 
                   
                    }

                }
            }else if(this.pila.length == 0 || this.pila[this.pila.length-1] == "("){//insertando y comparando operadores

                this.pila.push(this.infija[i]); 
            
            }else if(this.operadores[this.infija[i] as Operador] > this.operadores[this.pila[this.pila.length-1] as Operador]){

                this.pila.push(this.infija[i]); 
            
            }else if(this.operadores[this.infija[i] as Operador] <= this.operadores[this.pila[this.pila.length-1] as Operador]){

                while(this.operadores[this.infija[i] as Operador] <= this.operadores[this.pila[this.pila.length-1] as Operador]){

                    this.posfixConversion.push(this.pila.pop() as string); 
                
                }
                this.pila.push(this.infija[i]);
            }
        
        }
        //extrayendo todos los datos restantes de la pila y colocandolos en el array posfijo
        while(this.pila.length > 0){

            this.posfixConversion.push(this.pila.pop() as string);

        }
    }
	
}