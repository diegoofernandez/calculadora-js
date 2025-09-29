export enum TiposToken {

	NUMERO = "numero", 
	VARIABLE = "variable", 
	OPERADOR = "operador", 
	PAREN_ABI = "paren_abi",
  	PAREN_CER = "paren_cer",
  	FRACCION_SEPARADOR = "fraccion_separador",
  	POTENCIA_OPERADOR = "potencia_operador",
  	RAIZ_OPERADOR = "raiz_operador",
  	IGUAL = "igual"

}

export interface Token{
	tipo: TiposToken, 
	valor: string,
	posicion: number
}