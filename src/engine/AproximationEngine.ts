import Fraccion from './objects/Fraccion';
import VectorAnalyticEngine from './objects/analytics/VectorAnalyticEngine';
import GeometricConnector from './GeometricConnector';
import ASTConstrucG from './libs/ASTConstructG';
import GrobnerRobusto from './objects/grobner/Grobner';

type Vector = Fraccion[];

export default class AproximationEngine {
    private vectorEngine: VectorAnalyticEngine;
    private geometricConnector: GeometricConnector;
    private simulationId: string;
    private startTime: number;
    
    constructor() {
        this.vectorEngine = new VectorAnalyticEngine();
        this.geometricConnector = new GeometricConnector();
        this.simulationId = this.generateSimulationId();
        this.startTime = Date.now();
        
        this.initializeStorage();
    }
    
    private generateSimulationId(): string {
        return `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    private initializeStorage(): void {
        try {
            const keysToPreserve = ['groebner_pasos', 'bases'];
            const allKeys = Object.keys(localStorage);
            
            for (const key of allKeys) {
                if (key.startsWith('algebra_sim_') && !keysToPreserve.includes(key)) {
                    localStorage.removeItem(key);
                }
            }
        } catch (error) {
            console.warn('Error inicializando storage:', error);
        }
    }
    
    private saveToLocalStorage(key: string, data: any): void {
        try {
            const storageData = {
                simulationId: this.simulationId,
                timestamp: new Date().toISOString(),
                data: this.simplifyForStorage(data)
            };
            
            localStorage.setItem(`algebra_sim_${key}`, JSON.stringify(storageData));
            this.updateSimulationHistory(key, storageData);
            
        } catch (error) {
            console.warn('LocalStorage full:', error);
        }
    }
    
    private simplifyForStorage(data: any): any {
        if (data instanceof Array) {
            return data.map(item => this.simplifyForStorage(item));
        }
        
        if (data instanceof Fraccion) {
            return data.toString();
        }
        
        if (typeof data === 'object' && data !== null) {
            const simplified: any = {};
            for (const [key, value] of Object.entries(data)) {
                simplified[key] = this.simplifyForStorage(value);
            }
            return simplified;
        }
        
        return data;
    }
    
    private updateSimulationHistory(key: string, data: any): void {
        try {
            const historyKey = 'simulation_history';
            const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
            
            history.unshift({
                id: this.simulationId,
                key: key,
                timestamp: new Date().toISOString(),
                summary: `Simulación ${key.replace('algebra_sim_', '')}`
            });
            
            if (history.length > 20) {
                history.pop();
            }
            
            localStorage.setItem(historyKey, JSON.stringify(history));
        } catch (error) {
            console.warn('Error actualizando historial:', error);
        }
    }
    
    public async runCompleteSimulation(
        polinomiosInput: any[],
        options: {
            maxVectors?: number;
            targetVectors?: number;
            showSteps?: boolean;
            minVectorsForSimulation?: number;
        } = {}
    ): Promise<{
        success: boolean;
        simulationId: string;
        results: any;
        frontendData: any;
    }> {
        const startTime = Date.now();
        
        try {
            localStorage.setItem('simulation_status', '🚀 Iniciando simulación...');
            
            localStorage.setItem('simulation_status', '📐 Calculando base de Gröbner...');
            const grobnerResult = await this.calculateGroebnerBase(polinomiosInput);
            
            if (!grobnerResult.vectorialData) {
                throw new Error('No se pudo obtener datos vectoriales de Gröbner');
            }
            
            const optimalVectors = grobnerResult.vectorialData.optimalVectors || [];
            const isViable = grobnerResult.vectorialData.isViable !== false;
            
            if (!isViable) {
                throw new Error('Base de Gröbner no viable');
            }
            
            console.log(`📊 Grobner devolvió: ${optimalVectors.length} vector(es) viable=${isViable}`);
            
            const minRequired = options.minVectorsForSimulation || 3;
            let baseVectors: Vector[];
            let simulationStrategy: string;
            let adaptationInfo: string;
            
            if (optimalVectors.length >= minRequired) {
                baseVectors = optimalVectors.slice(0, minRequired);
                simulationStrategy = 'optimal';
                adaptationInfo = `Usando ${minRequired} vectores óptimos de Grobner`;
                console.log(`✅ ${adaptationInfo}`);
                
            } else if (optimalVectors.length === 2) {
                baseVectors = this.completarBase2D(optimalVectors, minRequired);
                simulationStrategy = 'completed-2d';
                adaptationInfo = `Completado de 2 a ${minRequired} vectores`;
                console.log(`🔧 ${adaptationInfo}`);
                
            } else if (optimalVectors.length === 1) {
                baseVectors = this.expandirBase1D(optimalVectors[0], minRequired);
                simulationStrategy = 'expanded-1d';
                adaptationInfo = `Expandido de 1 a ${minRequired} vectores`;
                console.log(`🔄 ${adaptationInfo}`);
                
            } else if (optimalVectors.length === 0) {
                baseVectors = this.crearBaseCanonica(minRequired);
                simulationStrategy = 'canonical';
                adaptationInfo = `Creada base canónica de ${minRequired} vectores`;
                console.log(`⚡ ${adaptationInfo}`);
                
            } else {
                baseVectors = this.generarBaseComplementaria(optimalVectors, minRequired);
                simulationStrategy = 'complementary';
                adaptationInfo = `Generada base complementaria (${optimalVectors.length} → ${minRequired})`;
                console.log(`🎭 ${adaptationInfo}`);
            }
            
            try {
                this.geometricConnector.setBaseVectors(baseVectors);
                this.geometricConnector.setSimulationStrategy(simulationStrategy);
            } catch (error: any) {
                console.warn(`Error configurando conector: ${error.message}`);
            }
            
            // OPTIMIZACIÓN: Ajustar target más conservadoramente
            let targetVectors = options.targetVectors || 50;
            if (simulationStrategy !== 'optimal') {
                targetVectors = Math.floor(targetVectors * 0.6); // Reducido de 0.7
            }
            
            // Limitar máximo de vectores
            targetVectors = Math.min(targetVectors, 200); // Límite absoluto
            
            console.log(`🎯 Target: ${targetVectors} vectores (estrategia: ${simulationStrategy})`);
            
            localStorage.setItem('simulation_status', '🌌 Generando espacio de simulación...');
            const simulationResult = await this.generateSimulationSpace(
                baseVectors, 
                targetVectors
            );
            
            localStorage.setItem('simulation_status', '🔗 Analizando conectividad...');
            const connectivity = this.geometricConnector.buildConnectivityGraph(
                simulationResult.simulationVectors
            );
            
            const frontendData = this.prepareJSONOutput({
                grobnerResult,
                baseVectors,
                simulationResult,
                connectivity,
                options,
                simulationStrategy,
                adaptationInfo,
                originalVectorsCount: optimalVectors.length
            });
            
            const finalResults = {
                success: true,
                simulationId: this.simulationId,
                duration: Date.now() - startTime,
                results: {
                    grobnerBase: grobnerResult.basePolynomials || [],
                    originalVectorsCount: optimalVectors.length,
                    simulationStrategy: simulationStrategy,
                    adaptationInfo: adaptationInfo,
                    baseVectors: this.vectorsToString(baseVectors),
                    simulationVectors: this.vectorsToString(simulationResult.simulationVectors),
                    connectivity,
                    geometricProperties: simulationResult.geometricProperties
                },
                frontendData
            };
            
            this.saveToLocalStorage('final_results', finalResults);
            
            // Preparar datos para exportación
            const powerBIData = this.generatePowerBIExport(finalResults);
            this.saveToLocalStorage('powerbi_export', powerBIData);
            
            const excelData = this.generateExcelExport(finalResults);
            this.saveToLocalStorage('excel_export', excelData);
            
            localStorage.setItem('simulation_status', '✅ Simulación completada');
            localStorage.setItem('last_simulation_id', this.simulationId);
            
            // Agregar métodos de exportación al resultado
            finalResults.frontendData.exportMethods = {
                powerBI: 'Use downloadPowerBIFile(results)',
                excel: 'Use downloadExcelFile(results) or downloadExcelXLSX(results)'
            };
            
            console.log('📊 Datos preparados para exportación a Power BI y Excel');
            
            return finalResults;
            
        } catch (error: any) {
            console.error('❌ Error en simulación:', error);
            
            const errorResult = {
                success: false,
                simulationId: this.simulationId,
                duration: Date.now() - startTime,
                error: error.message
            };
            
            this.saveToLocalStorage('error', errorResult);
            localStorage.setItem('simulation_status', `❌ Error: ${error.message}`);
            
            return {
                ...errorResult,
                results: null,
                frontendData: {
                    error: error.message,
                    status: 'failed',
                    timestamp: new Date().toISOString()
                }
            };
        }
    }
    
    private completarBase2D(vectores: Vector[], minRequired: number): Vector[] {
        if (vectores.length < 2) return this.crearBaseCanonica(minRequired);
        
        const result = [...vectores];
        const dimension = vectores[0].length;
        const v1 = vectores[0];
        const v2 = vectores[1];
        
        for (let k = 2; k < minRequired; k++) {
            const nuevoVector: Vector = [];
            
            for (let i = 0; i < dimension; i++) {
                const factor1 = new Fraccion(BigInt(k + 1), BigInt(2 * (k + 1)));
                const factor2 = new Fraccion(BigInt(k * 3), BigInt(k + 4));
                
                const term1 = v1[i].multiplicar(factor1);
                const term2 = v2[i].multiplicar(factor2);
                
                const randomComp = new Fraccion(
                    BigInt((i + k) % 7 + 1), 
                    BigInt(10)
                );
                
                nuevoVector.push(term1.sumar(term2).sumar(randomComp));
            }
            
            result.push(nuevoVector);
        }
        
        return result;
    }
    
    private expandirBase1D(vector: Vector, minRequired: number): Vector[] {
        const result: Vector[] = [vector];
        const dimension = vector.length;
        
        for (let k = 1; k < minRequired; k++) {
            const nuevoVector: Vector = [];
            
            for (let i = 0; i < dimension; i++) {
                if (i === k - 1) {
                    nuevoVector.push(new Fraccion(1n, 1n));
                } else if (i === 0 && !vector[0].esCero()) {
                    const relacion = new Fraccion(BigInt(-(k + 1)), BigInt(k + 2));
                    nuevoVector.push(vector[0].multiplicar(relacion));
                } else {
                    if ((i + k) % 3 === 0) {
                        nuevoVector.push(new Fraccion(BigInt(1), BigInt(7)));
                    } else {
                        nuevoVector.push(new Fraccion(0n, 1n));
                    }
                }
            }
            
            result.push(nuevoVector);
        }
        
        return result;
    }
    
    private crearBaseCanonica(minRequired: number): Vector[] {
        const result: Vector[] = [];
        
        for (let k = 0; k < minRequired; k++) {
            const vector: Vector = [];
            
            for (let i = 0; i < minRequired; i++) {
                if (i === k) {
                    vector.push(new Fraccion(1n, 1n));
                } else if ((i + k) % 2 === 0) {
                    vector.push(new Fraccion(1n, 2n));
                } else {
                    vector.push(new Fraccion(0n, 1n));
                }
            }
            
            result.push(vector);
        }
        
        return result;
    }
    
    private generarBaseComplementaria(vectores: Vector[], minRequired: number): Vector[] {
        const result = [...vectores];
        const dimension = vectores.length > 0 ? vectores[0].length : minRequired;
        
        while (result.length < minRequired) {
            const idx = result.length;
            const nuevoVector: Vector = [];
            
            for (let i = 0; i < dimension; i++) {
                const baseVal = (i * 17 + idx * 13) % 11;
                const sign = (i + idx) % 2 === 0 ? 1n : -1n;
                const den = 8n + BigInt(idx % 5);
                
                nuevoVector.push(new Fraccion(sign * BigInt(baseVal + 1), den));
            }
            
            result.push(nuevoVector);
        }
        
        return result;
    }
    
    private async calculateGroebnerBase(input: any[]): Promise<{
        basePolynomials?: any[];
        vectorialData?: any;
    }> {
        try {
            const ast = ASTConstrucG.construirAST(input);
            const grobner = new GrobnerRobusto(ast);
            
            const vectorialData = grobner.obtenerBaseVectorialOptima();
            
            let basePolynomials: any[] = [];
            if (typeof grobner.getBase === 'function') {
                basePolynomials = grobner.getBase();
            }
            
            return {
                basePolynomials,
                vectorialData
            };
            
        } catch (error) {
            console.error('Error en cálculo de Gröbner:', error);
            throw error;
        }
    }
    
    private vectorsToString(vectors: Vector[]): any[] {
        return vectors.map(vector => 
            vector.map(fraccion => fraccion.toString())
        );
    }
    
    private prepareJSONOutput(results: any): any {
        return {
            metadata: {
                engine: "AlgebraicDecisionEngine",
                version: "2.0.0",
                timestamp: new Date().toISOString(),
                simulationId: this.simulationId,
                adaptationStrategy: results.simulationStrategy || 'optimal',
                adaptationInfo: results.adaptationInfo || 'No adaptation needed'
            },
            algebraicAnalysis: {
                polynomialsCount: results.grobnerResult?.basePolynomials?.length || 0,
                originalVectorsCount: results.originalVectorsCount || 0,
                basePolynomials: results.grobnerResult?.basePolynomials || [],
                isValid: results.grobnerResult?.vectorialData?.isViable || false,
                monomialBasis: results.grobnerResult?.vectorialData?.monomialBasis || []
            },
            vectorSpace: {
                dimension: results.baseVectors?.[0]?.length || 0,
                simulationStrategy: results.simulationStrategy || 'optimal',
                baseVectors: this.vectorsToString(results.baseVectors || []),
                simulatedVectorsCount: results.simulationResult?.simulationVectors?.length || 0,
                connectivityMatrix: results.connectivity || [],
                geometricProperties: results.simulationResult?.geometricProperties || {}
            },
            simulationInfo: {
                targetVectors: results.options?.targetVectors || 50,
                actualVectors: results.simulationResult?.simulationVectors?.length || 0,
                connectivityRate: results.simulationResult?.geometricProperties?.connectivityRate || 0,
                averageDistance: results.simulationResult?.geometricProperties?.averageDistance || 0
            }
        };
    }
    
    private async generateSimulationSpace(
        baseVectors: Vector[], 
        targetCount: number
    ): Promise<{
        simulationVectors: Vector[];
        geometricProperties: any;
    }> {
        const simulationVectors: Vector[] = [...baseVectors];
        let consecutiveFailures = 0;
        const maxConsecutiveFailures = 20; // Reducido de 30
        
        // OPTIMIZACIÓN: Actualizar UI con menos frecuencia
        let lastUpdate = Date.now();
        const updateInterval = 500; // ms
        
        while (simulationVectors.length < targetCount && consecutiveFailures < maxConsecutiveFailures) {
            const newVector = this.geometricConnector.generateConnectedVector(simulationVectors);
            
            if (newVector) {
                simulationVectors.push(newVector);
                consecutiveFailures = 0;
                
                // Actualizar UI solo cada intervalo
                const now = Date.now();
                if (now - lastUpdate > updateInterval) {
                    const status = ` Generados ${simulationVectors.length}/${targetCount} vectores`;
                    localStorage.setItem('simulation_status', status);
                    console.log(status);
                    lastUpdate = now;
                    
                    // Yield control al navegador
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            } else {
                consecutiveFailures++;
            }
        }
        
        if (consecutiveFailures >= maxConsecutiveFailures) {
            console.warn(`Generación detenida: ${simulationVectors.length} vectores (límite de fallos)`);
        }
        
        // OPTIMIZACIÓN: Calcular propiedades solo para muestra
        return {
            simulationVectors,
            geometricProperties: {
                totalVectors: simulationVectors.length,
                averageDistance: this.calculateAverageDistanceSampled(simulationVectors),
                connectivityRate: this.calculateConnectivityRate(simulationVectors)
            }
        };
    }
    
    // OPTIMIZACIÓN: Calcular distancia promedio solo con muestra
    private calculateAverageDistanceSampled(vectors: Vector[]): number {
        if (vectors.length < 2) return 0;
        
        const maxSamples = 500;
        const totalPairs = (vectors.length * (vectors.length - 1)) / 2;
        
        if (totalPairs <= maxSamples) {
            return this.calculateAverageDistance(vectors);
        }
        
        // Muestreo aleatorio
        let totalDistance = 0;
        for (let k = 0; k < maxSamples; k++) {
            const i = Math.floor(Math.random() * vectors.length);
            const j = Math.floor(Math.random() * vectors.length);
            
            if (i !== j) {
                totalDistance += this.calculateDistance(vectors[i], vectors[j]);
            }
        }
        
        return totalDistance / maxSamples;
    }
    
    private calculateAverageDistance(vectors: Vector[]): number {
        if (vectors.length < 2) return 0;
        
        let totalDistance = 0;
        let pairCount = 0;
        
        for (let i = 0; i < vectors.length; i++) {
            for (let j = i + 1; j < vectors.length; j++) {
                const distance = this.calculateDistance(vectors[i], vectors[j]);
                totalDistance += distance;
                pairCount++;
            }
        }
        
        return pairCount > 0 ? totalDistance / pairCount : 0;
    }
    
    private calculateDistance(u: Vector, v: Vector): number {
        let sumSquares = new Fraccion(0n);
        for (let i = 0; i < u.length; i++) {
            const diff = u[i].sumar(v[i].negar());
            sumSquares = sumSquares.sumar(diff.multiplicar(diff));
        }
        return Math.sqrt(sumSquares.toFloat());
    }
    
    private calculateConnectivityRate(vectors: Vector[]): number {
        const pairs = this.geometricConnector.findConnectedPairs(vectors);
        const totalPossiblePairs = (vectors.length * (vectors.length - 1)) / 2;
        return totalPossiblePairs > 0 ? pairs.length / totalPossiblePairs : 0;
    }
    
    // ==================== EXPORTACIÓN A POWER BI ====================
    
    /**
     * Genera estructura optimizada para Power BI con tablas relacionales
     */
    public generatePowerBIExport(simulationResults: any): {
        tables: {
            Metadata: any[];
            BaseVectors: any[];
            SimulationVectors: any[];
            ConnectivityPairs: any[];
            GeometricMetrics: any[];
        };
        relationships: any[];
    } {
        const simId = simulationResults.simulationId;
        const results = simulationResults.results;
        const frontendData = simulationResults.frontendData;
        
        // Tabla 1: Metadata (1 fila)
        const metadata = [{
            SimulationID: simId,
            Timestamp: frontendData.metadata.timestamp,
            Engine: frontendData.metadata.engine,
            Version: frontendData.metadata.version,
            Strategy: frontendData.metadata.adaptationStrategy,
            AdaptationInfo: frontendData.metadata.adaptationInfo,
            Duration_ms: simulationResults.duration,
            TotalVectors: results.simulationVectors.length,
            OriginalVectorsCount: results.originalVectorsCount,
            IsValid: frontendData.algebraicAnalysis.isValid
        }];
        
        // Tabla 2: Base Vectors (N filas - vectores base)
        const baseVectors: any[] = [];
        results.baseVectors.forEach((vector: string[], idx: number) => {
            const vectorObj: any = {
                SimulationID: simId,
                VectorID: `BASE_${idx}`,
                VectorType: 'Base',
                VectorIndex: idx,
                Dimension: vector.length
            };
            
            // Agregar cada componente como columna
            vector.forEach((component: string, compIdx: number) => {
                vectorObj[`Component_${compIdx}`] = component;
                vectorObj[`Component_${compIdx}_Float`] = this.fractionStringToFloat(component);
            });
            
            baseVectors.push(vectorObj);
        });
        
        // Tabla 3: Simulation Vectors (M filas - vectores simulados)
        const simulationVectors: any[] = [];
        results.simulationVectors.forEach((vector: string[], idx: number) => {
            const vectorObj: any = {
                SimulationID: simId,
                VectorID: `SIM_${idx}`,
                VectorType: 'Simulated',
                VectorIndex: idx,
                Dimension: vector.length
            };
            
            // Agregar cada componente como columna
            vector.forEach((component: string, compIdx: number) => {
                vectorObj[`Component_${compIdx}`] = component;
                vectorObj[`Component_${compIdx}_Float`] = this.fractionStringToFloat(component);
            });
            
            simulationVectors.push(vectorObj);
        });
        
        // Tabla 4: Connectivity Pairs (pares conectados)
        const connectivityPairs: any[] = [];
        const pairs = this.geometricConnector.findConnectedPairs(
            this.stringVectorsToFractionVectors(results.simulationVectors)
        );
        
        pairs.forEach((pair, idx) => {
            connectivityPairs.push({
                SimulationID: simId,
                PairID: `PAIR_${idx}`,
                VectorID_A: `SIM_${pair.i}`,
                VectorID_B: `SIM_${pair.j}`,
                Angle_Radians: pair.metrics.angle,
                Angle_Degrees: pair.metrics.angle * (180 / Math.PI),
                Distance: pair.metrics.distance,
                DotProduct: pair.metrics.dotProduct,
                InSameSubspace: pair.metrics.inSameSubspace
            });
        });
        
        // Tabla 5: Geometric Metrics (métricas agregadas)
        const geometricMetrics = [{
            SimulationID: simId,
            AverageDistance: results.geometricProperties.averageDistance,
            ConnectivityRate: results.geometricProperties.connectivityRate,
            TotalConnectedPairs: connectivityPairs.length,
            TotalVectors: results.simulationVectors.length,
            BaseVectorsCount: results.baseVectors.length,
            Density: connectivityPairs.length / ((results.simulationVectors.length * (results.simulationVectors.length - 1)) / 2)
        }];
        
        // Definir relaciones entre tablas para Power BI
        const relationships = [
            {
                name: "Metadata_to_BaseVectors",
                fromTable: "Metadata",
                fromColumn: "SimulationID",
                toTable: "BaseVectors",
                toColumn: "SimulationID",
                cardinality: "OneToMany"
            },
            {
                name: "Metadata_to_SimulationVectors",
                fromTable: "Metadata",
                fromColumn: "SimulationID",
                toTable: "SimulationVectors",
                toColumn: "SimulationID",
                cardinality: "OneToMany"
            },
            {
                name: "Metadata_to_ConnectivityPairs",
                fromTable: "Metadata",
                fromColumn: "SimulationID",
                toTable: "ConnectivityPairs",
                toColumn: "SimulationID",
                cardinality: "OneToMany"
            },
            {
                name: "Metadata_to_GeometricMetrics",
                fromTable: "Metadata",
                fromColumn: "SimulationID",
                toTable: "GeometricMetrics",
                toColumn: "SimulationID",
                cardinality: "OneToOne"
            }
        ];
        
        return {
            tables: {
                Metadata: metadata,
                BaseVectors: baseVectors,
                SimulationVectors: simulationVectors,
                ConnectivityPairs: connectivityPairs,
                GeometricMetrics: geometricMetrics
            },
            relationships
        };
    }
    
    /**
     * Descarga archivo JSON para Power BI
     */
    public downloadPowerBIFile(simulationResults: any): void {
        const powerBIData = this.generatePowerBIExport(simulationResults);
        
        const dataStr = JSON.stringify(powerBIData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `PowerBI_${simulationResults.simulationId}_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        //console.log(' Archivo Power BI descargado');
    }
    
    // ==================== EXPORTACIÓN A EXCEL ====================
    
    /**
     * Genera estructura CSV para Excel con múltiples hojas
     */
    public generateExcelExport(simulationResults: any): {
        sheets: {
            Metadata: string;
            BaseVectors: string;
            SimulationVectors: string;
            ConnectivityPairs: string;
            GeometricMetrics: string;
            Summary: string;
        };
    } {
        const powerBIData = this.generatePowerBIExport(simulationResults);
        
        // Hoja 1: Metadata
        const metadataCSV = this.tableToCSV(powerBIData.tables.Metadata);
        
        // Hoja 2: Base Vectors
        const baseVectorsCSV = this.tableToCSV(powerBIData.tables.BaseVectors);
        
        // Hoja 3: Simulation Vectors
        const simulationVectorsCSV = this.tableToCSV(powerBIData.tables.SimulationVectors);
        
        // Hoja 4: Connectivity Pairs
        const connectivityPairsCSV = this.tableToCSV(powerBIData.tables.ConnectivityPairs);
        
        // Hoja 5: Geometric Metrics
        const geometricMetricsCSV = this.tableToCSV(powerBIData.tables.GeometricMetrics);
        
        // Hoja 6: Summary (resumen ejecutivo)
        const summary = this.generateSummarySheet(simulationResults);
        const summaryCSV = this.tableToCSV(summary);
        
        return {
            sheets: {
                Metadata: metadataCSV,
                BaseVectors: baseVectorsCSV,
                SimulationVectors: simulationVectorsCSV,
                ConnectivityPairs: connectivityPairsCSV,
                GeometricMetrics: geometricMetricsCSV,
                Summary: summaryCSV
            }
        };
    }
    
    /**
     * Descarga archivo Excel (formato CSV separado por hojas)
     */
    public downloadExcelFile(simulationResults: any): void {
        const excelData = this.generateExcelExport(simulationResults);
        
        // Crear un archivo ZIP con todas las hojas
        // Como no tenemos JSZip, descargaremos hojas individuales
        
        Object.entries(excelData.sheets).forEach(([sheetName, csvContent]) => {
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `${sheetName}_${simulationResults.simulationId}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
        
        console.log(' Archivos Excel (CSV) descargados');
    }
    
    /**
     * Descarga archivo Excel completo (XLSX format usando SheetJS)
     */
    public downloadExcelXLSX(simulationResults: any): void {
        try {
            // @ts-ignore - SheetJS debe estar cargado globalmente
            if (typeof XLSX === 'undefined') {
                console.error('❌ SheetJS no está disponible. Descargando como CSV...');
                this.downloadExcelFile(simulationResults);
                return;
            }
            
            const powerBIData = this.generatePowerBIExport(simulationResults);
            
            // @ts-ignore
            const workbook = XLSX.utils.book_new();
            
            // Agregar cada tabla como una hoja
            // @ts-ignore
            const metadataSheet = XLSX.utils.json_to_sheet(powerBIData.tables.Metadata);
            // @ts-ignore
            XLSX.utils.book_append_sheet(workbook, metadataSheet, "Metadata");
            
            // @ts-ignore
            const baseVectorsSheet = XLSX.utils.json_to_sheet(powerBIData.tables.BaseVectors);
            // @ts-ignore
            XLSX.utils.book_append_sheet(workbook, baseVectorsSheet, "BaseVectors");
            
            // @ts-ignore
            const simVectorsSheet = XLSX.utils.json_to_sheet(powerBIData.tables.SimulationVectors);
            // @ts-ignore
            XLSX.utils.book_append_sheet(workbook, simVectorsSheet, "SimulationVectors");
            
            // @ts-ignore
            const connectivitySheet = XLSX.utils.json_to_sheet(powerBIData.tables.ConnectivityPairs);
            // @ts-ignore
            XLSX.utils.book_append_sheet(workbook, connectivitySheet, "ConnectivityPairs");
            
            // @ts-ignore
            const metricsSheet = XLSX.utils.json_to_sheet(powerBIData.tables.GeometricMetrics);
            // @ts-ignore
            XLSX.utils.book_append_sheet(workbook, metricsSheet, "GeometricMetrics");
            
            // Agregar hoja resumen
            const summary = this.generateSummarySheet(simulationResults);
            // @ts-ignore
            const summarySheet = XLSX.utils.json_to_sheet(summary);
            // @ts-ignore
            XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
            
            // Descargar archivo
            const filename = `Simulation_${simulationResults.simulationId}_${Date.now()}.xlsx`;
            // @ts-ignore
            XLSX.writeFile(workbook, filename);
            
            console.log(' Archivo Excel (XLSX) descargado');
            
        } catch (error) {
            console.error('Error generando XLSX:', error);
            console.log('Intentando descarga como CSV...');
            this.downloadExcelFile(simulationResults);
        }
    }
    
    // ==================== MÉTODOS AUXILIARES ====================
    
    private fractionStringToFloat(fractionStr: string): number {
        try {
            // Formato esperado: "numerador/denominador" o número simple
            if (fractionStr.includes('/')) {
                const [num, den] = fractionStr.split('/').map(s => parseFloat(s));
                return num / den;
            }
            return parseFloat(fractionStr);
        } catch {
            return 0;
        }
    }
    
    private stringVectorsToFractionVectors(stringVectors: string[][]): Vector[] {
        return stringVectors.map(stringVector => {
            return stringVector.map(componentStr => {
                if (componentStr.includes('/')) {
                    const [num, den] = componentStr.split('/');
                    return new Fraccion(BigInt(num), BigInt(den));
                }
                return new Fraccion(BigInt(componentStr), 1n);
            });
        });
    }
    
    private tableToCSV(table: any[]): string {
        if (table.length === 0) return '';
        
        // Obtener headers
        const headers = Object.keys(table[0]);
        const headerRow = headers.map(h => this.escapeCSV(h)).join(',');
        
        // Generar filas
        const rows = table.map(row => {
            return headers.map(header => {
                const value = row[header];
                return this.escapeCSV(String(value ?? ''));
            }).join(',');
        });
        
        return [headerRow, ...rows].join('\n');
    }
    
    private escapeCSV(value: string): string {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }
    
    private generateSummarySheet(simulationResults: any): any[] {
        const results = simulationResults.results;
        const frontendData = simulationResults.frontendData;
        
        return [
            { Metric: 'Simulation ID', Value: simulationResults.simulationId },
            { Metric: 'Timestamp', Value: frontendData.metadata.timestamp },
            { Metric: 'Duration (ms)', Value: simulationResults.duration },
            { Metric: 'Strategy', Value: frontendData.metadata.adaptationStrategy },
            { Metric: 'Adaptation Info', Value: frontendData.metadata.adaptationInfo },
            { Metric: '', Value: '' },
            { Metric: 'Original Vectors Count', Value: results.originalVectorsCount },
            { Metric: 'Base Vectors Count', Value: results.baseVectors.length },
            { Metric: 'Simulated Vectors Count', Value: results.simulationVectors.length },
            { Metric: 'Total Vectors', Value: results.simulationVectors.length },
            { Metric: '', Value: '' },
            { Metric: 'Average Distance', Value: results.geometricProperties.averageDistance.toFixed(4) },
            { Metric: 'Connectivity Rate', Value: (results.geometricProperties.connectivityRate * 100).toFixed(2) + '%' },
            { Metric: 'Total Vectors', Value: results.geometricProperties.totalVectors },
            { Metric: '', Value: '' },
            { Metric: 'Polynomials Count', Value: frontendData.algebraicAnalysis.polynomialsCount },
            { Metric: 'Is Valid', Value: frontendData.algebraicAnalysis.isValid ? 'Yes' : 'No' },
            { Metric: 'Vector Space Dimension', Value: frontendData.vectorSpace.dimension }
        ];
    }
}