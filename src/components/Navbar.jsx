// import LogoExpandida from "../assets/6.svg"
import { useState } from "react";
import {
  FcHome,
  FcPlus,
  FcBusinessman,
  FcClock,
  FcSettings,
  FcMenu 
} from "react-icons/fc";

import { Link } from "react-router-dom";
import Logout from "./Logout";

function Navbar({ expanded, setExpanded }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`
        h-screen bg-white shadow-md z-40 fixed top-0 left-0
        transition-all duration-300 flex flex-col
        ${expanded ? "w-64" : "w-22"}
      `}
    >
      {/* Logo com possivel alteração*/}
      <div className="flex items-center justify-center mb-2 relative py-14">
        {/* Logo Grande */}
        <img src="src/assets/6.svg" alt="Logo Expandida" className={`absolute py-4 transition-all duration-300 ${expanded ? "opacity-100 w-48" : "opacity-0 w-12"}`} />

        {/*  Logo Pequeno */}
        <img src="src/assets/icon-diaghelper.svg" alt="Logo Minimizada" className={`absolute py-4 transition-all duration-300 ${expanded ? "opacity-0 w-48" : "opacity-100 w-12"}`} />

      </div>



      <div className="flex flex-col h-full px-6 p-6">
        {/* Botão expandir */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="mb-6 ml-2 cursor-pointer w-6 transition-transform duration-200 hover:scale-125"
        >
          <FcMenu  size={24} />
        </button>

        {/* MENU */}
        <nav className="flex-2">
          <ul className="space-y-4 text-slate-900">
            {[
              { to: "/dashboard", icon: FcHome, label: "Dashboard" },
              { to: "/GerarLaudo", icon: FcPlus, label: "Gerar laudo" },
              {
                to: "/CadastroPacientes",
                icon: FcBusinessman,
                label: "Cadastrar paciente",
              },
              {
                to: "/LogsAuditoria",
                icon: FcClock,
                label: "Logs de Auditoria",
              },
              { to: "/configuracoes", icon: FcSettings, label: "Configurações" },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  to={item.to}
                  className=" bg-gradient-to-r from-slate-100 to-slate-200 hover:from-primary-200 hover:to-primary-400
                    p-2 shadow-lg flex flex-row gap-3 rounded-md cursor-pointer items-center
                    transition-transform duration-200 hover:scale-115
                  "
                >
                  <item.icon size={24} className="min-w-6" />
                  <span
                    className={`
                      transition-all duration-300 text-nowrap
                      ${expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}
                    `}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* FOOTER */}
        <div
          className={`
            h-36 w-64 flex gap-3 overflow-hidden
            transition-all duration-300
          `}
        >
          <div className="shrink-0 flex flex-col items-center justify-around  w-12 h-full">
            <div>
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2.25&w=256&q=80"
                alt="Usuário"
                className="w-10 h-10 rounded-full ring-2 ring-gray-900"
              />
            </div>
            <div className="mt-1">
              <Logout />
              
            </div>
            {/* <div>
              <h5>Sair</h5>
            </div> */}
          </div>

          <div
            className={`
              flex flex-col transition-all duration-300 mt-1 gap-3
              ${expanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0  overflow-hidden"}
            `}
          >
            <p className="font-semibold whitespace-nowrap">{usuario?.nome}</p>
            <p className="text-sm text-slate-600 whitespace-nowrap">{usuario?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function Layout({ children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex">
      <Navbar expanded={expanded} setExpanded={setExpanded} />

      <main
        className={`
          flex-1 p-6 transition-all duration-300
          ${expanded ? "ml-64" : "ml-20"}
        `}
      >
        {children}
      </main>
    </div>
  );
}
