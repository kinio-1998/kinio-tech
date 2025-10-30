import { useState, useEffect } from "react";

// Simulación de clientes desde BD
const CLIENTES_SIMULADOS = [
  { id: 1, nombre: 'Juan Pérez', correo: 'juan@email.com', telefono: '5551234567' },
  { id: 2, nombre: 'María García', correo: 'maria@email.com', telefono: '5559876543' },
  { id: 3, nombre: 'Carlos López', correo: 'carlos@email.com', telefono: '5555555555' },
  { id: 4, nombre: 'Ana Martínez', correo: 'ana@email.com', telefono: '5554443332' },
  { id: 5, nombre: 'Luis Rodríguez', correo: 'luis@email.com', telefono: '5556667778' },
];

export default function ClienteDataForm({ 
  form, 
  setForm,
  formErrors = {},
  nombreField = "nombre",
  correoField = "correo", 
  telefonoField = "telefono",
  equipoTipoField = "equipo_tipo",
  includeEquipoTipo = false,
  onFormChange = null,
  handleChange: externalHandleChange = null // Para usar el handleChange del formulario padre
}) {
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

  // Seleccionar cliente existente
  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setForm(prev => ({
      ...prev,
      [nombreField]: cliente.nombre,
      [correoField]: cliente.correo,
      [telefonoField]: cliente.telefono
    }));
    setClienteBusqueda("");
  };

  // Manejar cambio en búsqueda de cliente
  const handleClienteBusquedaChange = (e) => {
    setClienteBusqueda(e.target.value);
  };

  // Manejar cambios en los campos usando el handler externo si está disponible
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    if (externalHandleChange) {
      externalHandleChange(e);  // Usar el manejador externo del formulario padre
    } else {
      setForm(prev => ({ ...prev, [name]: value }));  // Manejador interno como fallback
    }
  };

  return (
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
                  [nombreField]: "",
                  [correoField]: "",
                  [telefonoField]: ""
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
      <div className={`grid gap-1 sm:gap-2 ${includeEquipoTipo ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
        {/* Nombre */}
        <div className="space-y-1">
          <label className="text-green-300 text-xs sm:text-sm font-medium">NOMBRE:</label>
          <div className="relative">
            <input
              type="text"
              name={nombreField}
              value={form[nombreField] || ""}
              onChange={handleFieldChange}
              disabled={clienteSeleccionado}
              placeholder="Nombre completo"
              className={`bg-black border-2 ${formErrors[nombreField] ? 'border-red-600' : 'border-green-700'} text-white px-1 sm:px-2 py-1 w-full text-xs sm:text-sm ${clienteSeleccionado ? 'opacity-60' : ''}`}
            />
            {formErrors[nombreField] && (
              <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="pointer-events-none absolute -top-16 right-0 w-48 bg-red-900 border-l-2 border-red-500 text-xs text-white p-2 rounded shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all z-50">
                  {formErrors[nombreField]}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Correo */}
        <div className="space-y-1">
          <label className="text-green-300 text-xs sm:text-sm font-medium">CORREO:</label>
          <div className="relative">
            <input
              type="email"
              name={correoField}
              value={form[correoField] || ""}
              onChange={handleFieldChange}
              disabled={clienteSeleccionado}
              placeholder="email@ejemplo.com"
              className={`bg-black border-2 ${formErrors[correoField] ? 'border-red-600' : 'border-green-700'} text-white px-1 sm:px-2 py-1 w-full text-xs sm:text-sm ${clienteSeleccionado ? 'opacity-60' : ''}`}
            />
            {formErrors[correoField] && (
              <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="pointer-events-none absolute -top-16 right-0 w-48 bg-red-900 border-l-2 border-red-500 text-xs text-white p-2 rounded shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all z-50">
                  {formErrors[correoField]}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Teléfono */}
        <div className="space-y-1">
          <label className="text-green-300 text-xs sm:text-sm font-medium">TELÉFONO:</label>
          <div className="relative">
            <input
              type="tel"
              name={telefonoField}
              value={form[telefonoField] || ""}
              onChange={handleFieldChange}
              disabled={clienteSeleccionado}
              placeholder="1234567890"
              className={`bg-black border-2 ${formErrors[telefonoField] ? 'border-red-600' : 'border-green-700'} text-white px-1 sm:px-2 py-1 w-full text-xs sm:text-sm ${clienteSeleccionado ? 'opacity-60' : ''}`}
              minLength={10}
              maxLength={10}
              pattern="\d{10}"
            />
            {formErrors[telefonoField] && (
              <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="pointer-events-none absolute -top-16 right-0 w-48 bg-red-900 border-l-2 border-red-500 text-xs text-white p-2 rounded shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all z-50">
                  {formErrors[telefonoField]}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Tipo de Equipo (condicional) */}
        {includeEquipoTipo && (
          <div className="space-y-1">
            <label className="text-green-300 text-xs sm:text-sm font-medium">TIPO DE EQUIPO:</label>
            <div className="relative">
              <select
                name={equipoTipoField}
                value={form[equipoTipoField] || ""}
                onChange={handleFieldChange}
                className={`bg-black border-2 ${formErrors[equipoTipoField] ? 'border-red-600' : 'border-green-700'} text-white px-1 sm:px-2 py-1 w-full text-xs sm:text-sm`}
              >
                <option value="">Seleccione tipo</option>
                <option value="Desktop">Desktop</option>
                <option value="Laptop">Laptop</option>
                <option value="Tablet">Tablet</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Consola">Consola</option>
              </select>
              {formErrors[equipoTipoField] && (
                <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="pointer-events-none absolute -top-16 right-0 w-48 bg-red-900 border-l-2 border-red-500 text-xs text-white p-2 rounded shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all z-50">
                    {formErrors[equipoTipoField]}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}