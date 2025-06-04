import React from 'react'
import ReactDOM from 'react-dom/client'
import { HeroUIProvider, ToastProvider } from "@heroui/react"
import { BrowserRouter as Router } from "react-router-dom"
import App from './App.tsx'
import { AuthProvider } from './contexts/auth-context'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider/>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </HeroUIProvider>
  </React.StrictMode>,
)