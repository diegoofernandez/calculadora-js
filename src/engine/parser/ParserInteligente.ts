import Grobner from "../objects/grobner/Grobner";
type Termino = {
    coeficiente: number, 
    variables: Array<[string, number]>
}

export class ParserInteligente{

  public parse(input: string): string[] | string[][] | Termino[][]{

    const cadenaSinEspacios = input.trim();

    //verificamos tipo de operación
    if(cadenaSinEspacios.startsWith('F')){

        let tokenizado = this.parseOperacion(cadenaSinEspacios, 1);

        return tokenizado; 
        
    }else if(cadenaSinEspacios.startsWith('G')){

      let tokenizado = this.parseOperacion(cadenaSinEspacios, 1, "G");

      return tokenizado; 

    }else if(cadenaSinEspacios.startsWith('POL')){

      let tokenizado = this.parseOperacion(cadenaSinEspacios, 3); 
      return tokenizado; 

    }else{

        return ["Operación desconocida"]; 

    }

  }


  //creando objeto fracción
  private parseOperacion(input: string, eliminacionCantidad: number, algorit?: string): string[] | string[][] | Termino[][]{

    const removeTipoInput = input.substring(eliminacionCantidad).trim();

    if(algorit !== undefined){

      let entradaParseada; 
      let grobner; 

      switch(algorit){

        case "G":
          entradaParseada = this.runGrobner(removeTipoInput); 
          console.log(entradaParseada); 
          //grobner = new Grobner(entradaParseada); 
          break;

      }

      return [""];

    }else{
 
      const token = this.tokenize(removeTipoInput); 

      return token;

    }

     

  }

  private runGrobner(input: string): Termino[][] {
    const polinomios = input.split(',').map(p => p.trim());
    const resultado: Termino[][] = [];

    for (const poliStr of polinomios) {
        const terminos: Termino[] = [];
        
        // Dividir el polinomio en términos respetando los | |
        const terminosTemp = [];
        let termActual = '';
        let dentroDeBarras = false;

        for (let i = 0; i < poliStr.length; i++) {
            const char = poliStr[i];
            
            if (char === '|') {
                dentroDeBarras = !dentroDeBarras;
                termActual += char;
            } else if ((char === '+' || char === '-') && !dentroDeBarras) {
                if (termActual.trim()) {
                    terminosTemp.push(termActual.trim());
                }
                termActual = char;
            } else {
                termActual += char;
            }
        }
        
        if (termActual.trim()) {
            terminosTemp.push(termActual.trim());
        }

        // Parsear cada término
        for (let termStr of terminosTemp) {
            if (termStr) {
                const termino = this.parsearTermino(termStr);
                if (termino.coeficiente !== 0) {
                    terminos.push(termino);
                }
            }
        }

        resultado.push(terminos);
    }

    return resultado;
  }

  private parsearTermino(termStr: string): Termino {
      termStr = termStr.trim();
      
      // Si el término está vacío, retornar coeficiente 0
      if (!termStr || termStr === '+' || termStr === '-') {
          return { coeficiente: 0, variables: [] };
      }

      let coeficiente = 1;
      const variables: [string, number][] = [];

      // Manejar signo
      if (termStr.startsWith('-')) {
          coeficiente = -1;
          termStr = termStr.substring(1).trim();
      } else if (termStr.startsWith('+')) {
          termStr = termStr.substring(1).trim();
      }

      // Si después del signo no queda nada, es +1 o -1
      if (termStr === '') {
          return { coeficiente, variables: [] };
      }

      // Buscar coeficiente numérico al inicio (antes del primer |)
      const coefMatch = termStr.match(/^(\d*\.?\d*)(?=\|)/);
      if (coefMatch) {
          const coefNum = coefMatch[1];
          if (coefNum) {
              coeficiente *= parseFloat(coefNum);
          }
          termStr = termStr.substring(coefMatch[0].length);
      }

      // Extraer todas las variables entre | |
      const regex = /\|([^|]+)\|/g;
      let match;
      let contenidoBarras = '';
      
      while ((match = regex.exec(termStr)) !== null) {
          contenidoBarras += match[1];
      }

      // Procesar el contenido de las barras
      if (contenidoBarras) {
          // Si contiene ^, separar base y exponente
          if (contenidoBarras.includes('^')) {
              const partes = contenidoBarras.split('^');
              if (partes.length === 2) {
                  const base = partes[0].trim();
                  const exponente = parseInt(partes[1].trim());
                  if (!isNaN(exponente)) {
                      variables.push([base, exponente]);
                  }
              }
          } else {
              // Es una variable simple, exponente 1
              variables.push([contenidoBarras.trim(), 1]);
          }
      } else {
          // No hay barras, verificar si es un número constante
          const numMatch = termStr.match(/^(-?\d+)$/);
          if (numMatch) {
              coeficiente = parseFloat(numMatch[1]);
          } else if (termStr === 'x') {
              // Variable x sin formato de barras
              variables.push(['x', 1]);
          }
      }

      return { coeficiente, variables };
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
