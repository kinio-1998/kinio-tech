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
              <div className="w-28 h-28 flex items-center justify-center">
                <img src="/Logo.png" alt="Logo" />
              </div>
            </div>
          </div>
        </div>

        {/* Inner rounded panel */}
        <div className="bg-black p-4 md:p-6 mt-2 md:mt-4 relative w-full max-w-[600px] md:h-[550px] h-auto mx-auto">
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
              <span className="-rotate-45 text-xl">REGISTRAR</span>
            </button>
            {/* Boton arriba der -> abre modal */}
            <button
              type="button"
              onClick={() => setEntregOpen(true)}
              className="absolute -translate-y-[144px] translate-x-[144px] flex items-center justify-center border-b-2 border-r-4 border-t-4 border-l-2 border-green-600 text-green-600 font-bold transform  w-72 h-72 bg-black hover:bg-green-300 hover:text-white rounded-tr-xl"
              aria-haspopup="dialog"
              aria-expanded={entregOpen}
              >
              <span className="rotate-45 text-xl pb-32">Boton ARRIBA der</span>
            </button>
            {/* Boton abajo der -> abre modal */}
            <button
              type="button"
              onClick={() => setEntregOpen(true)}
              className="absolute translate-y-[144px] translate-x-[144px] flex items-center justify-center border-b-4 border-r-4 border-t-2 border-l-2 border-green-600 text-green-600 font-bold transform  w-72 h-72 bg-black hover:bg-green-300 hover:text-white rounded-br-xl"
              aria-haspopup="dialog"
              aria-expanded={entregOpen}
              >
              <span className="-rotate-45 text-xl pt-32">Boton abajo der</span>
            </button>
            {/* Boton abajo -> abre modal */}
            <button
              type="button"
              onClick={() => setEntregOpen(true)}
              className="absolute translate-y-[144px] -translate-x-[144px] flex items-center justify-center border-b-4 border-r-2 border-t-2 border-l-4 rounded-bl-xl border-green-600 text-green-600 font-bold transform  w-72 h-72 bg-black hover:bg-green-300 hover:text-white"
              aria-haspopup="dialog"
              aria-expanded={entregOpen}
              >
              <span className="rotate-45 text-xl pt-32">Boton abajo izq</span>
            </button>
            {/* Publicar -> abre modal */}
            <button
              type="button"
              onClick={() => setEntregOpen(true)}
              className="absolute -translate-y-[144px] -translate-x-[144px] flex items-center justify-center border-b-2 border-r-2 border-t-4 border-l-4 rounded-tl-xl border-green-600 text-green-600 font-bold transform  w-72 h-72 bg-black hover:bg-green-300 hover:text-white"
              aria-haspopup="dialog"
              aria-expanded={entregOpen}
            >
              <span className="-rotate-45 text-xl pb-32">PUBLICAR</span>
            </button>
            {/* Entregar -> abre modal */}
            <button
              type="button"
              onClick={() => setEntregOpen(true)}
              className="absolute -translate-y-[140px] flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-52 h-52 bg-black hover:bg-green-300 hover:text-white"
              aria-haspopup="dialog"
              aria-expanded={entregOpen}
            >
              <span className="-rotate-45 text-xl">ENTREGAR</span>
            </button>

            {/* Pendientes -> abre modal */}
            <button
              type="button"
              onClick={() => setPendientesOpen(true)}
              className="absolute translate-y-[140px] flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-52 h-52 bg-black hover:bg-green-300 hover:text-white"
              aria-haspopup="dialog"
              aria-expanded={pendientesOpen}
            >
              <span className="-rotate-45 text-xl">PENDIENTES</span>
            </button>

            {/* Cotizar -> abre modal */}
            <button
              type="button"
              onClick={() => setCotizarOpen(true)}
              className="absolute -translate-x-[140px] flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-52 h-52 bg-black hover:bg-green-300 hover:text-white"
              aria-haspopup="dialog"
              aria-expanded={cotizarOpen}
            >
              <span className="-rotate-45 text-xl">COTIZAR</span>
            </button>

            {/* Consultar -> abre modal */}
            <button
              type="button"
              onClick={() => setConsultOpen(true)}
              className="absolute translate-x-[140px] flex items-center justify-center border-2  border-green-600 text-green-600 font-bold transform rotate-45 w-52 h-52 bg-black hover:bg-green-300 hover:text-white"
              aria-haspopup="dialog"
              aria-expanded={consultOpen}
            >
              <span className="-rotate-45 text-xl justify-end pl-5">CONSULTAR</span>
            </button>
          </div>

          {/* Mobile grid con todos los botones y ajuste para impar */}
          {(() => {
            const mobileButtons = [
              { label: 'COTIZAR', onClick: () => setCotizarOpen(true) },
              { label: 'CONSULTAR', onClick: () => setConsultOpen(true) },
              { label: 'REGISTRAR', onClick: () => setRegistrarOpen(true) },
              { label: 'ENTREGAR', onClick: () => setEntregOpen(true) },
              { label: 'PENDIENTES', onClick: () => setPendientesOpen(true) },
              { label: 'Boton ARRIBA der', onClick: () => setEntregOpen(true) },
              { label: 'Boton abajo der', onClick: () => setEntregOpen(true) },
              { label: 'Boton abajo izq', onClick: () => setEntregOpen(true) },
              { label: 'PUBLICAR', onClick: () => setEntregOpen(true) },
            ];
            return (
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm md:hidden p-2">
                {mobileButtons.map((btn, i) => {
                  const isLast = i === mobileButtons.length - 1;
                  const isOdd = mobileButtons.length % 2 === 1;
                  return (
                    <button
                      key={btn.label}
                      type="button"
                      onClick={btn.onClick}
                      className={
                        "flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-20 md:h-24 px-3 bg-black hover:bg-green-300 hover:text-white rounded-2xl" +
                        (isLast && isOdd ? " col-span-2" : "")
                      }
                    >
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            );
          })()}
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
