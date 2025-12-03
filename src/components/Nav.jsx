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
        
            <header>
                <div className="LogoSection">
                    <div>
                        <img src={Logo} alt="Logo RomiMath" />
                    </div>
                    <h1>RomiMath</h1>
                </div>
                <nav>
                    <Link to="/" className="">Home</Link>
                    <Link to="/creador" className="">Creador</Link>
                    <Link to="/empresas" className="">Empresas</Link>
                    <Link to="https://www.blog.romimath.site" className="">Blog</Link>
                    <Link to="/contacto" className="">Contacto</Link>
                    <button className="btnAcceder">
                        <span className="">Acceder</span>
                    </button>
                </nav>
                <div className="btnResponsive" onClick={menuClick}>
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