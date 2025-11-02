export default class VarConstruccion {
    dataInforme: string[] = []; 
    valueIAG: string[] = []; 

    // BANCO DE MENSAJES SOBRE RELACIONES Y DEPENDENCIAS PARA EMPRESARIOS
    MENSAJES_RELACIONES = {
        relaciones_simples: [
            "📈 **Relación directa identificada** - Una variable controla directamente a otra, facilitando la gestión",
            "🎯 **Dependencia lineal clara** - Los cambios se propagan de manera predecible y medible",
            "💡 **Control unidireccional** - Podés ajustar esta área sin afectar otras operaciones",
            "🔧 **Ajuste simplificado** - Modificaciones puntuales con efectos calculables",
            "📊 **Metrica directa** - El rendimiento de esta variable es fácil de monitorear"
        ],
        
        relaciones_complejas: [
            "🔄 **Múltiples dependencias detectadas** - Esta variable interactúa con varias áreas simultáneamente",
            "🌐 **Red de influencia** - Los cambios aquí afectan múltiples departamentos",
            "⚖️ **Balance requerido** - Necesitás coordinar ajustes con otras áreas relacionadas",
            "🎪 **Efecto dominó potencial** - Modificaciones pueden desencadenar cambios en cadena",
            "🔍 **Monitoreo cruzado** - Recomendamos seguimiento conjunto con variables relacionadas"
        ],
        
        relaciones_no_lineales: [
            "📉 **Comportamiento exponencial** - Pequeños cambios pueden generar grandes impactos",
            "🎢 **Curva de respuesta** - La relación no es proporcional, requiere análisis cuidadoso",
            "⚠️ **Umbrales críticos** - Existen puntos donde pequeños ajustes producen cambios drásticos",
            "🔮 **Predictibilidad reducida** - Más difícil prever el impacto exacto de las modificaciones",
            "🎯 **Gestión por escenarios** - Recomendamos probar cambios en diferentes condiciones"
        ],
        
        acoplamientos: [
            "🔗 **Variables entrelazadas** - No podés modificar una sin afectar a la otra",
            "🕸️ **Tejido operativo** - Estas áreas funcionan como una unidad integrada",
            "🤝 **Co-dependencia operativa** - El rendimiento de una afecta directamente a la otra",
            "⚡ **Sincronización requerida** - Los ajustes deben coordinarse simultáneamente",
            "🎭 **Dúo operacional** - Tratalas como un par que funciona en conjunto"
        ],
        
        recomendaciones_gerenciales: [
            "👨‍💼 **Para directivos**: Esta estructura permite control granular y ajustes finos",
            "📋 **Para administradores**: Podés implementar KPIs específicos para esta relación",
            "💼 **Para empresarios**: La simplicidad operativa reduce costos de gestión",
            "🎯 **Para tomadores de decisión**: Los cambios son predecibles y medibles",
            "🔧 **Para operadores**: Las modificaciones son straightforward de implementar"
        ]
    };

    // AGREGÁ ESTE MÉTODO A TU CLASE
    generarDatosRadarChart(baseIdeal: string[], baseUsuario: string[], nombres: string[]) {
        const puntajesIdeal = this.puntajesBase(baseIdeal);
        const puntajesUsuario = this.puntajesBase(baseUsuario);
        
        // Convertir puntajes (0-1) a escala 0-100 para mejor visualización
        const datosRadar = nombres.map((nombre, i) => {
            return {
                subject: nombre,
                Ideal: Math.round((1 - puntajesIdeal[i]) * 100), // Invertir: 0 = perfecto, 100 = óptimo
                Usuario: Math.round((1 - puntajesUsuario[i]) * 100),
                fullMark: 100
            };
        });
        
        return datosRadar;
    }

    generarDatosBarChartCompleto(baseIdeal: string[], baseUsuario: string[], nombres: string[]) {
    const puntajesIdeal = this.puntajesBase(baseIdeal);
    const puntajesUsuario = this.puntajesBase(baseUsuario);
    const diferencias = puntajesUsuario.map((p, i) => Math.abs(p - puntajesIdeal[i]));
    
    const datosBar = nombres.map((nombre, i) => {
        const eficienciaUsuario = Math.round((1 - puntajesUsuario[i]) * 100);
        const eficienciaIdeal = Math.round((1 - puntajesIdeal[i]) * 100);
        
        return {
            name: nombre,
            optimo: eficienciaIdeal,           // Ideal (siempre 100%)
            variables: eficienciaUsuario,         // Usuario actual
            diferemcia: Math.round(diferencias[i] * 100), // Diferencia
            problema: Math.round(puntajesUsuario[i] * 100), // Puntaje problema
            mejora: Math.max(0, eficienciaIdeal - eficienciaUsuario) // Potencial mejora
        };
    });
    
    return datosBar;
}

    // BANCO GIGANTE DE MENSAJES
    MENSAJES_BASE = {
        grado: {
            optimo: [
                "✅ **Grado lineal perfecto** - Relaciones simples y predecibles",
                "🎯 **Linealidad óptima** - Cambios proporcionales, fácil de optimizar",
                "💎 **Grado ideal** - Máxima estabilidad algebraica"
            ],
            problematico: [
                "🟠 **Grado elevado** - Pequeños cambios generan efectos desproporcionados",
                "⚠️ **No linealidad detectada** - Comportamiento difícil de predecir",
                "📈 **Complejidad matemática** - Requiere análisis más avanzado"
            ],
            critico: [
                "🔴 **Grado muy alto** - Sistema caótico, inestable",
                "💥 **No linealidad extrema** - Comportamiento impredecible",
                "🚨 **Complejidad explosiva** - Difícil de optimizar y controlar"
            ]
        },

        variables: {
            optimo: [
                "✅ **2 variables ideales** - Relación directa y clara",
                "🎯 **Dualidad perfecta** - Una variable afecta a otra directamente", 
                "💎 **Simplicidad óptima** - Fácil de analizar y optimizar"
            ],
            aceptable: [
                "🟡 **3 variables** - Relación aceptable pero con alguna dependencia extra",
                "📊 **Triple relación** - Pequeña complejidad adicional",
                "⚖️ **Balance moderado** - Mantenible con cuidado"
            ],
            problematico: [
                "🟠 **4+ variables** - Múltiples dependencias, difícil optimizar",
                "🕸️ **Red compleja** - Cambios afectan varias variables simultáneamente",
                "🎭 **Relaciones entrelazadas** - Requiere coordinación cuidadosa"
            ]
        },

        acoplamiento: {
            optimo: [
                "✅ **Sin acoplamientos** - Variables independientes, fácil ajustar",
                "🎯 **Desacoplado perfecto** - Modificaciones aisladas sin efectos secundarios",
                "💎 **Independencia algebraica** - Máxima flexibilidad operativa"
            ],
            problematico: [
                "🟠 **Términos acoplados** - Variables ligadas, cambios afectan múltiples áreas",
                "🔗 **Dependencias cruzadas** - Ajustar una variable impacta otras",
                "🔄 **Acoplamiento detectado** - Requiere coordinación para cambios"
            ],
            critico: [
                "🔴 **Múltiples acoplamientos** - Sistema rígido, cambios riesgosos",
                "💥 **Alto acoplamiento** - Efectos en cascada ante modificaciones",
                "🚨 **Estructura rígida** - Poca flexibilidad para optimizaciones"
            ]
        }
    };

    // NUEVO: MÉTODO PARA CALCULAR PENALIZACIÓN POR COEFICIENTES EXTREMOS
    calcularPenalizacionCoeficiente(polinomio: string): number {
        const match = polinomio.match(/-(\d+(?:\/\d+)?)/);
        if (!match) return 0;
        
        const fraccion = match[1];
        const partes = fraccion.split('/');
        let valor: number;
        
        if (partes.length === 2) {
            valor = parseInt(partes[0]) / parseInt(partes[1]);
        } else {
            valor = parseFloat(partes[0]);
        }
        
        // Penalizar coeficientes extremos
        if (valor > 10 || valor < 0.02) return 0.6; // 🔴 CRÍTICO
        if (valor > 5 || valor < 0.05) return 0.3;  // 🟠 PROBLEMÁTICO  
        if (valor > 3 || valor < 0.1) return 0.1;   // 🟡 ACEPTABLE
        
        return 0.0; // ✅ ÓPTIMO
    }

    // NUEVO: MÉTODO PARA OBTENER MENSAJE DEL COEFICIENTE
    obtenerMensajeCoeficiente(polinomio: string): string {
        const match = polinomio.match(/-(\d+(?:\/\d+)?)/);
        if (!match) return "";
        
        const fraccion = match[1];
        const partes = fraccion.split('/');
        let valor: number;
        
        if (partes.length === 2) {
            valor = parseInt(partes[0]) / parseInt(partes[1]);
        } else {
            valor = parseFloat(partes[0]);
        }
        
        if (valor > 10) return `🔴 **Coeficiente extremo** - ${valor.toFixed(2)}x (demasiado alto)`;
        if (valor > 5) return `🟠 **Coeficiente elevado** - ${valor.toFixed(2)}x (revisar)`;
        if (valor < 0.02) return `🔴 **Coeficiente mínimo** - ${valor.toFixed(3)}x (insuficiente)`;
        if (valor < 0.05) return `🟠 **Coeficiente bajo** - ${valor.toFixed(3)}x (considerar aumentar)`;
        
        return `✅ **Coeficiente óptimo** - ${valor.toFixed(2)}x`;
    }

    // FUNCIÓN PARA ANALIZAR RELACIONES ENTRE VARIABLES
    analizarRelacionesVariables(polinomio: string): string[] {
        const mensajes: string[] = [];
        const variables = (polinomio.match(/[a-z]/gi) || []).length;
        const tieneAcoplamientos = (polinomio.match(/[a-z]{2,}/gi) || []).length > 0;
        const esNoLineal = polinomio.includes('²') || polinomio.includes('³') || polinomio.includes('^');

        // Análisis de cantidad de variables
        if (variables === 2) {
            mensajes.push(this.getMensajeAleatorio(this.MENSAJES_RELACIONES.relaciones_simples));
        } else if (variables >= 3) {
            mensajes.push(this.getMensajeAleatorio(this.MENSAJES_RELACIONES.relaciones_complejas));
        }

        // Análisis de no linealidad
        if (esNoLineal) {
            mensajes.push(this.getMensajeAleatorio(this.MENSAJES_RELACIONES.relaciones_no_lineales));
        }

        // Análisis de acoplamientos
        if (tieneAcoplamientos) {
            mensajes.push(this.getMensajeAleatorio(this.MENSAJES_RELACIONES.acoplamientos));
        }

        // Siempre agregar una recomendación gerencial
        mensajes.push(this.getMensajeAleatorio(this.MENSAJES_RELACIONES.recomendaciones_gerenciales));

        return mensajes;
    }

    // MODIFICAR LA FUNCIÓN PRINCIPAL PARA INCLUIR ANÁLISIS DE RELACIONES
    analizarBaseCompleta(baseIdeal: string[], baseUsuario: string[], nombres: string[]) {
        
        this.dataInforme = []; // Limpiar array
        this.dataInforme.push("🔍 ANÁLISIS ALGEBRAICO DETALLADO\n"); 
        
        baseUsuario.forEach((polinomio, i) => {
            const analisisIdeal = this.analizarPolinomioConciencia(baseIdeal[i]);
            const analisisUsuario = this.analizarPolinomioConciencia(polinomio);
            const diferencia = Math.abs(analisisUsuario.puntaje - analisisIdeal.puntaje);
            const relaciones = this.analizarRelacionesVariables(polinomio);
            
            const categoria = diferencia <= 0.1 ? "✅ ÓPTIMO" : 
                            diferencia <= 0.3 ? "🟡 ACEPTABLE" : 
                            diferencia <= 0.5 ? "🟠 PROBLEMÁTICO" : "🔴 CRÍTICO";
            
            this.dataInforme.push(`📊 **${nombres[i]}** (${polinomio})`);
            this.dataInforme.push(`   Puntaje: ${analisisUsuario.puntaje.toFixed(2)} vs Ideal: ${analisisIdeal.puntaje.toFixed(2)}`);
            this.dataInforme.push(`   Diferencia: ${diferencia.toFixed(2)} - ${categoria}\n`);
            
            // Mostrar análisis técnico original
            this.dataInforme.push(`   🔧 **ANÁLISIS TÉCNICO:**`);
            analisisUsuario.analisis.forEach((mensaje, j) => {
                this.dataInforme.push(`   ${mensaje}`);
            });

            // Mostrar análisis de relaciones para empresarios
            this.dataInforme.push(`\n   💼 **ANÁLISIS GERENCIAL:**`);
            relaciones.forEach((mensaje, j) => {
                this.dataInforme.push(`   ${mensaje}`);
            });
            
            // Recomendación si hay diferencia significativa
            if (diferencia > 0.2) {
                this.dataInforme.push(`\n   🚨 **RECOMENDACIÓN:** ${this.generarRecomendacion(diferencia, nombres[i])}`);
            }
            
            this.dataInforme.push("\n   ─────────────────────────");
        });
    }

    // ANALIZADOR DE POLINOMIOS CON CONCIENCIA - CORREGIDO
    analizarPolinomioConciencia(polinomio: string): {puntaje: number, analisis: string[]} {
        const analisis: string[] = [];
        
        // 1. ANALIZAR GRADO
        let grado = 1;
        if (polinomio.includes('²')) grado = 2;
        else if (polinomio.includes('³')) grado = 3;
        else if (polinomio.includes('^')) {
            const match = polinomio.match(/\^(\d+)/);
            grado = match ? parseInt(match[1]) : 1;
        }
        
        const gradoPen = (grado - 1) * 0.3;
        if (grado === 1) analisis.push(this.getMensajeAleatorio(this.MENSAJES_BASE.grado.optimo));
        else if (grado <= 2) analisis.push(this.getMensajeAleatorio(this.MENSAJES_BASE.grado.problematico));
        else analisis.push(this.getMensajeAleatorio(this.MENSAJES_BASE.grado.critico));

        // 2. ANALIZAR VARIABLES
        const variables = (polinomio.match(/[a-z]/gi) || []).length;
        const varsPen = Math.max(0, (variables - 2) * 0.2);
        if (variables === 2) analisis.push(this.getMensajeAleatorio(this.MENSAJES_BASE.variables.optimo));
        else if (variables === 3) analisis.push(this.getMensajeAleatorio(this.MENSAJES_BASE.variables.aceptable));
        else analisis.push(this.getMensajeAleatorio(this.MENSAJES_BASE.variables.problematico));

        // 3. ANALIZAR ACOPLAMIENTOS
        const terminosAcoplados = Math.max(0, (polinomio.match(/[a-z]{2,}/gi) || []).length);
        const acopPen = Math.max(0, (terminosAcoplados - 1) * 0.2);
        if (terminosAcoplados === 0) analisis.push(this.getMensajeAleatorio(this.MENSAJES_BASE.acoplamiento.optimo));
        else if (terminosAcoplados === 1) analisis.push(this.getMensajeAleatorio(this.MENSAJES_BASE.acoplamiento.problematico));
        else analisis.push(this.getMensajeAleatorio(this.MENSAJES_BASE.acoplamiento.critico));

      
        const coefPen = this.calcularPenalizacionCoeficiente(polinomio);
        const coefMensaje = this.obtenerMensajeCoeficiente(polinomio);
        if (coefMensaje) analisis.push(coefMensaje);

        const puntaje = Math.min(gradoPen + varsPen + acopPen + coefPen, 1.0);
        
        return { puntaje, analisis };
    }

    getMensajeAleatorio(mensajes: string[]): string {
        return mensajes[Math.floor(Math.random() * mensajes.length)];
    }

    generarRecomendacion(diferencia: number, nombre: string): string {
        const porcentaje = (diferencia * 100).toFixed(0);
        
        if (diferencia <= 0.3) {
            return `Ajuste menor necesario en ${nombre} - ${porcentaje}% de optimización posible`;
        } else if (diferencia <= 0.5) {
            return `Revisión recomendada en ${nombre} - ${porcentaje}% de mejora disponible`;
        } else {
            return `INTERVENCIÓN URGENTE en ${nombre} - ${porcentaje}% fuera del óptimo algebraico`;
        }
    }

    puntajesBase(base: string[]): number[] {
        return base.map(polinomio => this.analizarPolinomioConciencia(polinomio).puntaje);
    }

    similitudBases(baseIdeal: string[], baseUsuario: string[]): number {
        const puntajesIdeal = this.puntajesBase(baseIdeal);
        const puntajesUsuario = this.puntajesBase(baseUsuario);
        
        let diferenciaTotal = 0;
        for (let i = 0; i < puntajesIdeal.length; i++) {
            diferenciaTotal += Math.abs(puntajesIdeal[i] - puntajesUsuario[i]);
        }
        
        return 1 - (diferenciaTotal / puntajesIdeal.length);
    }

    // FUNCIÓN PARA GENERAR DATOS DE GRÁFICOS (CORREGIDA)
    generarDatosGraficos(baseIdeal: string[], baseUsuario: string[], nombres: string[]) {
        const datos = {
            baseOptima: {
                puntajes: [] as number[],
                categorias: [] as string[],
                colores: [] as string[]
            },
            baseUsuario: {
                puntajes: [] as number[],
                categorias: [] as string[],
                colores: [] as string[]
            },
            variablesOptimas: [] as string[],
            variablesUsuario: [] as string[],
            resumen: {
                similitudGeneral: 0,
                variablesOptimasCount: 0,
                variablesProblematicasCount: 0,
                variablesCriticasCount: 0
            }
        };

        // Calcular puntajes y categorías
        baseUsuario.forEach((polinomio, i) => {
            const analisisIdeal = this.analizarPolinomioConciencia(baseIdeal[i]);
            const analisisUsuario = this.analizarPolinomioConciencia(polinomio);
            const diferencia = Math.abs(analisisUsuario.puntaje - analisisIdeal.puntaje);
            
            // Determinar categoría y color
            let categoria, color;
            if (diferencia <= 0.1) {
                categoria = "ÓPTIMO";
                color = "#22c55e"; // verde
            } else if (diferencia <= 0.3) {
                categoria = "ACEPTABLE"; 
                color = "#eab308"; // amarillo
            } else if (diferencia <= 0.5) {
                categoria = "PROBLEMÁTICO";
                color = "#f97316"; // naranja
            } else {
                categoria = "CRÍTICO";
                color = "#ef4444"; // rojo
            }

            // Llenar datos de base óptima
            datos.baseOptima.puntajes.push(analisisIdeal.puntaje);
            datos.baseOptima.categorias.push("ÓPTIMO");
            datos.baseOptima.colores.push("#22c55e");

            // Llenar datos de base usuario
            datos.baseUsuario.puntajes.push(analisisUsuario.puntaje);
            datos.baseUsuario.categorias.push(categoria);
            datos.baseUsuario.colores.push(color);

            // Llenar variables óptimas y usuario
            if (diferencia <= 0.1) {
                datos.variablesOptimas.push(nombres[i]);
            }
            datos.variablesUsuario.push(nombres[i]);
        });

        // Calcular resumen
        const similitud = this.similitudBases(baseIdeal, baseUsuario);
        datos.resumen.similitudGeneral = similitud;
        datos.resumen.variablesOptimasCount = datos.variablesOptimas.length;
        datos.resumen.variablesProblematicasCount = datos.baseUsuario.categorias.filter(c => c === "PROBLEMÁTICO").length;
        datos.resumen.variablesCriticasCount = datos.baseUsuario.categorias.filter(c => c === "CRÍTICO").length;

        return datos;
    }

    // FUNCIÓN SIMPLIFICADA SI SOLO QUERÉS LOS PUNTAJES
    generarPuntajesParaGraficos(baseIdeal: string[], baseUsuario: string[]) {
        const puntajesIdeal = this.puntajesBase(baseIdeal);
        const puntajesUsuario = this.puntajesBase(baseUsuario);
        
        return {
            baseOptima: puntajesIdeal,
            baseUsuario: puntajesUsuario,
            diferencias: puntajesUsuario.map((p, i) => Math.abs(p - puntajesIdeal[i])),
            similitud: this.similitudBases(baseIdeal, baseUsuario)
        };
    }

    calcularIndiceAlgebraicoGlobal(baseIdeal: string[], baseUsuario: string[]): number {
        const puntajesIdeal = baseIdeal.map(p => this.analizarPolinomioConciencia(p).puntaje);
        const puntajesUsuario = baseUsuario.map(p => this.analizarPolinomioConciencia(p).puntaje);
        
        const sumaDiferencias = puntajesUsuario.reduce((sum, puntaje, i) => {
            return sum + Math.abs(puntaje - puntajesIdeal[i]);
        }, 0);
        
        const IAG = 1 - (sumaDiferencias / baseIdeal.length);
        return Math.max(0, Math.min(1, IAG)); // Asegurar entre 0 y 1
    }

    // VERSIÓN MEJORADA DE generarDatosGraficos CON IAG
    generarDatosGraficosConIAG(baseIdeal: string[], baseUsuario: string[], nombres: string[]) {
        const datos = this.generarDatosGraficos(baseIdeal, baseUsuario, nombres);
        const IAG = this.calcularIndiceAlgebraicoGlobal(baseIdeal, baseUsuario);
        
        // Devolver un NUEVO objeto con todo incluido
        return  this.interpretarIAG(IAG);
    }

    obtenerMetricasGlobales(baseIdeal: string[], baseUsuario: string[]) {
        const IAG = this.calcularIndiceAlgebraicoGlobal(baseIdeal, baseUsuario);
        
        return {
            indiceAlgebraicoGlobal: IAG,
            interpretacionIAG: this.interpretarIAG(IAG),
            categoriaIAG: IAG >= 0.9 ? "EXCELENTE" : 
                        IAG >= 0.8 ? "MUY BUENO" : 
                        IAG >= 0.7 ? "BUENO" : 
                        IAG >= 0.6 ? "REGULAR" : 
                        IAG >= 0.5 ? "MEJORABLE" : "CRÍTICO"
        };
    }

    // FUNCIÓN PARA INTERPRETAR EL IAG
    interpretarIAG(iag: number): string {
        if (iag >= 0.9) return "🏆 EXCELENTE - Sistema casi perfecto";
        if (iag >= 0.8) return "👍 MUY BUENO - Pequeñas optimizaciones posibles";
        if (iag >= 0.7) return "⚠️ BUENO - Algunas áreas necesitan atención";
        if (iag >= 0.6) return "📊 REGULAR - Varias mejoras identificadas";
        if (iag >= 0.5) return "🔧 MEJORABLE - Recomendación: revisión prioritaria";
        return "🚨 CRÍTICO - Rediseño recomendado";
    }
}