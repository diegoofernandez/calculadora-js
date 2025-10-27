import { Link } from "react-router-dom";
import Logo from './../assets/img/LOGO.png';

function Nav(){

    return(
        <>
        
            <header class="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#232348] bg-background-dark/80 px-4 sm:px-10 py-3 backdrop-blur-sm">
                <div class="flex items-center gap-4 text-white">
                    <div class="size-6 text-primary">
                        <img src={Logo} alt="" />
                    </div>
                    <h1 class="text-white text-xl font-bold leading-tight tracking-[-0.015em]">RomiMath</h1>
                </div>
                <nav class="hidden md:flex flex-1 justify-end gap-6 items-center">
                    <Link to="/" className="text-white/80 text-sm font-medium leading-normal hover:text-primary transition-colors">Home</Link>
                    <Link to="/casos-uso" className="text-white/80 text-sm font-medium leading-normal hover:text-primary transition-colors">Casos de uso</Link>
                    <Link to="/empresas" className="text-white/80 text-sm font-medium leading-normal hover:text-primary transition-colors">Empresas</Link>
                    <Link to="/algoritmos" className="text-white/80 text-sm font-medium leading-normal hover:text-primary transition-colors">Algoritmos</Link>
                    <Link to="/blog" className="text-white/80 text-sm font-medium leading-normal hover:text-primary transition-colors">Blog</Link>
                    <Link to="/contacto" className="text-white/80 text-sm font-medium leading-normal hover:text-primary transition-colors">Contacto</Link>
                    <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-violet-500 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                        <span class="truncate">Acceder</span>
                    </button>
                </nav>
                <button class="md:hidden text-white">
                <span class="material-symbols-outlined">menu</span>
                </button>
            </header>

        </>
    )

}

export default Nav;