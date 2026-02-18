
import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, data }) => {
  // Memoria del Pathfinding: Guarda el ID del Origen (0) y el Destino (1)
  const [selectedNodes, setSelectedNodes] = useState([]);

  if (!isOpen || !data) return null;

  const { simulationVectors, connectivity, geometricProperties, variables } = data;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedNodes([]); // Resetea el radar al hacer clic afuera
      onClose();
    }
  };

  // La lógica del clic táctico en los nodos
  const handleNodeClick = (id) => {
    if (selectedNodes.length === 2) {
      // Si ya hay 2, borramos todo y empezamos de nuevo con este clic
      setSelectedNodes([id]);
    } else if (selectedNodes.includes(id)) {
      // Si hace clic en el mismo, lo deselecciona
      setSelectedNodes(selectedNodes.filter(n => n !== id));
    } else {
      // Si hay 1, este clic se convierte en el destino
      setSelectedNodes([...selectedNodes, id]);
    }
  };

  // Construcción de Nodos para el SVG
  const nodes = simulationVectors.map((_, i) => ({
    id: i,
    x: 250 + 180 * Math.cos(2 * Math.PI * i / simulationVectors.length),
    y: 250 + 180 * Math.sin(2 * Math.PI * i / simulationVectors.length),
    isBase: i < data.originalVectorsCount
  }));

  // Construcción de las líneas rojas
  const links = [];
  connectivity.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val > 0 && i < j) links.push({ s: i, t: j, w: val });
    });
  });

  const isResilient = geometricProperties.connectivityRate > 0.2;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        
        <div className="modal-header">
          <h2>Radar Táctico</h2>
          <button onClick={() => { setSelectedNodes([]); onClose(); }} className="close-btn">[X] CERRAR</button>
        </div>

        <div className="svg-radar-container">
          <svg viewBox="0 0 500 500" style={{ width: '100%', height: 'auto', maxWidth: '400px' }}>
            {links.map((l, idx) => (
              <line 
                key={`link-${idx}`} 
                x1={nodes[l.s].x} y1={nodes[l.s].y} 
                x2={nodes[l.t].x} y2={nodes[l.t].y}
                stroke="#dc2626" 
                strokeWidth={l.w * 3} 
                opacity="0.5" 
              />
            ))}
            
            {nodes.map(n => {
              // Verificamos si es origen o destino para darle el color neón correspondiente
              const isOrigen = selectedNodes[0] === n.id;
              const isDestino = selectedNodes[1] === n.id;
              
              let claseNodo = "nodo-interactivo";
              if (isOrigen) claseNodo += " nodo-origen";
              if (isDestino) claseNodo += " nodo-destino";

              return (
                <circle 
                  key={`node-${n.id}`} 
                  cx={n.x} cy={n.y} 
                  r={n.isBase ? 9 : 6}
                  fill={n.isBase ? "#fff" : "#dc2626"} 
                  className={claseNodo}
                  onClick={() => handleNodeClick(n.id)}
                />
              )
            })}
          </svg>
        </div>

        {/* PANEL VERDE DE PATHFINDING */}
        {selectedNodes.length === 2 ? (
          <div className="panel-pathfinding">
            <h3>
              <span>PLAN DE ACCIÓN EXACTO</span>
              <span style={{color: '#71717a', fontSize: '0.8rem'}}>NODO {selectedNodes[0]} ➔ NODO {selectedNodes[1]}</span>
            </h3>
            
            {simulationVectors[selectedNodes[0]].map((valOrigenStr, index) => {
              const valOrigen = parseFloat(valOrigenStr);
              const valDestino = parseFloat(simulationVectors[selectedNodes[1]][index]);
              const diferencia = valDestino - valOrigen;
              
              // Leemos la letra de la variable (h, e, v, p, etc.)
              const nombreVariable = variables && variables[index] 
                ? variables[index].toUpperCase() 
                : `VAR_${index + 1}`;

              // Formateo visual
              let colorClass = "ruta-valor-neutro";
              let signo = "";
              let accion = "MANTENER";

              if (diferencia > 0) { 
                colorClass = "ruta-valor-positivo"; 
                signo = "+"; 
                accion = "SUBIR";
              }
              if (diferencia < 0) { 
                colorClass = "ruta-valor-negativo"; 
                signo = ""; 
                accion = "BAJAR";
              }

              const difFormateada = diferencia % 1 !== 0 ? diferencia.toFixed(2) : diferencia;

              return (
                <div key={index} className="ruta-item">
                  <span>{nombreVariable}:</span>
                  <span className={colorClass}>
                    {accion} {signo}{difFormateada}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="instruccion-radar">
            {selectedNodes.length === 0 
              ? "[ CLICKEÁ EL NODO DE TU REALIDAD ACTUAL (ORIGEN) ]" 
              : "[ AHORA CLICKEÁ HACIA DÓNDE QUERÉS IR (DESTINO) ]"}
          </div>
        )}

        <div className="modal-footer">
          Conectividad: {(geometricProperties.connectivityRate * 100).toFixed(2)}% | 
          Estado: <span className={isResilient ? "status-resiliente" : "status-fragil"}>
            {isResilient ? "RESILIENTE" : "FRÁGIL"}
          </span>
        </div>

      </div>
    </div>
  );
};

export default Modal;