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
        <Nav />
        <Routes>

          <Route path='/' element={<Home/>} />
          <Route path='https://blog.romimath.site' />
          <Route path='/creador' element={<Creador />} />
          <Route path='/empresas' element={<Empresas />} />
          <Route path='/algoritmos' element={<Algoritmos />} />
          <Route path='/contacto' element={<Contacto />} />
          <Route path='/construccion' element={<Construccion />} />

        </Routes>
      
      </BrowserRouter>

      <footer>
        <div>
          <p>© 2025 RomiMath. Creador por Diego Fernández</p>
          <div>
            <a href="/creador">Creador</a>
            <a href="/empresas">Empresas</a>
            <a href="/contacto">Contacto</a>
          </div>
        </div>
      </footer>
      
    </>
  )
}

export default App
