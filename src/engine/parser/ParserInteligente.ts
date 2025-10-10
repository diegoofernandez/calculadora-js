import { Token, TiposToken } from "./TiposToken";
import { Fraccion } from "../objects/Fraccion";

export class ParserInteligente{

  public parse(input: string): string[] | string[][]{

    const cadenaSinEspacios = input.trim();

    //verificamos tipo de operación
    if(cadenaSinEspacios.startsWith('F:')){

        let tokenizado = this.parseOperacion(cadenaSinEspacios, 2);

        return tokenizado; 
        
    }else if(cadenaSinEspacios.startsWith('G:')){

      //para bases de grobner 
      return [""];

    }else if(cadenaSinEspacios.startsWith('POL')){

      let tokenizado = this.parseOperacion(cadenaSinEspacios, 3); 
      return tokenizado; 

    }else{

        return ["Operación desconocida"]; 

    }

  }


  //creando objeto fracción
  private parseOperacion(input: string, eliminacionCantidad: number): string[] | string[][]{

    const removeTipoInput = input.substring(eliminacionCantidad).trim(); 
    const token = this.tokenize(removeTipoInput); 

    return token; 

  }

  //tokenize fracciones, potencias, raices, ecuaciones, polinomios
  private tokenize(input: string): string[] | string[][] {
    const tokens: string[] = [];
    const tokensPol: string[][] = []; 
    let current = 0;


    if(input.includes(',')){

      let datos = input.split(","); 

      for (const segmento of datos){

        const tempToken = [];
        let currentSegmentIndex = 0; 

        while (currentSegmentIndex < segmento.length){

            const char = segmento[currentSegmentIndex];

            if (char === '(' || char === ')') {
                currentSegmentIndex++;
                continue;
            }

            if (['+', '*', '-', ':', '='].includes(char)){

                tempToken.push(char);
                currentSegmentIndex++;
                continue;
            }

            if ((/\d/.test(char) || /[a-zA-Z]/.test(char) || ["/", "\\", "|", "^"].includes(char))){
                let objeto = '';
                while (currentSegmentIndex < segmento.length){
                    const nextChar = segmento[currentSegmentIndex];
                    if (!['(', ')', '+', '-', ':', '*', '='].includes(nextChar)) {

                      //verificación negativo
                      if(segmento.length >= 2 && ['-'].includes(segmento[currentSegmentIndex - 1])){

                        let negativo = tempToken.pop();
                        negativo += nextChar;  
                        objeto += negativo;
                        currentSegmentIndex++;

                      }else{

                        objeto += nextChar; 
                        currentSegmentIndex++; 

                      }
                        
                    }else{

                        break;

                    }
                }
        
                tempToken.push(objeto);
                continue;
        
            }
        
            currentSegmentIndex++;
        
        }

        tokensPol.push(tempToken);
      
      }

      return tokensPol;

    }else{

      while (current < input.length) {

        let char = input[current];

        if(char == "("){
          current++; 
          continue; 
        }

        if(char == ")"){
          current++; 
          continue; 
        }

        if(char == "+" || char == "*" ||char == "-" ||char == ":" || char == "="){
          tokens.push(char); 
          current++; 
          continue; 
        }

        if ((/\d/.test(char) || char == "/" || /[a-zA-Z]/.test(char) || char == "\\" || char == "|" || char == "^") && char != ")" && char != "+" && char != "-" && char != ":" && char != "*") {

          let objeto = '';
          
          while (current < input.length) {
            
            char = input[current]; 

            if(char != ")" && char != "(" && char !== "+" && char !== "-" && char !== ":" && char !== "*" && char !== "="){

              objeto += input[current];
              current++;

            }else{
              break; 
            }
            
          }
          tokens.push(objeto);
          continue;
        }

        current++;
      }

      return tokens;

    }

  }

  
}
