export const colToNum = (letra) => {
  let num = 0;
  for (let i = 0; i < letra.length; i++) {
    num = num * 26 + (letra.charCodeAt(i) - 64);
  }
  return num - 1;
};

export const generarColumnasExcel = (cantidad) => {
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

export const generarFilasVacias = (filas, columnas) => {
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

/**/
//Convierte "A1" en {col: 0, row: 0}
export const cellToCoords = (cellStr) => {
    const match = cellStr.match(/([A-Z]+)([0-9]+)/i);
    if (!match) return null;
    const colLetra = match[1].toUpperCase();
    let colNum = 0;
    for (let i = 0; i < colLetra.length; i++) colNum = colNum * 26 + (colLetra.charCodeAt(i) - 64);
    return { col: colNum - 1, row: parseInt(match[2]) - 1 };
};