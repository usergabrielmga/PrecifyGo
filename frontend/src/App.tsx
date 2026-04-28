import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/appRoutes'
import { NotificationProvider } from './context/notificationProvider'


function App() {
  return (
    <NotificationProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AppRoutes />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </NotificationProvider>
    
  )
}

export default App
