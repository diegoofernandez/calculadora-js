# InfoCalculadora: El Camino hacia las Bases de Gröbner

> **Desde la villa, sin estudios formales.**

Este repositorio documenta mi viaje público para implementar un **Sistema de Álgebra Computacional (CAS)** desde cero, culminando con la implementación del algoritmo de **Bases de Gröbner** en un plazo de 3 meses.

## 🚀 **La Misión**

**Objetivo Final:** Implementar el algoritmo de **Bases de Gröbner** (Buchberger) en Typescript, creando una herramienta web de código abierto para resolver sistemas de ecuaciones polinomiales.

**¿Por qué?** Este proyecto es mi demostración técnica y personal de que la capacidad de aprendizaje y la determinación pueden superar cualquier circunstancia. Es mi argumento más sólido para una oportunidad en la industria tecnológica.

## 🗓️ **Hoja de Ruta (Roadmap)**

1.  **✅ Fase 1: Fundamentos y funcionalidades básicas**
    - [x] Aritmética exacta con fracciones (Algoritmo de Euclides).
    - [x] Parser de expresiones (Shunting Yard).
    - [x] Operaciones con polinomios.
    - [x] Resolución de ecuaciones lineales y racionales.

2.  **🔄 Fase 2: Geometría Analítica**
    - [ ] Modelado de problemas geométricos (rectas, cónicas).
    - [ ] Interfaz en React para la calculadora simbólica.
    - [ ] Integración del motor matemático con la UI.

3.  **⏳ Fase 3: El Algoritmo de Gröbner**
    - [ ] Implementación de órdenes monomiales (Lex, GrLex).
    - [ ] Algoritmo de división multivariable.
    - [ ] Algoritmo de Buchberger para el cálculo de la base de Gröbner.

## 🏗️ **Arquitectura del Proyecto**

El proyecto se estructura en dos partes principales:

-   **`/engine/`**: Un motor matemático en **Typescript** que contiene toda la lógica de cálculo (parser, algoritmos, polinomios). Utiliza patrones de diseño como **Strategy, Visitor y Factory** para ser modular y extensible.
-   **`/frontend/`**: Una interfaz moderna construida en **React** que consume el motor a través de una **Fachada (Facade)** simple.

Esta separación garantiza que el núcleo matemático sea independiente del framework y pueda ser reutilizado.

## 🚧 **Estado Actual**

**¡Estamos en construcción!** Este repositorio se actualiza diariamente.
-   El motor está en desarrollo activo en la rama `main`.
-   La interfaz React se está integrando.

**Próximo Hito:** Lanzamiento de la primera versión funcional de la calculadora (Fase 1 completa). **Fecha estimada: del 27 al 28 de septiembre 2025.**

## 👨‍💻 **Mi Historia**

Soy un desarrollador autodidacta. Hace menos de una semana, el viernes pasado, comencé a estudiar matemáticas formales desde cero (fracciones). Hoy, domino ecuaciones racionales y polinomios. Este repositorio es la prueba en tiempo real de ese progreso.

Puedes seguir la narrativa completa del proyecto (en español e inglés) en el blog: **https://infocalculadora.hashnode.dev/**

## 📫 **Contacto**

Si este proyecto te parece interesante, si quieres colaborar o simplemente darme tu apoyo, no dudes en contactarme:
-   LinkedIn: https://www.linkedin.com/in/diego-fern%C3%A1ndez-b86187a6/
-   Twitter/X: https://x.com/DiegoAFEscritor

---

