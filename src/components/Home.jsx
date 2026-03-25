import { useState, useRef, useEffect } from 'react';
import FacadeDriver from '../engine/FacadeDriver';
import AproximationEngine from '../engine/AproximationEngine';  
import { CalculadorDiferencial } from '../engine/CalculadorDiferencial'; // Ajustá la ruta si hace falta
import { ModalJacobiano } from './ModalJacobiano';
import Modal from './Modal';  
// 1. Importamos el nuevo motor visual 3D
import { DynamicFluid3D } from './DynamicFluid3D'; 
import ManifoldModal from './ManifoldModal';
import {SimuladorEstructural} from '../engine/SimuladorEstructural'; 

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

    // NUEVOS ESTADOS PARA LAS 500 SIMULACIONES:
    const [ejecutandoLote, setEjecutandoLote] = useState(false);
    const [progresoLote, setProgresoLote] = useState({ porcentaje: 0, mensaje: '' });
    const [resilienceReport, setResilienceReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rawResult, setRawResult] = useState(null);
    const [inputJSON, setInputJSON] = useState(defaultInput);
    const [outputJSON, setOutputJSON] = useState('{}');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [isManifoldOpen, setIsManifoldOpen] = useState(false);
    const [isJacobianoOpen, setIsJacobianoOpen] = useState(false);
    const [datosJacobiano, setDatosJacobiano] = useState({ matriz: null, superficie: [], diagnostico: "" });

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

            // ACÁ EL MOTOR INTERCEPTA LAS 500 SIMULACIONES
            if (inputData[0]?.[0]?.correr_escenarios_estructurales) {
                setEjecutandoLote(true); 
                const variablesDinamicas = extraerVariablesDinamicas(inputData);
                
                await SimuladorEstructural.ejecutar500Escenarios(
                    inputData, 
                    variablesDinamicas, 
                    (mensaje, porcentaje) => setProgresoLote({ porcentaje, mensaje })
                );
                
                setEjecutandoLote(false);
                setIsProcessing(false);
                return; 
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

    const runDifferentialAnalysis = () => {
        try {
            const inputData = JSON.parse(inputJSON);
            // Aislar solo los polinomios (ignoramos el objeto de configuración en la posición 0)
            const polinomios = inputData.slice(1);
            const variables = extraerVariablesDinamicas(inputData);

            if (variables.length < 2) {
                alert("El motor élite requiere al menos 2 variables acopladas para generar el mapa topológico diferencial.");
                return;
            }

            // 1. CALCULO MATEMÁTICO PURO (Matriz Exacta)
            const matrizJ = CalculadorDiferencial.calcularJacobiano(polinomios, variables);

            // 2. GENERACIÓN DEL ABISMO TOPOLÓGICO PARA PLOTLY
           // 2. BARRIDO TOPOLÓGICO REAL (El Escáner Determinista y el Francotirador)
            const varX = variables[0];
            const varY = variables[1] || variables[0]; 
            
            const puntoBase = {};
            variables.forEach(v => puntoBase[v] = 1);

            const resolucion = 40; 
            const rangoMin = -10;  
            const rangoMax = 10;
            const paso = (rangoMax - rangoMin) / resolucion;

            const Z = [];
            const ejeX = [];
            const ejeY = [];
            
            // Variables para el Francotirador (Punto más cercano a 0)
            let minDetAbs = Infinity;
            let puntoCritico = { x: 0, y: 0, z: 0 };

            for (let i = 0; i < resolucion; i++) {
                const filaZ = [];
                const valY = rangoMin + (i * paso); 
                ejeY.push(valY); // Guardamos el eje real para Plotly
                
                for (let j = 0; j < resolucion; j++) {
                    const valX = rangoMin + (j * paso); 
                    if (i === 0) ejeX.push(valX); // Guardamos el eje real solo en la primera pasada
                    
                    const puntoActual = { ...puntoBase, [varX]: valX, [varY]: valY };
                    
                    const matrizNumerica = CalculadorDiferencial.evaluarJacobiano(matrizJ, puntoActual);
                    const determinante = CalculadorDiferencial.calcularDeterminante(matrizNumerica);
                    
                    filaZ.push(determinante);

                    // EL FRANCOTIRADOR: Si este punto está más cerca de 0 (el abismo), lo memorizamos
                    if (Math.abs(determinante) < minDetAbs) {
                        minDetAbs = Math.abs(determinante);
                        puntoCritico = { x: valX, y: valY, z: determinante };
                    }
                }
                Z.push(filaZ);
            }

            // 3. CARGAMOS EL DIAGNÓSTICO CON COORDENADAS EXACTAS
            setDatosJacobiano({
                matriz: matrizJ,
                superficie: Z,
                ejeX: ejeX,   // Inyectamos Eje X real
                ejeY: ejeY,   // Inyectamos Eje Y real
                puntoCritico: puntoCritico, // Inyectamos la coordenada del láser
                diagnostico: `SINGULARIDAD DETECTADA EN (${varX}: ${puntoCritico.x.toFixed(2)}, ${varY}: ${puntoCritico.y.toFixed(2)}). El análisis diferencial muestra un punto de curvatura extrema. Si tu negocio llega a estas variables exactas, la estructura matemática se rompe.`
            });

            setIsJacobianoOpen(true);

        } catch (e) {
            console.error(e);
            alert("Error al calcular el Jacobiano: " + e.message);
        }
    };

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
            <div className="romi-app">
            
            {/* === CABECERA CORPORATIVA Y REDES === */}
            <header className="romi-header">
                <div className="romi-brand">
                    <ion-icon name="cube-outline" style={{marginRight: '8px'}}></ion-icon>
                    ROMI MATH
                    <span className="romi-badge">ENGINE v1.0</span>
                </div>
                <a href="https://romimath.site/auditoria"><button>Auditoría</button></a>
                <div className="romi-socials">
                    <a href="https://tiktok.com/@romimath.vt" target="_blank" rel="noreferrer" className="romi-social-link">
                        <ion-icon name="logo-tiktok"></ion-icon>
                    </a>
                    <a href="https://www.youtube.com/@RomiMath-Motoralgebraico" target="_blank" rel="noreferrer" className="romi-social-link">
                        <ion-icon name="logo-youtube"></ion-icon>
                    </a>
                    <a href="https://github.com/diegoofernandez" target="_blank" rel="noreferrer" className="romi-social-link">
                        <ion-icon name="logo-github"></ion-icon>
                    </a>
                    <a href="https://romimath.site/blog" target="_blank" rel="noreferrer" className="romi-social-link">
                        <ion-icon name="globe-outline"></ion-icon>
                    </a>
                </div>
            </header>

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
                        {rawResult && !isProcessing && (
                    <button 
                        className="action-btn btn-manifold" 
                        onClick={() => setIsManifoldOpen(true)}
                    >
                        <ion-icon name="planet-outline" style={{marginRight: '8px', fontSize: '1.2rem'}}></ion-icon>
                        EXPLORAR UNIVERSO DE SOLUCIONES (3D)
                    </button>

                )}
                        <button 
                            className="action-btn btn-jacobiano" 
                            onClick={runDifferentialAnalysis}
                        >
                            <ion-icon name="nuclear-outline" style={{marginRight: '8px', fontSize: '1.2rem'}}></ion-icon>
                            Radar de Singularidades (Jacobiano)
                        </button>
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
                            textAlign: 'left',
                            borderRadius: '8px'
                        }}>
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
                    
                    {/* INYECCIÓN DEL MOTOR DE FLUIDOS 3D AQUÍ */}
                    {rawResult && rawResult.results && rawResult.results.grobnerBase && !isProcessing && (
                        <div style={{ marginBottom: '20px' }}>
                            <DynamicFluid3D 
                                grobnerOutput={rawResult.results.grobnerBase} 
                                viabilidadMax={30} 
                            />
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

            {/* MODALES FUERA DEL FLUJO PRINCIPAL */}
            {rawResult && (
                <ManifoldModal 
                    isOpen={isManifoldOpen}
                    onClose={() => setIsManifoldOpen(false)}
                    vectors={rawResult.results.simulationVectors}
                    variables={rawResult.results.variables || ['x', 'y', 'z']}
                    srIndex={rawResult.frontendData.diagnosticoAvanzado?.indiceSR?.SR || 0}
                    sobolData={rawResult.frontendData.analisisSobol || []}
                    algebraicBase={rawResult.frontendData.algebraicAnalysis.basePolynomials}
                    geometricMetrics={{
                        connectivity: rawResult.results.geometricProperties.connectivityRate * 100,
                        avgDistance: rawResult.results.geometricProperties.averageDistance
                    }}
                />
            )}

            <ModalJacobiano 
                isOpen={isJacobianoOpen}
                onClose={() => setIsJacobianoOpen(false)}
                matrizJacobiana={datosJacobiano.matriz}
                datosSuperficie={datosJacobiano.superficie}
                ejeX={datosJacobiano.ejeX}
                ejeY={datosJacobiano.ejeY}
                puntoCritico={datosJacobiano.puntoCritico}
                diagnostico={datosJacobiano.diagnostico}
            />

            {ejecutandoLote && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', zIndex: 99999,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    fontFamily: 'monospace', color: '#10b981'
                }}>
                    <div style={{ width: '600px', background: '#000', padding: '30px', borderRadius: '8px', border: '1px solid #10b981', boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)' }}>
                        <h2 style={{ margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '2px', color: '#fff' }}>
                            <span style={{color: '#F2D34E'}}>⚡</span> ROMI MATH | Inteligencia Estructural
                        </h2>
                        <div style={{ marginBottom: '20px', fontSize: '16px', color: '#888' }}>
                            Ejecutando Análisis de Montecarlo y Ablación Topológica...
                        </div>
                        <div style={{ width: '100%', height: '10px', background: '#333', borderRadius: '5px', overflow: 'hidden', marginBottom: '15px' }}>
                            <div style={{ width: `${progresoLote.porcentaje}%`, height: '100%', background: '#10b981', transition: 'width 0.2s ease-out' }}></div>
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                            > {progresoLote.mensaje} <span style={{ animation: 'blink 1s infinite' }}>_</span>
                        </div>
                        <div style={{ marginTop: '20px', fontSize: '12px', color: '#555' }}>
                            Generando archivo Excel (.xlsx) de grado consultoría... No cierre la ventana.
                        </div>
                    </div>
                    <style>{`@keyframes blink { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 0; } }`}</style>
                </div>
            )}

        </div>
        </>
    )
}

export default Home;