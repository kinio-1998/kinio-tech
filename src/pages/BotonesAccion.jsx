import { useNavigate } from "react-router-dom";

export const BotonesAccion = ({ formId, onClose, submitText }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    } else {
      navigate("/");
    }
  };

  return (
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
        form={formId} // 👉 aquí se hace el submit del form del padre
        className="bg-green-700 text-white border-2 border-green-500 px-4 py-1 rounded-full"
      >
        {submitText}
      </button>
    </div>
  );
};