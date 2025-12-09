
import React, { useRef, useEffect, useState } from 'react';

const GraphTab = ({ calculationResult }) => {
    const canvasRef = useRef(null);
    const [colors, setColors] = useState({
        primary: '#2272FF',
        contrast: '#F2D34E'
    });

    useEffect(() => {
        // Obtener colores CSS
        const getCssVariable = (variable) => {
            return getComputedStyle(document.documentElement)
                .getPropertyValue(variable)
                .trim();
        };

        try {
            const primary = getCssVariable('--color-primario') || '#2272FF';
            const contrast = getCssVariable('--color-contraste') || '#F2D34E';
            setColors({ primary, contrast });
        } catch (e) {
            console.log("Usando colores por defecto");
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        drawGraph(ctx);
    }, [calculationResult, colors]);

    const drawGraph = (ctx) => {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        
        // Clear canvas
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= width; x += width / 10) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= height; y += height / 10) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw axes
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        
        // Draw axes labels
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText('x', width - 10, height / 2 - 10);
        ctx.fillText('y', width / 2 + 10, 20);
        
        // Draw example polynomial: x² + y² = 1 (circle)
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.3;
        
        for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            if (angle === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.closePath();
        ctx.stroke();
        
        // Draw second polynomial: xy = 0.5 (hyperbola)
        ctx.strokeStyle = colors.contrast;
        ctx.beginPath();
        
        for (let x = -2; x <= 2; x += 0.01) {
            if (Math.abs(x) < 0.01) continue;
            const y = 0.5 / x;
            
            const plotX = centerX + x * (radius / 2);
            const plotY = centerY - y * (radius / 2);
            
            if (x === -2) {
                ctx.moveTo(plotX, plotY);
            } else {
                ctx.lineTo(plotX, plotY);
            }
        }
        
        ctx.stroke();
        
        // Mark intersection points
        ctx.fillStyle = '#ff0000';
        const intersections = [
            { x: 0.707, y: 0.707 },
            { x: -0.707, y: -0.707 }
        ];
        
        intersections.forEach(point => {
            const plotX = centerX + point.x * (radius / 2);
            const plotY = centerY - point.y * (radius / 2);
            
            ctx.beginPath();
            ctx.arc(plotX, plotY, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    };

    const handleRefresh = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            drawGraph(ctx);
        }
    };

    return (
        <div className="graph-container">
            <div className="graph-header">
                <h3>
                    <ion-icon name="stats-chart-outline"></ion-icon>
                    VISUALIZACIÓN DE BASE DE GRÖBNER
                </h3>
                <div className="graph-controls">
                    <button className="graph-btn" onClick={handleRefresh}>
                        <ion-icon name="refresh-outline"></ion-icon> Actualizar
                    </button>
                    <button className="graph-btn">
                        <ion-icon name="download-outline"></ion-icon> Exportar
                    </button>
                </div>
            </div>
            
            <div className="graph-content">
                <div className="canvas-container">
                    <canvas 
                        ref={canvasRef}
                        width={800}
                        height={500}
                        className="algebra-canvas"
                    />
                </div>
                
                <div className="graph-info">
                    <div className="info-panel">
                        <h4>📊 INFORMACIÓN DEL GRÁFICO</h4>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Sistema:</span>
                                <span className="info-value">
                                    x² + y² = 1<br />
                                    xy = 0.5
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Intersecciones:</span>
                                <span className="info-value">
                                    (0.707, 0.707)<br />
                                    (-0.707, -0.707)
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Campo:</span>
                                <span className="info-value">ℝ (Reales)</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="legend">
                        <h4>🎨 LEYENDA</h4>
                        <div className="legend-items">
                            <div className="legend-item">
                                <div className="legend-color" style={{backgroundColor: colors.primary}}></div>
                                <span>Circunferencia: x² + y² = 1</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color" style={{backgroundColor: colors.contrast}}></div>
                                <span>Hipérbola: xy = 0.5</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color" style={{backgroundColor: '#ff0000'}}></div>
                                <span>Puntos de intersección</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GraphTab;