import { FaPlus } from "react-icons/fa";
import Exterior from '../../assets/exterior.png';
import Group from '../../assets/group.png';
import Sign from '../../assets/Sign Document.png'


export default function SideBar() {
    return(
        <div>
            <div>
                <button className="flex items-center gap-2 bg-[#EA2E52] text-white px-4 py-3 rounded-md cursor-pointer m-4 mt-5">
                    Novo orçamento <FaPlus/>
                </button>
            
                <div className="flex items-center gap-2 m-4 mt-8">
                    <img className="w-6.5 h-6.5" src={Exterior} alt="Exterior" />
                    <p>Visão geral</p>
                </div>
                <div className="flex items-center gap-2 m-4 mt-8">
                    <img className="w-6.5 h-6.5" src={Sign} alt="Sign Document" />
                    <p>Orçamentos</p>
                </div>

                <div>
                    <ul className="flex flex-col gap-5 ml-12 mt-4">
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <a href="">Pendentes</a>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <a href="">Aprovados</a>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <a href="">Rejeitados</a>
                        </li>
                    </ul>
                </div>

                <div className="flex items-center gap-2 m-4 mt-8">
                    <img className="w-6.5 h-6.5" src={Group} alt="Group" />
                    <p>Clientes</p>
                </div>
            </div>
        </div>
    )
}