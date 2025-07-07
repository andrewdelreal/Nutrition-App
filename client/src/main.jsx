import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// create app
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App/>
    </StrictMode>,
)
