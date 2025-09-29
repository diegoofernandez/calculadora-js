export abstract class ObjetoMatematico{

	abstract evaluar(): ObjetoMatematico; 
	abstract simplficar(): ObjetoMatematico; 

	abstract toString(): string; 
	abstract toTree(): any; 

	//Euclides algoritmo
	protected maximoComunDivisor(a: number, b: number): number{

		a = Math.abs(a); //se obtienen los valores absolutos
		b = Math.abs(b); 

		while(b !== 0){

			const t = b; 
			b = a % b; 
			a = t; //'a' pasa valer como numerador, con el valor del denominador anterior. 

		}

		return a; 

	}

}