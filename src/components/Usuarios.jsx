import Estadisticas from './Estadisticas'
import Usertab from './Usertab'
import Soporte from './Soporte'
import {useState} from 'react'

function Usuarios(){

    const [tabSeleccionada, setTabSeleccionada] = useState("stats")

    function handleTabs(value){

        setTabSeleccionada(value)

    }


    return (
        <>
            <aside className="box-usuarios">
                <div className="tabs-container">
                    <div className="tabs-header">
                        <button className="tab-btn active" onClick={() => handleTabs("stats")}>Estadísticas</button>
                        <button className="tab-btn" onClick={() => handleTabs("user")}>Usuario</button>
                        <button className="tab-btn" onClick={() => handleTabs("spor")}>Soporte</button>
                    </div>
                
                    <div className="tabs-content">
                        {tabSeleccionada == "stats" && <Estadisticas />}
                        {tabSeleccionada == "user" && <Usertab />}
                        {tabSeleccionada == "spor" && <Soporte />}
                    </div>
                </div>
            </aside>
        </>
    )

}
export default Usuarios;