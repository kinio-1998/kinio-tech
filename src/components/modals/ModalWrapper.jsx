import { useNavigate } from "react-router-dom";
import Logo from "../Logo";

export default function ModalWrapper({ title, onClose, children, id, isLoading, loadingText, hideDefaultButtons = false, className, noOverlay = false }) {
  const navigate = useNavigate();

  const handleClose = () => {
      if (typeof onClose === "function") {
        onClose();
      } else {
        navigate("/");
      }
    };

  // Si noOverlay es true, solo devolvemos el contenido del modal sin overlay ni contenedor adicional
  if (noOverlay) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex gap-2 items-center pt-1 pb-2 justify-between flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-green-500 mb-2 pl-1 sm:pl-2">{title}</h2>
          <Logo className="w-10 h-10 sm:w-14 sm:h-14 mb-2 pr-1 sm:pr-2 md:pr-4" />
        </div>

        {/* contenido: evitar que el modal crezca fuera de la vista; los subcomponentes (items) harán su propio scroll */}
        <div className="flex-1 overflow-auto custom-scroll">
          {children}
        </div>

        {/* botones siempre visibles */}
        {!hideDefaultButtons && (
          <div className="flex justify-between mt-2 sm:mt-4 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="bg-red-800 text-white border-2 border-red-600 px-2 sm:px-4 py-1 rounded-full text-sm"
            >
              CERRAR
            </button>

            {id && (
              <button
                type="submit"
                form={id} // 👉 aquí se hace el submit del form del padre
                disabled={isLoading}
                className="bg-green-700 text-white border-2 border-green-500 px-2 sm:px-4 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? (loadingText || 'Cargando...') : title}
              </button>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-green-400 hover:text-green-200 text-2xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-2 sm:p-4">
      <div className={`w-full bg-black text-white shadow-lg relative border-4 border-green-600 rounded-lg p-2 sm:p-4 flex flex-col ${className || 'max-w-2xl'} max-h-[95vh] overflow-hidden`}>
        <div className="flex gap-2 items-center pt-1 pb-2 justify-between flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-green-500 mb-2 pl-1 sm:pl-2">{title}</h2>
          <Logo className="w-10 h-10 sm:w-14 sm:h-14 mb-2 pr-1 sm:pr-2 md:pr-4" />
        </div>

        {/* contenido: evitar que el modal crezca fuera de la vista; los subcomponentes (items) harán su propio scroll */}
        <div className="m-1 sm:m-2 flex-1 overflow-auto custom-scroll">
          {children}
        </div>

        {/* botones siempre visibles */}
        {!hideDefaultButtons && (
          <div className="flex justify-between mt-2 sm:mt-4 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="bg-red-800 text-white border-2 border-red-600 px-2 sm:px-4 py-1 rounded-full text-sm"
            >
              CERRAR
            </button>

            {id && (
              <button
                type="submit"
                form={id} // 👉 aquí se hace el submit del form del padre
                disabled={isLoading}
                className="bg-green-700 text-white border-2 border-green-500 px-2 sm:px-4 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? (loadingText || 'Cargando...') : title}
              </button>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-green-400 hover:text-green-200 text-2xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  );
}
