type Operador = "*" | "+" | "/" |"-"; 
type ObjetoMath = Frac | "expo" | "rai" | "eculin" | "ecurac" | "polin"; 
type Frac = [number, number]; 
type ObjElemental = {
    izquierda: number, 
    derecha: number,
    operador: string
}; 