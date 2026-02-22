import React, { useState, useEffect, useRef, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { GrobnerParser } from '../engine/GrobnerParser';

export const DynamicFluid3D = ({ grobnerOutput, viabilidadMax = 30 }) => {
    const graphRef = useRef();
    const containerRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
    
    // 1. Inicializar Topología base de Gröbner
    const initialData = useMemo(() => {
        if (!grobnerOutput || grobnerOutput.length === 0) return { nodes: [], links: [] };
        return GrobnerParser.parseToTopology(grobnerOutput);
    }, [grobnerOutput]);

    const [graphData, setGraphData] = useState(initialData);
    const [perturbations, setPerturbations] = useState({});

    // 2. Resetear sliders cuando cambia el JSON base y centrar cámara
    useEffect(() => {
        if (initialData.nodes.length > 0) {
            setPerturbations({});
            setTimeout(() => {
                if (graphRef.current) {
                    try {
                        graphRef.current.zoomToFit(1000, 50);
                    } catch (e) { /* Ignorar si no está listo */ }
                }
            }, 1000);
        }
    }, [initialData]);

    // 3. Medir el contenedor dinámicamente para el Canvas 3D
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({ 
                    width: containerRef.current.clientWidth, 
                    height: containerRef.current.clientHeight || 500 
                });
            }
        };
        
        // Medir al cargar
        setTimeout(updateDimensions, 100);
        
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // 4. El Motor Físico (Estrés e Inmutabilidad para React)
    useEffect(() => {
        if (!initialData.nodes.length) return;

        // A. Actualizamos Nodos preservando la identidad para que D3 no los reinicie
        const newNodes = initialData.nodes.map(node => {
            const appliedStress = perturbations[node.id] || 0;
            return { 
                ...node, 
                stress: appliedStress, 
                val: 3 + Math.abs(appliedStress / 5) // El nodo gana masa con la presión
            };
        });

        // B. Actualizamos Filamentos (Tensión diferencial)
        const newLinks = initialData.links.map(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            
            const sourceStress = perturbations[sourceId] || 0;
            const targetStress = perturbations[targetId] || 0;
            
            const tensionDiferencial = Math.abs(sourceStress - targetStress);
            
            return { 
                ...link, 
                source: sourceId, 
                target: targetId,
                isBroken: tensionDiferencial > viabilidadMax,
                tension: tensionDiferencial 
            };
        });

        setGraphData({ nodes: newNodes, links: newLinks });

        // C. Inyección segura de la fuerza física (Evita el "state.layout is undefined")
        setTimeout(() => {
            if (graphRef.current) {
                try {
                    // Fuerza elástica: hilos rotos se sueltan, sanos se estiran
                    graphRef.current.d3Force('link').distance(l => {
                        if (l.isBroken) return 800; 
                        return 40 + (l.tension * 2); 
                    });
                    // Fuerza de repulsión de los nodos
                    graphRef.current.d3Force('charge').strength(-300);
                    
                    // Despertar simulación
                    graphRef.current.d3ReheatSimulation();
                } catch (e) {
                    console.warn("D3 Motor esperando montaje...");
                }
            }
        }, 50); // 50ms son suficientes para que React monte el DOM de D3

    }, [perturbations, viabilidadMax, initialData]);


    const handleSliderChange = (nodeId, value) => {
        setPerturbations(prev => ({ ...prev, [nodeId]: parseFloat(value) }));
    };

    if (!initialData.nodes.length) return null;

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', // <-- Cambiado: Arriba a abajo
            background: '#0a0a0a', 
            color: '#fff', 
            borderRadius: '10px', 
            overflow: 'hidden', 
            border: '1px solid #333',
            marginBottom: '20px'
        }}>
            
            {/* PANEL SUPERIOR: CONSOLA DE MANDOS (Todo el ancho) */}
            <div style={{ 
                width: '100%', 
                padding: '20px', 
                background: '#111', 
                borderBottom: '2px solid #222',
                zIndex: 20 
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ fontFamily: 'monospace', color: '#10b981', margin: 0, fontSize: '16px' }}>
                        PANEL DE INYECCIÓN DE PRESIÓN
                    </h3>
                    <button 
                        onClick={() => {
                            setPerturbations({});
                            if(graphRef.current) graphRef.current.zoomToFit(1000, 50);
                        }}
                        style={{ background: '#333', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold' }}
                    >
                        ⟲ RESTAURAR EQUILIBRIO
                    </button>
                </div>

                {/* Grilla dinámica para los sliders (se acomodan solos al ancho disponible) */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '20px' 
                }}>
                    {initialData.nodes.map(node => (
                        <div key={node.id} style={{ fontFamily: 'monospace', background: '#000', padding: '10px', borderRadius: '5px', border: '1px solid #333' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#ccc', fontWeight: 'bold' }}>Var [{node.id.toUpperCase()}]</span>
                                <span style={{ color: Math.abs(perturbations[node.id]) > (viabilidadMax/1.5) ? '#F2D34E' : '#10b981', fontWeight: 'bold' }}>
                                    {perturbations[node.id] || 0}%
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="-50" 
                                max="50" 
                                step="1"
                                value={perturbations[node.id] || 0}
                                onChange={(e) => handleSliderChange(node.id, e.target.value)}
                                style={{ width: '100%', cursor: 'pointer', accentColor: '#10b981' }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* PANEL INFERIOR: RENDERIZADO 3D (Visor Completo) */}
            <div ref={containerRef} style={{ width: '100%', height: '500px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 10, fontFamily: 'monospace', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '5px', border: '1px solid #333' }}>
                    <div style={{ color: '#10b981', fontWeight: 'bold' }}>ESTADO TOPOLÓGICO: 3D</div>
                    <div style={{ color: '#888', fontSize: '12px', marginTop: '5px' }}>Límite elástico (Ruido S_R): {viabilidadMax}%</div>
                </div>

                <ForceGraph3D
                    ref={graphRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    graphData={graphData}
                    nodeLabel={node => `Variable ${node.id.toUpperCase()} | Presión Local: ${node.stress}%`}
                    nodeColor={node => {
                        if (Math.abs(node.stress) >= viabilidadMax) return '#dc2626'; // Rojo
                        if (Math.abs(node.stress) >= viabilidadMax / 1.5) return '#F2D34E'; // Amarillo
                        return '#10b981'; // Verde
                    }}
                    nodeRelSize={8}
                    linkColor={link => link.isBroken ? 'rgba(220, 38, 38, 0.4)' : 'rgba(16, 185, 129, 0.6)'}
                    linkWidth={link => link.isBroken ? 0.2 : (2 + link.tension * 0.1)}
                    linkDirectionalParticles={link => link.isBroken ? 0 : 3}
                    linkDirectionalParticleSpeed={link => link.tension * 0.002 + 0.005}
                    linkDirectionalParticleWidth={2}
                    backgroundColor="#050505"
                />
            </div>
        </div>
    );
};