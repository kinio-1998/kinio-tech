import { useState } from "react";
import ModalWrapper from "../modals/ModalWrapper";

export default function Registrar({ onClose }) {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    servicio: "",
    contrasena: "",
  });
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleRegistrar = (e) => {
    e.preventDefault();
    const { nombre, telefono } = form;
    if (!nombre || !telefono) {
      setResult("Ingrese nombre y teléfono.");
      return;
    }
    setResult(`Registrado: ${nombre} (${telefono}) — simulación.`);
  };

  const registrarForm = (
    <form
      id="form-registrar"
      onSubmit={handleRegistrar}
      className="bg-black border-2 border-green-500 rounded-md p-3"
    >
      <label className="text-green-300 block mb-2">NOMBRE:</label>
      <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        className="w-full bg-black border-2 border-green-700 text-white px-2 py-1 mb-3"
        placeholder="Nombre"
      />

      <label className="text-green-300 block mb-2">CORREO:</label>
      <input
        name="correo"
        value={form.correo}
        onChange={handleChange}
        className="w-full bg-black border-2 border-green-700 text-white px-2 py-1 mb-3"
        placeholder="Correo"
      />

      <label className="text-green-300 block mb-2">TELEFONO:</label>
      <input
        name="telefono"
        value={form.telefono}
        onChange={handleChange}
        className="w-full bg-black border-2 border-green-700 text-white px-2 py-1 mb-3"
        placeholder="Teléfono"
      />

      <label className="text-green-300 block mb-2">SERVICIO:</label>
      <select
        name="servicio"
        value={form.servicio}
        onChange={handleChange}
        className="w-full bg-black border-2 border-green-700 text-white px-2 py-1 mb-3"
      >
        <option value="">Seleccione servicio</option>
        <option value="s1">Servicio 1</option>
        <option value="s2">Servicio 2</option>
      </select>

      <div className="mb-3">
        <label className="text-green-300 flex items-center justify-between mb-1">
          <span>CONTRASEÑA:</span>
          <div className="relative inline-block group">
            <button
              type="button"
              aria-describedby="pwdInfo"
              className="ml-2 text-green-300 hover:text-white focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-9-1a1 1 0 102 0v5a1 1 0 11-2 0V9zm1-4a1.25 1.25 0 100 2.5A1.25 1.25 0 0010 5z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div
              id="pwdInfo"
              role="status"
              aria-hidden="true"
              className="pointer-events-none absolute -top-14 right-0 w-64 bg-black border-l-2 border-green-600 text-sm text-green-200 p-2 rounded shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all z-50"
            >
              Solicitar crear una contraseña al cliente: la necesitará al
              momento de la entrega del equipo.
            </div>
          </div>
        </label>

        <input
          type="password"
          name="contrasena"
          value={form.contrasena}
          onChange={handleChange}
          className="w-full bg-black border-2 border-green-700 text-white px-2 py-1"
          placeholder="Contraseña"
        />
      </div>

      {result && <div className="text-green-200 mb-3">{result}</div>}
    </form>
  );

  return (
    <ModalWrapper title="REGISTRAR" onClose={onClose} id="form-registrar">
      {registrarForm}
    </ModalWrapper>
  );
}
