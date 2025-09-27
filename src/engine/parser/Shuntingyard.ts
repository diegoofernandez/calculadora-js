export default class Parser{

    protected infija: string[]= [];
    protected posfixConversion: string[] = [];
    protected pila: string[] = [];
    protected cadena: string; 
    protected bufferElem: string[] = []; 

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
        if(road == 1){
            //objetos complejos
            this.tokenization(this.cadena); 
        }else{
            this.tokenizacionElem(this.cadena);
            this.conversionElem(); 
        }
    }

    //tokenizacion de las cadenas
    protected tokenization(cadena: string){
        this.infija = cadena.split("");
    }
    protected tokenizacionElem(cadena: string){
        let i = 0; 

        while(i < cadena.length){

            let digito = cadena[i]; 

            if(digito === ' '){
                i++; 
                continue; 
            } 

            if(this.enteros.test(digito)){

                let numeroExtenso = ''; 
                while(i < cadena.length && this.enteros.test(cadena[i])){
                    numeroExtenso+=cadena[i]; 
                    i++;
                }
                this.infija.push(numeroExtenso);
                continue;

            }

            if(['+', '-', '*', '/', '(', ')'].includes(digito)){
                this.infija.push(digito); 
                i++;
                continue; 
            }


        }

    }

    //obtenemos todos los digitos de un entero de más de 1 digito. Ej: 3889
    protected tokenizNumeros(posicionAcual: number): any{
        if(this.enteros.test(this.infija[posicionAcual])){
            return 1 + this.tokenizNumeros(posicionAcual +1);
        }
        return console.log("Digitos recuperados"); 
    }

    //SHUNTHING-YARD ALGORITMO
    private conversionElem(){

        for(var i = 0; i < this.infija.length; i++){

            //situaciones básicas de inserción a pila y posfija
            if(this.enteros.test(this.infija[i])){
 
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