import Logo from '../../imgs/logo.png'
import Google from '../../assets/google.png'
import Gmail from '../../assets/Gmail Logo.png'
import { useState } from 'react'
import { LoginUser, registerUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Register() {
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



    return (
        <div className="flex flex-col items-center w-90 py-8 bg-[#EA2E52] rounded-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className='w-30 h-30 rounded-full bg-[#ffff] '>
                <img src={Logo} alt="" />
            </div>
            <form action="" className='flex flex-col items-center mb-5'>
                <input type="text" placeholder="Nome" className="mt-10 p-2 rounded-lg w-80 bg-[#ffff] border-0 outline-none" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} />
                <input type="email" placeholder="Email" className="mt-4 p-2 rounded-lg w-80 bg-[#ffff] border-0 outline-none" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                <input type="password" placeholder="Senha" className="mt-4 p-2 rounded-lg w-80 bg-[#ffff] border-0 outline-none" value={form.senha} onChange={(e) => setForm({...form, senha: e.target.value})} />
            </form>
             <div className='flex gap-2 mb-2'>
                <img src={Google} alt="" className='w-10 h-10 cursor-pointer' />
                <img src={Gmail} alt="" className='w-10 h-10 cursor-pointer' />
            </div>
            <p className='text-white mb-5 text-sm cursor-pointer'>Não tem sua conta! crie sua conta agora</p>
            <button className="mt-2 p-2 rounded-lg w-80 bg-[#474646] text-[#ffffff] font-bold hover:bg-[#f0f0f0] cursor-pointer" onClick={() => handleRegister()}>Registrar</button>
        </div>
    )
}