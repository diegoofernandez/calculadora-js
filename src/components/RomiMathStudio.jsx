import React, { useState, useRef, useMemo, useEffect } from 'react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { HyperFormula } from 'hyperformula'; 
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([ AllCommunityModule ]);

// ============================================================================
// 1. UTILIDADES: GENERADORES Y TRADUCTORES
// ============================================================================
const colToNum = (letra) => {
  let num = 0;
  for (let i = 0; i < letra.length; i++) {
    num = num * 26 + (letra.charCodeAt(i) - 64);
  }
  return num - 1;
};

const generarColumnasExcel = (cantidad) => {
  const cols = [];
  cols.push({ 
    headerName: '', valueGetter: 'node.rowIndex + 1', pinned: 'left', width: 50, editable: false,
    cellStyle: { background: '#f1f5f9', color: '#475569', fontWeight: 'bold', textAlign: 'center', borderRight: '1px solid rgba(15, 23, 42, 0.08)' }
  });

  for (let i = 0; i < cantidad; i++) {
    let letra = '';
    let temp = i;
    while (temp >= 0) {
      letra = String.fromCharCode((temp % 26) + 65) + letra;
      temp = Math.floor(temp / 26) - 1;
    }
    cols.push({ field: letra, headerName: letra, width: 100 });
  }
  return cols;
};

const generarFilasVacias = (filas, columnas) => {
  const data = [];
  for (let i = 0; i < filas; i++) {
    const row = {};
    for (let c = 0; c < columnas; c++) {
      let letra = String.fromCharCode((c % 26) + 65);
      row[letra] = '';
    }
    data.push(row);
  }
  return data;
};

// ============================================================================
// 2. COMPONENTES DE VISTA
// ============================================================================
const Header = () => (
  <header className="romi-header" style={{ padding: '10px 20px' }}>
    <div className="romi-brand">ROMI MATH <span className="romi-badge">STUDIO</span></div>
    <span style={{color: 'var(--color-exito)', fontSize: '11px', fontWeight: 'bold'}}>● Motor HF Activo</span>
  </header>
);

const RibbonMenu = ({ applyStyle, rellenarAbajo }) => (
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

const FormulaBar = ({ activeCell, handleFormulaChange }) => (
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

const FooterTabs = ({ hojas, hojaActiva, setHojaActiva, zoom, setZoom, agregarHoja, renombrarHoja }) => (
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

// ============================================================================
// 3. CONTROLADOR PRINCIPAL
// ============================================================================
export default function RomiMathStudio() {
  const gridRef = useRef();
  const [gridListo, setGridListo] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [activeCell, setActiveCell] = useState({ rowIndex: null, colId: null, value: '' });
  const cellStylesRef = useRef({}); 

  const [hf] = useState(() => {
    const instance = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });
    instance.addSheet('Análisis 1');
    return instance;
  });

  const [hojas, setHojas] = useState([
    { nombre: 'Análisis 1', numCols: 26, datos: generarFilasVacias(100, 26) }
  ]);
  const [hojaActiva, setHojaActiva] = useState(0);

  const columnDefs = useMemo(() => generarColumnasExcel(hojas[hojaActiva].numCols), [hojaActiva, hojas]);

  const defaultColDef = useMemo(() => ({
    editable: true, resizable: true, sortable: false, flex: 0, minWidth: 80,
    
    valueFormatter: (params) => {
      if (params.node.rowIndex === undefined || !params.column.colId) return params.value; 
      
      const colNum = colToNum(params.column.colId);
      const hfSheetId = hf.getSheetId(hojas[hojaActiva].nombre);
      const key = `${hojaActiva}-${params.node.rowIndex}-${params.column.colId}`;
      const formato = cellStylesRef.current[key]?.formatType;

      try {
        const val = hf.getCellValue({ sheet: hfSheetId, row: params.node.rowIndex, col: colNum });
        let rawNumber = val;
        
        if (val !== null && typeof val === 'object' && val.value) rawNumber = val.value; 
        
        if (rawNumber !== null && rawNumber !== '' && !isNaN(rawNumber)) {
          if (formato === 'currency') {
            return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(rawNumber));
          }
          if (formato === 'percent') {
            return new Intl.NumberFormat('es-AR', { style: 'percent', maximumFractionDigits: 2 }).format(Number(rawNumber) / 100);
          }
        }
        
        return rawNumber !== null && rawNumber !== undefined ? rawNumber : params.value;
      } catch(e) {
        return params.value;
      }
    },
    
    cellStyle: (params) => {
      if (params.node.rowIndex === undefined || !params.column.colId) return null;
      const key = `${hojaActiva}-${params.node.rowIndex}-${params.column.colId}`;
      return { ...(cellStylesRef.current[key] || {}) };
    }
  }), [hojaActiva, hf, hojas]);

  useEffect(() => { setGridListo(true); }, []);

  const agregarHoja = () => {
    const nuevoNombre = `Hoja ${hojas.length + 1}`;
    hf.addSheet(nuevoNombre); 
    setHojas([...hojas, { nombre: nuevoNombre, numCols: 26, datos: generarFilasVacias(100, 26) }]);
    setHojaActiva(hojas.length);
  };

  const renombrarHoja = (index, nuevoNombre) => {
    if (!nuevoNombre || nuevoNombre.trim() === '') return;
    hf.renameSheet(hf.getSheetId(hojas[index].nombre), nuevoNombre);
    const nuevasHojas = [...hojas];
    nuevasHojas[index].nombre = nuevoNombre;
    setHojas(nuevasHojas);
  };

  const onCellClicked = (e) => setActiveCell({ rowIndex: e.rowIndex, colId: e.column.colId, value: e.value });
  
  const onCellValueChanged = (e) => {
    if (activeCell.rowIndex === e.rowIndex && activeCell.colId === e.column.colId) {
      setActiveCell(prev => ({ ...prev, value: e.value }));
    }
    
    const colNum = colToNum(e.column.colId);
    const hfSheetId = hf.getSheetId(hojas[hojaActiva].nombre);
    const valorRaw = e.newValue !== undefined && e.newValue !== null ? e.newValue : '';
    
    hf.setCellContents({ sheet: hfSheetId, row: e.rowIndex, col: colNum }, [[valorRaw]]);
    gridRef.current.api.refreshCells({ force: true });
  };

  const handleFormulaChange = (e) => {
    const val = e.target.value;
    setActiveCell(prev => ({ ...prev, value: val }));
    if (activeCell.rowIndex !== null && gridRef.current) {
      const rowNode = gridRef.current.api.getDisplayedRowAtIndex(activeCell.rowIndex);
      if (rowNode) rowNode.setDataValue(activeCell.colId, val); 
    }
  };

  const applyStyle = (property, value) => {
    if (activeCell.rowIndex === null || !gridRef.current) return;
    const key = `${hojaActiva}-${activeCell.rowIndex}-${activeCell.colId}`;
    const estilosActuales = cellStylesRef.current[key] || {};
    
    if (property === 'fontWeight') value = estilosActuales.fontWeight === 'bold' ? 'normal' : 'bold';
    if (property === 'fontStyle') value = estilosActuales.fontStyle === 'italic' ? 'normal' : 'italic';

    cellStylesRef.current[key] = { ...estilosActuales, [property]: value };
    
    const rowNode = gridRef.current.api.getDisplayedRowAtIndex(activeCell.rowIndex);
    if (rowNode) gridRef.current.api.redrawRows({ rowNodes: [rowNode] });
  };

  // ==========================================================================
  // HACK MAESTRO: RELLENO CON DESPLAZAMIENTO MATEMÁTICO (Regex Vibe Coding)
  // ==========================================================================
  const rellenarAbajo = () => {
    if (activeCell.rowIndex === null || !activeCell.colId) {
      alert("Seleccioná la celda que querés extender hacia abajo.");
      return;
    }
    
    const cantidadStr = window.prompt("¿Cuántas filas hacia abajo querés extender esta celda?", "5");
    if (!cantidadStr) return;
    
    const cantidad = parseInt(cantidadStr);
    if (isNaN(cantidad) || cantidad <= 0) return;

    const hfSheetId = hf.getSheetId(hojas[hojaActiva].nombre);
    const colNum = colToNum(activeCell.colId);
    const startRow = activeCell.rowIndex;

    try {
      // 1. Vemos qué hay en la celda original (fórmula o valor estático)
      let valorBase = hf.getCellFormula({ sheet: hfSheetId, col: colNum, row: startRow });
      let esFormula = true;
      
      if (valorBase === undefined || valorBase === null) {
        // Si no hay fórmula, sacamos el valor plano
        valorBase = hf.getCellValue({ sheet: hfSheetId, col: colNum, row: startRow });
        esFormula = false;
      } else {
        // FIX MAESTRO: Limpiamos cualquier "=" que ya traiga la fórmula y le clavamos uno solo.
        // Así matamos el temido "==A1" para siempre.
        valorBase = '=' + String(valorBase).replace(/^=+/, '');
      }

      // 2. El motor Regex que simula a Excel
      const shiftFormula = (formula, shiftBy) => {
        if (!esFormula || typeof formula !== 'string') return formula;
        
        return formula.replace(/(\$?)([A-Z]+)(\$?)([0-9]+)/ig, (match, colAbs, colLetra, rowAbs, rowNumTxt) => {
          if (rowAbs === '$') return match; // Respetamos referencias absolutas ($A$1)
          
          const nuevaFila = parseInt(rowNumTxt, 10) + shiftBy;
          return `${colAbs}${colLetra}${rowAbs}${nuevaFila}`;
        });
      };

      // 3. Pegamos los nuevos valores iterando hacia abajo
      for (let i = 1; i <= cantidad; i++) {
        const targetRow = startRow + i;
        const nuevoContenido = esFormula ? shiftFormula(valorBase, i) : valorBase;
        
        hf.setCellContents({ sheet: hfSheetId, col: colNum, row: targetRow }, [[nuevoContenido]]);
        
        // Sincronizamos con la interfaz visual
        const node = gridRef.current.api.getDisplayedRowAtIndex(targetRow);
        if (node) {
          node.setDataValue(activeCell.colId, nuevoContenido);
        }
      }

      gridRef.current.api.refreshCells({ force: true });
    } catch (e) {
      console.error("Error al inyectar fórmulas:", e);
      alert("Ocurrió un error al extender las celdas.");
    }
  };
  return (
    <div className="romi-app" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header />
      <RibbonMenu applyStyle={applyStyle} rellenarAbajo={rellenarAbajo} />
      <FormulaBar activeCell={activeCell} handleFormulaChange={handleFormulaChange} />
      
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#e2e8f0' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zoom: `${zoom}%` }}>
          <div className="ag-theme-alpine romi-grid" style={{ width: '100%', height: '100%' }}>
            {gridListo && (
              <AgGridReact
                ref={gridRef}
                theme="legacy"
                rowData={hojas[hojaActiva].datos}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowHeight={24}
                headerHeight={28}
                suppressMovableColumns={true}
                onCellClicked={onCellClicked}
                onCellValueChanged={onCellValueChanged}
              />
            )}
          </div>
        </div>
      </div>

      <FooterTabs hojas={hojas} hojaActiva={hojaActiva} setHojaActiva={setHojaActiva} zoom={zoom} setZoom={setZoom} agregarHoja={agregarHoja} renombrarHoja={renombrarHoja} />
    </div>
  );
}