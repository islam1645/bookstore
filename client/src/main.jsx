import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // (Si tu as une ligne css, garde-la)

// 1. IMPORT DE REDUX (Tu l'as déjà)
import { Provider } from 'react-redux'
import { store } from './redux/store' // Vérifie que le chemin est bon

// 2. IMPORT DE HELMET (Nouveau !)
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* 3. ON AJOUTE LE PROVIDER SEO ICI */}
      <HelmetProvider>
        <App />
      </HelmetProvider>
      {/* ------------------------------- */}
    </Provider>
  </React.StrictMode>,
)