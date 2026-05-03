import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser, registerUser } from "../services/authService";


export function useRegister() {
      const navigate = useNavigate()

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleRegister = async () => {
        try {
            await registerUser(form);
            setForm({ name: '', email: '', password: '' });
            console.log('Usuário registrado com sucesso');
            
            const loginRes = await LoginUser({
                email: form.email,
                password: form.password
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