export class ObjetosUtiles {

  static isPrime(num: number): boolean {

    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    for (let i = 5; i * i <= num; i += 6) {

      if (num % i === 0 || num % (i + 2) === 0) return false;

    }
    
    return true;

  }

  static factorize(num: number): number[] {

    const factors: number[] = [];
    let n = Math.abs(num);
    
    
    while (n % 2 === 0) {

      factors.push(2);
      n /= 2;

    }
    
    
    for (let i = 3; i * i <= n; i += 2) {

      while (n % i === 0) {

        factors.push(i);
        n /= i;

      }

    }
    
    
    if (n > 1) {

      factors.push(n);

    }
    
    return factors;

  }

  static solveQuadratic(a: number, b: number, c: number): [number, number] | [number] | [] {

    const discriminant = b * b - 4 * a * c;
    
    if (discriminant < 0) {

      return []; 

    } else if (discriminant === 0) {

      return [-b / (2 * a)]; 

    } else {

      return [
        (-b + Math.sqrt(discriminant)) / (2 * a),
        (-b - Math.sqrt(discriminant)) / (2 * a)
      ]; 

    }
  }
}