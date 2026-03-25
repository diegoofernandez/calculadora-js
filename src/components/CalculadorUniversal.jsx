import React, { useState } from 'react';
import { SimuladorEstructural } from '../engine/SimuladorEstructural'; 
import DashboardEstructural from './DashboardEstructural';

const MAPA_UNIVERSAL = {
  v: "Volumen (Clientes/Ventas)",
  p: "Precio Promedio (Ticket)",
  c: "Capacidad Máxima",
  d: "Desperdicio / Merma",
  t: "Tiempo Operativo (Horas)",
  f: "Costos Fijos Estructurales",
  cv: "Costo Variable Unitario",
  i: "Inversión en Adquisición (CAC)",
  r: "Retorno"
};

// Generador del JSON Matemático
export function generarJsonUniversal(inputs) {
  return [
    [{ "operacion": "Grobner", "simulaciones": 150 }],
    [
      { "type": "Monomio", "coeficiente": 1, "partes": [{ "objeto": "Potencia", "base": "c", "exponente": 1 }, { "objeto": "Potencia", "base": "t", "exponente": 1 }] },
      { "type": "Monomio", "coeficiente": -1, "partes": [{ "objeto": "Potencia", "base": "d", "exponente": 1 }] },
      { "type": "Monomio", "coeficiente": -1, "partes": [{ "objeto": "Potencia", "base": "v", "exponente": 1 }] }
    ],
    [
      { "type": "Monomio", "coeficiente": 1, "partes": [{ "objeto": "Potencia", "base": "v", "exponente": 1 }, { "objeto": "Potencia", "base": "p", "exponente": 1 }] },
      { "type": "Monomio", "coeficiente": -1, "partes": [{ "objeto": "Potencia", "base": "v", "exponente": 1 }, { "objeto": "Potencia", "base": "cv", "exponente": 1 }] },
      { "type": "Monomio", "coeficiente": -1, "partes": [{ "objeto": "Potencia", "base": "f", "exponente": 1 }] },
      { "type": "Monomio", "coeficiente": -1, "partes": [{ "objeto": "Potencia", "base": "i", "exponente": 1 }] },
      { "type": "Monomio", "coeficiente": -1, "partes": [{ "objeto": "Potencia", "base": "r", "exponente": 1 }] }
    ],
    [ { "type": "Monomio", "coeficiente": 1, "partes": [{ "objeto": "Potencia", "base": "p", "exponente": 1 }] }, { "type": "Monomio", "coeficiente": -inputs.p, "partes": [] } ],
    [ { "type": "Monomio", "coeficiente": 1, "partes": [{ "objeto": "Potencia", "base": "f", "exponente": 1 }] }, { "type": "Monomio", "coeficiente": -inputs.f, "partes": [] } ],
    [ { "type": "Monomio", "coeficiente": 1, "partes": [{ "objeto": "Potencia", "base": "cv", "exponente": 1 }] }, { "type": "Monomio", "coeficiente": -inputs.cv, "partes": [] } ],
    [ { "type": "Monomio", "coeficiente": 1, "partes": [{ "objeto": "Potencia", "base": "i", "exponente": 1 }] }, { "type": "Monomio", "coeficiente": -inputs.i, "partes": [] } ]
  ];
}

export default function CalculadoraUniversal() {
  const [fase, setFase] = useState('formulario');
  const [progreso, setProgreso] = useState({ mensaje: '', porcentaje: 0 });
  
  const [inputs, setInputs] = useState({
    v: 100, p: 5000, c: 150, d: 5, t: 160, f: 200000, cv: 1000, i: 50000
  });
  const [resultados, setResultados] = useState(null);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: Number(e.target.value) });
  };

  /*
  const ejecutarAutopsia = async () => {
    setFase('simulando');
    
    try {
      const jsonBaseTemporal = generarJsonUniversal(inputs);
      const variablesActivas = ['v', 'p', 'c', 'd', 't', 'r'];

      const resultados500 = await SimuladorEstructural.ejecutar500Escenarios(
        jsonBaseTemporal, 
        variablesActivas, 
        (msg, percent) => setProgreso({ mensaje: msg, porcentaje: percent })
      );

      const metricasFundacionales = {
        srInicial: resultados500[0]?.srIndex || 0,
        conectividad: resultados500[0]?.conectividad || 0,
        distanciaPromedio: resultados500[0]?.distancia || 0,
        variableRestrictiva: resultados500[0]?.variablesDominantes || 'Ninguno'
      };

      setResultados({ metricasFundacionales, datosSimulacion: resultados500 });
      setFase('resultados');

    } catch (error) {
      console.error("El motor colapsó:", error);
      alert("Error en la simulación estocástica. Revisá la consola.");
      setFase('formulario');
    }
  };*/
  const ejecutarAutopsia = () => {
    // 1. Cambiamos la fase a simulando
    setFase('simulando');
    setProgreso({ mensaje: 'Iniciando motor estocástico...', porcentaje: 0 });
    
    // 2. Le damos 50 milisegundos al navegador para que DIBUJE la pantalla oscura
    setTimeout(async () => {
      try {
        const jsonBaseTemporal = generarJsonUniversal(inputs);
        const variablesActivas = ['v', 'p', 'c', 'd', 't', 'r'];

        // 3. Ahora sí, le tiramos todo el peso matricial
        const resultados500 = await SimuladorEstructural.ejecutar500Escenarios(
          jsonBaseTemporal, 
          variablesActivas, 
          (msg, percent) => setProgreso({ mensaje: msg, porcentaje: percent })
        );

        // 4. Procesamos resultados
        const metricasFundacionales = {
          srInicial: resultados500[0]?.srIndex || 0,
          conectividad: resultados500[0]?.conectividad || 0,
          distanciaPromedio: resultados500[0]?.distancia || 0,
          variableRestrictiva: resultados500[0]?.variablesDominantes || 'Ninguno'
        };

        setResultados({ metricasFundacionales, datosSimulacion: resultados500 });
        setFase('resultados');

      } catch (error) {
        console.error("El motor colapsó:", error);
        alert("Error en la simulación estocástica. Revisá la consola.");
        setFase('formulario');
      }
    }, 50); // <-- Acá está la clave, el respiro de 50ms
  };

  if (fase === 'simulando') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold mb-2 tracking-widest uppercase">Motor RomiMath</h2>
          <p className="text-gray-400 mb-6 font-mono text-sm">{progreso.mensaje}</p>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div className="bg-red-500 h-4 rounded-full transition-all duration-300" style={{ width: `${progreso.porcentaje}%` }}></div>
          </div>
          <p className="text-right mt-2 text-xs font-bold text-red-400">{Math.round(progreso.porcentaje)}%</p>
        </div>
      </div>
    );
  }

  if (fase === 'resultados' && resultados) {
    return (
      <div className="relative">
        <button 
          onClick={() => setFase('formulario')}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          ← Nuevo Análisis
        </button>
        <DashboardEstructural 
          metricasFundacionales={resultados.metricasFundacionales} 
          datosSimulacion={resultados.datosSimulacion} 
          mapaVariables={MAPA_UNIVERSAL} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* CABECERA */}
        <div className="bg-gray-900 py-6 px-8 border-b-4 border-red-600">
          <h2 className="text-3xl font-black text-white uppercase tracking-wider">Auditoría Estructural</h2>
          <p className="text-gray-400 mt-2">Ingresá los parámetros operativos actuales. El motor someterá la estructura a 500 escenarios estocásticos para encontrar tus puntos de quiebre.</p>
        </div>
        
        <div className="p-8">
          {/* GRILLA DE INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {Object.entries(MAPA_UNIVERSAL).map(([key, label]) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-1">{label} ({key.toUpperCase()})</label>
                <input 
                  type="number" 
                  name={key}
                  value={inputs[key]}
                  onChange={handleInputChange}
                  // FIX COLOR: Agregamos text-gray-900 y bg-white para forzar contraste
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-colors font-mono font-bold shadow-inner"
                />
              </div>
            ))}
          </div>

          {/* NUEVO: GUÍA DE RESULTADOS (PRE-MORTEM) */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
              ¿Qué te revelará esta autopsia?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-red-600 mb-1 flex items-center gap-2">
                  <span className="text-xl">📉</span> Riesgo de Quiebra
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  El motor calculará tu <b>Índice SR</b>. Verás una montaña de distribución; si la masa se desplaza hacia el cero, significa que tu negocio no resistirá el próximo golpe económico.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-indigo-600 mb-1 flex items-center gap-2">
                  <span className="text-xl">🔪</span> El Cuello de Botella
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Descubrirás la <b>Variable Asesina</b>. La matemática aislará el factor exacto (ej: alquiler alto, poco volumen o exceso de horas) que está secuestrando tus ganancias reales.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-emerald-600 mb-1 flex items-center gap-2">
                  <span className="text-xl">🧱</span> Tu Techo Físico
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Un mapa de dispersión que revela tu <b>Límite Topológico</b>. Te mostrará visualmente el punto exacto donde trabajar más horas o producir más volumen te hace perder dinero.
                </p>
              </div>
            </div>
          </div>

          {/* BOTÓN DE ACCIÓN */}
          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <button 
              onClick={ejecutarAutopsia}
              className="bg-red-600 hover:bg-red-700 text-white font-black py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all uppercase tracking-widest text-lg w-full md:w-auto flex justify-center items-center gap-2"
            >
              <span>⚙️ Ejecutar Motor RomiMath</span>
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}