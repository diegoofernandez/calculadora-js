const Modal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;
  const { simulationVectors, connectivity, geometricProperties } = data;

  // Generamos posiciones para los nodos (un círculo)
  const nodes = simulationVectors.map((_, i) => ({
    id: i,
    x: 250 + 180 * Math.cos(2 * Math.PI * i / simulationVectors.length),
    y: 250 + 180 * Math.sin(2 * Math.PI * i / simulationVectors.length),
    isBase: i < 3 // Ajustar según cuántos polinomios base tengas
  }));
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const links = [];
  connectivity.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val > 0 && i < j) links.push({ s: i, t: j, w: val });
    });
  });

  return (
    <div className="fixed inset-0">
      <div className="modal-content">
        <div className="">
          <h2 className="text-xl font-black text-red-600 uppercase">Mapa de Estructura</h2>
          <button onClick={onClose} className="text-white hover:text-red-600 font-bold">[X] CERRAR</button>
        </div>
        <svg viewBox="0 0 500 500" className="w-full h-auto bg-black border border-zinc-800">
          {links.map((l, idx) => (
            <line key={idx} x1={nodes[l.s].x} y1={nodes[l.s].y} x2={nodes[l.t].x} y2={nodes[l.t].y}
                  stroke="#dc2626" strokeWidth={l.w * 2} opacity="0.4" />
          ))}
          {nodes.map(n => (
            <circle key={n.id} cx={n.x} cy={n.y} r={n.isBase ? 7 : 4} fill={n.isBase ? "#fff" : "#dc2626"} />
          ))}
        </svg>
        <div className="mt-4 text-[10px] font-mono text-zinc-500 uppercase">
          Conectividad: {(geometricProperties.connectivityRate * 100).toFixed(2)}% | 
          Estado: {geometricProperties.connectivityRate > 0.2 ? "Resiliente" : "Frágil"}
        </div>
      </div>
    </div>
  );
};

export default Modal;