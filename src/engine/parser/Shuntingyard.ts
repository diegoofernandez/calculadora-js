export default class Parser{

    protected infija: string[]= [];
    protected posfixConversion: string[] = [];
    protected pila: string[] = [];
    protected cadena: string; 
    protected road: number; 
    private enteros = /^\d+$/; 

    
    protected operadores: Record<Operador, number> = {
        "+": 1, 
        "-": 1, 
        "*": 2,
        "/": 2
    }; 

    constructor(data: string, road: number){
        this.cadena = data; 
        this.road = road; 
    }

    public goConversion(): any{

        if(this.road == 1){
            this.tokenization(this.cadena);
            return this.sufijoObjetos();
        }else{
            this.tokenizacionElem(this.cadena); 
            return this.conversionElem(); 
        }

    }

    protected sufijoObjetos(): string[]{
        return []
    }

    //tokenizacion de las cadenas
    protected tokenization(cadena: string){
        this.infija = cadena.split("");
    }
    protected tokenizacionElem(cadena: string){//se forma el token para las 4 operaciones elementales
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
        console.log("Cadena convertida a sufija: "+this.posfixConversion); 
        return this.posfixConversion;
    }
	
}