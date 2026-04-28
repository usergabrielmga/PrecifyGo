import { Link } from "react-router";
import logo from "../../imgs/logo.png";

export default function Header() {
  return (
    <header className="h-20 bg-white flex items-center justify-between px-4 sm:px-10 shadow-md ">
      

      <img className="w-24 sm:w-32 h-auto" src={logo} alt="Logo" />

 
      <div className="flex items-center gap-2 sm:gap-4">
        
        <Link
          to="/login"
          className="
            text-[#474646]
            px-3 sm:px-6 py-2
            text-sm sm:text-base
            rounded-lg
            hover:opacity-90 transition
          "
        >
          Login
        </Link>

        <Link
          to="/register"
          className="
            bg-[#EA2E52] text-white
            px-3 sm:px-6 py-2
            text-sm sm:text-base
            rounded-lg
            hover:opacity-90 transition
          "
        >
          Cadastrar
        </Link>

      </div>
    </header>
  );
}