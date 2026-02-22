export interface GraphNode {
    id: string;
    name: string;
    val: number;     // Representa la masa base en D3
    stress: number;  // Tensión inyectada por el usuario
}

export interface GraphLink {
    source: string;
    target: string;
    ecuacionOrigen: string;
    tension: number;
    isBroken: boolean;
}

export interface GrobnerGraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

export class GrobnerParser {
    /**
     * Convierte la base de Gröbner en un sistema topológico de Nodos y Enlaces
     * @param grobnerArray Array de polinomios reducidos (ej: ["k-6/5v-4/5w", "l-1/2w"])
     */
    public static parseToTopology(grobnerArray: string[]): GrobnerGraphData {
        const nodesMap = new Map<string, GraphNode>();
        const links: GraphLink[] = [];

        grobnerArray.forEach((ecuacion) => {
            // 1. Extraemos todas las letras minúsculas (variables) de la ecuación
            const variables = ecuacion.match(/[a-z]/g) || [];
            const uniqueVars = Array.from(new Set(variables));

            // 2. Registramos los Nodos (Variables) en el mapa
            uniqueVars.forEach(v => {
                if (!nodesMap.has(v)) {
                    nodesMap.set(v, { 
                        id: v, 
                        name: `Variable ${v.toUpperCase()}`,
                        val: 1, 
                        stress: 0 
                    });
                }
            });

            // 3. Creamos los filamentos (Links)
            // Asumimos que la primera variable encontrada tiene dependencia estructural con las demás en esa ecuación
            if (uniqueVars.length > 1) {
                const source = uniqueVars[0];
                for (let i = 1; i < uniqueVars.length; i++) {
                    links.push({
                        source: source,
                        target: uniqueVars[i],
                        ecuacionOrigen: ecuacion,
                        tension: 0,
                        isBroken: false
                    });
                }
            }
        });

        return { 
            nodes: Array.from(nodesMap.values()), 
            links 
        };
    }
}