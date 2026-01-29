import Logo from '../../imgs/logo.png'
import Google from '../../assets/google.png'
import Gmail from '../../assets/Gmail Logo.png'
import { useState } from 'react'
import { LoginUser } from '../../services/authService';
import { useGoogleLogin } from '@react-oauth/google';
import { loginGoogle } from '../../services/authService';


export default function Register() {

    const [form, setForm] = useState({
        email: '',
        senha: ''
    });

    const handleRegister = async () => {
        try {
            await LoginUser(form);
            setForm({email: '', senha: '' });

            console.log('Usuário logado com sucesso');

        } catch (error) {
            console.error('Erro ao registrar:', error);
        }
    };

    
    const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
        const res = await loginGoogle(tokenResponse.access_token);
        console.log(res);
        console.log('TOKEN GOOGLE:', tokenResponse);
    },
    onError: () => {
        console.error('Erro ao logar com Google');
    }
    });
        



    return (
        <div className="flex flex-col items-center w-90 py-8 bg-[#EA2E52] rounded-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className='w-30 h-30 rounded-full bg-[#ffff] '>
                <img src={Logo} alt="" />
            </div>
            <form action="" className='flex flex-col items-center mb-5'>
                <input type="email" placeholder="Email" className="mt-4 p-2 rounded-lg w-80 bg-[#ffff] border-0 outline-none" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                <input type="password" placeholder="Senha" className="mt-4 p-2 rounded-lg w-80 bg-[#ffff] border-0 outline-none" value={form.senha} onChange={(e) => setForm({...form, senha: e.target.value})} />
            </form>
             <div className='flex gap-2 mb-2'>
                <img src={Google} alt="" className='w-10 h-10 cursor-pointer' onClick={() => googleLogin()} />
                <img src={Gmail} alt="" className='w-10 h-10 cursor-pointer' />
            </div>
            <p className='text-white mb-5 text-sm cursor-pointer'>Não tem sua conta! crie sua conta agora</p>
            <button className="mt-2 p-2 rounded-lg w-80 bg-[#474646] text-[#ffffff] font-bold hover:bg-[#f0f0f0] cursor-pointer" onClick={() => handleRegister()}>Registrar</button>
        </div>
    )
}