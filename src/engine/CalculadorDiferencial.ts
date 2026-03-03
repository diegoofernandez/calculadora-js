// Interfaces inferidas de tu estructura AST actual
export interface PartePotencia {
    objeto: "Potencia";
    base: string;
    exponente: number; 
}

export interface Monomio {
    type: "Monomio";
    coeficiente: any; // Acá entrará tu instancia de la clase 'Fraccion'
    partes: PartePotencia[];
}

export type Polinomio = Monomio[];

export class CalculadorDiferencial {
    
    /**
     * Calcula la Matriz Jacobiana de un sistema de polinomios.
     * J[i][j] = derivada del polinomio i respecto a la variable j.
     */
    public static calcularJacobiano(sistema: Polinomio[], variables: string[]): Polinomio[][] {
        const jacobiano: Polinomio[][] = [];

        for (let i = 0; i < sistema.length; i++) {
            const filaDerivadas: Polinomio[] = [];
            for (let j = 0; j < variables.length; j++) {
                const derivadaParcial = this.derivarPolinomio(sistema[i], variables[j]);
                filaDerivadas.push(derivadaParcial);
            }
            jacobiano.push(filaDerivadas);
        }

        return jacobiano;
    }

    /**
     * Deriva un polinomio completo respecto a una variable objetivo.
     */
    public static derivarPolinomio(polinomio: Polinomio, variableObjetivo: string): Polinomio {
        const polinomioDerivado: Polinomio = [];

        for (const monomio of polinomio) {
            const monomioDerivado = this.derivarMonomio(monomio, variableObjetivo);
            // Si no es null (es decir, la derivada no dio cero), lo agregamos al nuevo polinomio
            if (monomioDerivado !== null) {
                polinomioDerivado.push(monomioDerivado);
            }
        }

        return polinomioDerivado;
    }

    /**
     * Aplica la regla de derivación a un monomio individual: d/dx (c * x^n * y^m) = (c*n) * x^(n-1) * y^m
     */
    private static derivarMonomio(monomio: Monomio, variableObjetivo: string): Monomio | null {
        // Buscamos si la variable objetivo existe en las partes de este monomio
        const indiceVariable = monomio.partes.findIndex(p => p.base === variableObjetivo);

        // Si la variable no está en este monomio, se lo considera una constante. Su derivada es 0.
        if (indiceVariable === -1) {
            return null; 
        }

        const parteObjetivo = monomio.partes[indiceVariable];
        const exponenteViejo = parteObjetivo.exponente;

        // Si el exponente es 0 (algo raro, pero por seguridad), la derivada es 0.
        if (exponenteViejo === 0) return null;

        // 1. MULTIPLICAMOS EL COEFICIENTE POR EL EXPONENTE
        // IMPORTANTE: Acá asumo que tu clase Fraccion tiene un método para multiplicar por un entero.
        // Reemplazá esto con el método exacto de tu clase Fraccion (ej: monomio.coeficiente.multiplicarPorEntero(exponenteViejo))
        const nuevoCoeficiente = monomio.coeficiente * exponenteViejo; 

        // 2. RESTAMOS 1 AL EXPONENTE
        const nuevoExponente = exponenteViejo - 1;

        // 3. RECONSTRUIMOS LAS PARTES (AST)
        const nuevasPartes: PartePotencia[] = [];
        for (let i = 0; i < monomio.partes.length; i++) {
            if (i === indiceVariable) {
                // Solo conservamos la variable si el nuevo exponente no es 0 (ej: derivada de x^1 es 1, la 'x' desaparece)
                if (nuevoExponente > 0) {
                    nuevasPartes.push({
                        objeto: "Potencia",
                        base: variableObjetivo,
                        exponente: nuevoExponente
                    });
                }
            } else {
                // Las otras variables (constantes en esta derivada parcial) quedan intactas
                nuevasPartes.push({ ...monomio.partes[i] });
            }
        }

        // Devolvemos el nuevo monomio mutado matemáticamente
        return {
            type: "Monomio",
            coeficiente: nuevoCoeficiente, // Acá iría tu nueva instancia de Fraccion
            partes: nuevasPartes
        };
    }

    /**
     * Evalúa un polinomio simbólico en un punto numérico específico.
     * Ejemplo punto: { "x": 5, "y": -2, "z": 1 }
     */
    public static evaluarPolinomio(polinomio: Polinomio, punto: Record<string, number>): number {
        let suma = 0;
        for (const monomio of polinomio) {
            // Adaptación al tipo de tu clase Fraccion. 
            // Plotly necesita números reales (floats) para dibujar, así que acá extraemos el valor numérico.
            let coefNumerico = 0;
            if (typeof monomio.coeficiente === 'number') {
                coefNumerico = monomio.coeficiente;
            } else if (monomio.coeficiente && monomio.coeficiente.numerador !== undefined) {
                // Si es tu clase Fraccion clásica:
                coefNumerico = Number(monomio.coeficiente.numerador) / Number(monomio.coeficiente.denominador);
            } else {
                // Fallback de seguridad
                coefNumerico = Number(monomio.coeficiente);
            }

            let valorMonomio = coefNumerico;
            for (const parte of monomio.partes) {
                // Si la variable no está en el punto, asumimos 1 (para no anular variables no graficadas)
                const valorBase = punto[parte.base] !== undefined ? punto[parte.base] : 1; 
                valorMonomio *= Math.pow(valorBase, parte.exponente);
            }
            suma += valorMonomio;
        }
        return suma;
    }

    /**
     * Convierte el Jacobiano Simbólico en una Matriz Numérica pura evaluada en un punto.
     */
    public static evaluarJacobiano(jacobianoSimb: Polinomio[][], punto: Record<string, number>): number[][] {
        return jacobianoSimb.map(fila => fila.map(pol => this.evaluarPolinomio(pol, punto)));
    }

    /**
     * Calcula el determinante de una matriz cuadrada numérica (Algoritmo de Laplace).
     * Soporta matrices N x N para máxima escalabilidad estructural.
     */
    
    public static calcularDeterminante(M: number[][]): number {
        const n = M.length;
        if (n === 0) return 0;
        if (n === 1) return M[0][0];
        if (n === 2) return (M[0][0] * M[1][1]) - (M[0][1] * M[1][0]); // Caso base rápido 2x2
        if (n === 3) { // Caso base rápido 3x3 (Regla de Sarrus)
            return M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) -
                   M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) +
                   M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
        }

        // Para N > 3 (Recursividad)
        let det = 0;
        for (let j = 0; j < n; j++) {
            const subMatriz = M.slice(1).map(fila => fila.filter((_, colIndex) => colIndex !== j));
            det += M[0][j] * Math.pow(-1, j) * this.calcularDeterminante(subMatriz);
        }
        return det;
    }



}