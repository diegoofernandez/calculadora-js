export default class ASTConstrucG{

    static construirAST(dataInput: any[]): ASTNode {
        const polinomiosAST: ASTNode[] = [];

        for(let i = 1; i < dataInput.length; i++) {
            const polinomio = dataInput[i];
            const monomiosAST: ASTNode[] = [];

            for(let j = 0; j < polinomio.length; j++) {
                const monomio = polinomio[j];
                const hijos: ASTNode[] = [];

                if(monomio.coeficiente !== undefined) {
                    if(Array.isArray(monomio.coeficiente)) {
                        for (const coef of monomio.coeficiente) {
                            hijos.push({ type: 'Variable', operable: true, representacion: coef });
                        }
                    } else {
                        hijos.push({ type: 'Numero', operable: true, representacion: monomio.coeficiente });
                    }
                }

                if (monomio.partes) {
                    for (const parte of monomio.partes) {
                        if (parte.objeto === "Potencia") {
                            hijos.push({
                                type: 'Potencia',
                                operable: false,
                                hijos: [
                                    { type: 'Variable', operable: true, representacion: parte.base },
                                    { type: 'Numero', operable: true, representacion: parte.exponente }
                                ]
                            });
                        }
                    }
                }

                if (hijos.length > 0) {
                    monomiosAST.push({ type: 'Monomio', operable: false, hijos: hijos });
                }
            }

            polinomiosAST.push({ type: 'Polinomio', operable: false, hijos: monomiosAST });
        }

        return { type: 'Grobner', operable: false, hijos: polinomiosAST };
    }

}