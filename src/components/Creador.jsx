import perfil from './../assets/img/perfil.jpg'
function Creador(){

    return(

        <>
        
            <main class="flex flex-col gap-12 md:gap-16 mt-10 md:mt-16">

                <div class="flex flex-wrap justify-between gap-3 p-4">
                    <div class="flex w-full flex-col gap-3 text-center items-center">
                        <p class="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                            Sobre mí
                        </p>
                        <p class="text-text-secondary-dark text-base md:text-lg font-normal leading-normal max-w-2xl">
                            Detrás del motor RomiMath
                        </p>
                    </div>
                </div>
                <div class="flex p-4 @container">
                    <div class="flex w-full flex-col gap-6 @[520px]:flex-row @[520px]:justify-center @[520px]:items-center">
                        <div class="flex justify-center">
                            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 md:h-40 md:w-40 border-2 border-primary" data-alt="Foto de perfil de Diego Fernández">
                                <img src={perfil} className="rounded-full" />
                            </div>
                        </div>
                        <div class="flex flex-col justify-center text-center @[520px]:text-left">
                            <p class="text-white text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em]">Diego Fernández</p>
                            <p class="text-text-secondary-dark text-lg md:text-xl font-normal leading-normal">Programador FullStack</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-12 md:gap-16">
                    <section>
                        <h2 class="text-white text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 border-l-4 border-primary">Quién Soy</h2>
                        <p class="text-text-primary-dark text-base md:text-lg font-normal leading-relaxed pb-3 pt-4 px-4">
                            Un desarrollador autodidacta con una pasión profunda por las matemáticas y la programación. Sin título secundario ni universitario, he construido mi camino mediante estudio independiente y proyectos prácticos
                        </p>
                    </section>
                    <section>
                        <h2 class="text-white text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 border-l-4 border-primary">El Origen del Proyecto</h2>
                        <p class="text-text-primary-dark text-base md:text-lg font-normal leading-relaxed pb-3 pt-4 px-4">
                            Hace apenas dos meses comencé a estudiar matemáticas de manera seria, empezando desde lo más básico: operaciones con fracciones. Este motor nació como un proyecto para consolidar ese aprendizaje y construir un portfolio profesional. En el camino, descubrí el poder de las bases de Gröbner y el proyecto evolucionó hacia algo mucho más ambicioso.
                        </p>
                    </section>
                <section>
                    <h2 class="text-white text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 border-l-4 border-primary">Arquitectura del Motor</h2>
                    <p class="text-text-primary-dark text-base md:text-lg font-normal leading-relaxed pb-3 pt-4 px-4 mb-6">
                        Desarrollado completamente en TypeScript, el motor utiliza una arquitectura AST (Abstract Syntax Tree) con patrones avanzados:
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                        <div class="bg-surface-dark p-6 rounded-lg border border-white/10">
                            <h3 class="text-secondary text-lg font-bold mb-2">Patrón Facade</h3>
                            <p class="text-text-secondary-dark text-sm">Interfaz simplificada para operaciones complejas.</p>
                        </div>
                        <div class="bg-surface-dark p-6 rounded-lg border border-white/10">
                            <h3 class="text-secondary text-lg font-bold mb-2">Patrón Strategy</h3>
                            <p class="text-text-secondary-dark text-sm">Algoritmos intercambiables en tiempo de ejecución para reducción polinomial.</p>
                        </div>
                        <div class="bg-surface-dark p-6 rounded-lg border border-white/10">
                            <h3 class="text-secondary text-lg font-bold mb-2">Patrón Template Method</h3>
                            <p class="text-text-secondary-dark text-sm">Esqueleto reutilizable para el algoritmo de Buchberger.</p>
                        </div>
                        <div class="bg-surface-dark p-6 rounded-lg border border-white/10">
                            <h3 class="text-secondary text-lg font-bold mb-2">Patrón Visitor</h3>
                            <p class="text-text-secondary-dark text-sm">Recorrido y manipulación eficiente del AST.</p>
                        </div>
                        <div class="bg-surface-dark p-6 rounded-lg border border-white/10">
                            <h3 class="text-secondary text-lg font-bold mb-2">Flyweight</h3>
                            <p class="text-text-secondary-dark text-sm">Optimización de memoria para objetos matemáticos frecuentes.</p>
                        </div>
                        <div class="bg-surface-dark p-6 rounded-lg border border-white/10">
                            <h3 class="text-secondary text-lg font-bold mb-2">Double Dispatch</h3>
                            <p class="text-text-secondary-dark text-sm">Resolución dinámica de operaciones entre tipos.</p>
                        </div>
                    </div>
                </section>
                <section>
                    <h2 class="text-white text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 border-l-4 border-primary">Tecnologías Utilizadas</h2>
                    <div class="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
                        <div class="flex flex-col items-center gap-2">
                            <img class="h-12 w-12" data-alt="TypeScript logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZtua6UNu16KJxVIuykxr92GHy8nNg_PEJ8mopOV9GwwkOR23-3fDQSI75p5FLIAytIQszEMZNcdqDnEA1_H-IyTgcAsigJaqTxbqg1VyNQqHvdOxvn-DdmIyDQflQD4pIliuMPrJDszMDWAe61Z5vJysYqUWVsSar7lsR4omrQWdAvQghA_mMpjdLT31sZ5MXBo1r7dcSMYxlFytZ4VKx2JQU-QQNrFDBWIFOmBd2H9HR2r0JkTCviW8sljein87w9LPsZybuyk0O"/>
                            <p class="text-text-secondary-dark text-sm">TypeScript</p>
                        </div>
                        <div class="flex flex-col items-center gap-2">
                            <img class="h-12 w-12" data-alt="React logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqRdLqrrDatHAYjLbHnUXQaMiYBpELhM7X432XV_LwLVfACjjVk2V17Y5-n1VgbRTwH7kuD_Zv_6rzVvjB1fmrbCFbWpfrtwxOFLly8i1D_hs3dxfeosEh5As9PlLP6iiouYz_B_XptXBqIHOvrtP42lUSHWpkIHYsy_f0HxD5Hw4KbhWfMj-lb7HTc1czGObC_-l2P8PEFNMBEK5DEeYKs5-FWBC3pIBbnbRaKoO0hl612CFz3PltPjippXnqp1LbxiB90G9_DJIy"/>
                            <p class="text-text-secondary-dark text-sm">React</p>
                        </div>
                        <div class="flex flex-col items-center gap-2">
                            <img class="h-12 w-12" data-alt="Tailwind CSS logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmE4i7m_dlpDMJJXrbUQzHFWmkrdXJqHI3mPxuv7zDeArcMrf0WYxUhVGEa1-KIcbzyzl_k3UvzkcX-frLNORPcxPHLH6j7Dl1ZAn-xQ2vF7sbshj8oJXjP1nVB8xgQs2uOW2Pz2qVe0Ln3-Z1UL9vLnnnCHebtgatFjcoYOExexCdgbl8eQymE5W0tBsa_bbcyyO4CZ5MVc8WRg8_bhlCA3n19cFH2wCS_T9xtuvUQB9gn8_PzD5sYgE__TnOPahIKZZUMjLMrBcp"/>
                            <p class="text-text-secondary-dark text-sm">TailwindCSS</p>
                        </div>
                        <div class="flex flex-col items-center gap-2">
                            <img class="h-12 w-12 bg-white p-1 rounded-md" data-alt="KaTeX logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRHKHuEUN9JiOZuh4hshlGuZRGlg92kxq_L8yG7qyKdIV1FljpVEnGwhJZ-LZ6RiMGNEYfoDtDbct5b0lCMpq0MpWBmsWdiI32wpuesltkftZyiOKVMsFJWtaLKg7WcVU7qCK2GNfdapj2baAc54McB6RAxTW5vwLmsBz0I3zv8J3imlsYFmKYg-UHiyUNWCwld5knR6CbyfMGNolvxYD1bbTWKJ60O5ZW4sG746krLZwO4q9O52f4lfnQ8ZB68JESDNZ02gnL9p4w"/>
                            <p class="text-text-secondary-dark text-sm">KaTeX</p>
                        </div>
                        <div class="flex flex-col items-center gap-2 col-span-2 sm:col-span-1">
                            <div class="h-12 w-12 flex items-center justify-center">
                            <span class="text-3xl font-bold text-secondary">BigInt</span>
                            </div>
                            <p class="text-text-secondary-dark text-sm">BigInt</p>
                        </div>
                    </div>
                </section>
                <section>
                    <h2 class="text-white text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 border-l-4 border-primary">De las Fracciones a Gröbner</h2>
                    <p class="text-text-primary-dark text-base md:text-lg font-normal leading-relaxed pb-3 pt-4 px-4">
                        Este proyecto representa mi filosofía de aprendizaje: empezar desde los fundamentos y construir hacia arriba. Desde las operaciones básicas con fracciones hasta la implementación completa del algoritmo de Buchberger, cada línea de código refleja un concepto matemático comprendido en profundidad.
                    </p>
                </section>
                <section>
                    <h2 class="text-white text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 border-l-4 border-primary">Para Quiénes es Esta Herramienta</h2>
                    <p class="text-text-primary-dark text-base md:text-lg font-normal leading-relaxed pb-3 pt-4 px-4">
                        Para todos los que creen que el conocimiento no tiene puertas y que las herramientas poderosas deben ser accesibles, transparentes y libres. Ya seas estudiante, ingeniero, investigador o simplemente alguien curioso, este motor está diseñado para ti.
                    </p>
                    <ul class="list-disc list-inside space-y-2 pt-4 px-4 text-text-secondary-dark">
                        <li><span class="text-text-primary-dark">Estudiantes de ciencias e ingeniería</span> que buscan una herramienta para verificar sus cálculos y explorar conceptos abstractos de forma interactiva.</li>
                        <li><span class="text-text-primary-dark">Desarrolladores y programadores</span> que necesitan integrar capacidades de cálculo simbólico en sus aplicaciones web.</li>
                        <li><span class="text-text-primary-dark">Educadores y académicos</span> que desean una plataforma abierta para crear material didáctico y demostraciones matemáticas.</li>
                        <li><span class="text-text-primary-dark">Entusiastas de las matemáticas</span> curiosos por experimentar con álgebra computacional en un entorno moderno y accesible.</li>
                        <li><span class="text-text-primary-dark">Empresas de distintas áreas</span> que necesiten tomar decisiones con precisión algebraica.</li>
                    </ul>
                </section>

                <section class="text-center py-10">
                    <h2 class="text-white text-3xl font-bold mb-4">¿Listo para explorar?</h2>
                    <p class="text-text-secondary-dark mb-8 max-w-xl mx-auto">Sumérgete en el motor, explora el código fuente o lee la documentación para empezar.</p>
                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="/">
                            <button class="flex w-full sm:w-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-80 transition-opacity">
                            <span class="truncate">Explorar el Motor</span>
                            </button>
                        </a>
                        <a href="https://github.com/diegoofernandez" target="_blank">
                            <button class="flex w-full sm:w-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-surface-dark text-white border border-white/20 text-base font-bold leading-normal tracking-[0.015em] hover:bg-white/10 transition-colors">
                            <span class="truncate">Ver en GitHub</span>
                            </button>
                        </a>
                    </div>
                </section>
                </div>
            </main>
        
        </>

    )

}

export default Creador; 