import { GoogleOAuthProvider } from '@react-oauth/google'
import Login from './views/pages/login'
import Register from './views/pages/Register'

function App() {


  return (
    
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Login />
  </GoogleOAuthProvider>
    )
}

export default App
