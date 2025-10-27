import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/utils/normalice.css'
import './style.css'
import 'katex/dist/katex.min.css';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
