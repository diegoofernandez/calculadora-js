import imagenPerfil from '../assets/img/perfil.jpg'
function Informacion(){

	return(
		<>
			<div className="box-info">
				<div className="proyecto-info">
					<h2>MathEngine v1.0</h2>
					<p>Calculadora científica con motor de algoritmos propios implementados en JavaScript puro.</p>
					<div className="tech-stack">
						<span className="tech-tag"><ion-icon name="logo-javascript"></ion-icon> Vanilla JS (para algoritmos)</span>
						<span className="tech-tag"><ion-icon name="logo-react"></ion-icon> React JS (frontend)</span>
						<span className="tech-tag"><ion-icon name="cube-outline"></ion-icon> PHP y Mysql (backend)</span>
						<span className="tech-tag"><ion-icon name="calculator-outline"></ion-icon> Matemáticas</span>
					</div>
            	</div>
            
				<div className="author-info">
					<img src={imagenPerfil} alt="Foto perfil" className="author-avatar" />
					<h3>Diego Fernández</h3>
					<p>Desarrollador Full Stack especializado en algoritmos matemáticos.</p>
				</div>
				
				<div className="update-log">
					<h3>Últimas Actualizaciones</h3>
					<div className="update-feed">
						<div className="update-item">
							<span className="update-date">2023-11-20</span>
							<p>Se implemento el algoritmo Shunting-yard, logrando convertir cadenas sujifas en posfijas, permitiendo respetar la jerarquía de operaciones y parentesis incluso anidados.</p>
						</div>
						<div className="update-item">
							<span className="update-date">2023-11-18</span>
							<p>Se implemento el algoritmo de Euclides, con el fin de lograr encontrar el MCD</p>
						</div>
					</div>
				</div>
			</div>
		</>

	)

}

export default Informacion