import Logo from '../../imgs/logo.png'
import Google from '../../assets/google.png'
import Gmail from '../../assets/gmail-logo.png'
import { useRegister } from '../../hooks/useRegister'
import { Link } from 'react-router-dom'

export default function Register() {

  const { form, setForm, handleRegister } = useRegister()

  return (
    <div className="flex flex-col items-center w-90 py-8 bg-[#EA2E52] rounded-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">

      {/* LOGO */}
      <div className='w-30 h-30 rounded-full bg-[#ffff]'>
        <img src={Logo} alt="Logo" />
      </div>

      {/* FORM */}
      <form
        className='flex flex-col items-center mb-5'
        onSubmit={(e) => {
          e.preventDefault()
          handleRegister()
        }}
      >

        <input
          type="text"
          placeholder="Nome"
          className="mt-10 p-2 rounded-lg w-80 bg-[#ffff] border-0 outline-none"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="mt-4 p-2 rounded-lg w-80 bg-[#ffff] border-0 outline-none"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Senha"
          className="mt-4 p-2 rounded-lg w-80 bg-[#ffff] border-0 outline-none"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* BOTÃO */}
        <button
          type="submit"
          className="mt-4 p-2 rounded-lg w-80 bg-[#474646] text-white font-bold hover:bg-[#f0f0f0]"
        >
          Registrar
        </button>

      </form>

      {/* SOCIAL LOGIN */}
      <div className='flex gap-2 mb-2'>
        <img src={Google} alt="Google" className='w-10 h-10 cursor-pointer' />
        <img src={Gmail} alt="Gmail" className='w-10 h-10 cursor-pointer' />
      </div>

      {/* LINK LOGIN */}
      <Link
        to="/login"
        className='text-white mb-5 text-sm cursor-pointer'
      >
        Já tem sua conta? Faça login agora
      </Link>

    </div>
  )
}