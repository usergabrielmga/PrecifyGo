import { FaPlus } from "react-icons/fa";
import Exterior from '../../assets/exterior.png';
import Group from '../../assets/group.png';
import Sign from '../../assets/Sign Document.png'
import { Link, useParams } from "react-router-dom";

export default function SideBar() {


    return(
        <div>
            <div className="relative w-64 h-screen bg-white border-r border-gray-200 p-4">
                <Link to="/orcamento">
                    <button className="flex items-center gap-2 bg-[#EA2E52] text-white px-4 py-3 rounded-md cursor-pointer m-4 mt-5">
                        Novo orçamento <FaPlus/>
                    </button>
                </Link>
            
                <Link to="/dashboard" className="flex items-center gap-2 m-4 mt-8">
                    <img className="w-6.5 h-6.5" src={Exterior} alt="Exterior" />
                    <p>Visão geral</p>
                </Link>
                <Link to="/viewOrcamento" className="flex items-center gap-2 m-4 mt-8">
                    <img className="w-6.5 h-6.5" src={Sign} alt="Sign Document" />
                    <p>Orçamentos</p>
                </Link>

                <div className="text-sm">
                    <ul className="flex flex-col gap-5 ml-12 mt-4">
                    <Link to="/viewOrcamento/Pendente" className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Pendentes
                    </Link>

                    <Link to="/viewOrcamento/Aprovado" className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Aprovados
                    </Link>

                    <Link to="/viewOrcamento/Rejeitado" className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Rejeitados
                    </Link>
                    </ul>
                </div>

                <Link to="/clientes" className="flex items-center gap-2 m-4 mt-8">
                    <img className="w-6.5 h-6.5" src={Group} alt="Group" />
                    <p>Clientes</p>
                </Link>
            </div>
        </div>
    )
}