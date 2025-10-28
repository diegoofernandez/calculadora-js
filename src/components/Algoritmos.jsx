function Algoritmos(){


    return(

        <>
        
        <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col gap-8 py-8 lg:flex-row">
                <aside class="w-full lg:w-64 lg:sticky lg:top-24 self-start">
                <div class="flex h-full flex-col justify-between rounded-lg bg-surface-dark p-4">
                    <div class="flex flex-col gap-4">
                        <div class="flex gap-3">
                            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" data-alt="RomiMath company logo"></div>
                            <div class="flex flex-col">
                                <h1 class="text-white text-base font-medium leading-normal">RomiMath</h1>
                                <p class="text-text-muted text-sm font-normal leading-normal">Documentación Técnica</p>
                            </div>
                        </div>
                        <nav class="flex flex-col gap-1">
                            <a class="flex items-center gap-3 rounded-lg px-3 py-2 bg-surface-dark-alt transition-colors hover:bg-surface-dark-alt/80" href="#buchberger">
                            <span class="material-symbols-outlined text-accent-blue text-xl">schema</span>
                            <p class="text-white text-sm font-medium leading-normal">Algoritmo de Buchberger</p>
                            </a>
                            <a class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-dark-alt/80" href="#euclides">
                            <span class="material-symbols-outlined text-text-muted text-xl">calculate</span>
                            <p class="text-white text-sm font-medium leading-normal">Euclides Extendido</p>
                            </a>
                            <a class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-dark-alt/80" href="#yun">
                            <span class="material-symbols-outlined text-text-muted text-xl">route</span>
                            <p class="text-white text-sm font-medium leading-normal">Algoritmo de Dijkstra</p>
                            </a>
                            <a class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-dark-alt/80" href="#ast">
                            <span class="material-symbols-outlined text-text-muted text-xl">account_tree</span>
                            <p class="text-white text-sm font-medium leading-normal">Árbol de Sintaxis Abstracta</p>
                            </a>
                            <a class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-dark-alt/80" href="#flujo">
                            <span class="material-symbols-outlined text-text-muted text-xl">sync_alt</span>
                            <p class="text-white text-sm font-medium leading-normal">Flujo de Procesamiento</p>
                            </a>
                            <a class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-dark-alt/80" href="#caracteristicas">
                            <span class="material-symbols-outlined text-text-muted text-xl">tune</span>
                            <p class="text-white text-sm font-medium leading-normal">Características Técnicas</p>
                            </a>
                        </nav>
                    </div>
                </div>
                </aside>
                <main class="flex-1">
                    <div class="flex flex-wrap items-center gap-2 px-4">
                        <a class="text-text-muted text-base font-medium leading-normal transition-colors hover:text-accent-blue" href="#">Inicio</a>
                        <span class="text-text-muted text-base font-medium leading-normal">/</span>
                        <a class="text-text-muted text-base font-medium leading-normal transition-colors hover:text-accent-blue" href="#">Documentación Técnica</a>
                        <span class="text-text-muted text-base font-medium leading-normal">/</span>
                        <span class="text-white text-base font-medium leading-normal">Algoritmos Implementados</span>
                    </div>
                    <div class="flex flex-wrap justify-between gap-3 p-4">
                        <div class="flex min-w-72 flex-col gap-3">
                            <p class="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Algoritmos Implementados (Detallado)</p>
                            <p class="text-text-muted text-base font-normal leading-normal">Toda la información técnica de los algoritmos y la arquitectura del motor RomiMath se presenta en esta única página de desplazamiento vertical, diseñada para ser completamente responsive.</p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-12">
                        <section class="flex flex-col gap-4 p-4 scroll-mt-24" id="buchberger">
                        <h2 class="border-l-4 border-accent-blue pl-4 text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Algoritmo de Buchberger</h2>
                        <p class="text-text-muted">Piedra angular de la geometría algebraica computacional, este algoritmo se utiliza para calcular las bases de Gröbner de ideales polinómicos.</p>
                        <div class="flex flex-col gap-4">
                        <div class="rounded-lg bg-surface-dark p-4">
                        <h3 class="font-medium text-white mb-2">Características Principales</h3>
                        <ul class="list-disc space-y-2 pl-5 text-text-muted">
                        <li>Maneja eficientemente sistemas de polinomios multivariados.</li>
                        <li>Soporta varios ordenamientos monomiales (lex, grlex, grevlex).</li>
                        <li>Proporciona una base para resolver sistemas de ecuaciones polinómicas.</li>
                        </ul>
                        </div>
                        <div class="rounded-lg bg-surface-dark p-4">
                        <h3 class="font-medium text-white mb-2">Optimizaciones Implementadas</h3>
                        <ul class="list-disc space-y-2 pl-5 text-text-muted">
                        <li>Implementación de los criterios de Buchberger para evitar reducciones redundantes de S-polinomios.</li>
                        <li>Estrategias de selección de pares para optimizar el orden de cálculo.</li>
                        </ul>
                        </div>
                        </div>
                        </section>
                        <section class="flex flex-col gap-4 p-4 scroll-mt-24" id="euclides">
                        <h2 class="border-l-4 border-accent-blue pl-4 text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Algoritmo de Euclides Extendido</h2>
                        <p class="text-text-muted">Esencial para la teoría de números y la aritmética modular, este algoritmo calcula los inversos modulares y el máximo común divisor (MCD).</p>
                        <div class="rounded-lg bg-surface-dark p-4">
                        <h3 class="font-medium text-white mb-2">Aplicaciones en RomiMath</h3>
                        <ul class="list-disc space-y-2 pl-5 text-text-muted">
                        <li>Resolución de ecuaciones diofánticas lineales.</li>
                        <li>Cálculo de inversos multiplicativos modulares, críticos para operaciones en campos finitos.</li>
                        <li>Simplificación de fracciones y expresiones racionales dentro del motor.</li>
                        </ul>
                        </div>
                        </section>
                        <section class="flex flex-col gap-4 p-4 scroll-mt-24" id="yun">
                        <h2 class="border-l-4 border-accent-violet pl-4 text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Algoritmo de Dijkstra (Shunting-Yard)</h2>
                        <p class="text-text-muted">Nuestro motor de análisis sintáctico se basa en el algoritmo Shunting-yard de Dijkstra, un método para analizar expresiones matemáticas especificadas en notación infija.</p>
                        <div class="rounded-lg bg-surface-dark p-4">
                        <h3 class="font-medium text-white mb-2">Utilidad en el Análisis de Expresiones</h3>
                        <p class="text-text-muted">Este algoritmo convierte eficientemente expresiones infijas legibles por humanos (ej. `3 + 4 * 2`) en una notación postfija (Notación Polaca Inversa) o directamente en un Árbol de Sintaxis Abstracta (AST), que es como nuestro motor las procesa internamente. Maneja correctamente la precedencia y asociatividad de los operadores.</p>
                        </div>
                        </section>
                        <section class="flex flex-col gap-4 p-4 scroll-mt-24" id="ast">
                        <h2 class="border-l-4 border-accent-violet pl-4 text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Árbol de Sintaxis Abstracta (AST)</h2>
                        <p class="text-text-muted">La estructura de datos central que representa las expresiones matemáticas. Cada operación y valor es un nodo en el árbol.</p>
                        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div class="flex flex-col gap-4">
                        <div class="rounded-lg bg-surface-dark p-4">
                        <h3 class="font-medium text-white mb-2">Patrones de Diseño Aplicados</h3>
                        <ul class="list-disc space-y-2 pl-5 text-text-muted">
                        <li>Patrón Visitor para evaluaciones y transformaciones.</li>
                        <li>Patrón Composite para tratar expresiones individuales y compuestas de forma uniforme.</li>
                        </ul>
                        </div>
                        <div class="rounded-lg bg-surface-dark p-4">
                        <h3 class="font-medium text-white mb-2">Ventajas del AST</h3>
                        <ul class="list-disc space-y-2 pl-5 text-text-muted">
                        <li>Facilita transformaciones complejas como la diferenciación y simplificación.</li>
                        <li>Permite un análisis y optimización sencillos de las expresiones antes de la evaluación.</li>
                        </ul>
                        </div>
                        </div>
                        <div class="relative rounded-lg bg-code-bg p-4 font-mono text-sm text-[#c9d1d9]">
                        <button class="absolute top-2 right-2 flex items-center gap-1 rounded bg-surface-dark-alt/50 px-2 py-1 text-xs text-text-muted transition-colors hover:bg-surface-dark-alt">
                        <span class="material-symbols-outlined text-base">content_copy</span>Copiar
                        </button>

                        </div>
                        </div>
                        </section>
                        <section class="flex flex-col gap-4 p-4 scroll-mt-24" id="flujo">
                        <h2 class="border-l-4 border-accent-blue pl-4 text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Flujo de Procesamiento Integrado</h2>
                        <p class="text-text-muted">Una visión general de cómo las entradas se procesan a través del motor RomiMath, desde la cadena de texto inicial hasta el resultado final.</p>
                        <div class="rounded-lg bg-surface-dark p-6 text-center">
                        <p class="font-mono text-sm md:text-base text-text-main">
                        <span class="text-accent-blue">Entrada (String)</span>
                        <span class="material-symbols-outlined mx-2 align-middle text-text-muted">arrow_forward</span>
                        <span class="text-accent-violet">Análisis (Sun)</span>
                        <span class="material-symbols-outlined mx-2 align-middle text-text-muted">arrow_forward</span>
                        <span class="text-accent-blue">AST</span>
                        <span class="material-symbols-outlined mx-2 align-middle text-text-muted">arrow_forward</span>
                        <span class="text-accent-violet">Simplificación/Evaluación</span>
                        <span class="material-symbols-outlined mx-2 align-middle text-text-muted">arrow_forward</span>
                        <span class="text-accent-blue">Resultado</span>
                        </p>
                        </div>
                        </section>
                        <section class="flex flex-col gap-4 p-4 scroll-mt-24" id="caracteristicas">
                        <h2 class="border-l-4 border-accent-blue pl-4 text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Características Técnicas Avanzadas</h2>
                        <p class="text-text-muted">Más allá de los algoritmos centrales, el motor RomiMath incluye un conjunto de características avanzadas para la robustez y el rendimiento.</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="rounded-lg bg-surface-dark p-4">
                        <h3 class="font-medium text-white mb-2">Manejo de Tipos</h3>
                        <p class="text-text-muted">Sistema de tipos robusto y dinámico para manejar enteros, racionales, números complejos y polinomios sin pérdida de precisión.</p>
                        </div>
                        <div class="rounded-lg bg-surface-dark p-4">
                        <h3 class="font-medium text-white mb-2">Métricas de Rendimiento</h3>
                        <p class="text-text-muted">Instrumentación incorporada para seguir el tiempo de ejecución y el uso de memoria para cada paso computacional.</p>
                        </div>
                        <div class="rounded-lg bg-surface-dark p-4">
                        <h3 class="font-medium text-white mb-2">Capacidades de Depuración</h3>
                        <p class="text-text-muted">Opciones de registro detallado y visualizadores de AST para ayudar en la depuración de evaluaciones de expresiones complejas.</p>
                        </div>
                        </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
        
        </>

    )

}
export default Algoritmos; 