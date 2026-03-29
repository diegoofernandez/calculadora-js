import React, { useState, useRef, useMemo, useEffect } from 'react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { HyperFormula } from 'hyperformula'; 
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


import { FloatingModal } from './sections/FloatingModal';
import { parseGridToAST } from './modulos/mathTranslator';

// Importamos los submódulos que separamos
import { colToNum, generarColumnasExcel, generarFilasVacias, cellToCoords } from './sections/excelUtils';
import { Header } from './sections/Header';
import { RibbonMenu } from './sections/RibbonMenu';
import { FormulaBar } from './sections/FormulaBar';
import { FooterTabs } from './sections/FooterTab';

ModuleRegistry.registerModules([ AllCommunityModule ]);

export default function RomiMathStudio() {

  const [modalAbierto, setModalAbierto] = useState(false);
  const [astActual, setAstActual] = useState(null);
  const gridRef = useRef();
  const [gridListo, setGridListo] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [activeCell, setActiveCell] = useState({ rowIndex: null, colId: null, value: '' });
  const cellStylesRef = useRef({}); 


  const extraerRangoAJSON = () => {
    const rangoStr = window.prompt("Indicá el rango a procesar para el Motor (Ej: A1:D3):", "A1:D3");
    if (!rangoStr || !rangoStr.includes(':')) return;

    const [inicioCelda, finCelda] = rangoStr.split(':');
    const coordsInicio = cellToCoords(inicioCelda);
    const coordsFin = cellToCoords(finCelda);

    if (!coordsInicio || !coordsFin) {
        alert("Formato de rango inválido."); return;
    }

    const hfSheetId = hf.getSheetId(hojas[hojaActiva].nombre);
    const matrizCruda = [];

    // Recorremos el rectángulo exacto que pidió el usuario
    for (let r = coordsInicio.row; r <= coordsFin.row; r++) {
        const fila = [];
        for (let c = coordsInicio.col; c <= coordsFin.col; c++) {
            // Obtenemos el valor calculado de HyperFormula
            const val = hf.getCellValue({ sheet: hfSheetId, col: c, row: r });
            // Extraemos el número crudo esquivando errores de tipo
            const cleanVal = (val !== null && typeof val === 'object' && val.value) ? val.value : val;
            fila.push(cleanVal);
        }
        matrizCruda.push(fila);
    }

    try {
        const astGenerado = parseGridToAST(matrizCruda, { operacion: "Grobner", simulaciones: 20 });
        setAstActual(astGenerado);
        setModalAbierto(true);
    } catch (e) {
        alert(e.message);
    }
  };

/*****************************************************************************
 * **************************************************************************
 * **************************************************************************
 * ***************************************************************************/

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
      let valorBase = hf.getCellFormula({ sheet: hfSheetId, col: colNum, row: startRow });
      let esFormula = true;
      
      if (valorBase === undefined || valorBase === null) {
        valorBase = hf.getCellValue({ sheet: hfSheetId, col: colNum, row: startRow });
        esFormula = false;
      } else {
        valorBase = '=' + String(valorBase).replace(/^=+/, '');
      }

      const shiftFormula = (formula, shiftBy) => {
        if (!esFormula || typeof formula !== 'string') return formula;
        
        return formula.replace(/(\$?)([A-Z]+)(\$?)([0-9]+)/ig, (match, colAbs, colLetra, rowAbs, rowNumTxt) => {
          if (rowAbs === '$') return match; 
          
          const nuevaFila = parseInt(rowNumTxt, 10) + shiftBy;
          return `${colAbs}${colLetra}${rowAbs}${nuevaFila}`;
        });
      };

      for (let i = 1; i <= cantidad; i++) {
        const targetRow = startRow + i;
        const nuevoContenido = esFormula ? shiftFormula(valorBase, i) : valorBase;
        
        hf.setCellContents({ sheet: hfSheetId, col: colNum, row: targetRow }, [[nuevoContenido]]);
        
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
      <RibbonMenu applyStyle={applyStyle} rellenarAbajo={rellenarAbajo} extraerRangoAJSON={extraerRangoAJSON} />
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