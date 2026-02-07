import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/appRoutes'
import Header from './views/components/header'
import SideBar from './views/components/sideBar'

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Header />
        <SideBar />
        <AppRoutes />
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
