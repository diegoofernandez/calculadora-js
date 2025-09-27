import {useState} from 'react'
import VisorComplex from './VisorComplex'
import {FacadeDriver} from './../engine/FacadeDriver'

function Calculadora(){

    const [stringVisorNormal, setVisorNormal] = useState("")
    const [visorComplex, setComplex] = useState(0)
    

    function clickCalc(event){
        if(event.target.name != "del" && event.target.name != "ac" && event.target.name != "calcular"){
            setVisorNormal(stringVisorNormal + event.target.name)
        }else if(event.target.name == "del"){
            let nuevoString = stringVisorNormal.slice(0, -1)
            setVisorNormal(nuevoString)
        }else if(event.target.name == "ac"){
            setVisorNormal("")
        }else if(event.target.name == "calcular"){
            let motor = new FacadeDriver(visorComplex, stringVisorNormal); 
            console.log(motor.runOp()); 
        }
    }

    function clickVisor(){
        if(visorComplex == 0){
            setComplex(1)
        }else{
            setComplex(0)
        }
    }

    let visorObj = <VisorComplex />

    return (
        <>
            <div className="calculadora">
                <h1>CALCULADORA CIENTÍFICA</h1>
                
                <div id="layout-calc">
                    {visorComplex ? (visorObj) : (
                            <div id="visor">
                                <input type="text" className="visor" placeholder="0" value={stringVisorNormal}/>
                            </div>
                        )
                    }
                    <div className="columnas">
                        <div>
                            <button><ion-icon name="square-outline"></ion-icon>&sup2;</button>
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
                            <button onClick={clickCalc} name="(">(</button>
                        </div>
                        <div>
                            <button id="ac" name="ac" onClick={clickCalc} >AC</button>
                            <button>TT</button>
                            <button>&#8540;</button>
                            <button onClick={clickCalc} name=")">)</button>
                        </div>
                        <div>
                            <button name="7" onClick={clickCalc}>7</button>
                            <button name="4" onClick={clickCalc}>4</button>
                            <button name="1" onClick={clickCalc}>1</button>
                            <button name="0" onClick={clickCalc}>0</button>
                        </div>
                        <div>
                            <button name="8" onClick={clickCalc}>8</button>
                            <button name="5" onClick={clickCalc}>5</button>
                            <button name="2" onClick={clickCalc}>2</button>
                            <button name="." onClick={clickCalc}>.</button>
                        </div>
                        <div>
                            <button name="9" onClick={clickCalc}>9</button>
                            <button name="6" onClick={clickCalc}>6</button>
                            <button name="3" onClick={clickCalc}>3</button>
                            <button><ion-icon name="chevron-back-outline"></ion-icon></button>
                        </div>
                        <div>
                            <button name="*" onClick={clickCalc}>*</button>
                            <button name="+" onClick={clickCalc}>+</button>
                            <button name="%" onClick={clickCalc}>%</button>
                            <button><ion-icon name="chevron-forward-outline"></ion-icon></button>
                        </div>
                        <div>
                            <button name="/" onClick={clickCalc}>/</button>
                            <button name="-" onClick={clickCalc}>-</button>
                            <button id="borrar" name="del" onClick={clickCalc}>DEL</button>
                            <button id="calcular" name="calcular" onClick={clickCalc} >=</button>
                        </div>
                    </div>
                    <div className="funcionalidades">
                    <button>MCD</button>
                    <button onClick={clickVisor} >FRACCIONES</button>
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