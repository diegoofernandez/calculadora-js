import Fraccion from '../Fraccion'

class VectorAnalyticEngine {
  
  // 1. Cálculo de la Distancia Euclidiana al Cuadrado (Mantiene precisión Fraccion)
  private calcularDistanciaCuadrada(u: Fraccion[], v: Fraccion[]): Fraccion {
    if (u.length !== v.length) {
      throw new Error("❌ Los vectores deben tener la misma dimensión.");
    }

    let sumaCuadrados = new Fraccion(0n);
    
    for (let i = 0; i < u.length; i++) {
      // 1. Resta: (u_i - v_i)
      const diferencia = u[i].sumar(v[i].negar()); 
      
      // 2. Cuadrado: (u_i - v_i)^2
      const cuadrado = diferencia.multiplicar(diferencia);
      
      // 3. Suma acumulada
      sumaCuadrados = sumaCuadrados.sumar(cuadrado);
    }
    
    return sumaCuadrados;
  }

  /**
   * 🎯 FUNCIÓN CRÍTICA: Calcula la distancia mínima de v_real al espacio S.
   * @param v_real El vector real de la empresa (Fraccion[]).
   * @param S El conjunto de vectores óptimos simulados (Fraccion[][]).
   * @returns La distancia Euclidiana mínima (como un número decimal).
   */
  public calcularDistanciaMinima(v_real: Fraccion[], S: Fraccion[][]): number {
    if (S.length === 0) return Infinity;

    let minDistanceSq = Infinity;
    let closestOptimalVector: Fraccion[] | null = null;

    for (const v_sim of S) {
      // Calculamos la distancia al cuadrado (mantiene precisión con Fraccion)
      const distSqFraccion = this.calcularDistanciaCuadrada(v_real, v_sim);
      
      // Convertimos a float solo para la comparación y búsqueda del mínimo
      const distSqFloat = distSqFraccion.toFloat();
      
      if (distSqFloat < minDistanceSq) {
        minDistanceSq = distSqFloat;
        closestOptimalVector = v_sim;
      }
    }

    // El resultado final es la raíz cuadrada de la distancia mínima al cuadrado.
    const finalDistance = Math.sqrt(minDistanceSq);
    
    console.log(`✅ Distancia Mínima Encontrada: ${finalDistance.toFixed(4)}`);
    // Aquí puedes retornar también el closestOptimalVector
    return finalDistance;
  }

    /**
    * Genera el conjunto de vectores de simulación S a través de Combinaciones Lineales.
    * @param baseVectores La Base de Verdad {v1, v2, ...} como Fraccion[][].
    * @param numSimulaciones Número de escenarios a generar (ej: 1000).
    * @returns El conjunto S de vectores de simulación (Fraccion[][]).
    */
    public generarEspacioSimulacionS(baseVectores: Fraccion[][], numSimulaciones: number = 1000): Fraccion[][] {
        if (baseVectores.length === 0) return [];
        
        const dim = baseVectores[0].length; 
        const numBase = baseVectores.length; 
        const S: Fraccion[][] = [];

        // Función auxiliar para generar un coeficiente aleatorio (escalar)
        const generarCoeficiente = (): Fraccion => {
            // Coeficientes en el rango [-2.0, 2.0] como fracciones con denominador 1000
            const randFloat = Math.random() * 4.0 - 2.0; 
            const denominador = 1000n;
            const numerador = BigInt(Math.round(randFloat * 1000));
            return new Fraccion(numerador, denominador);
        };

        for (let k = 0; k < numSimulaciones; k++) {
            // Inicializar el vector de simulación sk a cero
            const sk: Fraccion[] = new Array(dim).fill(new Fraccion(0n));

            // Calcular sk = c1*v1 + c2*v2 + ... + cm*vm
            for (let j = 0; j < numBase; j++) {
                const vj = baseVectores[j]; 
                const cj = generarCoeficiente(); 

                // Sumar cj * vj a sk
                for (let i = 0; i < dim; i++) {
                    const producto = vj[i].multiplicar(cj); 
                    sk[i] = sk[i].sumar(producto); 
                }
            }
            S.push(sk);
        }
        console.log(`✅ Generados ${numSimulaciones} vectores de simulación S en R^${dim}`);
        return S;
    }

}

export default VectorAnalyticEngine; 