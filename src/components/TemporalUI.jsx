import FacadeDriver from './../engine/FacadeDriver'; 
import { useState } from 'react';

function TemporalUI(){

    const [calculo, setCalculo] = useState("");

    function clickCalculo(){

        let motor = new FacadeDriver(1, calculo); 
        motor.runOp(); 

    }

    function cambiandoValor(event){
        setCalculo(event.target.value); 
    }

    return (

        <>
            <h1>Motor Matemático</h1>
            <img src="https://i.gifer.com/V8qR.gif" />
            <p>Disculpe la interfaz humilde, estoy corriendo hacia las bases de Grobner para el motor. Palabra de caballero: Una vez el motor este completo, le daré la interfaz que usted merece. :D </p>
            <input type="text" placeholder="Calcula lo que quieras..." value={calculo} onChange={cambiandoValor} />
            <button onClick={clickCalculo}>CALCULAR</button>
            <p>Indicaciones... para calcular apriete enter.<br />Permite: Fracciones, Potencias, Raices, Polinomios, Ecuaciones Lineales, Ecuaciones Racionales.</p>
            <div>
                <p># Para cualquiera de las 4 operaciones elementales, así tengan varias anidaciones, no necesita seguir ninguna indicación, solo escribala. Ej: 76+150*10 o 13*(23/1+50*(7*7+50+3500/8))</p>
                <p># Para fracciones, indique la palabra E:(numerador/denominador): - Ejemplo: E:(3/4)</p>
                <p># Más info...</p>
            </div>

        </>

    );


}

export default TemporalUI; 