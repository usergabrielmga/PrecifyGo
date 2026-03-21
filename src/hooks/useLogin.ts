import { useNavigate } from "react-router-dom";
import { loginGoogle, LoginUser } from "../services/authService";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";


export function useLogin() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        email: '',
        senha: ''
    });

    const handleRegister = async () => {

        try {
            const res = await LoginUser(form);
            setForm({email: '', senha: '' });
            localStorage.setItem('token', res.token);

            
            console.log('Usuário logado com sucesso');
            navigate('/dashboard');

        } catch (error) {
            console.error('Erro ao registrar:', error);
        }
    };

    
    const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
        const res = await loginGoogle(tokenResponse.access_token);

        console.log(res);
        console.log('TOKEN GOOGLE:', tokenResponse);

        localStorage.setItem('token', res.token) 
        navigate('/dashboard');
    
    },
    onError: () => {
        console.error('Erro ao logar com Google');
    }
    });

    return { form, setForm, handleRegister, googleLogin }
}