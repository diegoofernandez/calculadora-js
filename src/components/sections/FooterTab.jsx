import React from 'react';

export const FooterTabs = ({ hojas, hojaActiva, setHojaActiva, zoom, setZoom, agregarHoja, renombrarHoja }) => (
  <div style={{ background: '#1e293b', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px', height: '35px' }}>
    <div style={{ display: 'flex', overflowX: 'auto' }}>
      <button onClick={agregarHoja} style={{ background: 'transparent', border: 'none', color: 'var(--color-texto-muted)', padding: '0 15px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>+</button>
      {hojas.map((hoja, i) => (
        <button key={i} onClick={() => setHojaActiva(i)} onDoubleClick={() => { const nn = window.prompt("Renombrar hoja:", hoja.nombre); if(nn) renombrarHoja(i, nn); }}
          style={{ background: hojaActiva === i ? '#0f172a' : 'transparent', color: hojaActiva === i ? 'var(--color-primario)' : 'var(--color-texto-muted)', border: 'none', padding: '0 20px', height: '35px', fontWeight: hojaActiva === i ? 'bold' : 'normal', borderBottom: hojaActiva === i ? '2px solid var(--color-primario)' : 'none', cursor: 'pointer', fontSize: '12px', userSelect: 'none' }}>
          {hoja.nombre}
        </button>
      ))}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-texto-muted)', fontSize: '12px' }}>
      <button onClick={() => setZoom(z => Math.max(50, z - 10))} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>-</button>
      <span style={{ width: '40px', textAlign: 'center' }}>{zoom}%</span>
      <button onClick={() => setZoom(z => Math.min(200, z + 10))} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>+</button>
    </div>
  </div>
);