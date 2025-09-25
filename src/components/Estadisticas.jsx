import {Pie, PieChart, Tooltip} from 'recharts'
function Estadisticas(){



	return(

		<div className="tab-panel" id="stats-tab">
            <div className="stat-item">
                <span className="stat-label">Cálculos Totales:</span>
                <span className="stat-value" id="total-calculations">0</span>
            </div>
            <div className="stat-item">
                <span className="stat-label">Éxitos:</span>
                <span className="stat-value" id="success-calculations">0</span>
            </div>
            <div className="stat-item">
                <span className="stat-label">Errores:</span>
                <span className="stat-value" id="error-calculations">0</span>
            </div>
            <div className="chart-container">
                <PieChart width={200} height={200}>
                    <Pie
                        activeShape={{
                            fill: 'rgba(255, 82, 82,1.0)',
                        }}
                        data={[
                            { name: 'Cálculos totales', uv: 10000, fill: "rgba(34, 112, 147,1.0)" },
                            { name: 'Éxitos', uv: 590, fill: "rgba(51, 217, 178,1.0)" },
                            { name: 'Errores', uv: 200, fill: "rgba(179, 57, 57,1.0)" },
                        ]}
                        dataKey="uv"/>
                    <Tooltip defaultIndex={2} />
                </PieChart>
            </div>
        </div>

		);


}
export default Estadisticas