import { useState } from "react";
import ModalWrapper from "./ModalWrapper";

export default function Consultar({ onClose }) {
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
    </form>
  );

  const actionButtons = (
    <>
      <button
        type="submit"
        form="form-consultar"
        className="bg-green-700 text-white border-2 border-green-500 px-4 py-1 rounded-full"
      >
        CONSULTAR
      </button>
      <button
        type="button"
        onClick={onClose}
        className="bg-red-800 text-white border-2 border-red-600 px-4 py-1 rounded-full"
      >
        CERRAR
      </button>
    </>
  );

  return (
    <ModalWrapper title="CONSULTAR" onClose={onClose} actionButtons={actionButtons}>
      {consultarForm}
    </ModalWrapper>
  );
}
