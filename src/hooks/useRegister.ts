import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser, registerUser } from "../services/authService";


export function useRegister() {
      const navigate = useNavigate()

    const [form, setForm] = useState({
        nome: '',
        email: '',
        senha: ''
    });

    const handleRegister = async () => {
        try {
            await registerUser(form);
            setForm({ nome: '', email: '', senha: '' });
            console.log('Usuário registrado com sucesso');
            
            const loginRes = await LoginUser({
                email: form.email,
                senha: form.senha
            })

            localStorage.setItem('token', loginRes.token)
            navigate('/dashboard')

        } catch (error) {
            console.error('Erro ao registrar:', error);
        }
    };

    return {
        form,
        setForm,
        handleRegister
    }

}