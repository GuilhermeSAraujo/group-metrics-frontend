import { useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

const CORRECT_PASSWORD = '!123'
const STORAGE_KEY = 'app_password'

function PasswordGate({ children }) {
  const [authenticated, setAuthenticated] = useState(
    () => localStorage.getItem(STORAGE_KEY) === CORRECT_PASSWORD
  )
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  if (authenticated) return children

  function handleSubmit(e) {
    e.preventDefault()
    if (input === CORRECT_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, input)
      setAuthenticated(true)
    } else {
      setError(true)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#f5f5f5',
      fontFamily: 'sans-serif',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '2rem 2.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minWidth: '280px',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Enter password</h2>
        <input
          type="password"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false) }}
          placeholder="Password"
          autoFocus
          style={{
            padding: '0.6rem 0.8rem',
            borderRadius: '6px',
            border: error ? '1.5px solid #e53e3e' : '1.5px solid #cbd5e0',
            fontSize: '1rem',
            outline: 'none',
          }}
        />
        {error && (
          <span style={{ color: '#e53e3e', fontSize: '0.875rem' }}>Incorrect password.</span>
        )}
        <button
          type="submit"
          style={{
            padding: '0.6rem',
            borderRadius: '6px',
            background: '#3182ce',
            color: '#fff',
            border: 'none',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Unlock
        </button>
      </form>
    </div>
  )
}

export default function App() {
  return (
    <PasswordGate>
      <HashRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </HashRouter>
    </PasswordGate>
  )
}
