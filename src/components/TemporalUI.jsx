import FacadeDriver from './../engine/FacadeDriver'; 
import { use, useState } from 'react';

function TemporalUI(){

    const [calculo, setCalculo] = useState("");
    const [resultado, setResultado] = useState(""); 
    const [historial, setHistorial] = useState("");
    const [esVisible, setVisible] = useState(false);
    

    let pasoPasoG = localStorage.getItem('groebner_pasos') || "Aquí van los resultados." ;

    function clickCalculo(){
        localStorage.setItem('groebner_pasos', "Procesando...");
        let motor = new FacadeDriver(1, calculo); 
        motor.runOp(); 
        setResultado("Resultado actual: " + motor.getRespuesta()); 
        setHistorial(historial + motor.getRespuesta() + " || "); 

    }

    function cerrarModal(){
        setVisible(false);
    }

    function cambiandoValor(event){
        if(event.target.value.includes('G')){
            mostrarBox(); 
        }
        setCalculo(event.target.value); 
    }

    function mostrarBox(){

        setVisible(true);

    }
    
    const pasos = pasoPasoG.split('|').filter(Boolean);  

    

    return (

        <>
            <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
                <div className="w-full max-w-2xl text-center space-y-8 flex-grow">

                    <div className="w-full max-w-md mx-auto aspect-[4/3] rounded-xl ">

                        <img alt="Logo romi math" className="w-100% h-100%" src="LOGO.png"/>

                    </div>

                    <p className="text-gray-600 dark:text-gray-400">
                        El diseño de la interfaz es minimalista y prioriza la función sobre la forma, reflejando mi enfoque en la optimización del núcleo algorítmico.
                    </p>
                    <a className="text-primary hover:underline" href="https://romimath.hashnode.dev/documentacion">Ver documentación</a>
                    <a className="text-primary hover:underline" href="https://romimath.hashnode.dev">Blog</a>
                        <div class="w-full max-w-md mx-auto space-y-4">

                            <input className="form-input w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-lg" placeholder="Ingrese la operación que desea" type="text" onChange={cambiandoValor} value={calculo} />

                            <button className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors duration-300 text-lg" onClick={clickCalculo} >
                                Calcular
                            </button>

                            { !esVisible && ( 
                                <div className="w-full max-w-md mx-auto mt-4" >

                                <div className="bg-gray-100 dark:bg-gray-800/20 p-4 rounded-lg max-h-[100px] overflow-y-auto text-left text-sm text-gray-700 dark:text-gray-300">
                                    <p>Los resultados se mostrarán aquí:</p>
                                    <p>{historial}</p>
                                    <p>{resultado}</p>
                                </div>

                            </div>
                            )}
                        </div>



                        <div class="text-left bg-gray-100 dark:bg-gray-800/20 p-6 rounded-lg text-sm text-gray-700 dark:text-gray-300 space-y-4">
                            <p><strong class="font-semibold text-gray-900 dark:text-white">Operaciones elementales:</strong> Para operaciones elementales simplemente escriba: <code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">27 + 3 - 52 + 5 * 21</code>. Recuerde que puede anidar con parentesis.</p>
                            <p><strong class="font-semibold text-gray-900 dark:text-white">Operaciones con fracciones:</strong> Para realizar operaciones con fracciones, debe indicar primero que la operación va a ser con fracción de la siguiente forma: F y luego escribir cada fracción entre paréntesis. Ejemplo: <code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">F (5/4) + (12/7)</code>.</p>
                            <p><strong class="font-semibold text-gray-900 dark:text-white">Potencias:</strong> Para indicar una potencia, también debe encapsularlo dentro de paréntesis, e utilizar el siguiente símbolo <code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"> (^)</code> para el exponente. Ejemplo potencia individual: <code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">P |5^3|</code>. Ejemplo de potencia dentro de una fracción: <code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">(5/|4^x|)</code>.</p>
                            <p><strong class="font-semibold text-gray-900 dark:text-white">Raíces:</strong> también debe agrupar de la siguiente forma: <code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">R \\indice\\radicando</code>. Ejemplo en una fracción: <code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">(5/(\\3\\9))</code>. Por supuesto, si solo va a operar con raíces indique la letra R.</p>

                            <p><strong class="font-semibold text-gray-900 dark:text-white">Ecuaciones líneales:</strong> solo indique la letra E al inicio. Ejemplo: <code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">E 3x+11-7x=1</code>.</p>

                            <p><strong class="font-semibold text-gray-900 dark:text-white">Ecuaciones racionales:</strong> Para ecuaciones racionales con polinomios en numerador o denominador, de un variable, indique ER al inicio de la operación. Ejemplo: <code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">ER (2x/x-1) + (3x+1/x-1) = 2</code>.</p>

                            <p><strong class="font-semibold text-gray-900 dark:text-white">Polinomios:</strong> Para polinomios solo ingrese los polinomios luego de agregar la abreviación POL, separándolos con una coma. Ejemplo: <code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">POL 2|x^4|-5|x^3|+|x^2|, 3|x^2|-5x+2</code>.</p>

                            <p><strong class="font-semibold text-gray-900 dark:text-white">Groebner Bases:</strong> Para calcular bases de Grobner, ingrese las ecuaciones separadas con coma <code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">G 2|x^4|-5|x^3|+|x^2|, 3|x^2|-5x+2</code>.</p>
                        </div>
                </div>
                <footer class="w-full max-w-2xl text-center py-4 mt-8">
                <p class="text-gray-500 dark:text-gray-400 text-sm">Creado por Diego Fernández</p>
                </footer>



                

                {esVisible && (

                    <div class="fixed top-14 right-8 w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 max-h-[500px] overflow-y-auto">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{resultado ? 'Procesando resultado.': 'Esperando datos...'}</h3>
                        <button class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={cerrarModal}>
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                        </button>
                    </div>
                    <div class="space-y-4">
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {resultado ? 'Tus bases de grobner están en progreso, aguarda un momento.': 'Aguardando a que ingreses las ecuaciones a verificar.'}
                            
                        </p>
                        <div class="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg">
                            <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">Calculos. <span class="text-primary">{resultado ? 'Procesando...': 'En espera de datos.'}</span></p>
                                {pasos.map((paso, index) => (
                                    <p key={index}>{paso} <br /> </p>
                                ))}
                        </div>
                        <div class="text-left bg-gray-100 dark:bg-gray-800/20 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300 space-y-2">
                            <p><strong class="font-semibold text-gray-900 dark:text-white">Polinomios ingresados:</strong></p>
                            <code class="block bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded text-xs">{calculo}</code>
                        </div>
                    </div>
                </div>

                )}

            </div>
        </>

    );


}

export default TemporalUI; 