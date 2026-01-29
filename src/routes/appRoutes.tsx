import { Routes, Route, Navigate } from 'react-router-dom'
import Register from '../views/pages/Register'
import Dashboard from '../views/pages/dashboard'
import PrivateRoute from './PrivateRoute'
import Login from '../views/pages/login'

export default function AppRoutes() {
  return (
    <Routes>
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

 
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />


      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
