import { useState, useRef, useEffect } from 'react';
import FacadeDriver from '../engine/FacadeDriver';
import AproximationEngine from '../engine/AproximationEngine';  
import Modal from './Modal';  
// 1. Importamos el nuevo motor visual 3D
import { DynamicFluid3D } from './DynamicFluid3D'; 

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
    const [inputJSON, setInputJSON] = useState(defaultInput);
    const [outputJSON, setOutputJSON] = useState('{}');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const engineRef = useRef(null);
    const [simulationStatus, setSimulationStatus] = useState('Iniciando motor matemático...');

    useEffect(() => {
        let intervalId;
        
        if (isProcessing) {
            intervalId = setInterval(() => {
                const currentStatus = localStorage.getItem('simulation_status');
                if (currentStatus) {
                    setSimulationStatus(currentStatus);
                }
            }, 100); 
        } else {
            setSimulationStatus('Iniciando motor matemático...');
            localStorage.removeItem('simulation_status');
        }

        return () => clearInterval(intervalId); 
    }, [isProcessing]);

    async function processAlgebra() {
        if (!engineRef.current) {
            engineRef.current = new AproximationEngine();
        }

        setIsProcessing(true);
        localStorage.setItem('simulation_status', '📐 Validando topología del sistema...');
        setError(null);
        setOutputJSON('{"status": "processing"}');

        try {
            let inputData;
            try {
                inputData = JSON.parse(inputJSON);
            } catch (err) {
                throw new Error('JSON inválido: ' + err.message);
            }

            if (!Array.isArray(inputData) || inputData.length < 2) {
                throw new Error('Formato incorrecto. Debe ser un array con al menos 2 polinomios.');
            }

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
        setResilienceReport(null); 
        
        let report = [];
        let baseInput;
        
        try {
            baseInput = JSON.parse(inputJSON);
        } catch (e) {
            alert("JSON inválido para el test de resiliencia.");
            setIsProcessing(false);
            return;
        }

        const escenariosEstres = [0.0, 0.05, 0.10, 0.15, 0.25];

        for (let i = 0; i < escenariosEstres.length; i++) {
            const stressActual = escenariosEstres[i];
            const stressPorcentaje = (stressActual * 100).toFixed(0) + '%';
            
            setSimulationStatus(`🛡️ Test de Impacto Macro: Nivel ${i + 1}/5 (${stressPorcentaje} de ruido)...`);

            try {
                const res = await engineRef.current.runCompleteSimulation(baseInput, {
                    targetVectors: 100, 
                    showSteps: false,
                    stressLevel: stressActual 
                });
                
                const conectividad = (res.results.geometricProperties.connectivityRate * 100).toFixed(2);
                const distancia = res.results.geometricProperties.averageDistance.toFixed(2);
                
                let estadoDiagnostico = "DESCONOCIDO";
                let srValor = 0;
                
                if (res.frontendData && res.frontendData.diagnosticoAvanzado) {
                    estadoDiagnostico = res.frontendData.diagnosticoAvanzado.indiceSR.estado;
                    srValor = res.frontendData.diagnosticoAvanzado.indiceSR.SR;
                }

                report.push({
                    nivel: i,
                    ruidoMacro: stressPorcentaje,
                    sr: srValor,
                    conectividad: conectividad,
                    distancia: distancia,
                    estado: estadoDiagnostico
                });
            } catch (e) {
                report.push({ 
                    nivel: i, 
                    ruidoMacro: stressPorcentaje, 
                    sr: "0",
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

    function handleEditorChange(e) {
        setInputJSON(e.target.textContent);
    }

    function resetToExample() {
        setInputJSON(defaultInput);
        setOutputJSON('{}');
        setError(null);
    }

    function downloadResult() {
        const blob = new Blob([outputJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analisis-algebraico-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function downloadPowerBi(){
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
                            <button className="action-btn" onClick={resetToExample}>
                                <ion-icon name="refresh-outline"></ion-icon> Restablecer
                            </button>
                            <button className="action-btn" onClick={() => {
                                try {
                                    JSON.parse(inputJSON);
                                    alert('✅ JSON válido');
                                } catch {
                                    alert('❌ JSON inválido');
                                }
                            }}>
                                <ion-icon name="checkmark-outline"></ion-icon> Validar
                            </button>
                            <button className="action-btn"
                                style={{ background: '#121212', border: '1px solid #dc2626', color: '#dc2626', fontWeight: 'bold' }}
                                onClick={runResilienceAnalysis}
                                disabled={outputJSON === '{}' || isProcessing}
                            >
                                <ion-icon name="shield-half-outline"></ion-icon> TEST ESTRÉS
                            </button>
                        </div>
                    </div>
                    
                    <pre className="json-editor" contentEditable="true" suppressContentEditableWarning={true} onBlur={handleEditorChange} onKeyDown={(e) => {
                            if (e.key === 'Tab') {
                                e.preventDefault();
                                document.execCommand('insertText', false, '  ');
                            }
                        }}>
                        <code>{inputJSON}</code>
                    </pre>
                    
                    <div className="input-footer">
                        <button className="process-btn" onClick={processAlgebra} disabled={isProcessing}>
                            <ion-icon name="rocket-outline"></ion-icon>
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
                            <button className="action-btn" onClick={() => navigator.clipboard.writeText(outputJSON)} disabled={outputJSON === '{}'}>
                                <ion-icon name="copy-outline"></ion-icon> Copiar
                            </button>
                            <button className="action-btn" onClick={downloadResult} disabled={outputJSON === '{}'}>
                                <ion-icon name="cloud-download-outline"></ion-icon> JSON
                            </button>
                            <button className="action-btn" onClick={downloadPowerBi} disabled={outputJSON === '{}'}>
                                <ion-icon name="cloud-download-outline"></ion-icon> PowerBI
                            </button>
                            <button className="action-btn" onClick={() => setIsModalOpen(true)} disabled={!rawResult} style={{background: '#dc2626', color: 'white', border: 'none'}}>
                                <ion-icon name="map-outline"></ion-icon> MAPA
                            </button>
                        </div>
                    </div>
                    
                    {isProcessing && (
                        <div className="processing-info" style={{ margin: '20px 0', padding: '15px', background: '#2a2a2a', borderRadius: '8px' }}>
                            <div className="spinner"></div>
                            <span style={{ color: '#F2D34E', fontFamily: 'monospace', fontSize: '14px' }}>
                                {simulationStatus}
                            </span>
                        </div>
                    )}

                    {/* PANEL DE CONFIANZA QUIRÚRGICO */}
                    {rawResult && rawResult.frontendData && rawResult.frontendData.diagnosticoAvanzado && !isProcessing && (
                        <div style={{ 
                            fontFamily: 'monospace', 
                            border: '1px solid #444', 
                            background: '#0a0a0a', 
                            padding: '20px', 
                            color: '#e5e5e5',
                            marginBottom: '20px',
                            textAlign: 'left'
                        }}>
                            {/* ... (Todo tu código del diagnóstico se mantiene intacto) ... */}
                            <div style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 'bold', letterSpacing: '1px', color: '#10b981' }}>[ DIAGNÓSTICO ESTRUCTURAL ]</span>
                                <span style={{ color: '#888' }}>ID: {rawResult.simulationId.split('_')[1]}</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ borderLeft: '3px solid #F2D34E', paddingLeft: '15px' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase' }}>Tensión Estructural Relativa (S_R)</div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '5px' }}>
                                        <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fff' }}>
                                            {rawResult.frontendData.diagnosticoAvanzado.indiceSR.SR}
                                        </span>
                                        <span style={{ fontSize: '1.2rem', color: '#F2D34E', marginLeft: '10px' }}>
                                            ± {rawResult.frontendData.diagnosticoAvanzado.indiceSR.errorMargen}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '5px' }}>
                                        Estado: <span style={{ fontWeight: 'bold', color: rawResult.frontendData.diagnosticoAvanzado.indiceSR.SR < 15 ? '#dc2626' : '#F2D34E' }}>
                                            {rawResult.frontendData.diagnosticoAvanzado.indiceSR.estado}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ borderLeft: '3px solid #dc2626', paddingLeft: '15px' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase' }}>Variable Restrictiva (Cuello de Botella)</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', marginTop: '5px' }}>
                                        {rawResult.frontendData.diagnosticoAvanzado.variableCritica.variable}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '5px' }}>
                                        Nivel de Rigidez: {rawResult.frontendData.diagnosticoAvanzado.variableCritica.rigidez}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* 2. INYECCIÓN DEL MOTOR DE FLUIDOS 3D AQUÍ */}
                    {rawResult && rawResult.results && rawResult.results.grobnerBase && !isProcessing && (
                        <div style={{ marginBottom: '20px' }}>
                            <DynamicFluid3D 
                                grobnerOutput={rawResult.results.grobnerBase} 
                                viabilidadMax={30} // Esto lo podés linkear a tu ángulo de GeometricConnector
                            />
                        </div>
                    )}

                    <pre className="json-output">
                        <code>{outputJSON}</code>
                    </pre>

                    {resilienceReport && (
                        <div className="resilience-report">
                            {/* ... (Tu tabla de resiliencia intacta) ... */}
                            <h3 className="resilience-title">
                                <ion-icon name="warning-outline"></ion-icon> Reporte de Resiliencia Estructural
                            </h3>
                            <div className="table-responsive">
                                <table className="resilience-table">
                                    <thead>
                                        <tr>
                                            <th>Escenario Macro</th>
                                            <th>Ruido en Variables</th>
                                            <th>Índice S_R</th>
                                            <th>Conectividad</th>
                                            <th>Diagnóstico</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resilienceReport.map((row, idx) => (
                                            <tr key={idx} className={row.estado === 'Colapso' || row.estado === 'COLAPSO ESTRUCTURAL' ? 'row-colapso' : ''}>
                                                <td>Fase {row.nivel + 1}</td>
                                                <td style={{ fontWeight: 'bold', color: '#dc2626' }}>± {row.ruidoMacro}</td>
                                                <td style={{ fontWeight: 'bold', color: '#F2D34E' }}>{row.sr} pts</td>
                                                <td>{row.conectividad}%</td>
                                                <td style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                    {row.estado}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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