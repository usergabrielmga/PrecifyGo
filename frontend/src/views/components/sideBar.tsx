import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "../../models/logoutModal";
import Profile from "../../imgs/profile.png";
import logo from "../../imgs/logo.png";

import { LayoutDashboard, FileText, Users } from "lucide-react";

export default function SideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

 
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
      
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white border border-gray-200 p-2 rounded-lg shadow"
      >
        ☰
      </button>

      
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        />
      )}

      
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

       
        {/* MENU */}
        <nav className="flex-1 px-2 space-y-2 overflow-y-auto pt-10">
          <NavLink
            to="/"
            onClick={() => setSidebarOpen(false)}
             className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#EA2E52] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
          >
            <LayoutDashboard className="w-6 h-6" />
            
            <p className="font-medium">Visão geral</p>
          </NavLink>

          <NavLink
            to="/viewOrcamento"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-[#EA2E52] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FileText className="w-6 h-6" />
            <p className="font-medium">Orçamentos</p>
          </NavLink>


          <NavLink
            to="/clientes"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-[#EA2E52] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Users className="w-6 h-6" />
            <p className="font-medium">Clientes</p>
          </NavLink>
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