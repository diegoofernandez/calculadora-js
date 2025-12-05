import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import Home from './components/Home'
import Nav from './components/Nav';
import Creador from './components/Creador';
import Empresas from './components/Empresas';
import Algoritmos from './components/Algoritmos';
import Contacto from './components/Contacto';
import Construccion from './components/CasosUso/Construccion'; 


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

        </Routes>
      
      </BrowserRouter>

      <footer>
          <p>© 2025 RomiMath. Creador por Diego Fernández</p>
      </footer>
      
    </>
  )
}

export default App
