export const parseGridToAST = (gridData, config = { operacion: "Grobner", simulaciones: 20 }) => {
    if (!gridData || gridData.length < 2) throw new Error("Datos insuficientes para el análisis.");
  
    // El JSON siempre arranca con el bloque de configuración en el índice 0
    const ast = [
        [ config ]
    ];
  
    // Fila 0 son las cabeceras (Los términos literales: x^2, x*y, etc.)
    const headers = gridData[0].map(h => String(h).trim());
  
    // A partir de la Fila 1 son las ecuaciones (Coeficientes)
    for (let i = 1; i < gridData.length; i++) {
        const fila = gridData[i];
        const ecuacion = [];
  
        for (let j = 0; j < headers.length; j++) {
            const coeficienteStr = fila[j];
            // Si la celda está vacía o es 0, no generamos el monomio para optimizar
            if (coeficienteStr === '' || coeficienteStr === null || coeficienteStr === undefined) continue;
            
            const coeficiente = parseFloat(coeficienteStr);
            if (isNaN(coeficiente) || coeficiente === 0) continue;
  
            const termino = headers[j];
            const partes = [];
  
            // Si no es la columna de Constante (C)
            if (termino.toUpperCase() !== 'C' && termino.toUpperCase() !== 'CONSTANTE') {
                // Separamos por multiplicaciones (ej: "x^2*y" -> ["x^2", "y"])
                const literales = termino.split('*');
                
                literales.forEach(lit => {
                    const [base, expTxt] = lit.split('^');
                    partes.push({
                        objeto: "Potencia",
                        base: base.trim(),
                        exponente: expTxt ? parseInt(expTxt) : 1
                    });
                });
            }
  
            ecuacion.push({
                type: "Monomio",
                coeficiente: coeficiente,
                partes: partes
            });
        }
        
        // Solo agregamos la ecuación si tiene al menos un término
        if (ecuacion.length > 0) {
            ast.push(ecuacion);
        }
    }
  
    return ast;
};