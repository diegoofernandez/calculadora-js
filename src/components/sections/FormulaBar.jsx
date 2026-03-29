import React from 'react';

export const FormulaBar = ({ activeCell, handleFormulaChange }) => (
  <div style={{ padding: '4px 20px', background: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #334155' }}>
    <span style={{ color: 'var(--color-texto-muted)', fontSize: '11px', width: '30px', textAlign: 'center', background: '#1e293b', padding: '2px 0', borderRadius: '3px' }}>
      {activeCell.colId ? `${activeCell.colId}${activeCell.rowIndex + 1}` : ''}
    </span>
    <span style={{ color: 'var(--color-primario)', fontStyle: 'italic', fontWeight: '900', fontSize: '14px' }}>ƒx</span>
    <input 
      type="text" value={activeCell.value || ''} onChange={handleFormulaChange}
      style={{ flex: 1, background: 'transparent', border: 'none', color: '#f8fafc', padding: '4px', fontFamily: 'monospace', outline: 'none', fontSize: '13px' }}
    />
  </div>
);