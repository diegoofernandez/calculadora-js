function Usertab(){


	return(


		<div className="tab-panel" id="user-tab">
            <div className="user-auth" id="user-login-form">
                <h4>Iniciar Sesión</h4>
                <form id="login-form">
                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Contraseña" required />
                    <button type="submit">Ingresar</button>
                </form>
                <p>¿No tienes cuenta? <a href="#" id="show-register">Regístrate</a></p>
                <p>O ingresa con <a href="#">Google</a></p>
            </div>
                        
            <div className="user-profile" id="user-profile">
                <h4>Mi Perfil</h4>
                <div className="user-history">
                    <h5>Historial de Cálculos</h5>
                    <ul id="calculation-history"></ul>
                </div>
            </div>
        </div>
		

		);


}
export default Usertab