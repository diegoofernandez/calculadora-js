import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas'; // <--- Recuperado

export const generateForensicReport = async (data) => {
    const { 
        simulationId, variables, sobolData, crashCount, 
        totalNodes, srIndex, graphRef, 
        algebraicBase,   // Ecuaciones (ADN Lógico)
        vectorialBase,   // Números (ADN de Datos)
        geometricMetrics, // De GeometricConnector.ts
        trajectoryData 
    } = data;

    const doc = new jsPDF();
    const integrity = Math.round(Math.max(0, 100 - (crashCount / totalNodes * 100)));
    const timestamp = new Date().toLocaleString();
    const pageWidth = doc.internal.pageSize.width - 40;

    // --- DISEÑO DE CABECERA PROFESIONAL ---
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold"); doc.setFontSize(22);
    doc.text("ROMIMATH: AUDITORÍA DE RESILIENCIA", 20, 25);
    doc.setFontSize(9); doc.setFont("monospace");
    doc.text(`REFERENCE_ID: ${simulationId} | SR_INDEX: ${srIndex.toFixed(2)} pts`, 20, 35);

    // 1. CONTEXTO DEL NEGOCIO (Blindaje Técnico Sugerido por el Mentor)
    doc.setTextColor(0, 0, 0); doc.setFontSize(14);
    doc.text("1. METODOLOGÍA DE ESTRÉS ESTRUCTURAL", 20, 55);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    const contexto = doc.splitTextToSize(
        "Este informe evalúa la RESILIENCIA ESTRUCTURAL PASIVA ante perturbaciones paramétricas. " +
        "IMPORTANTE: La trayectoria de perturbación ha sido direccionada proporcionalmente a los índices de sensibilidad Sobol. " +
        "El modelo no simula mecanismos de ajuste estratégico o feedback correctivo; mide la robustez intrínseca de la arquitectura algebraica actual.", 175
    );
    doc.text(contexto, 20, 63);
    // 2. MODELO ESTRUCTURAL (EL DOBLE ADN)
    let currentY = 85;
    doc.setFont("helvetica", "bold"); doc.text("2. MODELO ESTRUCTURAL (BASES)", 20, currentY);
    
    // 2.1 Base Algebraica (Lo que entiende el mentor)
    currentY += 8;
    doc.setFontSize(11); doc.text("2.1 ADN Algebraico (Base de Gröbner)", 25, currentY);
    doc.setFont("courier", "normal"); doc.setFontSize(7);
    currentY += 5;
    algebraicBase.slice(0, 6).forEach((p, i) => {
        const wrapped = doc.splitTextToSize(`G${i+1}: ${p}`, pageWidth);
        if (currentY + 5 > 275) { doc.addPage(); currentY = 20; }
        doc.text(wrapped, 25, currentY);
        currentY += (wrapped.length * 4) + 1;
    });

    // 2.2 Base Vectorizada (Lo que sirve para el Big Data futuro)
    currentY += 5;
    doc.setFont("helvetica", "bold"); doc.setFontSize(11);
    doc.text("2.2 ADN Vectorizado (Vectores de Simulación)", 25, currentY);
    doc.setFont("courier", "normal"); doc.setFontSize(7);
    currentY += 5;
    vectorialBase.slice(0, 8).forEach((v, i) => {
        doc.text(`V${i+1}: [${v.join(', ')}]`, 25, currentY);
        currentY += 4;
    });

    // 3. SENSIBILIDAD GLOBAL (SOBOL)
    currentY += 10;
    doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    doc.text("3. SENSIBILIDAD GLOBAL (SOBOL)", 20, currentY);
    autoTable(doc, {
        startY: currentY + 5,
        head: [['VARIABLE', 'CONTRIBUCIÓN VARIANZA', 'PRIORIDAD']],
        body: sobolData.map(s => [s.variable.toUpperCase(), `${s.indice.toFixed(2)}%`, s.indice > 30 ? 'CRÍTICA' : 'NOMINAL']),
        theme: 'grid', headStyles: { fillColor: [20, 20, 20] }, styles: { fontSize: 8 }
    });

    // --- PÁGINA 2: EVIDENCIA VISUAL ---
    doc.addPage();
    doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    doc.text("4. TRAYECTORIAS Y MAPA TOPOLÓGICO 3D", 20, 25);
    
    // CAPTURA REAL DEL MOTOR 3D
    try {
        const canvas = graphRef.current.renderer().domElement;
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 20, 35, 170, 95);
    } catch (e) { console.error("Error en captura", e); }

    // 5. PUNTOS DE RUPTURA
    currentY = 145;
    doc.text("5. ANÁLISIS DE RUPTURA", 20, currentY);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    doc.text([
        `Nodos colapsados registrados: ${crashCount} / ${totalNodes}`,
        `Integridad estructural remanente: ${integrity}%`,
        `Ciclos de deriva antes de colapso: ${trajectoryData?.steps || 0}`
    ], 20, currentY + 10);

    // 6. MÉTRICAS GEOMÉTRICAS (Simplificadas: Solo el dato puro)
    currentY += 35;
    doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    doc.text("6. MÉTRICAS DE COHERENCIA GEOMÉTRICA", 20, currentY);
    autoTable(doc, {
        startY: currentY + 5,
        head: [['Parámetro de Red', 'Valor Detectado', 'Estado']],
        body: [
            ['Connectivity Rate', `${(geometricMetrics?.connectivity || 0).toFixed(2)}%`, geometricMetrics?.connectivity > 80 ? 'ÓPTIMO' : 'TENSO'],
            ['Average Distance', `${(geometricMetrics?.avgDistance || 0).toFixed(4)}`, geometricMetrics?.avgDistance < 0.5 ? 'COMPACTO' : 'DIVERGENTE'],
            ['SR Index (Resistencia)', `${srIndex.toFixed(2)} pts`, srIndex > 25 ? 'RESILIENTE' : 'INSUFICIENTE']
        ],
        theme: 'striped'
    });

    // --- PÁGINA 3: CIERRE Y CONCLUSIÓN ---
    doc.addPage();
    // 7. CONCLUSIÓN TÉCNICA
    doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    doc.text("7. CONCLUSIÓN TÉCNICA", 20, 25);
    doc.setFillColor(integrity < 40 ? 255 : 240, 240, 240);
    doc.rect(20, 30, 170, 35, 'F');
    doc.setFontSize(11);
    const conclusion = integrity < 40 
        ? "VERDICTO: FALLO ESTRUCTURAL DETECTADO. El modelo algebraico ha superado su límite elástico. Se recomienda rediseño de la matriz de costos." 
        : "VERDICTO: ESTABILIDAD RESILIENTE. El sistema es capaz de absorber la varianza del entorno sin perder el equilibrio.";
    doc.text(doc.splitTextToSize(conclusion, 160), 25, 48);

    // 8. JSON REFERENCIA (EL CONTENIDO MASIVO)
    doc.setFontSize(8); doc.setTextColor(150);
    const footerData = JSON.stringify({id: simulationId, variables, sr: srIndex}).substring(0, 100);
    doc.text(`8. DATA_SOURCE_REF: ${footerData}...`, 20, 285);

    doc.save(`REPORTE_FORENSE_${simulationId}.pdf`);
};