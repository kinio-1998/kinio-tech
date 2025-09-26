import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Consultar from "./Consultar";
import Entregar from "./Entregar";

export default function App() {
  const [consultOpen, setConsultOpen] = useState(false);
  const [entregOpen, setEntregOpen] = useState(false);

  useEffect(() => {
    // bloquear scroll cuando cualquier modal esté abierto
    const anyOpen = consultOpen || entregOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    const onKey = (e) => {
      if (e.key === "Escape") {
        setConsultOpen(false);
        setEntregOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [consultOpen, entregOpen]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-2">
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
            {/* Registrar (centro) */}
            <Link
              to="/registrar"
              className="absolute flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-32 h-32 bg-black hover:bg-green-300 hover:text-white z-10"
            >
              <span className="-rotate-45">REGISTRAR</span>
            </Link>

            {/* Entregar -> ahora abre modal */}
            <button
              type="button"
              onClick={() => setEntregOpen(true)}
              className="absolute -translate-y-[140px] flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-44 h-44 bg-black hover:bg-green-300 hover:text-white"
              aria-haspopup="dialog"
              aria-expanded={entregOpen}
            >
              <span className="-rotate-45">ENTREGAR</span>
            </button>

            {/* Pendientes */}
            <Link
              to="/pendientes"
              className="absolute translate-y-[140px] flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-44 h-44 bg-black hover:bg-green-300 hover:text-white"
            >
              <span className="-rotate-45">PENDIENTES</span>
            </Link>

            {/* Cotizar */}
            <Link
              to="/cotizar"
              className="absolute -translate-x-[140px] flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-44 h-44 bg-black hover:bg-green-300 hover:text-white"
            >
              <span className="-rotate-45">COTIZAR</span>
            </Link>

            {/* Consultar -> sigue abriendo modal */}
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
            <Link
              to="/cotizar"
              className="flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-20 md:h-24 px-3 bg-black hover:bg-green-300 hover:text-white rounded-2xl"
            >
              COTIZAR
            </Link>
            {/* Consultar en móvil -> botón que abre modal */}
            <button
              type="button"
              onClick={() => setConsultOpen(true)}
              className="flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-20 md:h-24 px-3 bg-black hover:bg-green-300 hover:text-white rounded-2xl"
              aria-haspopup="dialog"
              aria-expanded={consultOpen}
            >
              CONSULTAR
            </button>

            <Link
              to="/registrar"
              className="flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-20 md:h-24 px-3 bg-black hover:bg-green-300 hover:text-white rounded-2xl"
            >
              REGISTRAR
            </Link>

            {/* ENTREGAR en móvil -> botón que abre modal */}
            <button
              type="button"
              onClick={() => setEntregOpen(true)}
              className="flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-20 md:h-24 px-3 bg-black hover:bg-green-300 hover:text-white rounded-2xl"
              aria-haspopup="dialog"
              aria-expanded={entregOpen}
            >
              ENTREGAR
            </button>

            <Link
              to="/pendientes"
              className="flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-20 md:h-24 px-3 bg-black hover:bg-green-300 hover:text-white rounded-2xl col-span-2"
            >
              PENDIENTES
            </Link>
          </div>
        </div>
      </div>

      {/* Modal "Consultar" */}
      {consultOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setConsultOpen(false)}
        >
          <div
            className="bg-black rounded-lg border-2 border-green-600 w-11/12 max-w-md p-6 text-white"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <Consultar onClose={() => setConsultOpen(false)} />
          </div>
        </div>
      )}

      {/* Modal "Entregar" (igual estructura que Consultar) */}
      {entregOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setEntregOpen(false)}
        >
          <div
            className="bg-black rounded-lg border-2 border-green-600 w-11/12 max-w-md p-6 text-white"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <Entregar onClose={() => setEntregOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
