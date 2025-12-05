import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home'

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
