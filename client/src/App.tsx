import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [serverMessage, setServerMessage] = useState<string>('')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setServerMessage(data.message))
      .catch(() => setServerMessage('Server not connected'))
  }, [])

  return (
    <div className="app">
      <h1>🎮 Syntax Survivor</h1>
      <p className="subtitle">A web game built with React + Vite + Express</p>
      <div className="card">
        <p>Server Status: <span className="status">{serverMessage || 'Loading...'}</span></p>
      </div>
    </div>
  )
}

export default App

