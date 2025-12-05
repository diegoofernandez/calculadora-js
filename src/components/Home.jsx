import { useState, useRef, useEffect } from 'react';
import TeX from '@matejmazur/react-katex'; 
import ConvertKatexToJson from '../libs/ConvertKatexToJson';
import FacadeDriver from '../engine/FacadeDriver'; 


function Home(){

    const jsonData = [
        {type: "Monomio", coeficiente: 1, partes: [{objeto: "Potencia", base: "w", exponente: 1}]},
        {type: "Monomio", coeficiente: 1, partes: [{objeto: "Potencia", base: "x", exponente: 1}]},
        {type: "Monomio", coeficiente: 1, partes: [{objeto: "Potencia", base: "y", exponente: 1}]},
        {type: "Monomio", coeficiente: 1, partes: [{objeto: "Potencia", base: "z", exponente: 1}]},
        {type: "Monomio", coeficiente: -100000, partes: []}
    ]; 
    const [stringParse, setStringParse] = useState(''); 
    const [calculoMuestra, setCalculoMuestra] = useState(true);
    const [usarCalculadora, setUsarCalculadora] = useState(false); 
    
    const formater = new ConvertKatexToJson(); 

    function runFormater(){

        localStorage.setItem('groebner_pasos', "Procesando...");
        let datosInput = document.getElementById('inputString'); 
        let entradaToJson = formater.katexToSystem(datosInput.value); 
        clickCalculo(); 
        let operando = new FacadeDriver();
        operando.init(entradaToJson);  


    }

    function mostrarCampoCalculadora(){

        if(usarCalculadora){
            setUsarCalculadora(false); 
        }else{
            setUsarCalculadora(true);
        }

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

                    <div className="fixed z-50 top-14 right-8 w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 max-h-[500px] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Procesando...</h3>
                        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={cerrarModal}>
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                        </button>
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Tus calculos se mostrarán aquí...
                            
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Calculos. <span className="text-primary">Procesando...</span></p>
                                {pasos.map((paso, index) => (
                                    <p key={index}>{paso} <br /> </p>
                                ))}
                        </div>
                    </div>
                </div>

                )}

            <div className="MainContainer">
                
                <div className="JsonInput">
                    <pre contentEditable="true">
                        <code> 
                            {JSON.stringify(jsonData, null, 2)}
                        </code>
                    </pre>
                    <button><ion-icon name="calculator-outline"></ion-icon> REALIZAR CALCULO</button>
                </div>
                <div className="ViewsResult">
                    
                    <div class="tabsViews">
                        <button><ion-icon name="stats-chart-outline"></ion-icon> Gráficas</button>
                        <button><ion-icon name="tv-outline"></ion-icon> Consola</button>
                        <button><ion-icon name="text-outline"></ion-icon> Texto</button>
                    </div>

                </div>

            </div>

        </>

    )


}

export default Home; 