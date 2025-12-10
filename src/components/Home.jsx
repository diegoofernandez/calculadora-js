import { useState, useRef, useEffect } from 'react';
import FacadeDriver from '../engine/FacadeDriver';
import AproximationEngine from '../engine/AproximationEngine';  


function Home(){

    const defaultInput = JSON.stringify([
        [{operacion: "Grobner"}],
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

    const [inputJSON, setInputJSON] = useState(defaultInput);
    const [outputJSON, setOutputJSON] = useState('{}');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    // Referencia al motor
    const engineRef = useRef(null);


    // Función para procesar
    async function processAlgebra() {
        if (!engineRef.current) {
            engineRef.current = new AproximationEngine();
        }

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
                                    <ion-icon name="cloud-download-outline"></ion-icon> Descargar
                                </button>
                            </div>
                        </div>
                
                        <pre className="json-output">
                            <code>{outputJSON}</code>
                        </pre>
                        
                        {outputJSON !== '{}' && !isProcessing && (
                            <div className="output-info">
                                <small>
                                    ✅ Análisis completado • {new Date().toLocaleTimeString()} • 
                                    {Math.round(outputJSON.length / 1024)} KB
                                </small>
                            </div>
                        )}
                    </div>

            </div>

        </>

    )


}

export default Home; 