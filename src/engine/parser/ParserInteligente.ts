import { Token, TiposToken } from "./TiposToken";
import { Fraccion } from "../objects/Fraccion";

export class ParserInteligente{

  public parse(input: string): string[]{

    const cadenaSinEspacios = input.trim();

    //verificamos tipo de operación
    if(cadenaSinEspacios.startsWith('F:')){

        let tokenizado = this.parseOperacion(cadenaSinEspacios);
        tokenizado.push('F');

        return tokenizado; 
        
    }else{

        return ["Operación desconocida"]; 

    }

  }


  //creando objeto fracción
  private parseOperacion(input: string): string[]{

    const removeTipoInput = input.substring(2).trim(); 
    const token = this.tokenize(removeTipoInput); 

    return token; 

  }


  private tokenize(input: string): string[] {
    const tokens: string[] = [];
    let current = 0;

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
