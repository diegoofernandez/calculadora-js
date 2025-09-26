function VisorComplex(){

	return(

		<>
			<div className="VisorComplex">
                <div className="Botonera">
                    <div className="OpcionesBotonoera"><p>Nueva potencia</p></div>
                    <div className="OpcionesBotonoera"><p>Nueva raíz</p></div>
                    <div className="OpcionesBotonoera"><p>Nueva fracción</p></div>
                    <div className="OpcionesBotonoera"><ion-icon name="apps-outline"></ion-icon></div>
                </div>
                <div className="Fraccion">
                    <div className="BoxFraccion" contenteditable="true">
                        <p>??</p>
                    </div>
                    <div className="Line"></div>
                    <div className="BoxFraccion" contenteditable="true">
                        <p>??</p>
                    </div>
                </div>
                <p>(</p>
                <div className="Fraccion">
                    <div className="BoxFraccion" contenteditable="true">
                        <p>??</p>
                    </div>
                    <div className="Line"></div>
                    <div className="BoxFraccion" contenteditable="true">
                        <p>??</p>
                    </div>
                </div>
                <p>=</p>
                <div className="Potencia">
                    <div className="Exponente" contenteditable="true">?</div>
                    <div className="BasePotencia" contenteditable="true">?</div>
                </div>
                <p>)</p>
                <div className="Potencia">
                    <div className="Exponente" contenteditable="true">?</div>
                    <div className="BasePotencia" contenteditable="true">?</div>
                </div>
            </div>
		</>

		);

}

export default VisorComplex