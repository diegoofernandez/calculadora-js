import { Link } from "react-router-dom";
import Logo from './../assets/img/LOGO.png';
import { useState } from "react";

function Nav(){

    const [menuEstado, setMenuEstado] = useState(false); 

    function menuClick(){

        if(menuEstado){
            setMenuEstado(false);
        }else{
            setMenuEstado(true);
        }

    }

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
                    <Link to="/creador" className="text-white/80 text-sm font-medium leading-normal hover:text-primary transition-colors">Creador</Link>
                    <Link to="/construccion" className="text-white/80 text-sm font-medium leading-normal hover:text-primary transition-colors">Casos de uso</Link>
                    <Link to="/empresas" className="text-white/80 text-sm font-medium leading-normal hover:text-primary transition-colors">Empresas</Link>
                    <Link to="/algoritmos" className="text-white/80 text-sm font-medium leading-normal hover:text-primary transition-colors">Algoritmos</Link>
                    <Link to="/blog" className="text-white/80 text-sm font-medium leading-normal hover:text-primary transition-colors">Blog</Link>
                    <Link to="/contacto" className="text-white/80 text-sm font-medium leading-normal hover:text-primary transition-colors">Contacto</Link>
                    <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-violet-500 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                        <span class="truncate">Acceder</span>
                    </button>
                </nav>
                <div class="lg:hidden" onClick={menuClick}>
                    <a class="sidebar-open text-white" href="#page-container">
                    <span class="material-symbols-outlined text-3xl">menu</span>
                    </a>
                </div>
            </header>

            
            <aside className={menuEstado ? 'transition-transform duration-300 ease-in-out' : "sidebar fixed top-0 right-0 z-50 h-full w-72 max-w-[calc(100%-3rem)] bg-[#191933] border-l border-l-[#232348] transform translate-x-full transition-transform duration-300 ease-in-out"}>
                <div class="flex flex-col h-full">
                <div class="flex items-center justify-between p-4 border-b border-b-[#232348]">
                <h3 class="text-lg font-bold text-white" >Menú</h3>
                </div>
                <nav class="flex-grow p-4 space-y-2">
                <a class="block px-4 py-2 text-white/80 rounded-md hover:bg-primary hover:text-white transition-colors" href="/">Home</a>
                <a class="block px-4 py-2 text-white/80 rounded-md hover:bg-primary hover:text-white transition-colors" href="/algoritmos">Algoritmos</a>
                <a class="block px-4 py-2 text-white/80 rounded-md hover:bg-primary hover:text-white transition-colors" href="/empresas">Empresas</a>
                <a class="block px-4 py-2 text-white/80 rounded-md hover:bg-primary hover:text-white transition-colors" href="/creador">Creador</a>
                <a class="block px-4 py-2 text-white/80 rounded-md hover:bg-primary hover:text-white transition-colors" href="/contacto">Contacto</a>
                </nav>
                <div class="p-4 border-t border-t-[#232348] space-y-2">
                <a class="block text-center w-full px-4 py-2 text-white/80 rounded-md border border-primary/50 hover:bg-primary/20 transition-colors" href="#">Login</a>
                <a class="block text-center w-full px-4 py-2 text-white rounded-md bg-primary hover:bg-violet-500 transition-colors" href="#">Registro</a>
                </div>
                </div>
            </aside>

        </>
    )

}

export default Nav;