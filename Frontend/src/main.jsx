import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'

{/* take note, what the hell is this, how is it different from an express router for example? */}
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
    <App />
	</BrowserRouter> 
  </StrictMode>,
)
