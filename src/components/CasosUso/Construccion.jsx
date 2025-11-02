import FacadeDriver from './../../engine/FacadeDriver'; 
import ConvertKatexToJson from '../../libs/ConvertKatexToJson';
import VarConstruccion from './Analizers/VarConstruccion';
import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Scatter } from 'recharts';


function Construccion(){

	const [data, setData] = useState([]); 
	const [dataLine, setDataLine] = useState([]); 
	const [aig, setAig] = useState(); 
	const [trueBtn, setBtn] = useState(false); 
	const [puntaje, setPuntaje] = useState(''); 

	const [informe, setInforme] = useState([]);  

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


	let basesGrobnerUsuario = []; 


	let polinomiosParaBase = ""; 

	//construye las variables
	function cambiandoValor(e){

		let campo = e.target.id; 
		let valor = e.target.value; 

		if(campo == "campoPresupuesto"){
			variables.presupuesto = valor; 
		}else if(campo == "campoMateriales"){
			variables.materiales = valor; 
		}else if(campo == "campoManoObra"){
			variables.mano_obra = valor; 
		}else if(campo == "campoHerramientas"){
			variables.herramientas = valor; 
		}else if(campo == "campoContingencia"){
			variables.contingencia = valor; 
		}else if(campo == "campoMargen"){
			variables.margen = valor; 
		}else if(campo == "campoImpuestos"){
			variables.impuestos = valor; 
		}

		polinomiosParaBase = stringToBase();

	}
	//formatea la consulta al motor
	function stringToBase(){

		let tempString = "G "; 

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

		if(variables.contingencia == 0 || variables.herramientas == 0 || variables.impuestos == 0 || variables.mano_obra == 0 || variables.margen == 0 || variables.materiales == 0 || variables.presupuesto ==  0){
			
			return alert("No puedes enviar campos vacíos");  

		}

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

		let objetoAnalizer = new VarConstruccion(); 

		const nombres = ["Materiales", "Mano de obra", "Equipos", "Impuestos", "Contingencia", "Margen"];

		objetoAnalizer.analizarBaseCompleta(basesGrobnerOptimas, basesGrobnerUsuario, nombres);
		setInforme(objetoAnalizer.dataInforme); 
		setData( objetoAnalizer.generarDatosRadarChart(basesGrobnerOptimas, basesGrobnerUsuario, nombres));
		setDataLine(objetoAnalizer.generarDatosBarChartCompleto(basesGrobnerOptimas, basesGrobnerUsuario, nombres)); 
		setAig( objetoAnalizer.generarDatosGraficosConIAG(basesGrobnerOptimas, basesGrobnerUsuario, nombres) ); 

		setPuntaje(objetoAnalizer.calcularIndiceAlgebraicoGlobal(basesGrobnerOptimas, basesGrobnerUsuario)); 

		resetForm(); 

	}

	function resetForm(){

		document.getElementById('campoPresupuesto').value = '';
		document.getElementById('campoMateriales').value = ''; 
		document.getElementById('campoManoObra').value = ''; 
		document.getElementById('campoHerramientas').value = ''; 
		document.getElementById('campoContingencia').value = ''; 
		document.getElementById('campoMargen').value = ''; 
		document.getElementById('campoImpuestos').value = '';  

		setBtn(false); 

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
							<button class="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark" type="button" onClick={creandoBaseUsuario} disabled={trueBtn}>
								<span class="material-symbols-outlined">analytics</span>
							        Analizar Sistema
							</button>
						</form>
					</div>
					<div class="flex flex-col gap-8 rounded-xl bg-[#1E1E1E] p-6 sm:p-8 lg:col-span-2">
						<h2 class="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Tablero de Control</h2>
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="flex flex-col gap-4 rounded-lg bg-background-dark p-4">
								<h3 class="text-lg font-bold text-white">Integridad Algebraica</h3>
								<div class="space-y-3">
									<div class="flex items-center gap-3">
										<div class="text-sm">
											<p class="font-medium text-gray-300">
												{
													aig
												}
											</p>
											<br /><br />
											<h1 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">
												{
													puntaje
												}
											</h1>
										</div>
									</div>
								</div>
							</div>
						<div class="flex flex-col gap-4 rounded-lg bg-background-dark p-4">
							<h3 class="text-lg font-bold text-white">Radar de cumplimiento</h3>
							<div class="flex h-full min-h-[200px] w-full items-center justify-center">
								
									<RadarChart
									style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', aspectRatio: 1 }}
									responsive
									outerRadius="80%"
									data={data}
    								>
										<PolarGrid />
										<PolarAngleAxis dataKey="subject" />
										
										<PolarRadiusAxis angle={30} domain={[0, 100]} />
										<Radar name="Ideal" dataKey="fullMark" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
										<Radar name="Tus variables" dataKey="Usuario" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
										<Legend />
    								</RadarChart>
							</div>
						</div>
						</div>
						<div class="grid grid-cols-1 gap-6 md:grid-cols-5">
						
						<div class="flex flex-col gap-4 rounded-lg bg-background-dark p-4 md:col-span-12">
							<h3 class="text-lg font-bold text-white">Todas las relaciones</h3>
							<div class="flex h-full min-h-[150px] w-full items-center justify-center">
							<ComposedChart
								style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
								responsive
								data={dataLine}
								margin={{
									top: 20,
									right: 0,
									bottom: 0,
									left: 0
								}}
    						>
								<CartesianGrid stroke="#f5f5f5" />
								<XAxis dataKey="name" scale="band" />
								<YAxis width="auto" />
								<Tooltip />
								<Legend />
								<Area type="monotone" dataKey="problema" fill="#8884d8" stroke="#8884d8" />
								<Bar dataKey="variables" barSize={20} fill="#413ea0" />
								<Line type="monotone" dataKey="optimo" stroke="#ff7300" />
								<Scatter dataKey="mejora" fill="red" />
    						</ComposedChart>
							</div>
						</div>
						</div>
						<div class="rounded-lg bg-background-dark p-4 text-center">
						<h3 class="text-lg font-bold text-white">La Magia Ocurre Aquí: Bases de Gröbner</h3>
						<p class="mt-2 text-sm text-gray-400">Nuestro motor utiliza bases de Gröbner para transformar tu sistema de ecuaciones polinómicas en uno equivalente pero más simple. Si el resultado es <code class="font-mono text-primary bg-white/10 px-1 py-0.5 rounded-sm">{1}</code>, el sistema es inconsistente (sin solución). Además, nos permite identificar variables libres, revelando la dimensionalidad de tu espacio de soluciones.</p>
						</div>
						<div class="flex flex-col gap-4 rounded-lg bg-gradient-to-br from-blue-900/50 via-background-dark to-violet-900/50 p-6 border border-white/10">
						<h3 class="text-xl font-bold text-white text-center">Resumen ejecutivo del análisis</h3>
						<div class="grid grid-cols-1 md:grid-cols-1 gap-6 mt-2">
						<div class="flex flex-col gap-4">
						<div class="flex items-start gap-3">
						<div>
						<p class="text-sm text-gray-400">
							{
								informe.map((item, index) => {

									if(item.includes("ANÁLISIS ALGEBRAICO DETALLADO") || item.includes("Materiales") || item.includes("Mano de obra") || item.includes("Equipos") || item.includes("Impuestos") || item.includes("Contingencia") || item.includes("Margen")){

										return <h3 className='text-lg font-bold text-white'>{item}</h3> 

									}

									if(item.includes("ANÁLISIS TÉCNICO") || item.includes("ANÁLISIS GERENCIAL")){

										return <h4 className='text-lg font-bold text-white'>{item}</h4> 

									}

									return <p className="text-sm text-gray-400" key={index}>- {item}</p>
								})
							}
						</p>
						</div>
						</div>
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