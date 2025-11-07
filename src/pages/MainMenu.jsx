import { useState, useEffect } from "react";
import RegistrarForm from "../components/forms/RegistrarForm";
import CotizarForm from "../components/forms/CotizarForm";
import PendientesList from "../components/lists/PendientesList";
import PublicarForm from "../components/forms/PublicarForm";
import Dashboard from "../components/dashboard/Dashboard";
import ReparacionesList from "../components/lists/ReparacionesList";
import ClientesList from "../components/lists/ClientesList";
import FinanzasList from "../components/lists/FinanzasList";
import ServiciosList from "../components/lists/ServiciosList";
import NuevaReparacionForm from "../components/forms/NuevaReparacionForm";
import { botones } from "../obj/botones";

export default function App() {
  // single modal id state
  const [activeModal, setActiveModal] = useState(null); // values: 'registrar','cotizar','pendientes','publicar', etc. | null

  useEffect(() => {
    document.body.style.overflow = activeModal ? "hidden" : "";
    const onKey = (e) => {
      if (e.key === "Escape") setActiveModal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeModal]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-1 sm:p-2">
      {/* inject small CSS to style scrollbars (WebKit + Firefox) */}
      <style>{`
        .custom-scroll::-webkit-scrollbar{ width:10px; height:10px; }
        .custom-scroll::-webkit-scrollbar-track{ background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb{ background:#16a34a; border-radius:9999px; border:2px solid transparent; background-clip:padding-box; }
        .custom-scroll{ scrollbar-color: #16a34a transparent; scrollbar-width: thin; }
        
        /* Animaciones para los modales anidados */
        .modal-overlay {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* Estilos para las tablas del CRUD */
        .crud-table th {
          position: sticky;
          top: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
        }
      `}</style>

      {/* contenedor exterior: usar ancho responsivo en vez de fijo */}
      <div className="max-w-[320px] sm:max-w-[480px] md:max-w-[655px] w-full rounded-lg sm:rounded-2xl border-2 sm:border-4 border-green-600 p-2 sm:p-4 md:pl-6 md:pb-6 md:pr-6 relative">
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <div className="mb-1 sm:mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 flex items-center justify-center">
                <img src="/Logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* Inner rounded panel */}
        <div className="bg-black p-2 sm:p-4 md:p-6 mt-1 sm:mt-2 md:mt-4 relative w-full max-w-[600px] md:h-[550px] h-auto mx-auto">
          {/* Diamond (rotated square) */}
          <div className="hidden lg:flex relative w-[450px] h-[500px] justify-center items-center mx-auto">
            {botones.map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setActiveModal(btn.modal)}
                className={btn.clases}
              >
                <span className={btn.span}>{btn.label}</span>
              </button>
            ))}
          </div>
          
          {/* Tablet grid (md screens) */}
          <div className="hidden md:grid lg:hidden grid-cols-3 gap-3 w-full max-w-md mx-auto p-2">
            {botones.map((btn, i) => {
              const isLastRow = i >= botones.length - (botones.length % 3 || 3);
              const itemsInLastRow = botones.length % 3 || 3;
              const shouldSpan = isLastRow && itemsInLastRow === 1;
              return (
                <button
                  key={btn.id + "-tablet"}
                  type="button"
                  onClick={() => setActiveModal(btn.modal)}
                  className={`flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-16 px-2 bg-black hover:bg-green-300 hover:text-white rounded-lg text-xs transition-colors ${
                    shouldSpan ? "col-span-3" : ""
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
          
          {/* Mobile grid con todos los botones y ajuste para impar */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-sm md:hidden p-1 sm:p-2">
            {botones.map((btn, i) => {
              const isLast = i === botones.length - 1;
              const isOdd = botones.length % 2 === 1;
              return (
                <button
                  key={btn.id + "-mobile"}
                  type="button"
                  onClick={() => setActiveModal(btn.modal)}
                  className={`flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-16 sm:h-20 px-2 sm:px-3 bg-black hover:bg-green-300 hover:text-white rounded-lg sm:rounded-2xl text-xs sm:text-sm transition-colors ${
                    isLast && isOdd ? "col-span-2" : ""
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal renderer (single overlay) - Completamente responsivo */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-2 sm:p-4" onClick={() => setActiveModal(null)}>
          <div className="bg-black rounded-lg border-2 border-green-600 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-5xl 2xl:max-w-7xl text-white max-h-[95vh] overflow-hidden p-2 sm:p-4" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            {activeModal === "registrar" && <RegistrarForm onClose={() => setActiveModal(null)} noOverlay={true} />}
            {activeModal === "cotizar" && <CotizarForm onClose={() => setActiveModal(null)} noOverlay={true} />}
            {activeModal === "pendientes" && <PendientesList onClose={() => setActiveModal(null)} noOverlay={true} />}
            {activeModal === "publicar" && <PublicarForm onClose={() => setActiveModal(null)} noOverlay={true} />}
            {activeModal === "dashboard" && <Dashboard onClose={() => setActiveModal(null)} noOverlay={true} />}
            {activeModal === "reparaciones" && <ReparacionesList onClose={() => setActiveModal(null)} noOverlay={true} />}
            {activeModal === "clientes" && <ClientesList onClose={() => setActiveModal(null)} noOverlay={true} />}
            {activeModal === "finanzas" && <FinanzasList onClose={() => setActiveModal(null)} noOverlay={true} />}
            {activeModal === "servicios" && <ServiciosList onClose={() => setActiveModal(null)} noOverlay={true} />}
            {activeModal === "nueva-reparacion" && <NuevaReparacionForm onClose={() => setActiveModal(null)} noOverlay={true} />}
          </div>
        </div>
      )}
    </div>
  );
}
