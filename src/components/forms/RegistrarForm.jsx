import { useState, useEffect } from "react";
import ModalWrapper from "../modals/ModalWrapper";

// Simulación de clientes desde BD
const CLIENTES_SIMULADOS = [
  { id: 1, nombre: 'Juan Pérez', correo: 'juan@email.com', telefono: '5551234567' },
  { id: 2, nombre: 'María García', correo: 'maria@email.com', telefono: '5559876543' },
  { id: 3, nombre: 'Carlos López', correo: 'carlos@email.com', telefono: '5555555555' },
  { id: 4, nombre: 'Ana Martínez', correo: 'ana@email.com', telefono: '5554443332' },
  { id: 5, nombre: 'Luis Rodríguez', correo: 'luis@email.com', telefono: '5556667778' },
];

export default function Registrar({ onClose, noOverlay }) {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    servicio: "",
    contrasena: "",
  });
  const [result, setResult] = useState("");

  // Estados para búsqueda de cliente
  const [clienteBusqueda, setClienteBusqueda] = useState("");
  const [clientesEncontrados, setClientesEncontrados] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Búsqueda de clientes
  useEffect(() => {
    if (clienteBusqueda.trim()) {
      const encontrados = CLIENTES_SIMULADOS.filter(cliente =>
        cliente.nombre.toLowerCase().includes(clienteBusqueda.toLowerCase()) ||
        cliente.correo.toLowerCase().includes(clienteBusqueda.toLowerCase()) ||
        cliente.telefono.includes(clienteBusqueda)
      );
      setClientesEncontrados(encontrados);
    } else {
      setClientesEncontrados([]);
    }
  }, [clienteBusqueda]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // Seleccionar cliente existente
  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setForm(prev => ({
      ...prev,
      nombre: cliente.nombre,
      correo: cliente.correo,
      telefono: cliente.telefono
    }));
    setClienteBusqueda("");
  };

  // Manejar cambio en búsqueda de cliente
  const handleClienteBusquedaChange = (e) => {
    setClienteBusqueda(e.target.value);
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
    <div className="max-h-[60vh] overflow-auto custom-scroll">
      <form
        id="form-registrar"
        onSubmit={handleRegistrar}
        className="bg-black border-2 border-green-500 rounded-md p-2 sm:p-3 space-y-2 sm:space-y-3"
      >
        {/* Datos del cliente */}
        <div className="space-y-1 sm:space-y-2">
          {/* Título y búsqueda en la misma línea */}
          <div className="flex items-center justify-between">
            <h3 className="text-green-300 font-semibold text-sm sm:text-base">DATOS DEL CLIENTE</h3>
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={clienteBusqueda}
                onChange={handleClienteBusquedaChange}
                placeholder="Buscar cliente..."
                className="bg-black border-2 border-green-700 text-white px-2 py-1 w-48 text-xs sm:text-sm"
              />
              
              {/* Tooltip informativo cuando no hay cliente seleccionado */}
              {!clienteSeleccionado && (
                <div className="group relative">
                  <button
                    type="button"
                    className="text-green-300 hover:text-white focus:outline-none w-6 h-6 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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
                  <div className="pointer-events-none absolute top-full right-0 mt-2 w-64 bg-black border-2 border-green-600 text-xs text-green-200 p-3 rounded shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all z-[9999]">
                    <div className="font-semibold text-green-300 mb-1">💡 Búsqueda de Cliente</div>
                    <div>Use este campo para verificar si el cliente ya está registrado en el sistema. Si encuentra el cliente, selecciónelo para auto-completar sus datos.</div>
                  </div>
                </div>
              )}
              
              {/* Botón X cuando hay cliente seleccionado */}
              {clienteSeleccionado && (
                <button
                  type="button"
                  onClick={() => {
                    setClienteSeleccionado(null);
                    setForm(prev => ({
                      ...prev,
                      nombre: "",
                      correo: "",
                      telefono: ""
                    }));
                  }}
                  className="bg-red-800 text-white border border-red-600 px-1 py-1 rounded text-xs hover:bg-red-700 transition-colors w-6 h-6 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
              
              {/* Dropdown de resultados */}
              {clientesEncontrados.length > 0 && clienteBusqueda.trim() && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-black border-2 border-green-700 rounded shadow-lg z-50 max-h-40 overflow-auto custom-scroll">
                  {clientesEncontrados.slice(0, 5).map((cliente) => (
                    <button
                      key={cliente.id}
                      type="button"
                      onClick={() => seleccionarCliente(cliente)}
                      className="w-full text-left px-3 py-2 text-white hover:bg-green-900/30 transition-colors border-b border-green-800 last:border-b-0"
                    >
                      <div className="text-sm font-medium">{cliente.nombre}</div>
                      <div className="text-xs text-green-400">{cliente.correo} • {cliente.telefono}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Grid con campos del cliente */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2">
            {/* Nombre */}
            <div className="space-y-1">
              <label className="text-green-300 text-xs sm:text-sm font-medium">NOMBRE:</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                disabled={clienteSeleccionado}
                placeholder="Nombre completo"
                className={`bg-black border-2 border-green-700 text-white px-1 sm:px-2 py-1 w-full text-xs sm:text-sm ${clienteSeleccionado ? 'opacity-60' : ''}`}
              />
            </div>

            {/* Correo */}
            <div className="space-y-1">
              <label className="text-green-300 text-xs sm:text-sm font-medium">CORREO:</label>
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                disabled={clienteSeleccionado}
                placeholder="email@ejemplo.com"
                className={`bg-black border-2 border-green-700 text-white px-1 sm:px-2 py-1 w-full text-xs sm:text-sm ${clienteSeleccionado ? 'opacity-60' : ''}`}
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <label className="text-green-300 text-xs sm:text-sm font-medium">TELÉFONO:</label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                disabled={clienteSeleccionado}
                placeholder="1234567890"
                className={`bg-black border-2 border-green-700 text-white px-1 sm:px-2 py-1 w-full text-xs sm:text-sm ${clienteSeleccionado ? 'opacity-60' : ''}`}
                minLength={10}
                maxLength={10}
                pattern="\d{10}"
              />
            </div>
          </div>
        </div>

      <label className="text-green-300 block mb-1 sm:mb-2 text-xs sm:text-sm">SERVICIO:</label>
      <select
        name="servicio"
        value={form.servicio}
        onChange={handleChange}
        className="w-full bg-black border-2 border-green-700 text-white px-2 py-1 mb-2 sm:mb-3 text-xs sm:text-sm"
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
          className="w-full bg-black border-2 border-green-700 text-white px-2 py-1 text-xs sm:text-sm"
          placeholder="Contraseña"
        />
      </div>

      {result && <div className="text-green-200 mb-2 sm:mb-3 text-xs sm:text-sm p-2 bg-green-900 bg-opacity-30 rounded border border-green-700">{result}</div>}
      </form>
    </div>
  );

  return (
    <ModalWrapper title="REGISTRAR" onClose={onClose} id="form-registrar" noOverlay={noOverlay}>
      {registrarForm}
    </ModalWrapper>
  );
}
