import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import DataProvider from '../utils/dataContext.tsx'
import AuthProvide from '../utils/userscontextthook.tsx'



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <DataProvider>
        <AuthProvide>
          <App />
        </AuthProvide>
      </DataProvider>
      
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
