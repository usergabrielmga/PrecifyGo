import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import Exterior from '../../assets/exterior.png'
import Group from '../../assets/group.png'
import Sign from '../../assets/Sign Document.png'
import { Link } from "react-router-dom"

export default function SideBar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* BOTÃO HAMBÚRGUER (mobile) */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden absolute top-25 left-4 z-50 bg-white border border-gray-200 p-2 rounded-md"
      >
        ☰
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 p-4 z-50
          transform transition-transform duration-300 ease-in-out

          ${open ? "translate-x-0" : "-translate-x-full"}

          md:translate-x-0 md:static
        `}
      >
        {/* BOTÃO FECHAR (mobile) */}
        <div className="md:hidden flex justify-end mb-2">
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        <Link to="/orcamento" onClick={() => setOpen(false)}>
          <button className="flex items-center gap-2 bg-[#EA2E52] text-white px-4 py-3 rounded-md cursor-pointer m-4 mt-5">
            Novo orçamento <FaPlus />
          </button>
        </Link>

        <Link to="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 m-4 mt-8">
          <img className="w-6.5 h-6.5" src={Exterior} alt="Exterior" />
          <p>Visão geral</p>
        </Link>

        <Link to="/viewOrcamento" onClick={() => setOpen(false)} className="flex items-center gap-2 m-4 mt-8">
          <img className="w-6.5 h-6.5" src={Sign} alt="Sign Document" />
          <p>Orçamentos</p>
        </Link>

        <div className="text-sm">
          <ul className="flex flex-col gap-5 ml-12 mt-4">
            <Link to="/viewOrcamento/Pendente" onClick={() => setOpen(false)} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Pendentes
            </Link>

            <Link to="/viewOrcamento/Aprovado" onClick={() => setOpen(false)} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Aprovados
            </Link>

            <Link to="/viewOrcamento/Rejeitado" onClick={() => setOpen(false)} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Rejeitados
            </Link>

            <Link to="/viewOrcamento/Cancelado" onClick={() => setOpen(false)} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#A9A9A9] rounded-full"></div>
              Cancelados
            </Link>
          </ul>
        </div>

        <Link to="/clientes" onClick={() => setOpen(false)} className="flex items-center gap-2 m-4 mt-8">
          <img className="w-6.5 h-6.5" src={Group} alt="Group" />
          <p>Clientes</p>
        </Link>
      </div>
    </>
  )
}