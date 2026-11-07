import { Routes, Route, Navigate } from 'react-router-dom'
import Register from '../views/pages/Register'
import Dashboard from '../views/pages/dashboard'
import PrivateRoute from './PrivateRoute'
import Login from '../views/pages/login'
import Orcamento from '../views/pages/orcamento'
import ViewOrcamento from '../views/pages/viewOrcamento'
import Clientes from '../views/pages/clientes'
import OrcamentoPublico from '../views/pages/OrcamentoPublico'
import PrivateLayout from '../layouts/PrivateLayout'
import Produtos from '../views/pages/produtos'
import Servicos from '../views/pages/servicos'

export default function AppRoutes() {
  return (
    <Routes>
      
      <Route path="/login" element={<Login />} />
      
      

      <Route
        path="/orcamento-publico/:token"
        element={<OrcamentoPublico />}
      />

      <Route
  path="/"
  element={
    <PrivateRoute>
      <PrivateLayout>
        <Dashboard />
      </PrivateLayout>
    </PrivateRoute>
  }
/>

<Route
  path="/orcamento"
  element={
    <PrivateRoute>
      <PrivateLayout>
        <Orcamento />
      </PrivateLayout>
    </PrivateRoute>
  }
/>

<Route
  path="/viewOrcamento"
  element={
    <PrivateRoute>
      <PrivateLayout>
        <ViewOrcamento />
      </PrivateLayout>
    </PrivateRoute>
  }
/>

<Route
  path="/viewOrcamento/:status"
  element={
    <PrivateRoute>
      <PrivateLayout>
        <ViewOrcamento />
      </PrivateLayout>
    </PrivateRoute>
  }
/>

<Route
  path="/clientes"
  element={
    <PrivateRoute>
      <PrivateLayout>
        <Clientes />
      </PrivateLayout>
    </PrivateRoute>
  }
/>


<Route
  path="/produtos"
  element={
    <PrivateRoute>
      <PrivateLayout>
        <Produtos />
      </PrivateLayout>
    </PrivateRoute>
  }
/>



<Route
  path="/servicos"
  element={
    <PrivateRoute>
      <PrivateLayout>
        <Servicos />
      </PrivateLayout>
    </PrivateRoute>
  }
/>

      

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
