import { useState, useRef, useEffect } from 'react';
import FacadeDriver from '../engine/FacadeDriver';
import AproximationEngine from '../engine/AproximationEngine';  
import Modal from './Modal';  


function Home(){

    // Función para extraer letras dinámicamente del JSON del usuario
const extraerVariablesDinamicas = (jsonEntrada) => {
  const variablesEncontradas = new Set();
  for (let i = 1; i < jsonEntrada.length; i++) {
    const polinomio = jsonEntrada[i];
    polinomio.forEach(monomio => {
      if (monomio.partes && monomio.partes.length > 0) {
        monomio.partes.forEach(parte => {
          if (parte.base) variablesEncontradas.add(parte.base);
        });
      }
    });
  }
  return Array.from(variablesEncontradas).sort();
};

    const defaultInput = JSON.stringify([
        [{operacion: "Grobner", simulaciones:20}],
        [ // 3x³ + 2x²y + xy² + 2y - 140 = 0
    {type: "Monomio", coeficiente: 3, partes: [{objeto: "Potencia", base: "x", exponente: 3}]},
    {type: "Monomio", coeficiente: 2, partes: [
      {objeto: "Potencia", base: "x", exponente: 2},
      {objeto: "Potencia", base: "y", exponente: 1}
    ]},
    {type: "Monomio", coeficiente: 1, partes: [
      {objeto: "Potencia", base: "x", exponente: 1},
      {objeto: "Potencia", base: "y", exponente: 2}
    ]},
    {type: "Monomio", coeficiente: 2, partes: [{objeto: "Potencia", base: "y", exponente: 1}]},
    {type: "Monomio", coeficiente: -140, partes: []}
  ],
  [ // x²y + 3xy + y² - 80 = 0
    {type: "Monomio", coeficiente: 1, partes: [
      {objeto: "Potencia", base: "x", exponente: 2},
      {objeto: "Potencia", base: "y", exponente: 1}
    ]},
    {type: "Monomio", coeficiente: 3, partes: [
      {objeto: "Potencia", base: "x", exponente: 1},
      {objeto: "Potencia", base: "y", exponente: 1}
    ]},
    {type: "Monomio", coeficiente: 1, partes: [{objeto: "Potencia", base: "y", exponente: 2}]},
    {type: "Monomio", coeficiente: -80, partes: []}
  ]
    ], null, 2);

    const [resilienceReport, setResilienceReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rawResult, setRawResult] = useState(null);
    //const [resilienceReport, setResilienceReport] = useState([]);
    const [inputJSON, setInputJSON] = useState(defaultInput);
    const [outputJSON, setOutputJSON] = useState('{}');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    //Referencia al motor
    const engineRef = useRef(null);

    //Estado para el texto de progreso en tiempo real
    const [simulationStatus, setSimulationStatus] = useState('Iniciando motor matemático...');

    
    useEffect(() => {
        let intervalId;
        
        if (isProcessing) {
            // Arrancamos el radar
            intervalId = setInterval(() => {
                const currentStatus = localStorage.getItem('simulation_status');
                if (currentStatus) {
                    setSimulationStatus(currentStatus);
                }
            }, 100); // Revisa 10 veces por segundo
        } else {
            // Limpiamos cuando termina
            setSimulationStatus('Iniciando motor matemático...');
            localStorage.removeItem('simulation_status');
        }

        return () => clearInterval(intervalId); // Cleanup al desmontar
    }, [isProcessing]);

    // Función para procesar
    async function processAlgebra() {
        if (!engineRef.current) {
            engineRef.current = new AproximationEngine();
        }

        setIsProcessing(true);
        localStorage.setItem('simulation_status', '📐 Validando topología del sistema...');

        setIsProcessing(true);
        setError(null);
        setOutputJSON('{"status": "processing"}');

        try {
            // Parsear entrada
            let inputData;
            try {
                inputData = JSON.parse(inputJSON);
            } catch (err) {
                throw new Error('JSON inválido: ' + err.message);
            }

            // Validar formato mínimo
            if (!Array.isArray(inputData) || inputData.length < 2) {
                throw new Error('Formato incorrecto. Debe ser un array con al menos 2 polinomios.');
            }

           
            // Ejecutar simulación
            const result = await engineRef.current.runCompleteSimulation(inputData, {
                targetVectors: 300,
                showSteps: true
            });
            const letrasDetectadas = extraerVariablesDinamicas(inputData);
            if (result && result.results) {
                result.results.variables = letrasDetectadas;
            }
             setRawResult(result);
            const formattedResult = JSON.stringify(result, null, 2);
            // Mostrar resultado
            setOutputJSON(formattedResult);
            
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
            setOutputJSON(JSON.stringify({
                error: err.message,
                timestamp: new Date().toISOString()
            }, null, 2));
        } finally {
            setIsProcessing(false);
        }
    }


    async function runResilienceAnalysis() {
    if (!engineRef.current || !inputJSON) return;
    
    setIsProcessing(true);
    setResilienceReport(null); // Limpiamos reporte anterior
    
    let report = [];
    let baseInput;
    
    try {
        baseInput = JSON.parse(inputJSON);
    } catch (e) {
        alert("JSON inválido para el test de resiliencia.");
        setIsProcessing(false);
        return;
    }

    // El loop de la tortura: 5 niveles de estrés
    for (let i = 0; i <= 4; i++) {
        setSimulationStatus(`🛡️ Test de Impacto Dinámico: Nivel ${i + 1}/5...`);
        
        // Clonamos el JSON original
        let modifiedInput = JSON.parse(JSON.stringify(baseInput));
        
        // Buscamos el último polinomio (asumiendo que ahí está la regla financiera)
        let lastPoly = modifiedInput[modifiedInput.length - 1];
        
        // Buscamos el monomio que NO tiene variables (el término independiente, ej: -500)
        let constantMonomial = lastPoly.find(m => m.partes.length === 0);
        
        if (constantMonomial) {
            // Le restamos 2 puntos de estrés por cada iteración
            constantMonomial.coeficiente -= (i * 2); 
        }

        try {
            // Corremos el motor pero solo pidiendo 100 vectores para que sea rápido
            const res = await engineRef.current.runCompleteSimulation(modifiedInput, {
                targetVectors: 100, 
                showSteps: false
            });
            
            const conectividad = (res.results.geometricProperties.connectivityRate * 100).toFixed(2);
            let estado = "Estable";
            if (conectividad < 20) estado = "Tensionado";
            if (conectividad < 5) estado = "Frágil";
            if (conectividad == 0) estado = "Colapso";

            report.push({
                nivel: i,
                stress: constantMonomial ? constantMonomial.coeficiente : "N/A",
                conectividad: conectividad,
                distancia: res.results.geometricProperties.averageDistance.toFixed(2),
                estado: estado
            });
        } catch (e) {
            report.push({ 
                nivel: i, 
                stress: "FALLO", 
                conectividad: "0.00", 
                distancia: "---", 
                estado: "COLAPSO ESTRUCTURAL" 
            });
        }
    }
    
    setResilienceReport(report);
    setIsProcessing(false);
    setSimulationStatus('Iniciando motor matemático...');
}

     // Manejar cambio en el editor
    function handleEditorChange(e) {
        setInputJSON(e.target.textContent);
    }

    // Función para restablecer al ejemplo
    function resetToExample() {
        setInputJSON(defaultInput);
        setOutputJSON('{}');
        setError(null);
    }

    // Función auxiliar para validar JSON
    function validateJSON() {
        try {
            JSON.parse(inputJSON);
            return true;
        } catch {
            return false;
        }
    }

    // Función para descargar resultado
    function downloadResult() {
        const blob = new Blob([outputJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analisis-algebraico-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    //descarga power BI 
    function downloadPowerBi(){

        //let pedidoPowerBi = engineRef.generatePowerBiExport(outputJSON); 

        const blob = new Blob([localStorage.getItem('algebra_sim_powerbi_export')], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analisis-algebraico-power-bi-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

    }

    return(

        <>
            <p className="TextoAblog">Visita el blog para información técnica y asesoramiento sobre el motor. <a href="https://blog.romimath.site" target="_blank">Ir al blog</a></p>
            <div className="MainContainer">
                <div className="JsonInput">
                    <div className="editor-header">
                        <h3><ion-icon name="infinite-outline"></ion-icon> ENTRADA ALGEBRAICA</h3>
                        <div className="header-actions">
                        <button 
                            className="action-btn"
                            onClick={resetToExample}
                        >
                            <ion-icon name="refresh-outline"></ion-icon> Restablecer
                        </button>
                        <button 
                            className="action-btn"
                            onClick={() => {
                                try {
                                    JSON.parse(inputJSON);
                                    alert('✅ JSON válido');
                                } catch {
                                    alert('❌ JSON inválido');
                                }
                            }}
                        >
                            <ion-icon name="checkmark-outline"></ion-icon> Validar
                        </button>
                        <button className="action-btn"
    style={{ background: '#121212', border: '1px solid #dc2626', color: '#dc2626', fontWeight: 'bold' }}
    onClick={runResilienceAnalysis}
    disabled={outputJSON === '{}' || isProcessing}
>
    <ion-icon name="shield-half-outline"></ion-icon> TEST DE ESTRÉS
</button>
                    </div>
                    </div>
                    <pre className="json-editor"contentEditable="true" suppressContentEditableWarning={true} onBlur={handleEditorChange} onKeyDown={(e) => {
                            // Auto-indentación con Tab
                            if (e.key === 'Tab') {
                                e.preventDefault();
                                document.execCommand('insertText', false, '  ');
                            }
                        }}>
                        <code>{inputJSON}</code>
                    </pre>
                    
                    <div className="input-footer">
                    <button 
                        className="process-btn"
                        onClick={processAlgebra}
                        disabled={isProcessing}
                    >   <ion-icon name="rocket-outline"></ion-icon>
                        {isProcessing ? (
                            <>
                                <span className="spinner"></span>
                                ⚡ PROCESANDO...
                            </>
                        ) : (
                            'EJECUTAR ANÁLISIS'
                        )}
                    </button>
                    
                    {error && (
                        <div className="error-message">
                            ❌ {error}
                        </div>
                    )}
                </div>

                </div>
                    
                    <div className="JsonOutput">
                        <div className="output-header">
                            <h3><ion-icon name="cube-outline"></ion-icon> RESULTADO MATEMÁTICO</h3>
                            <div className="output-actions">
                                <button  className="action-btn"
                                    onClick={() => navigator.clipboard.writeText(outputJSON)}
                                    disabled={outputJSON === '{}'}
                                >
                                    <ion-icon name="copy-outline"></ion-icon> Copiar
                                </button>
                                <button className="action-btn"
                                    onClick={downloadResult}
                                    disabled={outputJSON === '{}'}
                                >
                                    <ion-icon name="cloud-download-outline"></ion-icon> JSON
                                </button>
                                <button className="action-btn"
                                    onClick={downloadPowerBi}
                                    disabled={outputJSON === '{}'}
                                >
                                    <ion-icon name="cloud-download-outline"></ion-icon> PowerBI
                                </button>
                                <button className="action-btn" 
                                        onClick={() => setIsModalOpen(true)} 
                                        disabled={!rawResult}
                                        style={{background: '#dc2626', color: 'white', border: 'none'}}>
                                    <ion-icon name="map-outline"></ion-icon> VER MAPA
                                </button>
                            </div>
                        </div>
                        
                        {/* 🎯 NUEVO: Visualización de Estado (Solo se ve si está procesando) */}
                        {isProcessing && (
                            <div className="processing-info" style={{ margin: '20px 0', padding: '15px', background: '#2a2a2a', borderRadius: '8px' }}>
                                <div className="spinner"></div>
                                <span style={{ color: '#F2D34E', fontFamily: 'monospace', fontSize: '14px' }}>
                                    {simulationStatus}
                                </span>
                            </div>
                        )}

                        <pre className="json-output">
                            <code>{outputJSON}</code>
                        </pre>

                       

{resilienceReport && (
    <div className="resilience-report">
        <h3 className="resilience-title">
            <ion-icon name="warning-outline"></ion-icon> Reporte de Resiliencia Estructural
        </h3>
        
        <div className="table-responsive">
            <table className="resilience-table">
                <thead>
                    <tr>
                        <th>Nivel de Estrés</th>
                        <th>Coef. Crítico</th>
                        <th>Conectividad</th>
                        <th>Distancia Base</th>
                        <th>Diagnóstico</th>
                    </tr>
                </thead>
                <tbody>
                    {resilienceReport.map((row, idx) => (
                        <tr key={idx} className={row.estado === 'Colapso' || row.estado === 'COLAPSO ESTRUCTURAL' ? 'row-colapso' : ''}>
                            <td>+ {row.nivel * 2} perturbaciones</td>
                            <td style={{ fontWeight: 'bold' }}>{row.stress}</td>
                            <td>{row.conectividad}%</td>
                            <td>{row.distancia}</td>
                            <td style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                                {row.estado}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <p className="resilience-note">
            * El motor aplicó perturbaciones temporales al término constante del último polinomio para medir la resistencia del Atractor de Gröbner frente a cambios bruscos del mercado.
        </p>
    </div>
)}
                        
                        {outputJSON !== '{}' && !isProcessing && (
                            <div className="output-info">
                                <small>
                                    ✅ Análisis completado • {new Date().toLocaleTimeString()} • 
                                    {Math.round(outputJSON.length / 1024)} KB
                                </small>
                            </div>
                        )}
                    </div>

                <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    data={rawResult ? rawResult.results : null} 
                />    
            </div>

        </>

    )


}

export default Home; 