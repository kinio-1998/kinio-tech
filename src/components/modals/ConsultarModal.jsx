import { useState } from "react";
import ModalWrapper from "./ModalWrapper";

export default function Consultar({ onClose, noOverlay }) {
  const [folio, setFolio] = useState("");
  const [result, setResult] = useState("");

  const handleConsultar = (e) => {
    e.preventDefault();
    if (!folio) {
      setResult("Por favor ingrese un folio.");
      return;
    }
    setResult(`El folio ${folio} se encuentra en estatus de recibido`);
  };

  const consultarForm = (
    <form
      id="form-consultar"
      onSubmit={handleConsultar}
      className="bg-black border-2 border-green-500 rounded-md p-2 sm:p-3 space-y-2 sm:space-y-3"
    >
      <label className="text-green-300 block mb-1 sm:mb-2 text-xs sm:text-sm">FOLIO:</label>
      <input
        value={folio}
        onChange={(e) => setFolio(e.target.value)}
        className="w-full bg-black border-2 border-green-700 text-white px-2 py-1 mb-2 sm:mb-3 text-xs sm:text-sm"
        placeholder="Ingrese folio"
      />

      {result && <div className="text-green-200 mb-2 sm:mb-3 text-xs sm:text-sm p-2 bg-green-900 bg-opacity-30 rounded border border-green-700">{result}</div>}
    </form>
  );

  return (
    <ModalWrapper title="CONSULTAR" onClose={onClose} id="form-consultar" noOverlay={noOverlay}>
      {consultarForm}
    </ModalWrapper>
  );
}
