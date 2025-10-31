import { useNavigate } from "react-router-dom";
import Logo from "../Logo";

export default function ModalWrapper({
  title,
  onClose,
  children,
  id,
  isLoading,
  loadingText,
  hideDefaultButtons = false,
  className,
  noOverlay = false,
}) {
  const navigate = useNavigate();

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    } else {
      navigate("/");
    }
  };

  // --- 🔹 Versión sin overlay (modo embebido) ---
  if (noOverlay) {
    return (
      <div className="min-h-0 flex flex-col relative overflow-hidden" style={{ height: 'min(90dvh, 90vh)' }}>
        {/* Header */}
        <div className="flex gap-2 items-center pt-1 pb-2 justify-between flex-shrink-0 border-b border-green-700 bg-black/95">
          <h2 className="text-xl sm:text-2xl font-bold text-green-500 mb-2 pl-1 sm:pl-2">
            {title}
          </h2>
          <Logo className="w-10 h-10 sm:w-14 sm:h-14 mb-2 pr-1 sm:pr-2 md:pr-4" />
        </div>

    {/* Contenido scrollable */}
  <div className="flex-1 min-h-0 overflow-auto custom-scroll px-1 sm:px-2 py-2">{children}</div>

        {/* Footer con botones */}
        {!hideDefaultButtons && (
          <div className="flex justify-between mt-2 sm:mt-4 flex-shrink-0 border-t border-green-700 bg-black/95 backdrop-blur-[1px] relative z-10 px-1 sm:px-2 py-2" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
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
                form={id}
                disabled={isLoading}
                className="bg-green-700 text-white border-2 border-green-500 px-2 sm:px-4 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? loadingText || "Cargando..." : title}
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

  // --- 🔹 Versión con overlay ---
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-2 sm:p-4">
      <div
        className={`w-full bg-black text-white shadow-lg relative border-4 border-green-600 rounded-lg flex flex-col min-h-0 pointer-events-auto
        ${className || "max-w-2xl"} overflow-hidden`}
        style={{ height: 'min(90dvh, 90vh)', maxHeight: 'min(90dvh, 90vh)', width: 'min(100%, 64rem)' }}
      >
        {/* Header */}
        <div className="flex gap-2 items-center pt-1 pb-2 justify-between flex-shrink-0 border-b border-green-700 bg-black/95">
          <h2 className="text-xl sm:text-2xl font-bold text-green-500 mb-2 pl-1 sm:pl-2">
            {title}
          </h2>
          <Logo className="w-10 h-10 sm:w-14 sm:h-14 mb-2 pr-1 sm:pr-2 md:pr-4" />
        </div>

        {/* Contenido scrollable */}
        <div className="m-1 sm:m-2 flex-1 min-h-0 overflow-auto custom-scroll px-1 sm:px-2 py-2">
          {children}
        </div>

        {/* Footer con botones */}
        {!hideDefaultButtons && (
          <div className="flex justify-between mt-2 sm:mt-4 flex-shrink-0 border-t border-green-700 bg-black/95 backdrop-blur-[1px] relative z-10 px-1 sm:px-2 py-2" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
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
                form={id}
                disabled={isLoading}
                className="bg-green-700 text-white border-2 border-green-500 px-2 sm:px-4 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? loadingText || "Cargando..." : title}
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
