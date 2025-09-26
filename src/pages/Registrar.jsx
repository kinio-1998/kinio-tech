import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registrar() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    servicio: "",
    contrasena: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // placeholder: aquí enviarías el formulario
    console.log("submit", form);
  };
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-md border-4 border-green-600 rounded-lg p-6" style={{ boxShadow: '0 0 0 6px #071005 inset' }}>
        {/* Logo top-right like mockup */}
        <div className="flex justify-end mb-2">
          <div className="w-12 h-12">
            <img src="/Logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        <h2 className="text-2xl text-white font-bold mb-4">REGISTRAR</h2>

        <form onSubmit={handleSubmit} className="bg-black border-2 border-green-500 rounded-md p-4">
          <div className="space-y-3">
            <label className="flex items-center justify-between text-green-300">
              <span>NOMBRE:</span>
              <input name="nombre" value={form.nombre} onChange={handleChange} className="ml-2 bg-black border-2 border-green-700 text-white px-2 py-1 w-56" />
            </label>

            <label className="flex items-center justify-between text-green-300">
              <span>CORREO:</span>
              <input name="correo" value={form.correo} onChange={handleChange} className="ml-2 bg-black border-2 border-green-700 text-white px-2 py-1 w-56" />
            </label>

            <label className="flex items-center justify-between text-green-300">
              <span>TELEFONO:</span>
              <input name="telefono" value={form.telefono} onChange={handleChange} className="ml-2 bg-black border-2 border-green-700 text-white px-2 py-1 w-56" />
            </label>

            <label className="flex items-center justify-between text-green-300">
              <span>SERVICIO:</span>
              <select name="servicio" value={form.servicio} onChange={handleChange} className="ml-2 bg-black border-2 border-green-700 text-white px-2 py-1 w-56">
                <option value="">Seleccione servicio</option>
                <option value="s1">Servicio 1</option>
                <option value="s2">Servicio 2</option>
              </select>
            </label>

            <label className="flex items-center justify-between text-green-300">
              <span>CONTRASEÑA:</span>
              <input type="password" name="contrasena" value={form.contrasena} onChange={handleChange} className="ml-2 bg-black border-2 border-green-700 text-white px-2 py-1 w-56" />
            </label>
          </div>

          <div className="flex justify-between mt-6">
            <button type="button" onClick={() => navigate('/')} className="bg-red-800 text-white border-2 border-red-600 px-4 py-1 rounded-full">CANCELAR</button>
            <button type="submit" className="bg-green-700 text-white border-2 border-green-500 px-4 py-1 rounded-full">REGISTRAR</button>
          </div>
        </form>
      </div>
    </div>
  );
}
