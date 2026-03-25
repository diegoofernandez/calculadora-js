import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home'
import CalculadorUniversal from './components/CalculadorUniversal'

function App() {

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  }, []);


  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Home/>} />
          <Route path='/auditoria' element={<CalculadorUniversal/>} />        

        </Routes>
      
      </BrowserRouter>

      <footer>
          <p>© 2026 RomiMath. Creado por Diego Fernández. V1.0</p>
      </footer>
      
    </>
  )
}

export default App
