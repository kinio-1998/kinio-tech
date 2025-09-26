import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Entregar() {
  const [folio, setFolio] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  const handleEntregar = (e) => {
    e.preventDefault();
    if (!folio || !contrasena) {
      setResult("Ingrese folio y contraseña.");
      return;
    }
    // Simulación: marcar como entregado
    setResult(`Folio ${folio} procesado como entregado.`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
      <div className="w-full max-w-md border-4 border-green-600 rounded-lg p-4 bg-black text-white">
        <div className="flex justify-end mb-2">
          <div className="w-12 h-12">
            <img src="/Logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">ENTREGAR</h2>

        <form onSubmit={handleEntregar} className="bg-black border-2 border-green-500 rounded-md p-3">
          <label className="text-green-300 block mb-2">FOLIO:</label>
          <input
            value={folio}
            onChange={(e) => setFolio(e.target.value)}
            className="w-full bg-black border-2 border-green-700 text-white px-2 py-1 mb-3"
            placeholder="Ingrese folio"
          />

          <label className="text-green-300 block mb-2">CONTRASEÑA:</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full bg-black border-2 border-green-700 text-white px-2 py-1 mb-3"
            placeholder="Ingrese contraseña"
          />

          {result && <div className="text-green-200 mb-3">{result}</div>}

          <div className="flex justify-between">
            <button type="button" onClick={() => navigate('/')} className="bg-red-800 text-white border-2 border-red-600 px-4 py-1 rounded-full">CERRAR</button>
            <button type="submit" className="bg-green-700 text-white border-2 border-green-500 px-4 py-1 rounded-full">ENTREGAR</button>
          </div>
        </form>
      </div>
    </div>
  );
}
