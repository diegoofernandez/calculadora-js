import React from 'react';
import Plot from 'react-plotly.js';

export const ModalJacobiano = ({ isOpen, onClose, matrizJacobiana, datosSuperficie, ejeX, ejeY, puntoCritico, diagnostico }) => {
    if (!isOpen) return null;

    // Estilos crudos tipo "Terminal / Radar de Élite"
    const overlayStyle = {
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 9999,
        display: 'flex', justifyContent: 'center', alignItems: 'center'
    };

    const modalStyle = {
        backgroundColor: '#121212', border: '1px solid #ff3333', borderRadius: '8px',
        width: '90%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto',
        padding: '20px', color: '#e0e0e0', fontFamily: 'monospace',
        boxShadow: '0 0 20px rgba(255, 51, 51, 0.2)'
    };

    const titleStyle = {
        color: '#ff3333', borderBottom: '1px solid #333', paddingBottom: '10px',
        textTransform: 'uppercase', letterSpacing: '2px', marginTop: 0
    };

    const sectionStyle = {
        backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '4px',
        marginBottom: '20px', borderLeft: '3px solid #ff3333'
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={titleStyle}>Radar de Singularidades: Límite Estructural</h2>
                    <button 
                        onClick={onClose} 
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#ff3333', fontSize: '24px', cursor: 'pointer' }}
                    >
                        &times;
                    </button>
                </div>

                {/* SECCIÓN 1: El Abismo 3D (Plotly) */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Plot
                        data={[
                            // Capa 1: La Superficie Estructural
                            {
                                z: datosSuperficie,
                                x: ejeX, // Le pasamos los números reales (-10 a 10)
                                y: ejeY,
                                type: 'surface',
                                colorscale: 'RdBu',
                                reversescale: true,
                                contours: { z: { show: true, usecolormap: true, project: { z: true } } }
                            },
                            // Capa 2: EL LÁSER ROJO (Francotirador)
                            puntoCritico ? {
                                x: [puntoCritico.x],
                                y: [puntoCritico.y],
                                z: [puntoCritico.z],
                                type: 'scatter3d',
                                mode: 'markers+text',
                                text: ['💥 RUPTURA'],
                                textposition: 'top center',
                                textfont: { color: '#ff3333', size: 14, weight: 'bold' },
                                marker: {
                                    size: 10,
                                    color: '#ff3333',
                                    symbol: 'diamond',
                                    line: { color: 'white', width: 2 }
                                }
                            } : {}
                        ]}
                        layout={{
                            width: 800, height: 500,
                            paper_bgcolor: 'transparent',
                            plot_bgcolor: 'transparent',
                            font: { color: '#e0e0e0', family: 'monospace' },
                            scene: {
                                xaxis: { title: 'Variable X', gridcolor: '#333' },
                                yaxis: { title: 'Variable Y', gridcolor: '#333' },
                                zaxis: { title: 'Determinante |J|', gridcolor: '#333' },
                                camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } }
                            },
                            margin: { l: 0, r: 0, b: 0, t: 0 },
                            showlegend: false
                        }}
                        config={{ responsive: true, displayModeBar: false }}
                    />
                </div>

                {/* SECCIÓN 2: Matemática de Élite (La Matriz Cruda) */}
                <div style={sectionStyle}>
                    <h3 style={{ color: '#aaa', marginTop: 0 }}>/// Matriz Jacobiana Exacta</h3>
                    <pre style={{ color: '#00ffcc', fontSize: '14px', overflowX: 'auto' }}>
                        {matrizJacobiana ? JSON.stringify(matrizJacobiana, null, 2) : "// Calculando derivadas..."}
                    </pre>
                </div>

                {/* SECCIÓN 3: La Traducción de Calle (Diagnóstico) */}
                <div style={{ ...sectionStyle, borderLeftColor: '#ffaa00' }}>
                    <h3 style={{ color: '#ffaa00', marginTop: 0 }}>/// Veredicto Estructural</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
                        {diagnostico || "El motor detectó una caída drástica en el determinante del Jacobiano. Matemáticamente, estás operando en el borde de un acantilado. Una mínima variación en la fricción hará colapsar tu estructura."}
                    </p>
                </div>

            </div>
        </div>
    );
};