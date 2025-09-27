import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderModal } from "./HeaderModal";
import { BotonesAccion } from "./BotonesAccion";
export default function Cotizar({ onClose }) {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    servicio: "",
  });
  const [items, setItems] = useState([
    { id: Date.now(), concepto: "", cantidad: 1, precio: "" },
  ]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // envía form + items al backend en tu implementación real
    console.log("cotizar", { form, items });
  };

  // filas del grid: añadir, eliminar y actualizar
  const addRow = () => {
    setItems((s) => [
      ...s,
      { id: Date.now() + Math.random(), concepto: "", cantidad: 1, precio: "" },
    ]);
  };
  const removeRow = (id) => {
    setItems((s) => s.filter((r) => r.id !== id));
  };
  const updateRow = (id, field, value) => {
    setItems((s) =>
      s.map((r) =>
        r.id === id
          ? { ...r, [field]: field === "cantidad" ? Number(value) : value }
          : r
      )
    );
  };

  const total = items.reduce(
    (sum, it) => sum + (Number(it.cantidad) || 0) * (Number(it.precio) || 0),
    0
  );

  const content = (
    // usar max-w-2xl para permitir más ancho dentro del wrapper mayor del padre
    <div className="w-full max-w-2xl rounded-lg p-6 bg-black text-white">
      <HeaderModal texto="COTIZAR" tamano={24} />
      <form
        formId="form-cotizar"
        onSubmit={handleSubmit}
        className="bg-black border-2 border-green-500 rounded-md p-4"
      >
        <div className="space-y-3 mb-3">
          <label className="flex items-center justify-between text-green-300">
            <span>NOMBRE:</span>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="ml-2 bg-black border-2 border-green-700 text-white px-2 py-1 w-56"
            />
          </label>

          <label className="flex items-center justify-between text-green-300">
            <span>CORREO:</span>
            <input
              name="correo"
              value={form.correo}
              onChange={handleChange}
              className="ml-2 bg-black border-2 border-green-700 text-white px-2 py-1 w-56"
            />
          </label>

          <label className="flex items-center justify-between text-green-300">
            <span>TELEFONO:</span>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="ml-2 bg-black border-2 border-green-700 text-white px-2 py-1 w-56"
            />
          </label>

          <label className="flex items-center justify-between text-green-300">
            <span>SERVICIO:</span>
            <select
              name="servicio"
              value={form.servicio}
              onChange={handleChange}
              className="ml-2 bg-black border-2 border-green-700 text-white px-2 py-1 w-56"
            >
              <option value="">Seleccione servicio</option>
              <option value="s1">Servicio 1</option>
              <option value="s2">Servicio 2</option>
            </select>
          </label>
        </div>

        {/* Grid editable de items */}
        <div className="mt-2 bg-black border-2 border-green-700 rounded-sm p-2">
          <div className="grid grid-cols-12 gap-2 text-sm text-green-300 border-b border-green-700 pb-2 mb-2">
            <div className="col-span-6">CONCEPTO</div>
            <div className="col-span-2 text-center">CANTIDAD</div>
            <div className="col-span-3 text-right">PRECIO</div>
            <div className="col-span-1" />
          </div>

          <div className="space-y-2 max-h-64 overflow-auto custom-scroll">
            {items.map((it) => (
              <div
                key={it.id}
                className="grid grid-cols-12 gap-2 items-center text-white text-sm"
              >
                <input
                  value={it.concepto}
                  onChange={(e) => updateRow(it.id, "concepto", e.target.value)}
                  placeholder="Concepto"
                  className="col-span-6 bg-black border-2 border-green-800 px-2 py-1 text-white"
                />
                <input
                  type="number"
                  value={it.cantidad}
                  min="1"
                  onChange={(e) => updateRow(it.id, "cantidad", e.target.value)}
                  className="col-span-2 bg-black border-2 border-green-800 px-2 py-1 text-white text-center"
                />
                <input
                  type="number"
                  value={it.precio}
                  min="0"
                  step="0.01"
                  onChange={(e) => updateRow(it.id, "precio", e.target.value)}
                  className="col-span-3 bg-black border-2 border-green-800 px-2 py-1 text-white text-right"
                />
                <button
                  type="button"
                  onClick={() => removeRow(it.id)}
                  className="col-span-1 bg-red-800 text-white px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={addRow}
              className="bg-green-700 text-white px-3 py-1 rounded-full"
            >
              AGREGAR ITEM
            </button>
            <div className="text-white">
              Total:{" "}
              <span className="text-green-300 font-bold">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </form>
      <BotonesAccion
        formId="form-cotizar"
        onClose={onClose}
        submitText="COTIZAR"
      />
    </div>
  );

  // Si el padre pasó onClose, el overlay lo maneja MainMenu; devolvemos solo el contenido.
  if (typeof onClose === "function") return content;

  // Si se usa standalone, envolvemos con overlay
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
      {content}
    </div>
  );
}
