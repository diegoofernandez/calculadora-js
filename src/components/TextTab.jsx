const TextTab = ({ calculationResult }) => {
    const getMathSymbol = (char) => {
        const symbols = {
            '^': '^',
            '*': '×',
            '/': '÷',
            'sqrt': '√'
        };
        return symbols[char] || char;
    };

    const formatPolynomial = (poly) => {
        return poly
            .replace(/\^(\d+)/g, '⁰¹²³⁴⁵⁶⁷⁸⁹'.split('')[parseInt('$1')] || '^$1')
            .replace(/\*/g, '·');
    };

    return (
        <div className="text-container">
            <div className="text-header">
                <h3>
                    <ion-icon name="text-outline"></ion-icon>
                    REPRESENTACIÓN TEXTUAL
                </h3>
                <div className="text-actions">
                    <button className="text-btn">
                        <ion-icon name="copy-outline"></ion-icon> Copiar
                    </button>
                    <button className="text-btn">
                        <ion-icon name="document-text-outline"></ion-icon> Exportar PDF
                    </button>
                </div>
            </div>
            
            <div className="text-content">
                <div className="math-section">
                    <h4>🧮 EXPRESIÓN ORIGINAL</h4>
                    <div className="math-display">
                        <p className="math-equation">
                            P(x, y, z, w) = w + x + y + z - 100000
                        </p>
                        <p className="math-description">
                            Polinomio en 4 variables con término constante negativo
                        </p>
                    </div>
                </div>
                
                {calculationResult?.baseGroebner && (
                    <div className="math-section">
                        <h4>🎯 BASE DE GRÖBNER ENCONTRADA</h4>
                        <div className="math-display">
                            <p className="math-theorem">Teorema (Buchberger):</p>
                            <div className="groebner-list">
                                {calculationResult.baseGroebner.map((poly, idx) => (
                                    <div key={idx} className="groebner-item">
                                        <span className="polynomial-index">g{idx + 1}:</span>
                                        <span className="polynomial-text">
                                            {formatPolynomial(poly)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="math-property">
                                Esta base es reducida y minimal respecto al orden lexicográfico
                            </p>
                        </div>
                    </div>
                )}
                
                <div className="math-section">
                    <h4>📝 PROPIEDADES ALGEBRAICAS</h4>
                    <div className="properties-grid">
                        <div className="property-card">
                            <div className="property-icon">🔢</div>
                            <div className="property-content">
                                <h5>Grado Total</h5>
                                <p className="property-value">2</p>
                                <p className="property-desc">Máximo grado de los monomios</p>
                            </div>
                        </div>
                        
                        <div className="property-card">
                            <div className="property-icon">⚖️</div>
                            <div className="property-content">
                                <h5>Orden Monomial</h5>
                                <p className="property-value">Lex</p>
                                <p className="property-desc">x - y - z - w</p>
                            </div>
                        </div>
                        
                        <div className="property-card">
                            <div className="property-icon">🎯</div>
                            <div className="property-content">
                                <h5>Dimensión</h5>
                                <p className="property-value">0</p>
                                <p className="property-desc">Número finito de soluciones</p>
                            </div>
                        </div>
                        
                        <div className="property-card">
                            <div className="property-icon">⏱️</div>
                            <div className="property-content">
                                <h5>Complejidad</h5>
                                <p className="property-value">O(n³)</p>
                                <p className="property-desc">n = número de polinomios</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="math-section">
                    <h4>💾 REPRESENTACIÓN JSON</h4>
                    <pre className="json-output">
{`{
  "baseGroebner": [
    {
      "type": "Polynomial",
      "terms": [
        {"coefficient": 1, "variables": [{"name": "x", "exponent": 2}]},
        {"coefficient": 1, "variables": [{"name": "y", "exponent": 2}]},
        {"coefficient": -1, "variables": []}
      ]
    },
    {
      "type": "Polynomial",
      "terms": [
        {"coefficient": 1, "variables": [{"name": "x", "exponent": 1}, {"name": "y", "exponent": 1}]},
        {"coefficient": -0.5, "variables": []}
      ]
    }
  ],
  "ordering": "lex",
  "field": "real",
  "computationTime": "0.45s"
}`}</pre>
                </div>
            </div>
        </div>
    );
};

export default TextTab;