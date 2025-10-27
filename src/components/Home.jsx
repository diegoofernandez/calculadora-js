import { useState, useRef, useEffect } from 'react';
import TeX from '@matejmazur/react-katex'; 

function Home(){

    const [stringParse, setStringParse] = useState(''); 
    const [calculoMuestra, setCalculoMuestra] = useState(true); 

    function driverInput(e){ 

        setStringParse(e.target.value);
        setCalculoMuestra(false); 

    }

    return(

        <>
            <main class="flex flex-col gap-10 py-10 px-4 md:px-10">
                <section class="flex flex-col items-center justify-center text-center py-12 md:py-20" id="hero">
                    <div class="flex flex-col items-center gap-6 w-full max-w-3xl">
                        <h1 class="text-white text-4xl md:text-5xl font-bold leading-tight tracking-tighter">
                            Álgebra más potente del mundo, ahora accesible para todos.
                        </h1>
                        <p class="text-white/70 text-base md:text-lg max-w-2xl">
                            Acceda a conocimiento y cómputo de nivel experto en física, finanzas, logística y más con el motor algebraico RomiMath.
                        </p>
                        <div class="flex place-content-between items-center p-6">
                            <TeX block math={stringParse}></TeX> 
                            {calculoMuestra && (
                                <TeX block math='x = \frac{-b \pm \sqrt{b^2-4ac}}{2a} * \sum_{n=1}^\infty \frac{1}{n^2} = \frac{\pi^2}{6} \int_0^\infty x^2 dx'></TeX> 
                            )}
                        </div>
                        <div class="w-full mt-4">
                            <div class="relative flex items-center">
                                <input class="w-full h-14 pl-5 pr-16 rounded-lg bg-[#191933] text-white font-mono border-2 border-[#323267] focus:border-primary focus:outline-none focus:ring-0 transition-colors" placeholder="Introduce tu cálculo..." onChange={driverInput}/>
                                <button class="absolute right-2 flex items-center justify-center size-10 rounded-md bg-primary hover:bg-violet-500 text-white transition-colors">
                                <span class="material-symbols-outlined">=</span>
                                </button>
                            </div>
                        </div>
                        
                        
                        <div class="bg-[#191933] rounded-xl border border-[#323267] p-6">
                            <h3 class="text-primary text-2xl font-bold mb-4">Guía de Sintaxis KaTeX para RomiMath</h3>
                            <h4 class="text-white/80 font-bold mb-2">📝 Introducción</h4>
                            <p class="text-white/70 text-sm">
                                Escribe expresiones matemáticas usando la sintaxis de KaTeX. Sigue la siguiente guía
                            </p>
                            <div class="grid md:grid-cols-2 gap-12">
                                <div>    
                                    <br/>
                                    <h5 class="text-white/80 font-bold mb-2">➕ Operaciones Básicas</h5>
                                    <p class="text-white/70 text-sm">
                                        Suma: a + b<br/>
                                        Resta: a - b<br/>
                                        Multiplicación: a * b o a * b<br/>
                                        División y fracciones: \frac{"{a}{b}"}
                                    </p>
                                    <br/>
                                    <h5 class="text-white/80 font-bold mb-2">🚀 Consejos Prácticos</h5>
                                    <p class="text-white/70 text-sm">
                                        Usa siempre \ antes de comandos especiales<br/>
                                        Los corchetes {"{}"} agrupan elementos<br/>
                                        Los espacios normales se ignoran - usa \quad o \qquad para espacios<br/>
                                        Para texto normal dentro de ecuaciones: \text{"{mi texto}"}<br/>
                                        Paréntesis automáticos: \left( \frac{"{a}{b}"} \right)<br/>
                                        Puntos suspensivos: \cdots (centrado) o \ldots (abajo)<br/>
                                    </p>
                                </div>
                                <div>
                                    <br/>
                                    <h5 class="text-white/80 font-bold mb-2">🔢 Exponentes y Raíces</h5>
                                    <p class="text-white/70 text-sm">
                                        Exponente: x^{"{2}"}<br/>
                                        Subíndice: x_{"{1}"}<br/>
                                        Raíz n-ésima: \sqrt{"[n]{x}"}<br/>
                                        Exponente y subíndice: x_{"{i}^{2}"}
                                    </p>
                                    <br/>
                                    <h5 class="text-white/80 font-bold mb-2">❌ Errores Comunes a Evitar</h5>
                                    <p class="text-white/70 text-sm">
                                        ❌ a/b → ✅ \frac{"{a}{b}"}<br/>
                                        ❌ x^2 → ✅ x^{"{2}"}<br/>
                                        ❌ sqrt x → ✅ \sqrt{"{x}"}<br/>
                                        ❌ alpha → ✅ \alpha<br/>
                                        ❌ sin x → ✅ \sin x<br/>
                                    </p>
                                </div>
                            </div>
                        </div>


                    </div>
                </section>
                <section class="flex flex-col gap-12 py-10" id="algorithms">
                    <div class="flex flex-col gap-4 text-center items-center">
                        <h2 class="text-white text-3xl font-bold tracking-tighter">Explora Nuestros Algoritmos</h2>
                        <p class="text-white/70 text-base max-w-3xl">
                            Navegue a través de nuestra extensa biblioteca de algoritmos. Desde los principios fundamentales de la física hasta las complejidades de la optimización financiera y logística.
                        </p>
                    </div>
                    <div class="flex flex-col gap-8">
                        <div class="bg-gradient-to-br from-[#4D4DFF] to-[#8A4DFF] p-1 rounded-xl shadow-2xl">
                            <div class="bg-[#111122] rounded-lg p-6 flex flex-col gap-4">
                                <div class="flex flex-col md:flex-row md:items-center gap-4">
                                    <div class="flex-shrink-0">
                                        <div class="size-12 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                                            <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="flex-1">
                                        <h3 class="text-white text-2xl font-bold">Bases de Gröbner: Nuestra Mayor Potencia</h3>
                                        <p class="text-white/70">La joya de la corona de RomiMath. Un algoritmo revolucionario para resolver sistemas de ecuaciones polinómicas no lineales.</p>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-4">
                                    <div>
                                        <h4 class="text-primary font-bold mb-2">CONCEPTO</h4>
                                        <p class="text-white/70 text-sm">Las Bases de Gröbner son un conjunto especial de generadores de un ideal en un anillo de polinomios. Permiten simplificar y resolver problemas algebraicos complejos que son intratables con métodos tradicionales.</p>
                                    </div>
                                    <div>
                                        <h4 class="text-primary font-bold mb-2">CÓMO FUNCIONA</h4>
                                        <p class="text-white/70 text-sm">Transforma un sistema de ecuaciones polinómicas en un sistema equivalente (la Base de Gröbner) que tiene una estructura triangular, facilitando la resolución sucesiva de las variables.</p>
                                    </div>
                                    <div>
                                        <h4 class="text-primary font-bold mb-2">EJEMPLO PRÁCTICO</h4>
                                        <pre class="bg-[#0A0A1A] p-3 rounded-lg text-sm overflow-x-auto"><code class="font-mono text-white/90 whitespace-pre">Resolver el sistema:
                                            x^2 + y + z = 1
                                            x + y^2 + z = 1
                                            x + y + z^2 = 1
                                            Una Base de Gröbner lo convierte en un problema manejable, encontrando todas las soluciones posibles, incluyendo las complejas.</code></pre>
                                    </div>
                                    <div>
                                        <h4 class="text-primary font-bold mb-2">POR QUÉ ES RELEVANTE</h4>
                                        <p class="text-white/70 text-sm">Es fundamental en campos como la robótica (cinemática inversa), la geometría computacional, la criptografía y la optimización. Permite resolver problemas que antes se consideraban imposibles.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-[#191933] rounded-xl border border-[#323267] p-6">
                            <h3 class="text-primary text-2xl font-bold mb-4">Mecánica Clásica</h3>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">CONCEPTO</h4>
                                    <p class="text-white/70 text-sm">Estudia el movimiento de los cuerpos y las fuerzas que lo causan, basándose en las leyes de Newton.</p>
                                </div>
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">CÓMO FUNCIONA</h4>
                                    <p class="text-white/70 text-sm">Utiliza ecuaciones de movimiento para predecir la trayectoria, velocidad y aceleración de objetos bajo la influencia de fuerzas conocidas.</p>
                                </div>
                                <div class="md:col-span-2">
                                    <h4 class="text-white/80 font-bold mb-2">EJEMPLO PRÁCTICO</h4>
                                    <pre class="bg-[#111122] p-3 rounded-lg text-sm overflow-x-auto"><code class="font-mono text-white/90 whitespace-pre">Calcular la trayectoria de un proyectil conociendo su velocidad inicial y el ángulo de lanzamiento.
                                        F = m * a
                                        v_f = v_i + a * t</code></pre>
                                </div>
                            </div>
                        </div>
                        <div class="bg-[#191933] rounded-xl border border-[#323267] p-6">
                            <h3 class="text-primary text-2xl font-bold mb-4">Relatividad</h3>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">CONCEPTO</h4>
                                    <p class="text-white/70 text-sm">Teoría de Einstein que describe la física del movimiento en ausencia de gravedad (Especial) y la gravedad como una curvatura del espaciotiempo (General).</p>
                                </div>
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">CÓMO FUNCIONA</h4>
                                    <p class="text-white/70 text-sm">Modifica las leyes de Newton para objetos que se mueven a velocidades cercanas a la de la luz y para cuerpos en campos gravitatorios intensos.</p>
                                </div>
                                <div class="md:col-span-2">
                                    <h4 class="text-white/80 font-bold mb-2">EJEMPLO PRÁCTICO</h4>
                                    <pre class="bg-[#111122] p-3 rounded-lg text-sm overflow-x-auto"><code class="font-mono text-white/90 whitespace-pre">Corregir el tiempo en los satélites GPS, que se ven afectados tanto por la relatividad especial (velocidad) como por la general (gravedad).
                                    E = mc^2</code></pre>
                                </div>
                            </div>
                        </div>
                        <div class="bg-[#191933] rounded-xl border border-[#323267] p-6">
                            <h3 class="text-primary text-2xl font-bold mb-4">Física Cuántica</h3>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">CONCEPTO</h4>
                                    <p class="text-white/70 text-sm">Describe el comportamiento de la materia y la energía a escala atómica y subatómica.</p>
                                </div>
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">CÓMO FUNCIONA</h4>
                                    <p class="text-white/70 text-sm">Utiliza la ecuación de Schrödinger para describir cómo el estado cuántico de un sistema físico cambia con el tiempo. Introduce conceptos como la dualidad onda-partícula y la cuantización.</p>
                                </div>
                                <div class="md:col-span-2">
                                    <h4 class="text-white/80 font-bold mb-2">EJEMPLO PRÁCTICO</h4>
                                    <pre class="bg-[#111122] p-3 rounded-lg text-sm overflow-x-auto"><code class="font-mono text-white/90 whitespace-pre">Desarrollo de láseres y transistores, que se basan en las propiedades cuánticas de los electrones en los materiales.
                                    iħ(∂ψ/∂t) = Hψ</code></pre>
                                </div>
                            </div>
                        </div>
                        <div class="bg-[#191933] rounded-xl border border-[#323267] p-6">
                            <h3 class="text-primary text-2xl font-bold mb-4">Inventario</h3>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">CONCEPTO</h4>
                                    <p class="text-white/70 text-sm">Gestión y control de las existencias de bienes y productos. Incluye modelos como la Clasificación ABC y el Modelo Newsvendor.</p>
                                </div>
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">CÓMO FUNCIONA</h4>
                                    <p class="text-white/70 text-sm">Utiliza algoritmos para optimizar la cantidad de stock, minimizar costos de almacenamiento y ruptura, y clasificar productos según su importancia.</p>
                                </div>
                                <div class="md:col-span-2">
                                    <h4 class="text-white/80 font-bold mb-2">EJEMPLO PRÁCTICO</h4>
                                    <pre class="bg-[#111122] p-3 rounded-lg text-sm overflow-x-auto"><code class="font-mono text-white/90 whitespace-pre">Una tienda de retail usa la Clasificación ABC para priorizar la gestión de sus productos más vendidos y rentables.</code></pre>
                                </div>
                                <div class="md:col-span-2">
                                    <h4 class="text-white/80 font-bold mb-2">POR QUÉ VENDERLO</h4>
                                    <p class="text-white/70 text-sm">Permite a las empresas reducir capital inmovilizado, mejorar la eficiencia del servicio al cliente y tomar decisiones estratégicas sobre su surtido de productos.</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-[#191933] rounded-xl border border-[#323267] p-6">
                            <h3 class="text-primary text-2xl font-bold mb-4">Logística</h3>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">CONCEPTO</h4>
                                    <p class="text-white/70 text-sm">Planificación, ejecución y control del movimiento y almacenamiento de bienes. Incluye problemas como el Flujo Máximo y el Algoritmo de Hungría para asignación.</p>
                                </div>
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">CÓMO FUNCIONA</h4>
                                    <p class="text-white/70 text-sm">Aplica algoritmos de optimización para resolver problemas de enrutamiento, asignación de tareas y maximización de la capacidad de redes de distribución.</p>
                                </div>
                                <div class="md:col-span-2">
                                    <h4 class="text-white/80 font-bold mb-2">EJEMPLO PRÁCTICO</h4>
                                    <pre class="bg-[#111122] p-3 rounded-lg text-sm overflow-x-auto"><code class="font-mono text-white/90 whitespace-pre">Una empresa de reparto utiliza algoritmos para encontrar las rutas más eficientes y asignar los paquetes a los vehículos adecuados.</code></pre>
                                </div>
                                <div class="md:col-span-2">
                                    <h4 class="text-white/80 font-bold mb-2">POR QUÉ VENDERLO</h4>
                                    <p class="text-white/70 text-sm">Reduce costos operativos, mejora los tiempos de entrega y aumenta la satisfacción del cliente a través de una cadena de suministro más eficiente.</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-[#191933] rounded-xl border border-[#323267] p-6">
                            <h3 class="text-primary text-2xl font-bold mb-4">Finanzas</h3>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">CONCEPTO</h4>
                                    <p class="text-white/70 text-sm">Aplicación de modelos matemáticos para la toma de decisiones financieras. Incluye el Modelo Markowitz para carteras y los Precios Hedónicos para valoración.</p>
                                </div>
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">CÓMO FUNCIONA</h4>
                                    <p class="text-white/70 text-sm">Utiliza la estadística y la optimización para analizar riesgos, valorar activos y construir carteras de inversión que equilibren riesgo y rendimiento.</p>
                                </div>
                                <div class="md:col-span-2">
                                    <h4 class="text-white/80 font-bold mb-2">EJEMPLO PRÁCTICO</h4>
                                    <pre class="bg-[#111122] p-3 rounded-lg text-sm overflow-x-auto"><code class="font-mono text-white/90 whitespace-pre">Un gestor de fondos utiliza el Modelo Markowitz para diversificar las inversiones de sus clientes y maximizar los retornos esperados.</code></pre>
                                </div>
                                <div class="md:col-span-2">
                                    <h4 class="text-white/80 font-bold mb-2">POR QUÉ VENDERLO</h4>
                                    <p class="text-white/70 text-sm">Proporciona herramientas cuantitativas para la gestión de inversiones, la valoración de activos complejos y la mitigación de riesgos financieros.</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-[#191933] rounded-xl border border-[#323267] p-6">
                            <h3 class="text-primary text-2xl font-bold mb-4">Utilidad</h3>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">CONCEPTO</h4>
                                    <p class="text-white/70 text-sm">Conjunto de herramientas algorítmicas de propósito general. Incluye el Suavizado Exponencial para pronósticos, Simulación Montecarlo y Clustering K-Means.</p>
                                </div>
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">CÓMO FUNCIONA</h4>
                                    <p class="text-white/70 text-sm">Ofrece soluciones para una amplia gama de problemas, desde la predicción de series temporales y la simulación de escenarios hasta la segmentación de datos.</p>
                                </div>
                                <div class="md:col-span-2">
                                    <h4 class="text-white/80 font-bold mb-2">EJEMPLO PRÁCTICO</h4>
                                    <pre class="bg-[#111122] p-3 rounded-lg text-sm overflow-x-auto"><code class="font-mono text-white/90 whitespace-pre">Una empresa de marketing usa Clustering K-Means para segmentar a sus clientes y personalizar sus campañas publicitarias.</code></pre>
                                </div>
                                <div class="md:col-span-2">
                                    <h4 class="text-white/80 font-bold mb-2">POR QUÉ VENDERLO</h4>
                                    <p class="text-white/70 text-sm">Brinda una caja de herramientas versátil que se puede aplicar a diversos dominios de negocio para mejorar la toma de decisiones, prever tendencias y descubrir patrones ocultos en los datos.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="contact">
                <div class="flex flex-col gap-6 px-4 py-10 rounded-xl bg-[#191933] border border-[#323267] mx-4 md:mx-0">
                <div class="flex flex-col gap-4 text-center items-center">
                <h2 class="text-white tracking-tight text-3xl font-bold">
                                                        RomiMath para Empresas
                                                    </h2>
                <p class="text-white/80 text-base font-normal leading-normal max-w-[720px] px-4 md:px-0">
                                                        Potencie su negocio con algoritmos matemáticos precisos y optimizados. Integre el poder de RomiMath en sus sistemas para obtener soluciones a medida y una ventaja competitiva.
                                                    </p>
                </div>
                <div class="flex justify-center">
                <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-violet-500 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors">
                <span class="truncate">Solicitar Información</span>
                </button>
                </div>
                </div>
                </section>
    </main>
        </>

    )


}

export default Home; 