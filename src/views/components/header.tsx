import { useState, useRef, useEffect } from "react";
import logo from "../../imgs/logo.png";
import Profile from "../../imgs/profile.png";
import LogoutButton from "../../models/logoutModal";

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen(prev => !prev);

  // fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white flex items-center shadow-md mb-10 relative">
      <img className="w-32 h-32" src={logo} alt="Logo" />

      {/* PROFILE */}
      <div className="absolute right-10" ref={menuRef}>
        <img
          onClick={toggleMenu}
          className="w-12 h-12 cursor-pointer rounded-full"
          src={Profile}
          alt="Profile"
        />

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg py-2">
            {/* seu componente */}
            <div onClick={() => setOpen(false)}>
              <LogoutButton />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}