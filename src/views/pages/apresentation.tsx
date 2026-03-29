import HeaderPublic from "../components/headerPublic";
import Dash from "../../imgs/dash.png";
import Form from "../../imgs/form.png";
import Done from "../../imgs/done.png";
import orcPublic from "../../imgs/orcPublic.png";
import Rodape from "../components/rodape";
import { Link } from "react-router";

export default function Apresentation() {
    return (
        <div className="overflow-x-hidden">
            <HeaderPublic />

            {/* HERO */}
            <div className="bg-[#EA2E52] w-full min-h-[700px] flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-15 overflow-hidden py-10 lg:py-0 gap-10">
                
                <div className="flex flex-col items-start justify-center max-w-xl w-full">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                        Gerencie, acompanhe e tome decisões melhores com seus orçamentos
                    </h2>

                    <p className="text-white mt-4">
                        Centralize seus orçamentos e tenha controle total do seu negócio
                    </p>

                    <p className="text-white mt-2">
                        Simplifique a gestão dos seus orçamentos com praticidade e clareza, Tudo que você precisa para criar e controlar seus orçamentos Orçamentos organizados, decisões mais rápidas
                    </p>

                    <Link
                        to="/register"
                        className="bg-white text-[#474646] py-3 px-10 sm:px-16 rounded-xl hover:bg-gray-200 transition duration-300 mt-4"
                    >
                        Comece agora
                    </Link>
                </div>

                <div className="flex items-end justify-center lg:justify-end w-full mt-auto">
                    <img
                        src={Dash}
                        alt="Dashboard"
                        className="max-h-[800px] lg:max-h-[90%] w-full max-w-[800px] object-contain"
                    />
                </div>
            </div>

            {/* FORM SECTION */}
            <div className="flex flex-col lg:flex-row justify-center items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 gap-10">
                <div className="w-full">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#474646] mt-10 mb-4 max-w-2xl">
                        Preencha as informações necessárias para gerar seu orçamento de forma rápida e organizada.
                    </h2>

                    <p className="max-w-2xl text-gray-500 mb-10">
                        Crie seus orçamentos preenchendo os dados do emissor, cliente e adicionando os itens com suas respectivas quantidades e valores. O sistema realiza os cálculos automaticamente, garantindo praticidade e precisão.
                    </p>

                    <p className="flex items-start gap-2 mb-4">
                        <img src={Done} alt="Concluído" className="w-5 h-5 mt-1" />
                        Dados do emissor: informe quem está emitindo o orçamento (nome, e-mail e telefone).
                    </p>

                    <p className="flex items-start gap-2 mb-4">
                        <img src={Done} alt="Concluído" className="w-5 h-5 mt-1" />
                        Dados do cliente: adicione as informações do cliente que irá receber o orçamento.
                    </p>

                    <p className="flex items-start gap-2 mb-4">
                        <img src={Done} alt="Concluído" className="w-5 h-5 mt-1" />
                        Itens do orçamento: inclua os produtos ou serviços, definindo quantidade e valor unitário.
                    </p>

                    <p className="flex items-start gap-2 mb-4">
                        <img src={Done} alt="Concluído" className="w-5 h-5 mt-1" />
                        Cálculo automático: o sistema calcula os totais automaticamente para você.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 w-full">
                    <img
                        src={Form}
                        alt="Formulário"
                        className="w-full h-auto object-cover rounded-2xl"
                    />
                </div>
            </div>

            {/* PUBLIC BUDGET SECTION */}
            <div className="flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 gap-10">
                <div className="w-full flex justify-center">
                    <img
                        src={orcPublic}
                        alt="Orçamento público"
                        className="w-full max-w-[600px] h-auto object-contain rounded-2xl"
                    />
                </div>

                <div className="w-full">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-8 h-8 bg-[#EA2E52] rounded-full flex items-center justify-center shrink-0">
                            <span className="text-white font-bold">1</span>
                        </div>
                        <p>Cada orçamento pode ser compartilhado diretamente com o cliente.</p>
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-8 h-8 bg-[#EA2E52] rounded-full flex items-center justify-center shrink-0">
                            <span className="text-white font-bold">2</span>
                        </div>
                        <p>O envio pode ser feito por link, facilitando o acesso sem necessidade de login.</p>
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-8 h-8 bg-[#EA2E52] rounded-full flex items-center justify-center shrink-0">
                            <span className="text-white font-bold">3</span>
                        </div>
                        <p>O cliente visualiza todos os detalhes: produtos/serviços, valores e condições.</p>
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-8 h-8 bg-[#EA2E52] rounded-full flex items-center justify-center shrink-0">
                            <span className="text-white font-bold">4</span>
                        </div>
                        <p>É possível aceitar o orçamento, confirmando o interesse no serviço/produto.</p>
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-8 h-8 bg-[#EA2E52] rounded-full flex items-center justify-center shrink-0">
                            <span className="text-white font-bold">5</span>
                        </div>
                        <p>Também é possível recusar, permitindo feedback ou apenas encerrando a proposta.</p>
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-8 h-8 bg-[#EA2E52] rounded-full flex items-center justify-center shrink-0">
                            <span className="text-white font-bold">6</span>
                        </div>
                        <p>A decisão do cliente é registrada automaticamente no sistema.</p>
                    </div>
                </div>
            </div>

            <Rodape />
        </div>
    );
}