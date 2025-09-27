import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Consultar from "./Consultar";
import Entregar from "./Entregar";
import Registrar from "./Registrar";
import Cotizar from "./Cotizar";
import Pendientes from "./Pendientes";

export default function App() {
  const [consultOpen, setConsultOpen] = useState(false);
  const [entregOpen, setEntregOpen] = useState(false);
  const [registrarOpen, setRegistrarOpen] = useState(false);
  const [cotizarOpen, setCotizarOpen] = useState(false);
  const [pendientesOpen, setPendientesOpen] = useState(false);

  useEffect(() => {
    const anyOpen = consultOpen || entregOpen || registrarOpen || cotizarOpen || pendientesOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    const onKey = (e) => {
      if (e.key === "Escape") {
        setConsultOpen(false);
        setEntregOpen(false);
        setRegistrarOpen(false);
        setCotizarOpen(false);
        setPendientesOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [consultOpen, entregOpen, registrarOpen, cotizarOpen, pendientesOpen]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-2">
      {/* inject small CSS to style scrollbars (WebKit + Firefox) */}
      <style>{`
        .custom-scroll::-webkit-scrollbar{ width:10px; height:10px; }
        .custom-scroll::-webkit-scrollbar-track{ background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb{ background:#16a34a; border-radius:9999px; border:2px solid transparent; background-clip:padding-box; }
        .custom-scroll{ scrollbar-color: #16a34a transparent; scrollbar-width: thin; }
      `}</style>

      {/* contenedor exterior: usar ancho responsivo en vez de fijo */}
      <div className="max-w-[655px] w-full rounded-2xl border-4 border-green-600 pl-4 pb-4 pr-4 md:pl-6 md:pb-6 md:pr-6 relative">
        <div className="flex justify-center ">
          <div className="flex flex-col items-center">
            <div className="mb-2  ">
              <div className="w-32 h-32 flex items-center justify-center">
                <img src="/Logo.png" alt="Logo" />
              </div>
            </div>
          </div>
        </div>

        {/* Inner rounded panel */}
        <div className="bg-black rounded-lg border-2 border-green-600 p-4 md:p-6 relative w-full max-w-[600px] md:h-[550px] h-auto mx-auto">
          {/* Diamond (rotated square) */}
          <div className="hidden md:flex relative w-[450px] h-[500px] justify-center items-center mx-auto">
            {/* Registrar (centro) -> abre modal */}
            <button
              type="button"
              onClick={() => setRegistrarOpen(true)}
              className="absolute flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-32 h-32 bg-black hover:bg-green-300 hover:text-white z-10"
              aria-haspopup="dialog"
              aria-expanded={registrarOpen}
            >
              <span className="-rotate-45">REGISTRAR</span>
            </button>

            {/* Entregar -> abre modal */}
            <button
              type="button"
              onClick={() => setEntregOpen(true)}
              className="absolute -translate-y-[140px] flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-44 h-44 bg-black hover:bg-green-300 hover:text-white"
              aria-haspopup="dialog"
              aria-expanded={entregOpen}
            >
              <span className="-rotate-45">ENTREGAR</span>
            </button>

            {/* Pendientes -> abre modal */}
            <button
              type="button"
              onClick={() => setPendientesOpen(true)}
              className="absolute translate-y-[140px] flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-44 h-44 bg-black hover:bg-green-300 hover:text-white"
              aria-haspopup="dialog"
              aria-expanded={pendientesOpen}
            >
              <span className="-rotate-45">PENDIENTES</span>
            </button>

            {/* Cotizar -> abre modal */}
            <button
              type="button"
              onClick={() => setCotizarOpen(true)}
              className="absolute -translate-x-[140px] flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-44 h-44 bg-black hover:bg-green-300 hover:text-white"
              aria-haspopup="dialog"
              aria-expanded={cotizarOpen}
            >
              <span className="-rotate-45">COTIZAR</span>
            </button>

            {/* Consultar -> abre modal */}
            <button
              type="button"
              onClick={() => setConsultOpen(true)}
              className="absolute translate-x-[140px] flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-44 h-44 bg-black hover:bg-green-300 hover:text-white"
              aria-haspopup="dialog"
              aria-expanded={consultOpen}
            >
              <span className="-rotate-45">CONSULTAR</span>
            </button>
          </div>

          {/* Mobile grid estilo Windows Phone */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm md:hidden p-2">
            <button
              type="button"
              onClick={() => setCotizarOpen(true)}
              className="flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-20 md:h-24 px-3 bg-black hover:bg-green-300 hover:text-white rounded-2xl"
            >
              COTIZAR
            </button>
            <button
              type="button"
              onClick={() => setConsultOpen(true)}
              className="flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-20 md:h-24 px-3 bg-black hover:bg-green-300 hover:text-white rounded-2xl"
            >
              CONSULTAR
            </button>
            <button
              type="button"
              onClick={() => setRegistrarOpen(true)}
              className="flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-20 md:h-24 px-3 bg-black hover:bg-green-300 hover:text-white rounded-2xl"
            >
              REGISTRAR
            </button>
            <button
              type="button"
              onClick={() => setEntregOpen(true)}
              className="flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-20 md:h-24 px-3 bg-black hover:bg-green-300 hover:text-white rounded-2xl"
            >
              ENTREGAR
            </button>
            <button
              type="button"
              onClick={() => setPendientesOpen(true)}
              className="flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-20 md:h-24 px-3 bg-black hover:bg-green-300 hover:text-white rounded-2xl col-span-2"
            >
              PENDIENTES
            </button>
          </div>
        </div>
      </div>

      {/* Modals: each modal uses parent's overlay and receives onClose */}
      {consultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setConsultOpen(false)}>
          {/* aumentado max-w a 3xl y padding mayor */}
          <div className="bg-black rounded-lg border-2 border-green-600 w-11/12 max-w-3xl pl-12 text-white" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <Consultar onClose={() => setConsultOpen(false)} />
          </div>
        </div>
      )}

      {entregOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setEntregOpen(false)}>
          <div className="bg-black rounded-lg border-2 border-green-600 w-11/12 max-w-3xl pl-12 text-white" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <Entregar onClose={() => setEntregOpen(false)} />
          </div>
        </div>
      )}

      {registrarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setRegistrarOpen(false)}>
          <div className="bg-black rounded-lg border-2 border-green-600 w-11/12 max-w-3xl pl-12 text-white" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <Registrar onClose={() => setRegistrarOpen(false)} />
          </div>
        </div>
      )}

      {cotizarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setCotizarOpen(false)}>
          <div className="bg-black rounded-lg border-2 border-green-600 w-11/12 max-w-3xl pl-12 text-white" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <Cotizar onClose={() => setCotizarOpen(false)} />
          </div>
        </div>
      )}

      {pendientesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setPendientesOpen(false)}>
          <div className="bg-black rounded-lg border-2 border-green-600 w-11/12 max-w-3xl pl-12 text-white" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <Pendientes onClose={() => setPendientesOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
