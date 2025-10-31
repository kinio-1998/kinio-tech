export default function ServicioSelector({ 
  equipoTipo,
  serviciosDisponibles,
  serviciosSeleccionados,
  onServicioChange,
  formErrors
}) {
  if (!equipoTipo || serviciosDisponibles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <label className="text-green-300 text-sm sm:text-base font-semibold">
        SERVICIOS DISPONIBLES:
        {formErrors.servicios_seleccionados && (
          <span className="text-red-400 text-xs ml-2">
            {formErrors.servicios_seleccionados}
          </span>
        )}
      </label>
      <div className="bg-black border-2 border-green-700 rounded p-1">
        <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-8 gap-1">
          {serviciosDisponibles.map((servicio) => (
            <button
              key={servicio.id}
              type="button"
              onClick={() => onServicioChange(servicio.id)}
              className={`flex flex-col p-1.5 rounded border text-center transition-all ${
                serviciosSeleccionados.includes(servicio.id)
                  ? 'border-green-500 bg-green-900/60 shadow-md'
                  : 'border-green-800 hover:border-green-600 hover:bg-green-900/20'
              }`}
            >
              <span className={`font-mono text-xs font-bold mb-0.5 ${
                serviciosSeleccionados.includes(servicio.id)
                  ? 'text-green-300'
                  : 'text-green-500'
              }`}>
                ${servicio.precio}
              </span>
              <span className={`text-xs leading-tight line-clamp-2 ${
                serviciosSeleccionados.includes(servicio.id)
                  ? 'text-white font-medium'
                  : 'text-gray-300'
              }`}>
                {servicio.nombre}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
