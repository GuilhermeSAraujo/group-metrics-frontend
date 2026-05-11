import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  )
}
