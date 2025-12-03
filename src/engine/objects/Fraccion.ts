import { Euclides } from "../utils/Euclides";

export interface ProcesamientoFraccion{

    operacion(fraccion1: Fraccion, fraccion2: Fraccion): string | number | bigint;

}


export default class Fraccion {
    private numerador: bigint;
    private denominador: bigint;

    constructor(numerador: number | bigint | string, denominador: number | bigint | string = 1n) {
        // ✅ CONVERTIR TODO A BIGINT INMEDIATAMENTE
        this.numerador = typeof numerador === 'bigint' ? numerador : BigInt(numerador);
        this.denominador = typeof denominador === 'bigint' ? denominador : BigInt(denominador);
        
        if (this.denominador === 0n) {
            throw new Error("❌ Denominador cero detectado");
        }
        
        // ✅ SIMPLIFICAR USANDO SOLO ARITMÉTICA BIGINT
        this.simplificar();
    }

    private simplificar(): void {
        // Normalizar signo: denominador siempre positivo
        if (this.denominador < 0n) {
            this.numerador = -this.numerador;
            this.denominador = -this.denominador;
        }
        
        // Calcular MCD usando algoritmo de Euclides con BigInt
        const mcd = this.mcd(
            this.numerador < 0n ? -this.numerador : this.numerador,
            this.denominador
        );
        
        // Simplificar por el MCD
        if (mcd > 1n) {
            this.numerador /= mcd;
            this.denominador /= mcd;
        }
    }

    private mcd(a: bigint, b: bigint): bigint {
        // ✅ ALGORITMO DE EUCLIDES CON BIGINT PURO
        while (b !== 0n) {
            [a, b] = [b, a % b];
        }
        return a;
    }

    sumar(otra: Fraccion): Fraccion {
        // ✅ a/b + c/d = (ad + bc) / bd (todo BigInt)
        return new Fraccion(
            this.numerador * otra.denominador + otra.numerador * this.denominador,
            this.denominador * otra.denominador
        );
    }

    multiplicar(otra: Fraccion): Fraccion {
        // ✅ a/b * c/d = ac / bd (todo BigInt)
        return new Fraccion(
            this.numerador * otra.numerador,
            this.denominador * otra.denominador
        );
    }

    dividir(otra: Fraccion): Fraccion {
        // ✅ a/b ÷ c/d = ad / bc (todo BigInt)
        return new Fraccion(
            this.numerador * otra.denominador,
            this.denominador * otra.numerador
        );
    }

    negar(): Fraccion {
        // ✅ Simple negación de numerador
        return new Fraccion(-this.numerador, this.denominador);
    }

    esCero(): boolean { 
        return this.numerador === 0n; 
    }
    
    esUno(): boolean { 
        return this.numerador === 1n && this.denominador === 1n; 
    }
    
    esPositivo(): boolean {
        if (this.numerador === 0n) return false;
        // Ambos positivos o ambos negativos → positivo
        return (this.numerador > 0n) === (this.denominador > 0n);
    }
    
    equals(otra: Fraccion): boolean {
        // ✅ Comparación exacta: a/b = c/d ⟺ ad = bc
        return this.numerador * otra.denominador === otra.numerador * this.denominador;
    }

    toString(): string {
        if (this.denominador === 1n) {
            return this.numerador.toString();
        }
        return `${this.numerador}/${this.denominador}`;
    }

    // Método para obtener el valor decimal (necesario para la raíz cuadrada final) para vectorizado
    toFloat(): number {
      // Convertimos a number al final, asumiendo que los BigInt no desbordan
      return Number(this.numerador) / Number(this.denominador);
    }

    getNumerador(): bigint { return this.numerador; }
    getDenominador(): bigint { return this.denominador; }
}

