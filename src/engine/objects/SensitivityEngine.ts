import Fraccion from './Fraccion';

export interface SobolResult {
    variable: string;
    indice: number; // Valor entre 0 y 1
    varianza: number;
    clasificacion: 'DOMINANTE' | 'INFLUYENTE' | 'ESTÁTICA';
}

export default class SensitivityEngine {

    /**
     * Calcula los Índices de Sensibilidad de Primer Orden basados en Varianza
     * @param vectores Los 300+ vectores simulados (Nube de puntos)
     * @param nombresVariables Los nombres ['C', 'G', 'M', etc.]
     */
    public calcularIndicesSobol(vectores: Fraccion[][], nombresVariables: string[]): SobolResult[] {
        const n = vectores.length;
        const dim = nombresVariables.length;

        if (n < 10) return []; // Necesitamos muestra estadística mínima

        // 1. Convertir a Float y Normalizar (Z-Score)
        // Para comparar "Peras" (Precio $1000) con "Manzanas" (Horas 8)
        const matrizNormalizada = this.normalizarMatriz(vectores, dim);

        // 2. Calcular Varianza Total del Sistema (La "Energía" del negocio)
        // Usamos la norma euclidiana de cada vector como métrica de "Estado"
        const estados: number[] = matrizNormalizada.map(vec => 
            Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0))
        );
        
        const varianzaTotal = this.calcularVarianza(estados);
        if (varianzaTotal === 0) return [];

        const resultados: SobolResult[] = [];

        // 3. Calcular Varianza Parcial por Variable (El corazón de Sobol)
        for (let i = 0; i < dim; i++) {
            // Extraemos la columna de la variable i
            const columna = matrizNormalizada.map(v => v[i]);
            
            // Calculamos su varianza individual
            const varianzaVar = this.calcularVarianza(columna);

            // Índice de Sobol (Aproximación de primer orden para sistemas acoplados)
            // En sistemas restringidos, esto mide la "libertad" relativa de la variable.
            let indice = varianzaVar / (varianzaTotal + 0.0001); // Evitar div/0
            
            // Normalización final para que sumen aprox 100% (para visualización)
            // (Nota: En sistemas no lineales complejos, la suma puede no ser 1 por las interacciones, 
            // pero para el usuario normalizamos)
            resultados.push({
                variable: nombresVariables[i].toUpperCase(),
                indice: indice,
                varianza: varianzaVar,
                clasificacion: this.clasificar(indice)
            });
        }

        // Re-normalizar porcentajes para UX
        const sumaIndices = resultados.reduce((sum, r) => sum + r.indice, 0);
        return resultados.map(r => ({
            ...r,
            indice: (r.indice / sumaIndices) * 100 // Pasamos a porcentaje directo
        })).sort((a, b) => b.indice - a.indice); // Ordenar de mayor a menor impacto
    }

    private normalizarMatriz(vectores: Fraccion[][], dim: number): number[][] {
        const n = vectores.length;
        const floats = vectores.map(v => v.map(f => f.toFloat()));
        
        const matrizNorm: number[][] = Array(n).fill(0).map(() => Array(dim).fill(0));

        for (let j = 0; j < dim; j++) {
            // Media
            let sum = 0;
            for (let i = 0; i < n; i++) sum += floats[i][j];
            const media = sum / n;

            // Desvío
            let sumSq = 0;
            for (let i = 0; i < n; i++) sumSq += Math.pow(floats[i][j] - media, 2);
            const desvio = Math.sqrt(sumSq / n) || 1; // Evitar div/0

            // Z-Score
            for (let i = 0; i < n; i++) {
                matrizNorm[i][j] = (floats[i][j] - media) / desvio;
            }
        }
        return matrizNorm;
    }

    private calcularVarianza(datos: number[]): number {
        const n = datos.length;
        if (n === 0) return 0;
        const media = datos.reduce((a, b) => a + b, 0) / n;
        return datos.reduce((a, b) => a + Math.pow(b - media, 2), 0) / n;
    }

    private clasificar(valor: number): 'DOMINANTE' | 'INFLUYENTE' | 'ESTÁTICA' {
        if (valor > 0.4) return 'DOMINANTE';
        if (valor > 0.1) return 'INFLUYENTE';
        return 'ESTÁTICA';
    }
}