import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Consultar({ onClose }) {
  const [folio, setFolio] = useState("");
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  const handleConsultar = (e) => {
    e.preventDefault();
    if (!folio) {
      setResult("Por favor ingrese un folio.");
      return;
    }
    setResult(`El folio ${folio} se encuentra en estatus de recibido`);
  };

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg p-4 bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-bold text-green-300">
          <h2 className="text-2xl font-bold text-white mb-3">CONSULTAR</h2>
        </div>
        <div className="w-12 h-12">
          <img
            src="/Logo.png"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <form
        onSubmit={handleConsultar}
        className="bg-black border-2 border-green-500 rounded-md p-3"
      >
        <label className="text-green-300 block mb-2">FOLIO:</label>
        <input
          value={folio}
          onChange={(e) => setFolio(e.target.value)}
          className="w-full bg-black border-2 border-green-700 text-white px-2 py-1 mb-3"
          placeholder="Ingrese folio"
        />

        {result && <div className="text-green-200 mb-3">{result}</div>}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="bg-red-800 text-white border-2 border-red-600 px-4 py-1 rounded-full"
          >
            CERRAR
          </button>
          <button
            type="submit"
            className="bg-green-700 text-white border-2 border-green-500 px-4 py-1 rounded-full"
          >
            CONSULTAR
          </button>
        </div>
      </form>
    </div>
  );
}
