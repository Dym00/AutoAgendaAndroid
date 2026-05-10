import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { A11yProvider } from './context/A11yContext.jsx'

// Import i18n
import './i18n/config'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <A11yProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </A11yProvider>
    </BrowserRouter>
  </StrictMode>,
)
