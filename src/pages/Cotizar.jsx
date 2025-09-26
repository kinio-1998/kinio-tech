import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cotizar() {
  const [form, setForm] = useState({ nombre: "", correo: "", telefono: "", servicio: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("cotizar", form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-md border-4 border-green-600 rounded-lg p-6" style={{ boxShadow: '0 0 0 6px #071005 inset' }}>
        {/* Logo top-right */}
        <div className="flex justify-end mb-2">
          <div className="w-12 h-12">
            <img src="/Logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        <h2 className="text-2xl text-white font-bold mb-4">COTIZAR</h2>

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
          </div>

          {/* Table placeholder for concepto/cantidad/precio */}
          <div className="mt-4 bg-black border-2 border-green-700 rounded-sm">
            <div className="grid grid-cols-3 text-sm text-green-300 border-b border-green-700">
              <div className="p-2">CONCEPTO</div>
              <div className="p-2">CANTIDAD</div>
              <div className="p-2">PRECIO</div>
            </div>
            <div className="h-40">
              {/* rows empty for now */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="grid grid-cols-3 text-white text-sm border-b border-green-900">
                  <div className="p-2">&nbsp;</div>
                  <div className="p-2">&nbsp;</div>
                  <div className="p-2">&nbsp;</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button type="button" onClick={() => navigate('/')} className="bg-red-800 text-white border-2 border-red-600 px-4 py-1 rounded-full">CANCELAR</button>
            <button type="submit" className="bg-green-700 text-white border-2 border-green-500 px-4 py-1 rounded-full">COTIZAR</button>
          </div>
        </form>
      </div>
    </div>
  );
}
