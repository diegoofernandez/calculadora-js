function ConsoleTab({calculationResult}){

	const pasos = calculationResult?.pasos || [
	    "Esperando cálculo...",
	    "Ingresa un polinomio en formato JSON y presiona 'REALIZAR CÁLCULO'",
	    "Ejemplo válido:",
	        `[
	        	{"type": "Monomio", "coeficiente": 1, "partes": [{"objeto": "Potencia", "base": "x", "exponente": 2}]},
	  			{"type": "Monomio", "coeficiente": 1, "partes": [{"objeto": "Potencia", "base": "y", "exponente": 2}]},
	  			{"type": "Monomio", "coeficiente": -1, "partes": []}
				]`
	    ];

	return(

		<>
			<div className="console-container">
	            <div className="console-header">
	                <div className="console-title">
	                    <span className="console-icon">▶</span>
	                    <h3>CONSOLA ALGEBRAICA</h3>
	                </div>
	                <div className="console-actions">
	                    <button className="console-btn">
	                        <ion-icon name="copy-outline"></ion-icon>
	                    </button>
	                    <button className="console-btn">
	                        <ion-icon name="trash-outline"></ion-icon>
	                    </button>
	                </div>
	            </div>
            
	            <div className="console-output">
	                {pasos.map((paso, index) => (
	                    <div key={index} className="console-line">
	                        <span className="console-prompt">algebra&gt;</span>
	                        <span className={`console-text ${paso.includes('✅') ? 'success' : paso.includes('❌') ? 'error' : ''}`}>
	                            {paso}
	                        </span>
	                    </div>
	                ))}
	            </div>
            
	            {calculationResult?.baseGroebner && (
	                <div className="console-result">
	                    <h4>📦 RESULTADO FINAL</h4>
	                    <div className="groebner-result">
	                        {calculationResult.baseGroebner.map((polinomio, idx) => (
	                            <div key={idx} className="polinomio">
	                                g{idx + 1} = {polinomio}
	                            </div>
	                        ))}
	                    </div>
	                    <div className="metadata">
	                        <div className="meta-item">
	                            <span className="meta-label">Variables:</span>
	                            <span className="meta-value">{calculationResult.variables?.join(', ')}</span>
	                        </div>
	                        <div className="meta-item">
	                            <span className="meta-label">Tiempo:</span>
	                            <span className="meta-value">0.45s</span>
	                        </div>
	                    </div>
	                </div>
	            )}
            
	            <div className="console-input-area">
	                <span className="input-prompt">...</span>
	                <input 
	                    type="text" 
	                    className="console-input"
	                    placeholder="Ingresa comando (ej: simplify, factor, solve...)"
	                    disabled
	                />
	            </div>
        	</div>
		</>

		)

}
export default ConsoleTab; 