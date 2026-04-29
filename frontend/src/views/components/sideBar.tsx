import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Exterior from "../../assets/exterior.png";
import Group from "../../assets/group.png";
import Sign from "../../assets/sign document.png";
import { Link } from "react-router-dom";
import LogoutButton from "../../models/logoutModal";
import Profile from "../../imgs/profile.png";
import logo from "../../imgs/logo.png";

export default function SideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* BOTÃO HAMBÚRGUER */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white border border-gray-200 p-2 rounded-lg shadow"
      >
        ☰
      </button>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
     <aside
  className={`
    fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50
    transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden

    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}

    md:translate-x-0
  `}
>
        {/* HEADER */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200">
          <img className="w-28" src={logo} alt="Logo" />

          {/* fechar mobile */}
          <button
            className="md:hidden text-lg"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* BOTÃO PRINCIPAL */}
        <div className="p-4">
          <Link to="/orcamento" onClick={() => setSidebarOpen(false)}>
            <button className="w-full flex items-center justify-center gap-2 bg-[#EA2E52] text-white py-3 rounded-xl shadow hover:opacity-90 transition">
              Novo orçamento <FaPlus />
            </button>
          </Link>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-2 space-y-2 overflow-y-auto">
          <Link
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            <img className="w-6 h-6" src={Exterior} />
            <p className="font-medium">Visão geral</p>
          </Link>

          <Link
            to="/viewOrcamento"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            <img className="w-6 h-6" src={Sign} />
            <p className="font-medium">Orçamentos</p>
          </Link>


          <Link
            to="/clientes"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition "
          >
            <img className="w-6 h-6" src={Group} />
            <p className="font-medium">Clientes</p>
          </Link>
        </nav>

        {/* PROFILE */}
        <div className="p-4 border-t border-gray-200 relative" ref={menuRef}>
          <div
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-xl transition"
          >
            <img
              className="w-10 h-10 rounded-full"
              src={Profile}
              alt="Profile"
            />
            <div>
              <p className="text-sm font-medium">Seu Perfil</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>

          {profileOpen && (
            <div className="absolute bottom-16 left-0 w-full bg-white border rounded-xl shadow-lg py-2">
              <div onClick={() => setProfileOpen(false)}>
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}