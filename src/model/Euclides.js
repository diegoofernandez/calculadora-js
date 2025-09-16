/*
	IMPORTANTE: aún no detecta fracciones que ya no se pueden simplificar
*/
//cambiar números para otra fracción
 


export function euclidesMcd(numerador, denominador){

	#numerador = this.numerador; 
	#denominador = this.denominador; 

	function simplificacion(estado, mcd){

		if(estado){
			console.log("Fracción simplificada de " + numerador + "/" + denominador + " es " + numerador / mcd + "/" + denominador / mcd); 
		}else{
			console.log("No se puede simplificar esta fracción"); 
		}

	}

	function maximoComunDivisor(numerador, denominador){

		if(numerador == 0 || denominador == 0){
			return console.log("Esta operación no se puede realizar");
		}

		if(numerador % denominador != 0){
			maximoComunDivisor(denominador, numerador % denominador); //llamamos recursivamente hasta encontrar mcd
		}else{
			return simplificacion(true, Math.trunc(denominador));
		}


	}

}







maximoComunDivisor(numerador, denominador);