import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

export default function ModalWrapper({ title, onClose, children, id }) {
  const navigate = useNavigate();

  const handleClose = () => {
      if (typeof onClose === "function") {
        onClose();
      } else {
        navigate("/");
      }
    };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
      <div className="w-full max-w-2xl bg-black text-white shadow-lg relative border-4 border-green-600 rounded-lg p-4 max-h-9/10 flex flex-col">
        <div className="flex gap-2 items-center pt-2 pb-2 justify-between">
          <h2 className="text-2xl font-bold text-green-500 mb-2 pl-2">{title}</h2>
          <Logo className="w-14 h-14 mb-2 md:pr-4 pr-2" />
        </div>

        {/* contenido: evitar que el modal crezca fuera de la vista; los subcomponentes (items) harán su propio scroll */}
        <div className="m-2 flex-1 overflow-hidden">
          {children}
        </div>

        {/* botones siempre visibles */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleClose}
            className="bg-red-800 text-white border-2 border-red-600 px-4 py-1 rounded-full"
          >
            CERRAR
          </button>

          <button
            type="submit"
            form={id} // 👉 aquí se hace el submit del form del padre
            className="bg-green-700 text-white border-2 border-green-500 px-4 py-1 rounded-full"
          >
            {title}
          </button>
        </div>

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
