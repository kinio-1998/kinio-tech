import { useState } from "react";
import ModalWrapper from "./ModalWrapper";
export default function Cotizar({ onClose }) {
  const [purchased, setPurchased] = useState(true);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    servicio: "",
  });
  const [items, setItems] = useState([
    { id: Date.now(), concepto: "", cantidad: 1, precio: "" },
  ]);
  const [statusMsg, setStatusMsg] = useState("");
  const [result, setResult] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const validateItem = (item) => {
    const errors = {};
    
    // Validar concepto (solo letras, números y espacios)
    if (!item.concepto.trim() || !/^[a-zA-Z0-9\s]+$/.test(item.concepto)) {
      errors.concepto = "El concepto debe contener solo letras, números y espacios";
    }
    
    // Validar cantidad (número entero positivo)
    if (!Number.isInteger(Number(item.cantidad)) || Number(item.cantidad) <= 0) {
      errors.cantidad = "La cantidad debe ser un número entero positivo";
    }
    
    // Validar precio (número decimal positivo)
    if (isNaN(Number(item.precio)) || Number(item.precio) <= 0) {
      errors.precio = "El precio debe ser un número positivo";
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    // Limpiar error al modificar el campo
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("Enviando cotización...");

    // Validar el formulario
    const errors = {};
    if (!form.nombre.trim()) errors.nombre = "El nombre es requerido";
    if (!form.correo.trim()) errors.correo = "El correo es requerido";
    if (!form.telefono.trim() || !/^\d{10}$/.test(form.telefono)) errors.telefono = "El teléfono debe tener 10 dígitos";
    if (!form.servicio) errors.servicio = "Debe seleccionar un servicio";

    // Validar items cuando purchased es true
    if (purchased) {
      const itemErrors = {};
      let hasValidItem = false;

      items.forEach((item, index) => {
        const itemValidation = validateItem(item);
        if (Object.keys(itemValidation).length === 0) {
          hasValidItem = true;
        }
        if (Object.keys(itemValidation).length > 0) {
          itemErrors[index] = itemValidation;
        }
      });

      if (!hasValidItem) {
        setStatusMsg("❌ Debe agregar al menos 1 ítem con todos los campos válidos");
        setFormErrors({ ...errors, items: itemErrors });
        return;
      }
    }

    // Si hay errores en el formulario principal, mostrarlos
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setStatusMsg("❌ Por favor corrija los errores en el formulario");
      return;
    }

    try {
      const res = await fetch(
        "https://kiniotech-backend.onrender.com/api/cotizar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_name: form.nombre,
            client_email: form.correo,
            client_phone: form.telefono,
            service_type: form.servicio,
            items: purchased
              ? items
                  .filter((it) => (Number(it.cantidad) > 0) && (Number(it.precio) > 0))
                  .map((it) => ({ description: it.concepto, qty: it.cantidad, price: Number(it.precio) }))
              : [],
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setResult("success");
        setStatusMsg("✅ Cotización enviada correctamente!");
        setForm({ nombre: "", correo: "", telefono: "", servicio: "" });
        setItems([{ id: Date.now(), concepto: "", cantidad: 1, precio: "" }]);
      } else {
        setResult("error");
        setStatusMsg("❌ Error al enviar la cotización: " + data.detail);
      }
    } catch (err) {
      setResult("error");
      setStatusMsg("❌ Error al enviar la cotización: " + err.message);
    }
  };

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
  const cotizarForm = (
    <form
      id="form-cotizar"
      onSubmit={handleSubmit}
      className="bg-black border-2 border-green-500 rounded-md p-4"
    >
      {/* datos cliente */}
      <div className="space-y-2 sm:space-y-3 mb-3">
        <label className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-green-300 gap-1">
          <span className="text-sm sm:text-base">NOMBRE:</span>
          <div className="relative w-full sm:w-56">
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className={`bg-black border-2 ${formErrors.nombre ? 'border-red-600' : 'border-green-700'} text-white px-2 py-1 w-full text-sm sm:text-base`}
            />
            {formErrors.nombre && (
              <span className="text-red-500 text-xs absolute -bottom-5">{formErrors.nombre}</span>
            )}
          </div>
        </label>
        <label className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-green-300 gap-1">
          <span className="text-sm sm:text-base">CORREO:</span>
          <div className="relative w-full sm:w-56">
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              className={`bg-black border-2 ${formErrors.correo ? 'border-red-600' : 'border-green-700'} text-white px-2 py-1 w-full text-sm sm:text-base`}
            />
            {formErrors.correo && (
              <span className="text-red-500 text-xs absolute -bottom-5">{formErrors.correo}</span>
            )}
          </div>
        </label>
        <label className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-green-300 gap-1">
          <span className="text-sm sm:text-base">TELÉFONO:</span>
          <div className="relative w-full sm:w-56">
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className={`bg-black border-2 ${formErrors.telefono ? 'border-red-600' : 'border-green-700'} text-white px-2 py-1 w-full text-sm sm:text-base`}
              minLength={10}
              maxLength={10}
              pattern="\d{10}"
            />
            {formErrors.telefono && (
              <span className="text-red-500 text-xs absolute -bottom-5">{formErrors.telefono}</span>
            )}
          </div>
        </label>
        <label className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-green-300 gap-1">
          <span className="text-sm sm:text-base">SERVICIO:</span>
          <div className="relative w-full sm:w-56">
            <select
              name="servicio"
              value={form.servicio}
              onChange={handleChange}
              className={`bg-black border-2 ${formErrors.servicio ? 'border-red-600' : 'border-green-700'} text-white px-2 py-1 w-full text-sm sm:text-base`}
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
            {formErrors.servicio && (
              <span className="text-red-500 text-xs absolute -bottom-5">{formErrors.servicio}</span>
            )}
          </div>
        </label>
      </div>

      {/* switch que controla la visibilidad del grid (debe quedar FUERA del grid) */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-3">
          <span className="text-green-300">¿Se compró algo?</span>
          <label className="relative inline-flex items-center cursor-pointer ml-2">
            <input
              type="checkbox"
              checked={purchased}
              onChange={(e) => setPurchased(e.target.checked)}
              className="sr-only peer"
              aria-label="Se compró algo"
            />
            <div className="w-11 h-6 bg-gray-800 rounded-full peer-checked:bg-green-500 transition-colors" />
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
          </label>
        </div>
        <small className="text-xs text-green-400">Muestra/oculta la tabla de ítems</small>
      </div>

      {/* grid principal: se oculta/visualiza COMPLETO */}
      {purchased ? (
        <div className="mt-2 bg-black border-2 border-green-700 rounded-sm p-2">
          <div className="grid grid-cols-12 gap-1 sm:gap-2 text-xs sm:text-sm text-green-300 border-b border-green-700 pb-2 mb-2">
            <div className="col-span-6 truncate">CONCEPTO</div>
            <div className="col-span-2 text-center truncate">CANTIDAD</div>
            <div className="col-span-3 text-center truncate">PRECIO</div>
            <div className="col-span-1" />
          </div>

          <div className={items.length >= 3 ? "space-y-2 max-h-24 md:max-h-28 overflow-auto custom-scroll" : "space-y-2"}>
            {items.map((it, index) => (
              <div
                key={it.id}
                className="grid grid-cols-12 gap-1 sm:gap-2 items-center text-white text-xs sm:text-sm"
              >
                <input
                  value={it.concepto}
                  onChange={(e) => updateRow(it.id, "concepto", e.target.value)}
                  placeholder="Concepto"
                  className={`col-span-6 bg-black border ${formErrors.items?.[index]?.concepto ? 'border-red-600' : 'border-green-800'} px-1 sm:px-2 py-1 text-white text-xs sm:text-sm`}
                />
                {formErrors.items?.[index]?.concepto && (
                  <span className="col-span-6 text-red-500 text-xs">{formErrors.items[index].concepto}</span>
                )}
                <input
                  type="number"
                  value={it.cantidad}
                  min="1"
                  onChange={(e) => updateRow(it.id, "cantidad", e.target.value)}
                  className={`col-span-2 bg-black border ${formErrors.items?.[index]?.cantidad ? 'border-red-600' : 'border-green-800'} px-1 sm:px-2 py-1 text-white text-center text-xs sm:text-sm`}
                />
                {formErrors.items?.[index]?.cantidad && (
                  <span className="col-span-2 text-red-500 text-xs text-center">{formErrors.items[index].cantidad}</span>
                )}
                <input
                  type="number"
                  value={it.precio}
                  min="0"
                  step="0.01"
                  onChange={(e) => updateRow(it.id, "precio", e.target.value)}
                  className={`col-span-3 bg-black border ${formErrors.items?.[index]?.precio ? 'border-red-600' : 'border-green-800'} px-1 sm:px-2 py-1 text-white text-right text-xs sm:text-sm`}
                />
                {formErrors.items?.[index]?.precio && (
                  <span className="col-span-3 text-red-500 text-xs text-right">{formErrors.items[index].precio}</span>
                )}
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
              AGREGAR
            </button>
            <div className="text-white">
              Total: {" "}
              <span className="text-green-300 font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );

  const actionButtons = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="bg-red-800 text-white border-2 border-red-600 px-4 py-1 rounded-full"
      >
        CERRAR
      </button>
      <button
        type="submit"
        form="form-cotizar"
        className="bg-green-700 text-white border-2 border-green-500 px-4 py-1 rounded-full"
      >
        COTIZAR
      </button>
    </>
  );

  const resultContent = (
    <div className="w-full max-w-2xl rounded-lg p-6 bg-black text-white text-center space-y-4">
      <h2 className="text-2xl font-bold text-green-500 mb-4">RESULTADO</h2>
      <p
        className={
          result === "success"
            ? "text-green-400 text-xl "
            : "text-red-400 text-xl"
        }
      >
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
              onClick={() => setResult(null)}
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

  return (
    <ModalWrapper title="COTIZAR" onClose={onClose} actionButtons={'actionButtons'} id="form-cotizar">
      {result ? resultContent : cotizarForm}
    </ModalWrapper>
  );
}
