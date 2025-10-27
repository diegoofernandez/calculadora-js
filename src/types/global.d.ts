import { Fraccion } from "../engine/objects/Fraccion";

type Operador = "*" | "+" | "/" |"-" | ":"; 
type ObjetoMath = Frac | "expo" | "rai" | "eculin" | "ecurac" | "polin"; 
type Frac = [number, number]; 
type ObjElemental = {
    izquierda: number, 
    derecha: number,
    operador: string
}
/*type Termino = {
    coeficiente: number, 
    variables: Array<[string, number]>
}*/
