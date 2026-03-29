import React from 'react';

export const RibbonMenu = ({ applyStyle, rellenarAbajo }) => (
  <div style={{ background: 'var(--color-bg-panel)', borderBottom: '1px solid var(--color-border)' }}>
    <div style={{ display: 'flex', gap: '20px', padding: '5px 20px', fontSize: '12px', borderBottom: '1px solid #334155' }}>
      <span style={{ color: 'var(--color-primario)', fontWeight: 'bold', cursor: 'pointer', borderBottom: '2px solid var(--color-primario)', paddingBottom: '4px' }}>Inicio</span>
      <span style={{ color: 'var(--color-texto-muted)', cursor: 'pointer' }}>Análisis Estructural</span>
    </div>
    
    <div style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
      <select onChange={(e) => applyStyle('fontFamily', e.target.value)} style={{ background: '#0f172a', color: 'white', border: '1px solid var(--color-border)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
        <option value="Space Grotesk">Space Grotesk</option>
        <option value="Arial">Arial</option>
        <option value="Courier New">Courier New</option>
      </select>
      
      <div style={{ display: 'flex', gap: '5px' }}>
        <button onClick={() => applyStyle('fontWeight', 'bold')} className="action-btn" style={{ fontWeight: 'bold' }}>B</button>
        <button onClick={() => applyStyle('fontStyle', 'italic')} className="action-btn" style={{ fontStyle: 'italic' }}>I</button>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', paddingRight: '15px', borderRight: '1px solid var(--color-border)' }}>
        <span style={{ color: 'var(--color-texto-muted)', fontSize: '11px' }}>A</span>
        <input type="color" onChange={(e) => applyStyle('color', e.target.value)} style={{ width: '22px', height: '22px', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }} title="Color de texto" />
        <span style={{ color: 'var(--color-texto-muted)', fontSize: '11px', marginLeft: '5px' }}>fondo</span>
        <input type="color" onChange={(e) => applyStyle('backgroundColor', e.target.value)} style={{ width: '22px', height: '22px', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }} title="Color de fondo" />
      </div>

      <div style={{ display: 'flex', gap: '5px' }}>
        <button onClick={() => applyStyle('formatType', 'currency')} className="action-btn" style={{ color: 'var(--color-exito)', fontWeight: 'bold' }} title="Formato Moneda">$</button>
        <button onClick={() => applyStyle('formatType', 'percent')} className="action-btn" style={{ color: 'var(--color-primario)', fontWeight: 'bold' }} title="Formato Porcentaje">%</button>
        <button onClick={() => applyStyle('formatType', 'none')} className="action-btn" title="Quitar Formato">123</button>
        
        <button 
          onClick={rellenarAbajo} 
          className="action-btn" 
          style={{ marginLeft: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'var(--color-primario)', color: 'var(--color-primario)' }} 
          title="Extender hacia abajo"
        >
          ↓ Rellenar
        </button>
      </div>
    </div>
  </div>
);