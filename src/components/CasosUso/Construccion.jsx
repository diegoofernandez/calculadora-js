import FacadeDriver from './../../engine/FacadeDriver'; 
import ConvertKatexToJson from '../../libs/ConvertKatexToJson';
//import VarConstruccion from './Analizers/VarConstruccion';

function Construccion(){

	//variables base optima
	const baseOptima = {
		w: 1000000, //presupuesto
		x: 550000, //materiales
		y: 250000, //mano de obra
		z: 100000, //herramientas o equipos
		a: 50000, //impuestos
		b: 50000, //contingencia
		c: 100000 //margen o ganancia
	}; 
	let variables = {
		"presupuesto": 0, //w
		"materiales": 0, //x
		"mano_obra": 0, //y
		"herramientas": 0, //z
		"impuestos": 0, //a
		"contingencia": 0, //b
		"margen": 0 //c
	}
	const basesGrobnerOptimas = ["w-20/11x", "x-11/5y", "y-5/2z", "z-2a", "a-b", "b-1/2c"]; 
	let basesOptimasVectorizada = []; 


	let basesGrobnerUsuario = []; 
	let basesUsiarioVectorizada = []; 


	let polinomiosParaBase = ""; 

	//construye las variables
	function cambiandoValor(e){

		let campo = e.target.id; 
		let valor = e.target.value; 

		if(campo == "campoPresupuesto"){
			variables.presupuesto = valor; 
			console.log(variables);
		}else if(campo == "campoMateriales"){
			variables.materiales = valor; 
			console.log(variables); 
		}else if(campo == "campoManoObra"){
			variables.mano_obra = valor; 
			console.log(variables); 
		}else if(campo == "campoHerramientas"){
			variables.herramientas = valor; 
			console.log(variables); 
		}else if(campo == "campoContingencia"){
			variables.contingencia = valor; 
			console.log(variables); 
		}else if(campo == "campoMargen"){
			variables.margen = valor; 
			console.log(variables); 
		}else if(campo == "campoImpuestos"){
			variables.impuestos = valor; 
			console.log(variables); 
		}

		polinomiosParaBase = stringToBase();

	}
	//formatea la consulta al motor
	function stringToBase(){

		let tempString = "G "; 
		//G 20x^1 - 11w^1=0; 4y^1 - 1w^1=0; 10z^1 - 1w^1=0; 20a^1 - 1w^1=0; 20b^1 - 1w^1=0; 10c^1- 1w^1=0
		for (const variable in variables){

			if(variable != 'presupuesto' && variables[variable] != undefined && variables[variable] != 0){ 
				
				let operation = variables[variable]; 

				switch(variable){

					case 'materiales':
						tempString += `${variables.presupuesto}x^1 - ${operation}w^1 = 0;`; 
						break; 

					case 'mano_obra': 
						tempString += `${variables.presupuesto}y^1 - ${operation}w^1 = 0;`; 
						break; 

					case 'herramientas':
						tempString += `${variables.presupuesto}z^1 - ${operation}w^1 = 0;`; 
						break; 

					case 'impuestos':
						tempString += `${variables.presupuesto}a^1 - ${operation}w^1 = 0;`;
						break; 

					case 'contingencia': 
						tempString += `${variables.presupuesto}b^1 - ${operation}w^1 = 0;`; 
						break; 

					case 'margen':
						tempString += `${variables.presupuesto}c^1 - ${operation}w^1 = 0`;  
						break; 
				}

			}

		}

		return tempString; 

	}

	//envia la consulta
	function creandoBaseUsuario(){

		let parser = new ConvertKatexToJson(); 
		let resultadoParser = parser.katexToSystem(polinomiosParaBase); 
		let motor = new FacadeDriver(); 

		motor.init(resultadoParser); 	

		recuperarBaseUsuario(); 

	}

	function recuperarBaseUsuario(){

		let token = localStorage.getItem('bases'); 
		let arrayToken = token.split(','); 

		for (let i = 0; i < arrayToken.length; i++) {

			let limpieza1 = arrayToken[i].replace(/\[/g, "").replace(/\]/g, "").replace(/\"/g, ""); 
			let limpieza2 = limpieza1.replace(/\n/g, "").trim(); 
			basesGrobnerUsuario.push(limpieza2); 

		}

		vectorizarBases(); 

	}

	function vectorizarBases(){

		

	}


	return(

		<>
			<main class="flex w-full flex-1 flex-col items-center py-10 sm:py-16">
				<div class="flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
					<div class="flex flex-wrap justify-between gap-4">
						<div class="flex max-w-3xl flex-col gap-3">
							<p class="text-white text-4xl sm:text-5xl font-black leading-tight tracking-[-0.033em]">Análisis de Sistema de Ecuaciones</p>
							<p class="text-gray-400 text-base font-normal leading-normal">Introduce tus ecuaciones y variables para obtener un análisis de viabilidad y optimización completo a través de nuestro tablero de control interactivo.</p>
							<p class="text-gray-400 text-base font-normal leading-normal">
								El presente caso de uso esta diseñado para medir la viabilidad financiera de un proyecto de construcción.
							</p>
						</div>
					</div>
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
					<div class="flex flex-col gap-6 rounded-xl bg-[#1E1E1E] p-6 sm:p-8 lg:col-span-1">
						<h2 class="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Introduce los datos</h2>
						<form class="flex flex-col gap-6">
							<div class="flex flex-col gap-4">
								<label class="flex flex-col">
									<p class="pb-2 text-base font-medium text-white">Presupuesto total ($)</p>
									<input id="campoPresupuesto" class="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-lg border border-white/20 bg-background-dark p-3 text-base font-normal leading-normal text-white placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 font-mono" placeholder="Ej: 20000000" onChange={cambiandoValor}/>
									<p class="pt-1 text-xs text-gray-400">Escribe el valor sin puntos</p>
								</label>
								<label class="flex flex-col">
									<p class="pb-2 text-base font-medium text-white">Materiales estimados ($)</p>
									<input id="campoMateriales" class="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-lg border border-white/20 bg-background-dark p-3 text-base font-normal leading-normal text-white placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 font-mono" placeholder="Ej: 20000000" onChange={cambiandoValor}/>
									<p class="pt-1 text-xs text-gray-400">Escribe el valor sin puntos</p>
								</label>
								<label class="flex flex-col">
									<p class="pb-2 text-base font-medium text-white">Mano de obra ($)</p>
									<input id="campoManoObra" class="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-lg border border-white/20 bg-background-dark p-3 text-base font-normal leading-normal text-white placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 font-mono" placeholder="Ej: 20000000" onChange={cambiandoValor}/>
									<p class="pt-1 text-xs text-gray-400">Escribe el valor sin puntos</p>
								</label>
								<label class="flex flex-col">
									<p class="pb-2 text-base font-medium text-white">Herramientas ($)</p>
									<input id="campoHerramientas" class="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-lg border border-white/20 bg-background-dark p-3 text-base font-normal leading-normal text-white placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 font-mono" placeholder="Ej: 20000000" onChange={cambiandoValor}/>
									<p class="pt-1 text-xs text-gray-400">Escribe el valor sin puntos</p>
								</label>
								<label class="flex flex-col">
									<p class="pb-2 text-base font-medium text-white">Contingencia ($)</p>
									<input id="campoContingencia" class="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-lg border border-white/20 bg-background-dark p-3 text-base font-normal leading-normal text-white placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 font-mono" placeholder="Ej: 5" onChange={cambiandoValor}/>
									<p class="pt-1 text-xs text-gray-400">Escribe valor númerico. Este campo representa imprevistos y riesgos de imprevistos. ¿Cuánto destinas a eso?</p>
								</label>
								<label class="flex flex-col">
									<p class="pb-2 text-base font-medium text-white">Margen deseado ($)</p>
									<input id="campoMargen" class="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-lg border border-white/20 bg-background-dark p-3 text-base font-normal leading-normal text-white placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 font-mono" placeholder="Ej: 20" onChange={cambiandoValor}/>
									<p class="pt-1 text-xs text-gray-400">Escribe valor númerico. Este campo representa la ganancia que deseas tener sobre el proyecto.</p>
								</label>
								<label class="flex flex-col">
									<p class="pb-2 text-base font-medium text-white">Impuestos ($)</p>
									<input id="campoImpuestos" class="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-lg border border-white/20 bg-background-dark p-3 text-base font-normal leading-normal text-white placeholder:text-gray-500 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 font-mono" placeholder="Ej: 20" onChange={cambiandoValor}/>
									<p class="pt-1 text-xs text-gray-400">Escribe valor númerico. Este campo representa el valor absoluto que se destina a impuestos.</p>
								</label>
							</div>
							<button class="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark" type="button" onClick={creandoBaseUsuario}>
								<span class="material-symbols-outlined">analytics</span>
							        Analizar Sistema
							</button>
						</form>
					</div>
					<div class="flex flex-col gap-8 rounded-xl bg-[#1E1E1E] p-6 sm:p-8 lg:col-span-2">
						<h2 class="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Tablero de Control</h2>
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="flex flex-col gap-4 rounded-lg bg-background-dark p-4">
								<h3 class="text-lg font-bold text-white">Semáforo de Restricciones</h3>
								<div class="space-y-3">
									<div class="flex items-center gap-3">
										<div class="h-4 w-4 rounded-full bg-green-500 flex-shrink-0"></div>
										<div class="text-sm">
											<p class="font-medium text-gray-300">Ecuación 1: Cumplida</p>
											<p class="font-mono text-xs text-gray-400">x + y = 98.5 (Límite: 100)</p>
										</div>
									</div>
									<div class="flex items-center gap-3">
										<div class="h-4 w-4 rounded-full bg-green-500 flex-shrink-0"></div>
										<div class="text-sm">
											<p class="font-medium text-gray-300">Ecuación 2: Cumplida</p>
											<p class="font-mono text-xs text-gray-400">2x - z = 0.0 (Límite: 0)</p>
										</div>
									</div>
									<div class="flex items-center gap-3">
										<div class="h-4 w-4 rounded-full bg-yellow-500 flex-shrink-0"></div>
										<div class="text-sm">
											<p class="font-medium text-gray-300">Ecuación 3: Tensión</p>
											<p class="font-mono text-xs text-gray-400">y - w &gt;= 10.1 (Límite: 10)</p>
										</div>
									</div>
									<div class="flex items-center gap-3">
										<div class="h-4 w-4 rounded-full bg-red-500 flex-shrink-0"></div>
										<div class="text-sm">
											<p class="font-medium text-gray-300">Ecuación 4: Incumplida</p>
											<p class="font-mono text-xs text-gray-400">z*w = 1500 (Límite: 1200)</p>
										</div>
									</div>
									<div class="flex items-center gap-3">
										<div class="h-4 w-4 rounded-full bg-green-500 flex-shrink-0"></div>
										<div class="text-sm">
											<p class="font-medium text-gray-300">Ecuación 5: Cumplida</p>
											<p class="font-mono text-xs text-gray-400">x &gt; 0</p>
										</div>
									</div>
									<div class="flex items-center gap-3">
										<div class="h-4 w-4 rounded-full bg-green-500 flex-shrink-0"></div>
										<div class="text-sm">
											<p class="font-medium text-gray-300">Ecuación 6: Cumplida</p>
											<p class="font-mono text-xs text-gray-400">y &gt; 0</p>
										</div>
									</div>
								</div>
							</div>
						<div class="flex flex-col gap-4 rounded-lg bg-background-dark p-4">
							<h3 class="text-lg font-bold text-white">Diagrama de Radar de Cumplimiento</h3>
							<div class="flex h-full min-h-[200px] w-full items-center justify-center">
								<img alt="Diagrama de radar mostrando el nivel de cumplimiento normalizado de cada ecuación. Los ejes representan las Ecuaciones 1 a 6." class="h-full w-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfdw0BkCVM_a07AE1mdLApKJuKMjQbtWefKC1m0NKTdBjlF_3815UjTLC7Y6kiyanogXC5k6pYBY7iFWCHc2H_FTM-QkZq7jrTijrkHxTsPaPbUswH35Z3Dm55tOkQsOz9cXaRMupOt-B0w-Ayuqt69i7sQGo_-dfB2kUxJ9e87vbH1yq6yc4ILwbwyH6q5Alx0H7yr3AVwLE3LxPJxnbzZuf_FGCRssG1xbLREoOQqizCCpwVH8Q-IPFLwHguzU5rViSTSqN28qAa"/>
							</div>
						</div>
						</div>
						<div class="grid grid-cols-1 gap-6 md:grid-cols-5">
						<div class="flex flex-col gap-4 rounded-lg bg-background-dark p-4 md:col-span-2">
							<h3 class="text-lg font-bold text-white">Mapa de Calor Multivariable</h3>
							<div class="space-y-4">
								<div class="text-sm">
									<p class="font-medium text-gray-300">Cluster 1: Recursos Primarios</p>
									<div class="mt-2 flex items-center gap-2">
										<span class="font-mono text-xs text-gray-400">Var X</span>
										<div class="h-4 w-full rounded bg-gradient-to-r from-blue-500 to-violet-500"></div>
										<span class="font-mono text-xs font-bold text-white">75%</span>
									</div>
									<div class="mt-2 flex items-center gap-2">
										<span class="font-mono text-xs text-gray-400">Var Y</span>
										<div class="h-4 w-full rounded bg-gradient-to-r from-blue-500 to-violet-500"></div>
										<span class="font-mono text-xs font-bold text-white">95%</span>
									</div>
								</div>
								<div class="text-sm">
									<p class="font-medium text-gray-300">Cluster 2: Derivados</p>
									<div class="mt-2 flex items-center gap-2">
										<span class="font-mono text-xs text-gray-400">Var Z</span>
										<div class="h-4 w-full rounded bg-gradient-to-r from-blue-500 to-violet-500"></div>
										<span class="font-mono text-xs font-bold text-white">50%</span>
									</div>
									<div class="mt-2 flex items-center gap-2">
										<span class="font-mono text-xs text-gray-400">Var W</span>
										<div class="h-4 w-full rounded bg-gradient-to-r from-blue-500 to-violet-500" ></div>
										<span class="font-mono text-xs font-bold text-white">80%</span>
									</div>
								</div>
							</div>
						</div>
						<div class="flex flex-col gap-4 rounded-lg bg-background-dark p-4 md:col-span-3">
						<h3 class="text-lg font-bold text-white">Flujo de Recursos con Cuellos de Botella</h3>
						<div class="flex h-full min-h-[150px] w-full items-center justify-center">
						<img alt="Diagrama de flujo de Sankey que muestra el flujo de recursos entre variables. Una conexión en rojo indica un cuello de botella." class="h-full w-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGc-l-LCqLMPB8ycKrVCV4KqfeU1uBsAH6NrqfwU_OMjuj0H7K93BbSihGCwPgGPNhnu50rzmijp9Q67UU2FhYLF6PYzG4OERmIltmVO9bQ8cM8ZONyWEYlSmR9GsJ-xHUyfrCDo4ioFB9RmSxcTNp7vSrRoMdxvYga304ZRYfNFoJAo5djBjeNUKzICX1uHIrAdzDGYU3cRSvEh1k5hkBBxtGEkLS0VJQJN2PgCo8fVJsiOdIBpQfm1UGLMLM1egZ8gDSKeI2nhhe"/>
						</div>
						</div>
						</div>
						<div class="flex flex-col gap-4 rounded-lg bg-background-dark p-4">
						<h3 class="text-lg font-bold text-white">Matriz de Interacciones Críticas</h3>
						<div class="overflow-x-auto">
						<table class="w-full border-collapse text-center text-xs">
						<thead>
						<tr class="border-b border-white/10">
						<th class="p-2 font-medium text-gray-400"></th>
						<th class="p-2 font-mono">E1</th>
						<th class="p-2 font-mono">E2</th>
						<th class="p-2 font-mono">E3</th>
						<th class="p-2 font-mono">E4</th>
						<th class="p-2 font-mono">E5</th>
						<th class="p-2 font-mono">E6</th>
						</tr>
						</thead>
						<tbody>
						<tr>
						<td class="p-2 font-mono font-medium text-gray-400">E1</td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-gray-600 mx-auto"></div></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-green-500/50 mx-auto"></div></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-green-500/50 mx-auto"></div></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-yellow-500/50 mx-auto"></div></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-green-500/50 mx-auto"></div></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-green-500/50 mx-auto"></div></td>
						</tr>
						<tr>
						<td class="p-2 font-mono font-medium text-gray-400">E2</td>
						<td></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-gray-600 mx-auto"></div></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-green-500/50 mx-auto"></div></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-red-500/50 mx-auto"></div></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-yellow-500/50 mx-auto"></div></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-green-500/50 mx-auto"></div></td>
						</tr>
						<tr>
						<td class="p-2 font-mono font-medium text-gray-400">E3</td>
						<td></td><td></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-gray-600 mx-auto"></div></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-yellow-500/50 mx-auto"></div></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-green-500/50 mx-auto"></div></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-yellow-500/50 mx-auto"></div></td>
						</tr>
						<tr>
						<td class="p-2 font-mono font-medium text-gray-400">E4</td>
						<td></td><td></td><td></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-gray-600 mx-auto"></div></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-red-500/50 mx-auto"></div></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-green-500/50 mx-auto"></div></td>
						</tr>
						<tr>
						<td class="p-2 font-mono font-medium text-gray-400">E5</td>
						<td></td><td></td><td></td><td></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-gray-600 mx-auto"></div></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-green-500/50 mx-auto"></div></td>
						</tr>
						<tr>
						<td class="p-2 font-mono font-medium text-gray-400">E6</td>
						<td></td><td></td><td></td><td></td><td></td>
						<td class="p-2"><div class="h-4 w-4 rounded-sm bg-gray-600 mx-auto"></div></td>
						</tr>
						</tbody>
						</table>
						</div>
						<div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-400 pt-2">
						<div class="flex items-center gap-1.5"><div class="h-2.5 w-2.5 rounded-sm bg-red-500/50"></div><span>Conflicto Directo</span></div>
						<div class="flex items-center gap-1.5"><div class="h-2.5 w-2.5 rounded-sm bg-yellow-500/50"></div><span>Tensión</span></div>
						<div class="flex items-center gap-1.5"><div class="h-2.5 w-2.5 rounded-sm bg-green-500/50"></div><span>Compatible</span></div>
						</div>
						</div>
						<div class="rounded-lg bg-background-dark p-4 text-center">
						<h3 class="text-lg font-bold text-white">La Magia Ocurre Aquí: Bases de Gröbner</h3>
						<p class="mt-2 text-sm text-gray-400">Nuestro motor utiliza bases de Gröbner para transformar tu sistema de ecuaciones polinómicas en uno equivalente pero más simple. Si el resultado es <code class="font-mono text-primary bg-white/10 px-1 py-0.5 rounded-sm">{1}</code>, el sistema es inconsistente (sin solución). Además, nos permite identificar variables libres, revelando la dimensionalidad de tu espacio de soluciones.</p>
						</div>
						<div class="flex flex-col gap-4 rounded-lg bg-gradient-to-br from-blue-900/50 via-background-dark to-violet-900/50 p-6 border border-white/10">
						<h3 class="text-xl font-bold text-white text-center">Resumen Ejecutivo del Análisis</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
						<div class="flex flex-col gap-4">
						<div class="flex items-start gap-3">
						<span class="material-symbols-outlined text-red-500 mt-1">error</span>
						<div>
						<h4 class="font-semibold text-gray-200">Estado General: Inviable</h4>
						<p class="text-sm text-gray-400">El sistema tiene conflictos irresolubles en su estado actual.</p>
						</div>
						</div>
						<div class="flex items-start gap-3">
						<span class="material-symbols-outlined text-yellow-500 mt-1">crisis_alert</span>
						<div>
						<h4 class="font-semibold text-gray-200">Restricciones Críticas</h4>
						<p class="text-sm text-gray-400">La Ecuación 4 (<code class="font-mono text-xs">z*w &lt;= 1200</code>) es el principal punto de fallo.</p>
						</div>
						</div>
						<div class="flex items-start gap-3">
						<span class="material-symbols-outlined text-red-400 mt-1">fork_right</span>
						<div>
						<h4 class="font-semibold text-gray-200">Conflictos Detectados</h4>
						<p class="text-sm text-gray-400">Conflicto directo entre Ecuación 2 (<code class="font-mono text-xs">2x - z = 0</code>) y Ecuación 4.</p>
						</div>
						</div>
						</div>
						<div class="flex flex-col gap-3 rounded-md bg-background-dark/50 p-4 border border-white/10">
						<h4 class="font-semibold text-gray-200 flex items-center gap-2"><span class="material-symbols-outlined text-primary">psychology</span>Recomendaciones Claras</h4>
						<ul class="list-disc space-y-2 pl-5 text-sm text-gray-400">
						<li><strong class="text-gray-300">Revisar Ecuación 4:</strong> Considerar aumentar el límite de <code class="font-mono text-xs">1200</code> a <code class="font-mono text-xs">1550</code> para alcanzar la viabilidad.</li>
						<li><strong class="text-gray-300">Ajustar Variable X:</strong> Reducir la dependencia de 'x' en la Ecuación 2 puede aliviar la tensión con la Ecuación 4.</li>
						</ul>
						</div>
						</div>
						</div>
					</div>
				</div>
				</div>
			</main>
		</>

		)


}

export default Construccion; 