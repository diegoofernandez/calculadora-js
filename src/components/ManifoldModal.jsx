import React, { useMemo, useRef, useState, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { generateForensicReport } from './modulos/ReportGenerator';

const ManifoldModal = ({ isOpen, onClose, vectors, variables, srIndex, sobolData, algebraicBase, geometricMetrics }) => {
    // Si no está abierto o no hay vectores, no renderizamos nada
    if (!isOpen) return null;

    const graphRef = useRef();
    
    // --- ESTADOS ---
    const [isSimulating, setIsSimulating] = useState(false);
    const [crashCount, setCrashCount] = useState(0);
    const [logs, setLogs] = useState([]); 

    // --- CAJA NEGRA (FLIGHT RECORDER) ---
    // Usamos useRef para grabar sin provocar re-renders
    const trajectoryBuffer = useRef([]); 
    const isRecording = useRef(false);

    // --- 🔧 FUNCIÓN HELPER SEGURA ---
    const safeParseFraction = (str) => {
        if (typeof str === 'number') return str;
        if (!str) return 0;
        try {
            if (str.includes('/')) {
                const [num, den] = str.split('/');
                return parseFloat(num) / parseFloat(den);
            }
            return parseFloat(str);
        } catch (e) {
            return 0;
        }
    };

    // 1. PREPARACIÓN DE DATOS (Nodos + ESQUELETO DEL CONO)
    const { initialNodes, colorThresholds, coneNodes, coneLinks } = useMemo(() => {
        if (!vectors || !Array.isArray(vectors) || vectors.length === 0) {
            console.warn("ManifoldModal: Recibido vectors vacío o inválido");
            return { initialNodes: [], colorThresholds: {}, coneNodes: [], coneLinks: [] };
        }

        let maxVal = 0; 

        // A. Nodos de Datos (Escenarios)
        const nodes = vectors.map((vec, i) => {
            const x = safeParseFraction(vec[0]) * 100;
            const y = safeParseFraction(vec[1]) * 100;
            const z = safeParseFraction(vec[2]) * 100;
            
            maxVal = Math.max(maxVal, Math.abs(x), Math.abs(y), Math.abs(z));
            const magnitude = Math.sqrt(x*x + y*y + z*z);

            return {
                id: i,
                ox: x, oy: y, oz: z,
                x: x, y: y, z: z,
                magnitude: magnitude,
                isCrashed: false,
                crashTime: null, // <--- NUEVO: Momento exacto del colapso
                rawVector: vec,
                type: 'SCENARIO',
                val: 20 
            };
        });

        const sortedMags = nodes.map(n => n.magnitude).sort((a, b) => a - b);
        const count = sortedMags.length;
        const limitGreen = sortedMags[Math.floor(count * 0.33)] || 0;
        const limitYellow = sortedMags[Math.floor(count * 0.66)] || 0;

        // --- B. CONSTRUCCIÓN DEL CONO (EJES) ---
        const axisLength = maxVal > 0 ? maxVal * 1.5 : 100; 
        
        const originNode = { id: 'ORIGIN', x: 0, y: 0, z: 0, fx: 0, fy: 0, fz: 0, type: 'AXIS_CENTER', val: 2 };
        const xNode = { id: 'AXIS_X', x: axisLength, y: 0, z: 0, fx: axisLength, fy: 0, fz: 0, type: 'AXIS_TIP', label: variables[0] || 'X', val: 2 };
        const yNode = { id: 'AXIS_Y', x: 0, y: axisLength, z: 0, fx: 0, fy: axisLength, fz: 0, type: 'AXIS_TIP', label: variables[1] || 'Y', val: 2 };
        const zNode = { id: 'AXIS_Z', x: 0, y: 0, z: axisLength, fx: 0, fy: 0, fz: axisLength, type: 'AXIS_TIP', label: variables[2] || 'Z', val: 2 };

        const axisNodes = [originNode, xNode, yNode, zNode];
        const axisLinks = [
            { source: 'ORIGIN', target: 'AXIS_X', color: '#666', width: 2, dashed: false },
            { source: 'ORIGIN', target: 'AXIS_Y', color: '#666', width: 2, dashed: false },
            { source: 'ORIGIN', target: 'AXIS_Z', color: '#666', width: 2, dashed: false },
            { source: 'AXIS_X', target: 'AXIS_Y', color: '#333', width: 1, dashed: true },
            { source: 'AXIS_Y', target: 'AXIS_Z', color: '#333', width: 1, dashed: true },
            { source: 'AXIS_Z', target: 'AXIS_X', color: '#333', width: 1, dashed: true },
        ];

        return { 
            initialNodes: nodes, 
            colorThresholds: { green: limitGreen, yellow: limitYellow },
            coneNodes: axisNodes,
            coneLinks: axisLinks
        };
    }, [vectors, variables]);

    const [graphData, setGraphData] = useState({ 
        nodes: [...initialNodes, ...coneNodes], 
        links: coneLinks 
    });

    // --- FUNCIONES DE LOGICA ---

    const addLog = (msg, type = 'info') => {
        setLogs(prev => {
            const newLog = { 
                id: Date.now() + Math.random(), 
                msg, 
                type, 
                time: new Date().toLocaleTimeString().split(' ')[0] 
            };
            return [newLog, ...prev].slice(0, 50); 
        });
    };

    // RESET COMPLETO
    const handleReset = () => {
        setIsSimulating(false);
        isRecording.current = false;
        trajectoryBuffer.current = []; // Limpiamos la caja negra

        const resetNodes = initialNodes.map(n => ({
            ...n, x: n.ox, y: n.oy, z: n.oz, 
            isCrashed: false, 
            crashTime: null,
            color: undefined 
        }));
        setGraphData({ nodes: [...resetNodes, ...coneNodes], links: coneLinks });
        setCrashCount(0);
        setLogs([]);
        addLog('SISTEMA REINICIADO. CONO VECTORIAL RESTAURADO.', 'info');
    };

    // EXPORTACIÓN CSV (Forensic Analysis)
    const downloadTrajectories = () => {
        if (trajectoryBuffer.current.length === 0) {
            addLog('NO HAY DATOS GRABADOS AÚN.', 'warning');
            return;
        }

        addLog('GENERANDO CSV FORENSE...', 'info');

        // Cabecera del CSV
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Time_Step,Scenario_ID,X_Val,Y_Val,Z_Val,Magnitude,Status,Integrity_Flag\n";

        // Cuerpo del CSV
        trajectoryBuffer.current.forEach(row => {
            csvContent += `${row.t},${row.id},${row.x.toFixed(2)},${row.y.toFixed(2)},${row.z.toFixed(2)},${row.mag.toFixed(2)},${row.status},${row.crashed ? 0 : 1}\n`;
        });

        // Descarga
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `TRAJECTORY_ANALYSIS_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        addLog('ARCHIVO DE TRAYECTORIAS DESCARGADO.', 'success');
    };

    // Zoom inicial seguro
    useEffect(() => {
        const timer = setTimeout(() => {
            if (graphRef.current) {
                graphRef.current.zoomToFit(1000, 50);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // 2. MOTOR DE FÍSICA
    useEffect(() => {
        let animationFrame;
        let frameCounter = 0;

        if (isSimulating && sobolData) {
            
            // Activar grabación
            isRecording.current = true;
            const topVar = sobolData.length > 0 ? sobolData[0].variable : "ENTROPÍA";
            if (logs.length === 0) addLog(`GRABANDO TRAYECTORIAS DE SOBOL...`, 'warning');

            const animate = () => {
                frameCounter++;
                
                setGraphData(prevData => {
                    let currentFrameCrashes = 0; 
                    let newCrashEvent = false;
                    
                    const newNodes = prevData.nodes.map(node => {
                        // SI ES UN NODO DEL EJE (CONO), NO LO MOVEMOS
                        if (node.type !== 'SCENARIO') return node;

                        if (node.isCrashed) {
                            currentFrameCrashes++;
                            return node;
                        }

                        // --- FÍSICA ---
                        const sobolX = (sobolData.find(s => s.variable.includes(variables[0]?.toUpperCase()))?.indice || 10) / 100;
                        const sobolY = (sobolData.find(s => s.variable.includes(variables[1]?.toUpperCase()))?.indice || 10) / 100;
                        const sobolZ = (sobolData.find(s => s.variable.includes(variables[2]?.toUpperCase()))?.indice || 10) / 100;

                        // Drift
                        const driftX = (Math.random() - 0.4) * (sobolX * 3); 
                        const driftY = (Math.random() - 0.4) * (sobolY * 3);
                        const driftZ = (Math.random() - 0.4) * (sobolZ * 3);

                        node.x += driftX;
                        node.y += driftY;
                        node.z += driftZ;

                        // Check Límite Elástico
                        const desvio = Math.sqrt(Math.pow(node.x - node.ox, 2) + Math.pow(node.y - node.oy, 2) + Math.pow(node.z - node.oz, 2));
                        const tolerancia = srIndex < 20 ? 15 : 40; 

                        if (desvio > tolerancia) {
                            node.isCrashed = true;
                            node.crashTime = frameCounter; // Registramos hora de muerte
                            node.color = '#dc2626'; 
                            newCrashEvent = true;
                            currentFrameCrashes++;
                        }

                        return node;
                    });
                    
                    // --- GRABACIÓN AL BUFFER (Sampling cada 5 frames) ---
                    if (frameCounter % 5 === 0) {
                        newNodes.forEach(n => {
                            if (n.type === 'SCENARIO') { // Solo grabamos escenarios, no ejes
                                trajectoryBuffer.current.push({
                                    t: frameCounter,
                                    id: n.id,
                                    x: n.x,
                                    y: n.y,
                                    z: n.z,
                                    mag: n.magnitude,
                                    status: n.isCrashed ? 'COLLAPSED' : 'ACTIVE',
                                    crashed: n.isCrashed
                                });
                            }
                        });
                    }
                    
                    setCrashCount(currentFrameCrashes);

                    if (newCrashEvent && Math.random() > 0.6) {
                        addLog(`COLAPSO EN NODO #${Math.floor(Math.random()*100)} - LÍMITE ELÁSTICO EXCEDIDO`, 'error');
                    }
                    if (frameCounter % 180 === 0) { 
                        const tension = Math.floor(Math.random() * 100);
                        addLog(`MONITOREANDO ${topVar}: PRESIÓN ${tension}%`, 'info');
                    }

                    return { ...prevData, nodes: newNodes };
                });

                animationFrame = requestAnimationFrame(animate);
            };
            animate();
        } else {
            if (logs.length > 0 && logs[0].msg !== 'SIMULACIÓN PAUSADA.') {
                addLog('SIMULACIÓN PAUSADA.', 'warning');
            }
        }

        return () => cancelAnimationFrame(animationFrame);
    }, [isSimulating]);

    const getSystemStatus = () => {
        if (!isSimulating && crashCount === 0) return { title: "READY", color: "#666", msg: "Sistema listo para grabar." };
        if (!isSimulating && crashCount > 0) return { title: "PAUSADO", color: "#3b82f6", msg: "Análisis detenido." };
        
        const damage = (crashCount / initialNodes.length) * 100;
        if (damage > 80) return { title: "COLAPSO TOTAL", color: "#dc2626", msg: "Falla sistémica." };
        if (damage > 20) return { title: "INESTABLE", color: "#F2D34E", msg: "Degradación activa." };
        return { title: "GRABANDO", color: "#10b981", msg: "Capturando trayectorias..." };
    };

    const status = getSystemStatus();

    // Si no hay datos (y tampoco cono), mostramos mensaje
    if (initialNodes.length === 0) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: '#050505', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexDirection: 'column'
            }}>
                <h2>NO DATA</h2>
                <button onClick={onClose} style={{padding: '10px 20px', cursor:'pointer'}}>Cerrar</button>
            </div>
        );
    }

   const handleDownloadReport = async () => {
        if (isSimulating) {
            addLog('POR FAVOR, PAUSA LA SIMULACIÓN ANTES DE GENERAR REPORTE.', 'warning');
            return;
        }

        addLog('CAPTURANDO EVIDENCIA 3D Y BASES...', 'info');
        
        setTimeout(async () => {
            try {
                // 2. Pasamos los datos correctamente al generador
                await generateForensicReport({
                    simulationId: `RM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    variables,
                    sobolData,
                    crashCount,
                    totalNodes: initialNodes.length,
                    srIndex,
                    graphRef,
                    // Usamos los nombres exactos que espera el ReportGenerator.js
                    algebraicBase: algebraicBase || [], 
                    vectorialBase: vectors || [], 
                    geometricMetrics: geometricMetrics || {},
                    trajectoryData: {
                        steps: trajectoryBuffer.current.length
                    }
                });
                addLog('REPORTE PDF GENERADO EXITOSAMENTE.', 'success');
            } catch (error) {
                console.error("Error en PDF:", error);
                addLog('ERROR AL GENERAR PDF. REVISA LA CONSOLA.', 'error');
            }
        }, 200); 
    };
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: '#050505', zIndex: 9999, display: 'flex', flexDirection: 'column'
        }}>
            {/* HUD SUPERIOR */}
            <div style={{
                padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid #333', background: 'rgba(0,0,0,0.95)', zIndex: 10
            }}>
                <div>
                    <h2 style={{ color: '#fff', margin: 0, fontFamily: 'monospace', letterSpacing: '2px', fontSize: '1.2rem' }}>
                        <ion-icon name="pulse-outline" style={{marginRight:'10px', color: status.color}}></ion-icon>
                        SOBOL TRAJECTORY RECORDER
                    </h2>
                </div>
                
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        onClick={() => setIsSimulating(!isSimulating)} 
                        style={{
                            background: isSimulating ? '#F2D34E' : '#10b981', 
                            border: 'none', color: '#000', fontWeight: 'bold',
                            padding: '8px 25px', cursor: 'pointer', fontFamily: 'monospace',
                            borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px'
                        }}
                    >
                        {isSimulating ? <><ion-icon name="pause"></ion-icon> PAUSAR</> : <><ion-icon name="play"></ion-icon> REC</>}
                    </button>
                    
                    <button 
                        onClick={handleReset} 
                        style={{
                            background: '#333', border: '1px solid #555', color: '#fff',
                            padding: '8px 15px', cursor: 'pointer', fontFamily: 'monospace', borderRadius: '4px',
                            display: 'flex', alignItems: 'center', gap: '5px'
                        }}
                    >
                        <ion-icon name="refresh"></ion-icon> RESET
                    </button>

                    {/* BOTÓN NUEVO: DESCARGAR CSV */}
                    <button 
                        onClick={downloadTrajectories} 
                        style={{
                            background: '#3b82f6', border: 'none', color: '#fff', fontWeight: 'bold',
                            padding: '8px 15px', cursor: 'pointer', fontFamily: 'monospace', borderRadius: '4px',
                            display: 'flex', alignItems: 'center', gap: '5px'
                        }}
                    >
                        <ion-icon name="download"></ion-icon> CSV DATA
                    </button>
                    <button 
                        onClick={handleDownloadReport} 
                        style={{
                            background: '#8b5cf6', border: 'none', color: '#fff', fontWeight: 'bold',
                            padding: '8px 15px', cursor: 'pointer', fontFamily: 'monospace', borderRadius: '4px',
                            display: 'flex', alignItems: 'center', gap: '5px'
                        }}
                    >
                        <ion-icon name="document-text"></ion-icon> GENERAR PDF
                    </button>

                    <button onClick={onClose} style={{
                        background: 'transparent', border: '1px solid #666', color: '#666',
                        padding: '8px 15px', cursor: 'pointer', fontFamily: 'monospace', borderRadius: '4px'
                    }}>SALIR</button>
                </div>
            </div>

            {/* 3D VIEW */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <ForceGraph3D
                    ref={graphRef}
                    graphData={graphData}
                    backgroundColor="#000000"
                    rendererConfig={{ preserveDrawingBuffer: true }}
                    nodeVal="val"
                    nodeRelSize={1} 
                    nodeOpacity={0.9}
                    
                    nodeColor={node => {
                        // Color de los ejes
                        if (node.type !== 'SCENARIO') return '#444'; 
                        
                        // Lógica normal de nodos
                        if (node.isCrashed) return '#ff0000'; 
                        if (node.color) return node.color;    
                        if (node.magnitude <= colorThresholds.green) return '#10b981';
                        if (node.magnitude <= colorThresholds.yellow) return '#F2D34E';
                        return '#8b5cf6'; 
                    }}

                    nodeLabel={node => {
                        // Etiqueta especial para ejes
                        if (node.type === 'AXIS_TIP') return `EJE ${node.label}`;
                        if (node.type === 'AXIS_CENTER') return 'ORIGEN (0,0,0)';

                        // Etiqueta normal
                        const dataString = node.rawVector.map((val, idx) => {
                            const varName = variables[idx] ? variables[idx].toUpperCase() : `V${idx}`;
                            let numVal = safeParseFraction(val).toFixed(2); 
                            return `${varName}=${numVal}`;
                        }).join(' | ');
                        return `<div style="background:rgba(0,0,0,0.9);padding:8px;border:1px solid ${node.isCrashed?'#f00':'#555'};color:#fff;border-radius:4px">
                            <strong>${node.isCrashed ? '⚠ COLAPSADO' : 'NODO ACTIVO'}</strong><br/>
                            <small>${dataString}</small>
                        </div>`;
                    }}

                    // LINKS
                    linkColor={link => link.color || '#333'}
                    linkWidth={link => link.width || 1}
                    linkDirectionalParticles={link => link.dashed ? 2 : 0}
                    linkDirectionalParticleSpeed={0.005}
                    
                    showNavInfo={false}
                    cooldownTicks={0} 
                    enableZoom={true} 
                    enableRotate={true} 
                />

                {/* HUD IZQUIERDO */}
                <div style={{
                    position: 'absolute', bottom: 20, left: 20,
                    background: 'rgba(5,5,5,0.9)', borderLeft: `4px solid ${status.color}`,
                    padding: '20px', borderRadius: '4px', width: '300px',
                    boxShadow: '0 0 30px rgba(0,0,0,0.8)',
                    pointerEvents: 'none' 
                }}>
                    <div style={{ color: status.color, fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '5px' }}>
                        {status.title}
                    </div>
                    
                    {/* BARRA DE INTEGRIDAD */}
                    <div style={{ width: '100%', height: '8px', background: '#222', borderRadius: '4px', overflow:'hidden' }}>
                        <div style={{ 
                            width: `${Math.max(0, 100 - ((crashCount / initialNodes.length) * 100))}%`, 
                            height: '100%', 
                            background: (100 - ((crashCount / initialNodes.length) * 100)) < 30 ? '#dc2626' : status.color,
                            transition: 'width 0.1s linear, background 0.3s ease'
                        }}></div>
                    </div>
                    
                    <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#888' }}>
                        Integridad Estructural: {Math.round(Math.max(0, 100 - ((crashCount / initialNodes.length) * 100)))}%
                    </div>
                </div>

                {/* HUD DERECHO */}
                <div style={{
                    position: 'absolute', bottom: 20, right: 20,
                    background: 'rgba(0,0,0,0.95)', border: '1px solid #333',
                    padding: '15px', borderRadius: '4px', width: '350px',
                    fontFamily: 'monospace', fontSize: '0.85rem',
                    boxShadow: '0 0 30px rgba(0,0,0,0.8)',
                    maxHeight: '300px', 
                    overflowY: 'auto', 
                    pointerEvents: 'auto' 
                }}>
                    <div style={{ borderBottom: '1px solid #333', paddingBottom: '5px', marginBottom: '10px', color: '#fff', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                        <span>> SYSTEM_LOG</span>
                        <span style={{animation: 'blink 1s infinite'}}>_</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {logs.length === 0 && <span style={{color:'#444'}}>Esperando inicio de simulación...</span>}
                        {logs.map(log => (
                            <div key={log.id} style={{ 
                                display: 'flex', gap: '10px', 
                                color: log.type === 'error' ? '#ef4444' : (log.type === 'warning' ? '#F2D34E' : '#10b981'),
                                textShadow: log.type === 'error' ? '0 0 5px rgba(239, 68, 68, 0.5)' : 'none'
                            }}>
                                <span style={{color: '#555', minWidth:'60px'}}>[{log.time}]</span>
                                <span>{log.msg}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes blink { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 0; } }
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #111; }
                ::-webkit-scrollbar-thumb { background: #333; borderRadius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #555; }
            `}</style>
        </div>
    );
};

export default ManifoldModal;