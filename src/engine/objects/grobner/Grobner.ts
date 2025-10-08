import { MonomioNode, OperadorNode } from "../../tree/TreeElemental";

export interface ProcesamientoGrobner{

    operacion(fraccion1: Grobner, s: Grobner): string;

}

export default class Grobner{ 

	private idealesG: Array<{ polinomio: string[], terminoLider: string}> = []; 
	private potencia = /\|(.+)\^(.+)\|/gi;

	constructor(...polinomios: string[][]){

		polinomios.forEach(polinom => {
			this.idealesG.push({
				polinomio: polinom,
				terminoLider: this.monomioLider(polinom)
			});
		});

	}

	//busqueda del monomio lider dentro de los términos del polinomio
	private monomioLider(terminos: string[]): string{

		let tempMayor = terminos[0];
		
		for(let i = 1; i < terminos.length; i++){

			let terminoActual = terminos[i];

			//variables de ambos términos
			let vTerminoMayor = Array.from(tempMayor.matchAll(this.potencia)); 
			let vTerminoActual = Array.from(terminoActual.matchAll(this.potencia));

			if(this.definicionMonomioUnico(vTerminoActual, vTerminoMayor)){
				tempMayor = terminoActual; 
			}

		}

		return tempMayor; 

	}

	//comparacion monomios mayores extraídos
	private definicionMonomioUnico(monA: RegExpMatchArray[], monB: RegExpMatchArray[]):boolean{
		
		const ordenLex = ['x', 'y', 'z', 'w', 'v', 'u'];

		for(let variable of ordenLex){

			let gradoA = this.obtenerGrado(monA, variable);
			let gradoB = this.obtenerGrado(monB, variable);

			if(gradoA > gradoB) return true;
			if(gradoA < gradoB) return false;

		}

		return false; //son iguales

	}

	//grado de monomio
	private obtenerGrado(varsMono: RegExpMatchArray[], variable: string): number{

		for(let coincidencia of varsMono){

			if(coincidencia[1] === variable){
				return parseInt(coincidencia[2] || '1');
			}

		}
		
		return 0;

	}


	//extraer variables
	private extraerVariables(termino: string): {[key: string]: number} {
    	
		const resultado: {[key: string]: number} = {};
    
		const partes = termino.split('|');
		
		//solo trabajando impar
		for (let i = 1; i < partes.length; i += 2) { 
			const variableConGrado = partes[i];
			const coincidencia = variableConGrado.match(/([a-z])\^?(\d+)?/);
			
			if (coincidencia) {
				const variable = coincidencia[1];
				const grado = parseInt(coincidencia[2] || '1');
				resultado[variable] = (resultado[variable] || 0) + grado;
			}
		}
    
		// fuera de  | | 
		const variablesSueltas = termino.match(/([a-z])(?![^|]*\|)/g) || [];
		for (let variable of variablesSueltas) {
			resultado[variable] = (resultado[variable] || 0) + 1;
		}
    
    	return resultado;

	}

	//multiplicar terminos
	private multiplicarTerminos(termA: string, termB: string): string {

    if (termA === '0' || termB === '0') return '0';
    
		const varsA = this.extraerVariables(termA);
		const varsB = this.extraerVariables(termB);
		
		// Combinar coeficientes (parte numérica)
		const coefA = this.extraerCoeficiente(termA);
		const coefB = this.extraerCoeficiente(termB);
		const nuevoCoef = coefA * coefB;
		
		// Combinar variables
		const todasVariables = new Set([...Object.keys(varsA), ...Object.keys(varsB)]);
		const variablesResultado: string[] = [];
    
		for (let variable of todasVariables) {
			const expA = varsA[variable] || 0;
			const expB = varsB[variable] || 0;
			const totalExp = expA + expB;
			
			if (totalExp > 0) {
				variablesResultado.push(`|${variable}^${totalExp}|`);
			}
		}
    
		// Reconstruir término
		const coefStr = nuevoCoef !== 1 ? `${nuevoCoef}` : '';
		const varsStr = variablesResultado.join('');
		
		return coefStr + varsStr;

	}


	private extraerCoeficiente(termino: string): number {
		// Buscar número al inicio del término (antes del primer |)
		const match = termino.match(/^(\d*)/);
		return match && match[1] ? parseInt(match[1]) : 1;
	}

	private calcularMCM(terminoA: string, terminoB: string): string {
		
		const varsA = this.extraerVariables(terminoA);
		const varsB = this.extraerVariables(terminoB);
		
		const variablesResultado: string[] = [];
		
		const todasVariables = new Set([...Object.keys(varsA), ...Object.keys(varsB)]);
		
		for (let variable of todasVariables) {
			const expA = varsA[variable] || 0;
			const expB = varsB[variable] || 0;
			const maxExp = Math.max(expA, expB);
			
			if (maxExp > 0) {
				variablesResultado.push(`|${variable}^${maxExp}|`);
			}
		}
		
		return variablesResultado.join('');

	}


	private calcularSPolinomio(p1: {polinomio: string[], terminoLider: string}, p2: {polinomio: string[], terminoLider: string}): string[] {
    
		// 1. Calcular MCM de términos líderes
		const mcm = this.calcularMCM(p1.terminoLider, p2.terminoLider);
		
		// 2. Calcular coeficientes para cancelación
		const coef1 = this.dividirMonomios(mcm, p1.terminoLider);
		const coef2 = this.dividirMonomios(mcm, p2.terminoLider);
		
		// 3. Multiplicar polinomios completos
		const poly1Mult = this.multiplicarPolinomioPorTermino(p1.polinomio, coef1);
		const poly2Mult = this.multiplicarPolinomioPorTermino(p2.polinomio, coef2);
		
		// 4. Restar (S-polinomio = coef1·f1 - coef2·f2)
		return this.restarPolinomios(poly1Mult, poly2Mult);

	}

	private dividirMonomios(dividendo: string, divisor: string): string {
		
		const varsDividendo = this.extraerVariables(dividendo);
		const varsDivisor = this.extraerVariables(divisor);
		
		const resultado: string[] = [];
		
		for (let variable in varsDividendo) {
			const expDividendo = varsDividendo[variable];
			const expDivisor = varsDivisor[variable] || 0;
			
			if (expDividendo < expDivisor) {
				throw new Error(`No se puede dividir: ${dividendo} / ${divisor}`);
			}
			
			const nuevoExp = expDividendo - expDivisor;
			if (nuevoExp > 0) {
				resultado.push(nuevoExp > 1 ? `|${variable}^${nuevoExp}|` : variable);
			}
		}
		
		return resultado.length > 0 ? resultado.join('') : '1';

	}

	private multiplicarPolinomioPorTermino(polinomio: string[], termino: string): string[] {
    	
		return polinomio.map(monomio => this.multiplicarTerminos(monomio, termino));

	}

	private restarPolinomios(polyA: string[], polyB: string[]): string[] {
		
		// Concatenar con signos opuestos para B
		const resultado = [...polyA];
		polyB.forEach(term => {
			if (term.startsWith('-')) {
				resultado.push(term.substring(1)); // -(-x) = +x
			} else {
				resultado.push('-' + term); // -(x) = -x
			}
		});
		
		return this.simplificarPolinomio(resultado);
	
	}

	private simplificarPolinomio(polinomio: string[]): string[] {

		// Agrupar términos semejantes
		const terminosMap = new Map<string, number>();
		
		polinomio.forEach(term => {
			const coef = this.extraerCoeficiente(term);
			const vars = term.replace(/^-?\d*/, ''); // Quitar coeficiente
			
			terminosMap.set(vars, (terminosMap.get(vars) || 0) + coef);
		});
		
		// Reconstruir
		const resultado: string[] = [];
		terminosMap.forEach((coef, vars) => {
			if (coef !== 0) {
				const termStr = coef === 1 ? vars : 
							coef === -1 ? '-' + vars : 
							coef + vars;
				resultado.push(termStr);
			}
		});
		
		return resultado;

	}

	private esCero(polinomio: string[]): boolean {
		
		// Un polinomio es cero si está vacío o todos sus términos son "0"
		if (polinomio.length === 0) return true;
		
		// Verificar si todos los términos se cancelaron (simplificaron a 0)
		const terminosNoCero = polinomio.filter(term => {
			const coef = this.extraerCoeficiente(term);
			return coef !== 0;
		});
		
		return terminosNoCero.length === 0;

	}

	private estaEnBase(polinomio: {polinomio: string[], terminoLider: string}, base: Array<{polinomio: string[], terminoLider: string}>): boolean {
    
		// Comparar por término líder (más rápido)
		// Si dos polinomios tienen el mismo término líder, probablemente son el mismo
		for (let poly of base) {
			if (poly.terminoLider === polinomio.terminoLider) {
				return true;
			}
		}
		
		// Opcional: comparación más estricta de todos los términos
		// return this.polinomiosSonIguales(polinomio.polinomio, basePoly.polinomio);
		
		return false;

	}

	private reducirPolinomio(polinomio: string[], base: Array<{polinomio: string[], terminoLider: string}>): string[] {
    
		let resto = [...polinomio];
		let sePuedeReducir = true;
		
		while (sePuedeReducir && !this.esCero(resto)) {
			sePuedeReducir = false;
			const terminoLiderResto = this.monomioLider(resto);
			
			// Buscar en la base algún polinomio que pueda dividir el término líder
			for (let basePoly of base) {
				try {
					// Intentar dividir los términos líderes
					const cociente = this.dividirMonomios(terminoLiderResto, basePoly.terminoLider);
					
					// Si la división es exitosa, reducir
					const aRestar = this.multiplicarPolinomioPorTermino(basePoly.polinomio, cociente);
					resto = this.restarPolinomios(resto, aRestar);
					sePuedeReducir = true;
					break; // Salir y empezar de nuevo con el nuevo resto
					
				} catch (e) {
					// La división falló (exponentes negativos) - continuar con siguiente
					continue;
				}
			}
		}
		
		return resto;

	}


	public construirBaseGroebner(): void {
		
		let base = [...this.idealesG];
		let cambiado = true;
		
		while (cambiado) {
			cambiado = false;
			const nuevaBase = [...base];
			
			for (let i = 0; i < base.length; i++) {
				for (let j = i + 1; j < base.length; j++) {
					const sPol = this.calcularSPolinomio(base[i], base[j]);
					const resto = this.reducirPolinomio(sPol, base);
					
					if (!this.esCero(resto)) {
						const nuevoPol = {
							polinomio: resto,
							terminoLider: this.monomioLider(resto)
						};
						
						if (!this.estaEnBase(nuevoPol, nuevaBase)) {
							nuevaBase.push(nuevoPol);
							cambiado = true;
						}
					}
				}
			}
			
			base = nuevaBase;
		}
		
		this.idealesG = base;

	}


}
