import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'

// ✅ Import PWA registration helper
import { registerSW } from 'virtual:pwa-register'

ReactDOM.createRoot(document.getElementById('root')!).render(
  //<React.StrictMode>
    <App />
  //</React.StrictMode>,
)

// 🔁 Automatically register and update the service worker
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New content available — reloading...')
    // Trigger the update by calling the returned function
    updateSW()
  },
  onOfflineReady() {
    console.log('App ready to work offline.')
  },
})