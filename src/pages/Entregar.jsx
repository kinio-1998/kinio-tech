import { useState } from "react";
import { HeaderModal } from "./HeaderModal";
import { BotonesAccion } from "./BotonesAccion";

export default function Entregar({ onClose }) {
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

  return (
    <div className="w-full max-w-2xl rounded-lg p-4 bg-black text-white">
      <HeaderModal texto="ENTREGAR" tamano={24} />

      <form
        id="form-entregar"
        onSubmit={handleEntregar}
        className="bg-black border-2 border-green-500 rounded-md p-3"
      >
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
      </form>

      <BotonesAccion
        formId="form-entregar"
        onClose={onClose}
        submitText="ENTREGAR"
      />
    </div>
  );
}
