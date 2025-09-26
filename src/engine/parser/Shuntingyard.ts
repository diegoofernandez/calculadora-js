export default class Parser{

    protected infija: string[]= [];
    protected posfixConversion: string[] = [];
    protected pila: string[] = [];
    protected cadena: string; 
    protected bufferElem: string[] = []; 

    protected operadores = {
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

    protected tokenization(cadena: string){
        this.infija = cadena.split("");
    }

    
    private conversionElem(){

        for(var i = 0; i < this.infija.length; i++){

            //situaciones básicas de inserción a pila y posfija
            if(!isNaN(Number(this.infija[i]))){
                this.posfixConversion.push(this.infija[i]); //agregamos si es un número
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
            }else if(this.operadores[this.infija[i]] > this.operadores[this.pila[this.pila.length-1]]){
                this.pila.push(this.infija[i]); 
            }else if(operadores[this.infija[i]] <= operadores[this.pila[this.pila.length-1]]){
                while(operadores[this.infija[i]] <= operadores[this.pila[this.pila.length-1]]){
                    this.posfixConversion.push(this.pila.pop()); 
                }
                this.pila.push(this.infija[i]);
            }
        }
        //extrayendo todos los datos restantes de la pila y colocandolos en el array posfijo
        while(this.pila.length > 0){
            this.posfixConversion.push(this.pila.pop());
        }
    }
	
}