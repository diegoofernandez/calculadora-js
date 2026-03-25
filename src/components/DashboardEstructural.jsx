import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis, AreaChart, Area 
} from 'recharts';

export default function DashboardEstructural({ metricasFundacionales, datosSimulacion, mapaVariables }) {

  // 1. Procesar datos para el Histograma de Riesgo
  const datosHistograma = useMemo(() => {
    const bins = new Array(20).fill(0).map((_, i) => ({ rango: i * 5, cantidad: 0 }));
    datosSimulacion.forEach(sim => {
      const binIndex = Math.min(Math.floor(sim.srIndex / 5), 19);
      if (bins[binIndex]) bins[binIndex].cantidad++;
    });
    return bins;
  }, [datosSimulacion]);

  // 2. Procesar datos para el Ranking de Cuellos de Botella
  const datosCuellosBotella = useMemo(() => {
    const conteo = {};
    datosSimulacion.forEach(sim => {
      if (sim.srIndex < 30) {
        const falla = sim.variablesDominantes || 'Ninguno';
        conteo[falla] = (conteo[falla] || 0) + 1;
      }
    });
    
    return Object.entries(conteo)
      .map(([nombre, cantidad]) => ({ 
        nombre: nombre.split(' Y ').map(letra => mapaVariables[letra.trim().toLowerCase()] || letra).join(' + '), 
        cantidad 
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
  }, [datosSimulacion, mapaVariables]);

  // 3. Procesar datos para el Scatter Plot (C vs V)
  const datosScatter = useMemo(() => {
    return datosSimulacion.map(sim => ({
      x: sim.valoresVariables['c'] || 0,
      y: sim.valoresVariables['v'] || 0,
      z: sim.srIndex,
    }));
  }, [datosSimulacion]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* MÉTRICAS FUNDACIONALES */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider border-b-2 border-gray-800 pb-2">
          Análisis Fundacional del Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg shadow-sm border-l-4 ${metricasFundacionales.srInicial < 30 ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
            <p className="text-sm text-gray-500 font-bold">ÍNDICE SR FUNDACIONAL</p>
            <p className="text-3xl font-black">{Number(metricasFundacionales.srInicial).toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <p className="text-sm text-gray-500 font-bold">CONECTIVIDAD</p>
            <p className="text-3xl font-black">{(metricasFundacionales.conectividad * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
            <p className="text-sm text-gray-500 font-bold">DISTANCIA PROMEDIO</p>
            <p className="text-3xl font-black">{Number(metricasFundacionales.distanciaPromedio).toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-400 font-bold">RESTRICCIÓN DOMINANTE</p>
            <p className="text-xl font-black mt-1">
              {metricasFundacionales.variableRestrictiva.split(' Y ').map(letra => mapaVariables[letra.trim().toLowerCase()] || letra).join(' + ')}
            </p>
          </div>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-center mb-4">Riesgo de Quiebra (Distribución SR)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={datosHistograma}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="rango" name="Índice SR" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="cantidad" stroke="#dc2626" fill="#fca5a5" name="Escenarios" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-center mb-4">Frecuencia de Cuellos de Botella</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosCuellosBotella} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" />
                <YAxis dataKey="nombre" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#4f46e5" name="Veces que causó colapso" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-bold text-center mb-4">Límite Físico: {mapaVariables['c']} vs {mapaVariables['v']}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" dataKey="x" name={mapaVariables['c']} />
                <YAxis type="number" dataKey="y" name={mapaVariables['v']} />
                <ZAxis type="number" dataKey="z" range={[20, 100]} name="Índice SR" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Escenarios" data={datosScatter} fill="#ef4444" opacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button 
          onClick={() => window.print()} 
          className="px-6 py-2 bg-gray-800 text-white font-bold rounded shadow hover:bg-gray-700 transition"
        >
          Guardar como PDF
        </button>
      </div>
    </div>
  );
}