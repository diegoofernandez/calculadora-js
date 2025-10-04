export class Euclides {

	//Algoritmo de Euclides para máximo común divisor
	static maximoComunDivisor(a: number, b: number): number {

		a = Math.abs(a); //se obtienen los valores absolutos
	    b = Math.abs(b);
	    
	    while (b !== 0) {
	      const temp = b;
	      b = a % b;
	      a = temp; //'a' pasa a convertirse en el proximo numerador
	    }
	    
	    return a;

	}

	//mínimo común multiplo
	static minimoComunMultiplo(a: number, b: number): number {

    	return Math.abs(a * b) / this.maximoComunDivisor(a, b); 

  	}

	//Euclides extendido (con esteroides)
	static maximoComunDivisorExtendido(a: number, b: number): { mcd: number; x: number; y: number } {
	    
	    if (b === 0) {
	      return { mcd: a, x: 1, y: 0 };
	    }
    
	    const resultado = this.maximoComunDivisorExtendido(b, a % b);
	    return {

	      mcd: resultado.mcd,
	      x: resultado.y,
	      y: resultado.x - Math.floor(a / b) * resultado.y

	    };

    }


}