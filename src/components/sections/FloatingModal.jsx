import React, { useState } from 'react';

export default function FloatingModal({ isOpen, onClose, astData, onEjecutarCore }) {
    const [posicion, setPosicion] = useState({ x: 50, y: 50 });
    const [arrastrando, setArrastrando] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    if (!isOpen) return null;

    const iniciarArrastre = (e) => {
        setArrastrando(true);
        setOffset({
            x: e.clientX - posicion.x,
            y: e.clientY - posicion.y
        });
    };

    const enArrastre = (e) => {
        if (!arrastrando) return;
        setPosicion({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y
        });
    };

    const finArrastre = () => setArrastrando(false);

    return (
        <div 
            style={{
                position: 'fixed', left: posicion.x, top: posicion.y,
                width: '600px', backgroundColor: '#1e293b', border: '1px solid #3b82f6',
                borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                zIndex: 9999, color: 'white', display: 'flex', flexDirection: 'column',
                opacity: arrastrando ? 0.9 : 1
            }}
            onMouseMove={enArrastre}
            onMouseUp={finArrastre}
            onMouseLeave={finArrastre}
        >
            {/* Cabecera Arrastrable */}
            <div 
                onMouseDown={iniciarArrastre}
                style={{
                    padding: '10px 15px', backgroundColor: '#0f172a', borderBottom: '1px solid #334155',
                    cursor: 'grab', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderTopLeftRadius: '8px', borderTopRightRadius: '8px'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '10px', height: '10px', backgroundColor: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 10px #3b82f6' }}></div>
                    <span style={{ fontWeight: 'bold', letterSpacing: '1px', fontSize: '12px' }}>TERMINAL ROMIMATH :: LINK ESTABLECIDO</span>
                </div>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
            </div>

            {/* Cuerpo del Modal */}
            <div style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
                <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '15px' }}>
                    Se ha extraído la matriz y se ha convertido a un AST (Abstract Syntax Tree) listo para inyectarse en el núcleo de Gröbner.
                </p>
                
                <pre style={{ 
                    backgroundColor: '#000', padding: '15px', borderRadius: '5px', 
                    fontSize: '12px', color: '#10b981', overflowX: 'auto', border: '1px solid #333'
                }}>
                    {JSON.stringify(astData, null, 2)}
                </pre>
            </div>

            {/* Pie con Acciones */}
            <div style={{ padding: '15px', backgroundColor: '#0f172a', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
                <button onClick={onClose} style={{ padding: '8px 15px', background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', borderRadius: '4px', cursor: 'pointer' }}>
                    Cancelar
                </button>
                <button 
                    onClick={onEjecutarCore}
                    style={{ padding: '8px 20px', background: '#3b82f6', border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)' }}
                >
                    Ejecutar Gröbner
                </button>
            </div>
        </div>
    );
}