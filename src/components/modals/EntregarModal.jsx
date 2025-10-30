import { useState } from "react";
import ModalWrapper from "./ModalWrapper";

export default function Entregar({ onClose, noOverlay }) {
  const [folio, setFolio] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [result, setResult] = useState("");

  const handleEntregar = (e) => {
    e.preventDefault();
    if (!folio || !contrasena) {
      setResult("Ingrese folio y contraseña.");
      return;
    }
    setResult(`Folio ${folio} procesado como entregado.`);
  };

  const entregarForm = (
    <form
      id="form-entregar"
      onSubmit={handleEntregar}
      className="bg-black border-2 border-green-500 rounded-md p-2 sm:p-3 space-y-2 sm:space-y-3"
    >
      <label className="text-green-300 block mb-1 sm:mb-2 text-xs sm:text-sm">FOLIO:</label>
      <input
        value={folio}
        onChange={(e) => setFolio(e.target.value)}
        className="w-full bg-black border-2 border-green-700 text-white px-2 py-1 mb-2 sm:mb-3 text-xs sm:text-sm"
        placeholder="Ingrese folio"
      />

      <label className="text-green-300 block mb-1 sm:mb-2 text-xs sm:text-sm">CONTRASEÑA:</label>
      <input
        type="password"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        className="w-full bg-black border-2 border-green-700 text-white px-2 py-1 mb-2 sm:mb-3 text-xs sm:text-sm"
        placeholder="Ingrese contraseña"
      />

      {result && <div className="text-green-200 mb-2 sm:mb-3 text-xs sm:text-sm p-2 bg-green-900 bg-opacity-30 rounded border border-green-700">{result}</div>}
    </form>
  );

  return (
    <ModalWrapper title="ENTREGAR" onClose={onClose} id="form-entregar" noOverlay={noOverlay}>
      {entregarForm}
    </ModalWrapper>
  );
}
