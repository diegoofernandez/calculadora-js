export class Euclides {

	//Algoritmo de Euclides para máximo común divisor
	static maximoComunDivisor(a: bigint, b: bigint): bigint {

		a = a < 0n ? -a : a; // Valor absoluto para BigInt
		b = b < 0n ? -b : b;
		while (b !== 0n) {
			const temp = b;
			b = a % b;
			a = temp;
		}
		return a;

	}

	//mínimo común multiplo
	static minimoComunMultiplo(a: bigint , b: bigint ): bigint {

		if (a === 0n || b === 0n) return 0n;
    	// Usa el MCD de BigInt
    	return (a * b) / this.maximoComunDivisor(a, b); 

	}


	//Euclides extendido (con esteroides)
	/*static maximoComunDivisorExtendido(a: bigint, b: bigint): { mcd: bigint; x: bigint; y: bigint } {
	    
	    if (b === 0n) {
	      return { mcd: a, x: 1n, y: 0n };
	    }
    
	    const resultado = this.maximoComunDivisorExtendido(b, a % b);
	    return {

	      mcd: resultado.mcd,
	      x: resultado.y,
	      y: resultado.x - Math.floor(a / b) * resultado.y

	    };

    }*/


}