import { useState } from "react";

function VisorComplex(){

    const [objetos, setObjetos] = useState([]); 


    const agregarElemento = (e) => {

        let fraccion = (
            <div className="Fraccion" key={Date.now()}><div className="BoxFraccion" contenteditable="true"></div><div className="Line"></div><div className="BoxFraccion" contenteditable="true"></div></div>
        );        
        console.log(e); 
        if(e.target.dataset.name == "fraccion"){
            setObjetos([...objetos, fraccion]); 
        }
            
       
    }

	return(

		<>
			<div className="VisorComplex">
                <div className="Botonera">
                    <div className="OpcionesBotonoera"><p>Nueva potencia</p></div>
                    <div className="OpcionesBotonoera"><p>Nueva raíz</p></div>
                    <div className="OpcionesBotonoera" data-name="fraccion" onClick={agregarElemento}><p>Nueva fracción</p></div>
                    <div className="OpcionesBotonoera"><ion-icon name="apps-outline"></ion-icon></div>
                </div>
                {
                    objetos.map(elemento => elemento)
                }
                <div className="Fraccion">
                    <div className="BoxFraccion" contenteditable="true">
                    </div>
                    <div className="Line"></div>
                    <div className="BoxFraccion" contenteditable="true">
                    </div>
                </div>
                <p>(</p>
                <div className="Fraccion">
                    <div className="BoxFraccion" contenteditable="true">
                    </div>
                    <div className="Line"></div>
                    <div className="BoxFraccion" contenteditable="true">
                    </div>
                </div>
                <p>=</p>
                <div className="Potencia">
                    <div className="Exponente" contenteditable="true"></div>
                    <div className="BasePotencia" contenteditable="true"></div>
                </div>
                <p>)</p>
                <div className="Potencia">
                    <div className="Exponente" contenteditable="true"></div>
                    <div className="BasePotencia" contenteditable="true"></div>
                </div>
            </div>
		</>

		);

}

export default VisorComplex