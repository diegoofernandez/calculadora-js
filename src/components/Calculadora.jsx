import React from "react"
function Calculadora(){

    return (
        <>
            <div className="calculadora">
                <h1>CALCULADORA CIENTÍFICA</h1>
                
                <div id="layout-calc">
                    <div id="visor">
                        <input type="text" className="visor" placeholder="0" />
                    </div>
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
                    <div className="columnas">
                    <div>
                        <button dataInfo="potencia"><ion-icon name="square-outline"></ion-icon>&sup2;</button>
                        <button>SIN</button>
                        <button>IN</button>
                        <button>ANS</button>
                    </div>
                    <div>
                        <button>x&sup2;</button>
                        <button>COS</button>
                        <button>LOG 10</button>
                        <button>,</button>
                    </div>
                    <div>
                        <button>&radic;<ion-icon name="square-outline"></ion-icon></button>
                        <button>TAN</button>
                        <button>LOGx</button>
                        <button>(</button>
                    </div>
                    <div>
                        <button id="ac">AC</button>
                        <button>TT</button>
                        <button>&#8540;</button>
                        <button>)</button>
                    </div>
                    <div>
                        <button>7</button>
                        <button>4</button>
                        <button>1</button>
                        <button>0</button>
                    </div>
                    <div>
                        <button>8</button>
                        <button>5</button>
                        <button>2</button>
                        <button>.</button>
                    </div>
                    <div>
                        <button>9</button>
                        <button>6</button>
                        <button>3</button>
                        <button><ion-icon name="chevron-back-outline"></ion-icon></button>
                    </div>
                    <div>
                        <button>x</button>
                        <button>+</button>
                        <button>%</button>
                        <button><ion-icon name="chevron-forward-outline"></ion-icon></button>
                    </div>
                    <div>
                        <button>/</button>
                        <button>-</button>
                        <button id="borrar"><ion-icon name="arrow-undo-outline"></ion-icon></button>
                        <button id="calcular"><ion-icon name="checkbox-outline"></ion-icon></button>
                    </div>
                    </div>
                    <div className="funcionalidades">
                    <button>MCD</button>
                    <button>FRACCIONES</button>
                    </div>
                </div>

                <div className="TiposTrabajos">
                
                    <h3>IMPORTANTE</h3>
                    <p>
                        ¿Qué tipos de calculos puedes realizar por el momento?<br/> 
                        * Operaciones básicas (suma, resta, multiplicación, división)<br/>
                        * Combinar cualquier tipo de operación básica, colocarlas entre paréntesis o anidar paréntesis.<br/>
                        * Operaciones con fraciones propias e impropias. Anidar las mismas o múltiples operaciones con las mismas. También todo lo anterior con fracciones mixtas.<br/>
                        * Operaciones con exponentes.<br/>
                        * Raíces. <br/> 
                        * Combinación múltiple de todas las operaciones anteriores. (SIN VARIABLES POR EL MOMENTO)
                    </p>
                </div>

            </div>
        </>
    )

}

export default Calculadora