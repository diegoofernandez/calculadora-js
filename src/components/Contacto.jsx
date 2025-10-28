function Contacto(){


    return(

        <>
        <main class="flex flex-col gap-10 md:gap-16 mt-10 md:mt-16">
            <div class="flex flex-wrap justify-between gap-3 p-4">
                <div class="flex w-full flex-col gap-3 text-center items-center">
                    <p class="text-white text-4xl md:text-5xl font-bold leading-tight tracking-[-0.033em]">Contacto y Colaboración</p>
                    <p class="text-white/70 text-base md:text-lg font-normal leading-normal max-w-2xl">
                        RomiMath está abierto a colaboraciones para integrar nuestro motor Gröbner. Conéctate con nosotros para explorar oportunidades y llevar tus proyectos al siguiente nivel.
                    </p>
                </div>
            </div>
            <section>
                <h2 class="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 text-center">Canales de Contacto</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    <a class="flex flex-1 flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-6 hover:border-accent-violet hover:bg-accent-violet/10 transition-all transform hover:-translate-y-1" href="mailto:contact@romimath.dev">
                    <div class="text-accent-violet"><span class="material-symbols-outlined">mail</span></div>
                    <div class="flex flex-col gap-1">
                        <h3 class="text-white text-lg font-bold leading-tight">Email</h3>
                        <p class="text-white/70 text-sm font-normal leading-normal">diego225587@gmail.com</p>
                    </div>
                    </a>
                    <a class="flex flex-1 flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-6 hover:border-accent-violet hover:bg-accent-violet/10 transition-all transform hover:-translate-y-1" href="https://github.com/romimath" target="_blank">
                    <div class="text-accent-violet"><span class="material-symbols-outlined">code</span></div>
                    <div class="flex flex-col gap-1">
                        <h3 class="text-white text-lg font-bold leading-tight">GitHub</h3>
                        <p class="text-white/70 text-sm font-normal leading-normal">github.com/diegoofernandez</p>
                    </div>
                    </a>
                    <a class="flex flex-1 flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-6 hover:border-accent-violet hover:bg-accent-violet/10 transition-all transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1" href="https://linkedin.com/in/romimath" target="_blank">
                    <div class="text-accent-violet"><span class="material-symbols-outlined">group</span></div>
                    <div class="flex flex-col gap-1">
                        <h3 class="text-white text-lg font-bold leading-tight">LinkedIn</h3>
                        <p class="text-white/70 text-sm font-normal leading-normal">linkedin.com/in/diego-fern%C3%A1ndez-b86187a6/</p>
                    </div>
                    </a>
                </div>
            </section>
            <section>
                <h2 class="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 text-center">Áreas de Colaboración</h2>
                <div class="flex flex-col gap-4 p-4">
                    <div class="rounded-lg border border-white/10 bg-white/5 p-6">
                        <h3 class="text-lg font-bold text-white mb-2">Empresas</h3>
                        <p class="text-white/70 text-sm">Ofrecemos integración de nuestro motor a través de API, desarrollo de soluciones personalizadas y consultoría para optimizar sus procesos computacionales.</p>
                    </div>
                    <div class="rounded-lg border border-white/10 bg-white/5 p-6">
                        <h3 class="text-lg font-bold text-white mb-2">Instituciones Educativas</h3>
                        <p class="text-white/70 text-sm">Colaboramos con universidades y centros educativos para el uso académico de RomiMath, impartición de talleres y desarrollo de material didáctico.</p>
                    </div>
                    <div class="rounded-lg border border-white/10 bg-white/5 p-6">
                        <h3 class="text-lg font-bold text-white mb-2">Investigadores</h3>
                        <p class="text-white/70 text-sm">Estamos abiertos a proyectos de investigación conjuntos, publicaciones académicas y la aplicación de nuestro motor en nuevos dominios científicos.</p>
                    </div>
                </div>
            </section>
            <section>
                <h2 class="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 text-center">Información Adicional</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <div class="flex flex-col items-center text-center gap-3 rounded-lg border border-white/10 bg-white/5 p-6">
                        <div class="text-primary"><span class="material-symbols-outlined">schedule</span></div>
                        <h3 class="text-white text-lg font-bold leading-tight">Tiempos de Respuesta</h3>
                        <p class="text-white/70 text-sm">Nos esforzamos por responder a todas las consultas en un plazo de 48 horas hábiles.</p>
                    </div>
                    <div class="flex flex-col items-center text-center gap-3 rounded-lg border border-white/10 bg-white/5 p-6">
                        <div class="text-primary"><span class="material-symbols-outlined">videocam</span></div>
                        <h3 class="text-white text-lg font-bold leading-tight">Disponibilidad para Reuniones</h3>
                        <p class="text-white/70 text-sm">Estamos disponibles para agendar reuniones virtuales para discutir potenciales colaboraciones en detalle.</p>
                    </div>
                </div>
            </section>
            <section class="p-4">
                <div class="rounded-xl bg-gradient-to-r from-primary/80 to-accent-violet/80 p-8 text-center flex flex-col items-center gap-4">
                    <h2 class="text-white text-2xl md:text-3xl font-bold">Proyecto de Código Abierto</h2>
                    <p class="text-white/90 max-w-xl">RomiMath es un proyecto impulsado por la comunidad. Creemos en el poder del código abierto para democratizar el conocimiento. Explora nuestro repositorio, contribuye y sé parte de nuestra misión.</p>
                    <a class="mt-2 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white text-black text-base font-bold leading-normal tracking-[0.015em] hover:bg-white/90 transition-colors" href="https://github.com/diegoofernandez" target="_blank">
                    <span class="truncate">Explorar en GitHub</span>
                    </a>
                </div>
            </section>
        </main>
        
        </>

    )


}

export default Contacto; 