import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

export default function LogoutButton() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <button
      onClick={logout}
      className="
        w-full flex items-center gap-3
        px-4 py-2
        text-sm font-medium
        text-red-500
        hover:bg-red-50 hover:text-red-600
        transition-colors duration-200
        rounded-lg
        cursor-pointer
      "
    >
      <FiLogOut size={16} />
      Sair da conta
    </button>
  );
}