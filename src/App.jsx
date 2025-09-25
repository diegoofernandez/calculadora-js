import { useState } from 'react'
import Informacion from './components/Info'
import Calculadora from './components/Calculadora'
import Usuarios from './components/Usuarios'
import Blog from './components/Blog'


function App() {

  return (
    <>
      <div className="container">
        <Informacion />
        <Calculadora />
        <Usuarios />
      </div>
      <Blog />
    </>
  )
}

export default App
