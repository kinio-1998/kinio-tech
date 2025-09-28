import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderModal } from "./HeaderModal";
import { BotonesAccion } from "./BotonesAccion";

export default function Cotizar({ onClose }) {
  const [statusMsg, setStatusMsg] = useState(""); // mensaje de resultado
  const [result, setResult] = useState(null); // null = formulario, "success" o "error"
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("Enviando cotización...");

    try {
      const res = await fetch("http://localhost:8000/cotizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_name: form.nombre,
          client_email: form.correo,
          client_phone: form.telefono,
          service_type: form.servicio,
          items: items.map((it) => ({
            description: it.concepto,
            qty: it.cantidad,
            price: Number(it.precio),
          })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult("success");
        setStatusMsg("✅ Cotización enviada correctamente!");
        console.log("PDF generado en:", data.pdf_path);

        // limpiar formulario
        setForm({ nombre: "", correo: "", telefono: "", servicio: "" });
        setItems([{ id: Date.now(), concepto: "", cantidad: 1, precio: "" }]);
      } else {
        setResult("error");
        setStatusMsg("❌ Error al enviar la cotización: " + data.detail);
      }
    } catch (err) {
      console.error(err);
      setResult("error");
      setStatusMsg("❌ Error al enviar la cotización: " + err.message);
    }
  };

  // filas del grid
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

  // Vista del formulario
  const formContent = (
    <div className="w-full max-w-2xl rounded-lg p-6 bg-black text-white">
      <HeaderModal texto="COTIZAR" tamano={24} />
      <form
        id="form-cotizar"
        onSubmit={handleSubmit}
        className="bg-black border-2 border-green-500 rounded-md p-4"
      >
        {/* datos cliente */}
        <div className="space-y-3 mb-3">
          <label className="flex items-center justify-between text-green-300">
            <span>NOMBRE:</span>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="ml-2 bg-black border-2 border-green-700 text-white px-2 py-1 w-56"
              required
            />
          </label>

          <label className="flex items-center justify-between text-green-300">
            <span>CORREO:</span>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              className="ml-2 bg-black border-2 border-green-700 text-white px-2 py-1 w-56"
              required
            />
          </label>

          <label className="flex items-center justify-between text-green-300">
            <span>TELÉFONO:</span>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="ml-2 bg-black border-2 border-green-700 text-white px-2 py-1 w-56"
              required
              minLength={10}
              maxLength={10}
              pattern="\d{10}"
            />
          </label>

          <label className="flex items-center justify-between text-green-300">
            <span>SERVICIO:</span>
            <select
              name="servicio"
              value={form.servicio}
              onChange={handleChange}
              className="ml-2 bg-black border-2 border-green-700 text-white px-2 py-1 w-56"
              required
            >
              <option value="">Seleccione servicio</option>
              <option value="1">Armado De PC</option>
              <option value="2">Cambio de Pasta</option>
              <option value="3">Diagnóstico</option>
              <option value="4">Formateo</option>
              <option value="5">Limpieza Física</option>
              <option value="6">Limpieza y Cambio de Pasta</option>
              <option value="7">Recuperación de Datos</option>
              <option value="8">Reemplazo de Disco Duro</option>
              <option value="9">Reemplazo de RAM</option>
            </select>
          </label>
        </div>

        {/* tabla de items */}
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
      <BotonesAccion id="form-cotizar" onClose={onClose} submitText="COTIZAR" />
    </div>
  );

  // Vista del resultado
  const resultContent = (
    <div className="w-full max-w-2xl rounded-lg p-6 bg-black text-white text-center space-y-4">
      <HeaderModal texto="RESULTADO" tamano={24} />
      <p className={result === "success" ? "text-green-400 text-xl "  : "text-red-400 text-xl"}>
        {statusMsg}
      </p>
      <div className="flex justify-center gap-4">
        {result === "success" ? (
          <button
            onClick={onClose}
            className="bg-red-700 px-4 py-2 rounded-md text-white"
          >
            Cerrar
          </button>
        ) : (
          <>
            <button
              onClick={() => setResult(null)} // reintentar
              className="bg-yellow-600 px-4 py-2 rounded-md text-white"
            >
              Reintentar
            </button>
            <button
              onClick={onClose}
              className="bg-red-700 px-4 py-2 rounded-md text-white"
            >
              Cerrar
            </button>
          </>
        )}
      </div>
    </div>
  );

  const content = result ? resultContent : formContent;

  // Modal con overlay
  if (typeof onClose === "function") return content;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
      {content}
    </div>
  );
}
