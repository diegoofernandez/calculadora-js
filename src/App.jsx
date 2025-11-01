import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import Home from './components/Home'
import Nav from './components/Nav';
import Blog from './components/Blog'; 
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
          <Route path='/blog' element={<Blog />} />
          <Route path='/creador' element={<Creador />} />
          <Route path='/empresas' element={<Empresas />} />
          <Route path='/algoritmos' element={<Algoritmos />} />
          <Route path='/contacto' element={<Contacto />} />
          <Route path='/construccion' element={<Construccion />} />

        </Routes>
      
      </BrowserRouter>

      <footer class="border-t border-solid border-t-[#232348] px-4 sm:px-10 py-8 mt-10">
        <div class="flex flex-col md:flex-row justify-between items-center text-white gap-4">
          <p class="text-sm text-white/60 text-center md:text-left">© 2025 RomiMath. Todos los derechos reservados.</p>
          <div class="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            <a class="text-sm text-white/80 hover:text-primary transition-colors" href="#">Términos de Servicio</a>
            <a class="text-sm text-white/80 hover:text-primary transition-colors" href="#">Política de Privacidad</a>
            <a class="text-sm text-white/80 hover:text-primary transition-colors" href="#contact">Contacto</a>
          </div>
        </div>
      </footer>
      
    </>
  )
}

export default App
