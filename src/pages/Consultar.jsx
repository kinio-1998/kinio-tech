import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderModal } from "./HeaderModal";
import { BotonesAccion } from "./BotonesAccion";

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


  return (
    <div className="w-full max-w-2xl rounded-lg pl-6 pr-6 pb-6 bg-black text-white">
      <HeaderModal texto="CONSULTAR" tamano={24} />

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
      <BotonesAccion
              id="form-consultar"
              onClose={onClose}
              submitText="CONSULTAR"
            />
    </div>
  );
}
