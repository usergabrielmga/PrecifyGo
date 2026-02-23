

export default function Rodape() {
    return (
        <footer className="bg-[#EA2E52] text-white p-4 text-center w-full mt-20">
            <div>
                <p>Crie seu orçamento</p>
            </div>
            <div className="mt-2">

                <a href="/privacidade" className="text-sm  hover:underline mx-2">
                    Política de Privacidade e Cookies
                </a>
            </div>
            <div>
                <p className="text-sm ">
                    &copy; {new Date().getFullYear()} PrecifyGo. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
}