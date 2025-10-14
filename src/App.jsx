import { useState, useEffect } from 'react'
import TemporalUI from './components/TemporalUI'


function App() {

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  }, []);


  return (
    <>
      <div>
        <TemporalUI />
      </div>
      
    </>
  )
}

export default App
