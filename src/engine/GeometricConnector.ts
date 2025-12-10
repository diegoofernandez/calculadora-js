import Fraccion from './objects/Fraccion';

type Vector = Fraccion[];

export default class GeometricConnector {
    private baseVectors: Vector[] = [];
    private connectionThreshold: number = 2.0;
    private simulationStrategy: string = 'optimal';
    private strictMode: boolean = true;
    

    private vectorCache: Map<string, boolean> = new Map();
    
    setBaseVectors(vectors: Vector[]): void {
        if (vectors.length < 1) {
            throw new Error("Se requiere al menos 1 vector base");
        }
        
        if (this.strictMode && vectors.length !== 3) {
            console.warn(`Modo estricto: Se esperaban 3 vectores, pero se recibieron ${vectors.length}. Cambiando a modo flexible.`);
            this.strictMode = false;
        }
        
        this.baseVectors = vectors;
        this.vectorCache.clear(); // Limpiar cache
        //console.log(`Vectores base configurados: ${vectors.length} vector(es)`);
    }
    
    setSimulationStrategy(strategy: string): void {
        this.simulationStrategy = strategy;
        
        switch (strategy) {
            case 'optimal':
                this.connectionThreshold = 2.0;
                this.strictMode = true;
                break;
            case 'completed-2d':
            case 'expanded-1d':
                this.connectionThreshold = 2.5;
                this.strictMode = false;
                break;
            case 'complementary':
            case 'canonical':
                this.connectionThreshold = 3.0;
                this.strictMode = false;
                break;
            default:
                this.connectionThreshold = 2.0;
                this.strictMode = false;
        }
        
        //console.log(`Estrategia configurada: ${strategy} (umbral: ${this.connectionThreshold})`);
    }
    
    canConnect(u: Vector, v: Vector): {
        connectable: boolean;
        reason: string;
        metrics: {
            angle: number;
            distance: number;
            inSameSubspace: boolean;
            dotProduct: number;
        }
    } {
        // Verificación rápida de colinealidad
        if (this.areColinear(u, v)) {
            return {
                connectable: false,
                reason: "Vectores colineales",
                metrics: this.calculateMetrics(u, v)
            };
        }
        
        const metrics = this.calculateMetrics(u, v);
        const MAX_ANGLE = Math.PI / 2;
        const MIN_DOT_PRODUCT = this.simulationStrategy === 'optimal' ? 0.1 : 0.05;
        
        const connectable = metrics.angle < MAX_ANGLE && 
                           metrics.distance < this.connectionThreshold &&
                           metrics.dotProduct > MIN_DOT_PRODUCT;
        
        return {
            connectable,
            reason: connectable ? "Vectores conectables" : "No conectable",
            metrics
        };
    }
    
    generateConnectedVector(existingVectors: Vector[]): Vector | null {
        if (this.baseVectors.length < 1) {
            throw new Error("Primero establece los vectores base con setBaseVectors()");
        }
        
        // Reducir intentos máximos para evitar bloqueos
        const maxAttempts = 50; // Reducido de 100-200
        
        // OPTIMIZACIÓN 1: Generar batch de candidatos
        const batchSize = 10;
        const candidates: Vector[] = [];
        
        for (let batch = 0; batch < Math.ceil(maxAttempts / batchSize); batch++) {
            // Generar batch de candidatos
            candidates.length = 0;
            for (let i = 0; i < batchSize; i++) {
                candidates.push(this.generateCandidateVector());
            }
            
            // OPTIMIZACIÓN 2: Verificar solo contra muestra de vectores existentes
            const sampleSize = Math.min(20, existingVectors.length);
            const sampleIndices = this.getRandomSample(existingVectors.length, sampleSize);
            
            // Probar cada candidato
            for (const candidate of candidates) {
                // Verificar cache
                const cacheKey = this.vectorToKey(candidate);
                if (this.vectorCache.has(cacheKey)) continue;
                
                let isValid = true;
                
                // Verificación rápida de colinealidad con muestra
                for (const idx of sampleIndices) {
                    if (this.areColinearFast(candidate, existingVectors[idx])) {
                        isValid = false;
                        break;
                    }
                }
                
                if (!isValid) continue;
                
                // Verificar conectividad con al menos un vector de la muestra
                let connectableToAny = false;
                for (const idx of sampleIndices) {
                    const result = this.canConnect(candidate, existingVectors[idx]);
                    if (result.connectable) {
                        connectableToAny = true;
                        break;
                    }
                }
                
                if (connectableToAny) {
                    this.vectorCache.set(cacheKey, true);
                    return candidate;
                }
            }
        }
        
        // Si no encontramos nada, generar vector simple
        console.warn(`No se encontró vector conectable después de ${maxAttempts} intentos`);
        return this.generateSimpleRandomVector(this.baseVectors[0].length);
    }
    
    // OPTIMIZACIÓN: Verificación rápida de colinealidad
    private areColinearFast(u: Vector, v: Vector): boolean {
        if (u.length !== v.length) return false;
        
        // Encontrar primer ratio no-cero
        let ratio: number | null = null;
        const tolerance = 1e-6;
        
        for (let i = 0; i < u.length; i++) {
            const vVal = v[i].toFloat();
            const uVal = u[i].toFloat();
            
            if (Math.abs(vVal) < tolerance) {
                if (Math.abs(uVal) > tolerance) return false;
                continue;
            }
            
            const currentRatio = uVal / vVal;
            
            if (ratio === null) {
                ratio = currentRatio;
            } else if (Math.abs(currentRatio - ratio) > tolerance) {
                return false;
            }
        }
        
        return true;
    }
    
    // Generar muestra aleatoria de índices
    private getRandomSample(total: number, sampleSize: number): number[] {
        if (sampleSize >= total) {
            return Array.from({ length: total }, (_, i) => i);
        }
        
        const indices = new Set<number>();
        while (indices.size < sampleSize) {
            indices.add(Math.floor(Math.random() * total));
        }
        return Array.from(indices);
    }
    
    // Convertir vector a string para cache
    private vectorToKey(v: Vector): string {
        return v.map(f => f.toFloat().toFixed(3)).join(',');
    }
    
    private generateCandidateVector(): Vector {
        const baseCount = this.baseVectors.length;
        const coefficients: Fraccion[] = [];
        
        // OPTIMIZACIÓN: Coeficientes más variados
        const range = this.simulationStrategy === 'optimal' ? 3 : 4;
        
        for (let i = 0; i < baseCount; i++) {
            coefficients.push(this.randomFraction(-range, range));
        }
        
        return this.linearCombination(coefficients);
    }
    
    private generateAlternativeCandidate(existingVectors: Vector[]): Vector | null {
        if (existingVectors.length < 2) return null;
        
        const i = Math.floor(Math.random() * existingVectors.length);
        const j = Math.floor(Math.random() * existingVectors.length);
        
        if (i === j) return null;
        
        const u = existingVectors[i];
        const v = existingVectors[j];
        const dim = u.length;
        
        const newVector: Vector = [];
        for (let d = 0; d < dim; d++) {
            const avg = u[d].sumar(v[d]).multiplicar(new Fraccion(1n, 2n));
            const perturbation = this.randomFraction(-0.5, 0.5);
            newVector.push(avg.sumar(perturbation));
        }
        
        return newVector;
    }
    
    private generateSimpleRandomVector(dimension: number): Vector {
        const vector: Vector = [];
        for (let i = 0; i < dimension; i++) {
            const value = Math.random() * 2 - 1;
            const numerator = BigInt(Math.round(value * 100));
            vector.push(new Fraccion(numerator, 100n));
        }
        return vector;
    }
    
    findConnectedPairs(vectors: Vector[]): Array<{i: number, j: number, metrics: any}> {
        const pairs: Array<{i: number, j: number, metrics: any}> = [];
        
        // OPTIMIZACIÓN: Solo verificar muestra de pares para conjuntos grandes
        const maxPairsToCheck = 10000;
        const totalPairs = (vectors.length * (vectors.length - 1)) / 2;
        
        if (totalPairs <= maxPairsToCheck) {
            // Verificar todos los pares
            for (let i = 0; i < vectors.length; i++) {
                for (let j = i + 1; j < vectors.length; j++) {
                    const result = this.canConnect(vectors[i], vectors[j]);
                    if (result.connectable) {
                        pairs.push({ i, j, metrics: result.metrics });
                    }
                }
            }
        } else {
            // Verificar muestra aleatoria de pares
            const samplesToCheck = maxPairsToCheck;
            for (let k = 0; k < samplesToCheck; k++) {
                const i = Math.floor(Math.random() * vectors.length);
                const j = Math.floor(Math.random() * vectors.length);
                
                if (i !== j && i < j) {
                    const result = this.canConnect(vectors[i], vectors[j]);
                    if (result.connectable) {
                        pairs.push({ i, j, metrics: result.metrics });
                    }
                }
            }
        }
        
        return pairs;
    }
    
    buildConnectivityGraph(vectors: Vector[]): number[][] {
        const n = vectors.length;
        const graph: number[][] = [];
        
        for (let i = 0; i < n; i++) {
            graph.push(new Array(n).fill(0));
        }
        
        const pairs = this.findConnectedPairs(vectors);
        
        for (const {i, j, metrics} of pairs) {
            const weight = 1.0 / (metrics.distance + 0.01);
            graph[i][j] = weight;
            graph[j][i] = weight;
        }
        
        return graph;
    }
    
    // ==================== MÉTODOS PRIVADOS ====================
    
    private calculateMetrics(u: Vector, v: Vector) {
        const dot = this.dotProduct(u, v);
        const normU = Math.sqrt(this.dotProduct(u, u).toFloat());
        const normV = Math.sqrt(this.dotProduct(v, v).toFloat());
        
        let angle = Math.PI;
        let dotProductNorm = 0;
        
        if (normU > 0 && normV > 0) {
            const cosTheta = dot.toFloat() / (normU * normV);
            const clamped = Math.max(-1, Math.min(1, cosTheta));
            angle = Math.acos(clamped);
            dotProductNorm = cosTheta;
        }
        
        const distance = this.calculateDistance(u, v);
        
        return {
            angle,
            distance,
            inSameSubspace: true,
            dotProduct: dotProductNorm
        };
    }
    
    private dotProduct(u: Vector, v: Vector): Fraccion {
        let result = new Fraccion(0n);
        for (let i = 0; i < u.length; i++) {
            result = result.sumar(u[i].multiplicar(v[i]));
        }
        return result;
    }
    
    private calculateDistance(u: Vector, v: Vector): number {
        let sumSquares = new Fraccion(0n);
        for (let i = 0; i < u.length; i++) {
            const diff = u[i].sumar(v[i].negar());
            sumSquares = sumSquares.sumar(diff.multiplicar(diff));
        }
        return Math.sqrt(sumSquares.toFloat());
    }
    
    private areColinear(u: Vector, v: Vector, tolerance: number = 1e-6): boolean {
        if (u.length !== v.length) return false;
        
        let lambda: Fraccion | null = null;
        
        for (let i = 0; i < u.length; i++) {
            if (v[i].esCero()) {
                if (!u[i].esCero()) return false;
                continue;
            }
            
            const currentLambda = u[i].dividir(v[i]);
            
            if (lambda === null) {
                lambda = currentLambda;
            } else if (!currentLambda.equals(lambda)) {
                return false;
            }
        }
        
        return true;
    }
    
    private isColinearWithAny(vector: Vector, vectors: Vector[]): boolean {
        for (const v of vectors) {
            if (this.areColinear(vector, v)) {
                return true;
            }
        }
        return false;
    }
    
    private linearCombination(coefficients: Fraccion[]): Vector {
        const baseCount = this.baseVectors.length;
        if (coefficients.length !== baseCount) {
            throw new Error(`Requiere ${baseCount} coeficientes para ${baseCount} vectores base`);
        }
        
        const dim = this.baseVectors[0].length;
        const result: Vector = [];
        
        for (let d = 0; d < dim; d++) {
            result.push(new Fraccion(0n));
        }
        
        for (let d = 0; d < dim; d++) {
            for (let i = 0; i < baseCount; i++) {
                const term = this.baseVectors[i][d].multiplicar(coefficients[i]);
                result[d] = result[d].sumar(term);
            }
        }
        
        return result;
    }
    
    private randomFraction(min: number, max: number): Fraccion {
        const value = min + Math.random() * (max - min);
        const numerator = BigInt(Math.round(value * 1000));
        const denominator = 1000n;
        return new Fraccion(numerator, denominator);
    }
}