import { useState, useRef, useEffect } from 'react';
import TeX from '@matejmazur/react-katex'; 
import ConvertKatexToJson from '../libs/ConvertKatexToJson';
import FacadeDriver from './../engine/FacadeDriver'; 

function Home(){

    const [stringParse, setStringParse] = useState(''); 
    const [calculoMuestra, setCalculoMuestra] = useState(true);
    
    const formater = new ConvertKatexToJson(); 

    function runFormater(){

        localStorage.setItem('groebner_pasos', "Procesando...");
        let datosInput = document.getElementById('inputString'); 
        let entradaToJson = formater.katexToSystem(datosInput.value); 
        clickCalculo(); 
        let operando = new FacadeDriver();
        operando.init(entradaToJson);  


    }


    function driverInput(e){ 

        setStringParse(e.target.value);
        setCalculoMuestra(false); 

    }

    const [calculo, setCalculo] = useState("");
    const [esVisible, setVisible] = useState(false);


    let pasoPasoG = localStorage.getItem('groebner_pasos') || "Aquí van los resultados." ;
    
        function clickCalculo(){
            localStorage.setItem('groebner_pasos', "Procesando...");
            setVisible(true);
    
        }
    
        function cerrarModal(){
            setVisible(false);
            localStorage.setItem('groebner_pasos', "...");
        }
    
        function mostrarBox(){
    
            setVisible(true);
    
        }
        
        const pasos = pasoPasoG.split('|').filter(Boolean);  

    return(

        <>
            {esVisible && (

                    <div class="fixed z-50 top-14 right-8 w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 max-h-[500px] overflow-y-auto">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Procesando...</h3>
                        <button class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={cerrarModal}>
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                        </button>
                    </div>
                    <div class="space-y-4">
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            Tus calculos se mostrarán aquí...
                            
                        </p>
                        <div class="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg">
                            <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">Calculos. <span class="text-primary">Procesando...</span></p>
                                {pasos.map((paso, index) => (
                                    <p key={index}>{paso} <br /> </p>
                                ))}
                        </div>
                    </div>
                </div>

                )}













            <main class="flex flex-col gap-10 py-10 px-4 md:px-10 @container">
                <section class="flex flex-col items-center justify-center text-center py-12 md:py-20" id="hero">
                    <div class="flex flex-col items-center gap-6 w-full max-w-3xl">
                        <h1 class="text-white text-4xl md:text-5xl font-bold leading-tight tracking-tighter">
                            El Álgebra más potente del mundo, ahora accesible para todos.
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
                                <input id="inputString" class="w-full h-14 pl-5 pr-16 rounded-lg bg-[#191933] text-white font-mono border-2 border-[#323267] focus:border-primary focus:outline-none focus:ring-0 transition-colors" placeholder="Introduce tu cálculo..." onChange={driverInput}/>
                                <button onClick={runFormater} class="absolute right-2 flex items-center justify-center size-10 rounded-md bg-primary hover:bg-violet-500 text-white transition-colors">
                                <span class="material-symbols-outlined">=</span>
                                </button>
                            </div>
                        </div>
                        
                        
                        <div class="bg-[#191933] rounded-xl border border-[#323267] p-6">
                            <h3 class="text-primary text-2xl font-bold mb-4">Guía de Sintaxis KaTeX para RomiMath</h3>
                            <h4 class="text-white/80 font-bold mb-2">📝 Introducción</h4>
                            <p class="text-white/70 text-sm">
                                Si vas a calcular bases de Grobner debes dividir cada polinomio con punto y coma (;) y colocar la letra G antes de escribir tus polinomios. Ej: <br/><br/>
                                G w^2+x^2+y^2+z^2-1 = 0; w+x+y+z-1 = 0; wx+zw+xy+yz-1 = 0; wxy+zwx+yzw+xyz-1 = 0<br/><br/>
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
                            Navegue a través de nuestra extensa biblioteca de algoritmos.
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
                                        <h3 class="text-white text-2xl font-bold">Bases de Gröbner: Nuestra Mayor Potencia, la precisión perfecta.</h3>
                                        <p class="text-white/70">El Algoritmo de la Verdad para Sistemas de Reglas Complejas.</p>
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
                                        <h4 class="text-primary font-bold mb-2">DEFINICIÓN</h4>
                                        <p class="text-white/70 text-sm">Este motor implementa Bases de Gröbner con Aritmética Racional Exacta (BigInt). Esto garantiza la Certeza Absoluta en la solución y la detección irrefutable de inconsistencias lógicas (1=0), eliminando el 100% del error de punto flotante.</p>
                                    </div>
                                    <div>
                                        <h4 class="text-primary font-bold mb-2">VENTAJA</h4>
                                        <p class="text-white/70 text-sm">Certeza Ilimitada: Precisión infinita en cada cálculo (no hay errores de float).</p>
                                    </div>
                                    <div>
                                        <h4 class="text-primary font-bold mb-2">CAMPO DE ACCIÓN</h4>
                                        <p class="text-white/70 text-sm">Validación de Lógica: Prueba si sus reglas de negocio son consistentes, previniendo fallos en modelos de riesgo o regulatorios.</p>
                                    </div>
                                    <div>
                                        <h4 class="text-primary font-bold mb-2">EJEMPLO PRACTICO</h4>
                                        <pre class="bg-[#0A0A1A] p-3 rounded-lg text-sm overflow-x-auto"><code class="font-mono text-white/90 whitespace-pre">Resolver el sistema:<br/>
                                            <TeX block math="x^2 + y + z = 1"></TeX>
                                            <TeX block math="x + y^2 + z = 1"></TeX>
                                            <TeX block math="x + y + z^2 = 1"></TeX>
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
                            <h3 class="text-primary text-2xl font-bold mb-4">🤝 #1 - Únete al Desarrollo</h3>
                            <div class="grid md:grid-cols-1 gap-6">
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">"Este motor es de código abierto"</h4>
                                    <p class="text-white/70 text-sm">¿Eres desarrollador o matemático? ¡Tu experiencia es valiosa! Contribuye con código, reporta bugs, sugiere mejoras o ayuda a documentar. Juntos podemos hacer herramientas matemáticas más accesibles.</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-[#191933] rounded-xl border border-[#323267] p-6">
                            <h3 class="text-primary text-2xl font-bold mb-4">💙 #2 - Soporte Voluntario</h3>
                            <div class="grid md:grid-cols-1 gap-6">
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">"La integración es gratuita, el soporte se agradece"</h4>
                                    <p class="text-white/70 text-sm">No cobramos por usar el motor, pero si te sirve y querés apoyar su desarrollo, aceptamos donaciones. Cada aporte ayuda a mantener el proyecto activo y mejorar su performance.</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-[#191933] rounded-xl border border-[#323267] p-6">
                            <h3 class="text-primary text-2xl font-bold mb-4">🌍 #3 - Open Source & Transparencia</h3>
                            <div class="grid md:grid-cols-1 gap-6">
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">"Código 100% abierto, decisiones 100% transparentes"</h4>
                                    <p class="text-white/70 text-sm">Todo el código está disponible en GitHub bajo licencia MIT. Creemos en el software libre y la colaboración abierta. Revisá, auditá y contribuí sin restricciones.</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-[#191933] rounded-xl border border-[#323267] p-6">
                            <h3 class="text-primary text-2xl font-bold mb-4">🎯 #4 - Sponsors & Empresas</h3>
                            <div class="grid md:grid-cols-1 gap-6">
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">"¿Usás el motor en tu empresa? Sé nuestro sponsor"</h4>
                                    <p class="text-white/70 text-sm">Si implementás el motor en proyectos comerciales, considerá sponsorear el desarrollo. Ofrecemos visibilidad, prioridad en features y soporte personalizado.</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-[#191933] rounded-xl border border-[#323267] p-6">
                            <h3 class="text-primary text-2xl font-bold mb-4">📚 #5 - Educación & Divulgación</h3>
                            <div class="grid md:grid-cols-1 gap-6">
                                <div>
                                    <h4 class="text-white/80 font-bold mb-2">"Llevemos las matemáticas a más personas"</h4>
                                    <p class="text-white/70 text-sm">¿Das clases o hacés divulgación? Te ayudamos a integrar el motor en tus materiales educativos. Compartamos el conocimiento sin barreras.</p>
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