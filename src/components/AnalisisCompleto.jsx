import cubo from './../assets/img/cubo.png'
import grafico from './../assets/img/grafico.png'
import geometria from './../assets/img/geometria.png'
import coseno from './../assets/img/coseno.png'
import cilindro from './../assets/img/cilindro.png'
import infinidad from './../assets/img/infinidad.png'
import estadistica from './../assets/img/estadistica.png'
import logica from './../assets/img/logica.png'
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';


function AnalisisCompleto(){

	const data = [
		{
		    name: 'Semana 1',
		    optimo: 40,
		    actual: 24,
		    proyectado: 13,
		    amt: 100,
		},
		{
		    name: 'Semana 2',
		    optimo: 30,
		    actual: 13,
		    proyectado: 53,
		    amt: 100,
		},
		{
		    name: 'Semana 3',
		    optimo: 20,
		    actual: 18,
		    proyectado: 43,
		    amt: 100,
		},
		{
		    name: 'Semana 4',
		    optimo: 27,
		    actual: 39,
		    proyectado: 23,
		    amt: 100,
		},
		{
		    name: 'Semana 5',
		    optimo: 75,
		    actual: 48,
		    proyectado: 83,
		    amt: 100,
		},
		{
		    name: 'Semana 6',
		    optimo: 23,
		    actual: 38,
		    proyectado: 26,
		    amt: 100,
		},
		{
		    name: 'Semana 7',
		    optimo: 34,
		    actual: 43,
		    proyectado: 48,
		    amt: 100,
		},
	];


	return(

		<>
			
			<div className="menuAnalisis" id="menuAnalisis">
				
				<div>
					<p>General</p>
					<img src={grafico} />
				</div>
				<div>
					<p>Variables</p>
					<img src={cubo} />
				</div>
				<div>
					<p>Relaciones Var.</p>
					<img src={geometria} />
				</div>
				<div>
					<p>Simulaciones</p>
					<img src={coseno} />
				</div>
				<div>
					<p>Historial</p>
					<img src={cilindro} />
				</div>
				<div>
					<p>Mapa</p>
					<img src={infinidad} />
				</div>
				<div>
					<p>Exportar stats</p>
					<img src={estadistica} />
				</div>
				<div>
					<p>Logica</p>
					<img src={logica} />
				</div>

			</div>

			<div className="Dashboard">
				
				<h2>General<br/><small>Ve todas las relaciones que desees</small></h2>

				<div className="GraficaContainer">
					
					<LineChart
				     	style={{ width: '100%', maxWidth: '100%', maxHeight: 'auto', aspectRatio: 1.618 }}
				    	responsive
				    	data={data}
    				>
			        	<CartesianGrid strokeDasharray="3 3" />
			        	<XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
			        	<YAxis width="auto" />
			        	<Tooltip />
			        	<Legend />
			      		<Line type="monotone" dataKey="optimo" stroke="#2ecc71" activeDot={{ r: 8 }} />
			        	<Line type="monotone" dataKey="actual" stroke="#9b59b6" />
			        	<Line type="monotone" dataKey="proyectado" stroke="var(--color-primario)" />
			    	</LineChart>

				</div>

				<div className="BoxSeleccionarVariables">
					<div className="SeleccionarVariable">
						<input type="checkbox"/>
						<p>Variable 1</p>
					</div>
				</div>

				<h2>Estado de variables<br/><small>Identifica como se encuentra cada variable</small></h2>

				<div className="BoxTablaVariables">
					
					<table>
						
						<tr>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
						</tr>
						<tr>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
						</tr>
						<tr>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
						</tr>
						<tr>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
						</tr>
						<tr>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
						</tr>
						<tr>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
						</tr>
						<tr>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
							<th>Variable 1</th>
						</tr>

					</table>

				</div>

			</div>

		</>

		)

}
export default AnalisisCompleto;