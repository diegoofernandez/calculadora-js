function Soporte(){

	return(

		<div className="tab-panel" id="support-tab">
            <form className="support-form" id="support-form">
                <h4>Reportar un Error/Sugerencia</h4>
                <select id="issue-type">
                    <option value="bug">Reportar Error</option>
                    <option value="feature">Sugerir Función</option>
                    <option value="improvement">Mejora</option>
                </select>
                <textarea placeholder="Describe el problema o sugerencia..." required></textarea>
                <button type="submit">Enviar</button>
            </form>
        </div>
		
		)

}
export default Soporte
