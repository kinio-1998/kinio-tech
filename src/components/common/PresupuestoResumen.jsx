export default function PresupuestoResumen({ 
  serviciosSeleccionados,
  serviciosDisponibles,
  componentesItems = [],
  mostrarComponentes = false
}) {
  // Calcular total de servicios seleccionados
  const calcularTotalServicios = () => {
    return serviciosSeleccionados.reduce((total, servicioId) => {
      const servicio = serviciosDisponibles.find(s => s.id === servicioId);
      return total + (servicio ? servicio.precio : 0);
    }, 0);
  };

  // Calcular total de componentes
  const calcularTotalComponentes = () => {
    if (!mostrarComponentes || !componentesItems.length) return 0;
    
    return componentesItems.reduce((total, item) => {
      const cantidad = parseFloat(item.cantidad || 0);
      const precio = parseFloat(item.precio || 0);
      return total + (cantidad * precio);
    }, 0);
  };

  // Calcular precio total general
  const calcularPrecioTotal = () => {
    return calcularTotalServicios() + calcularTotalComponentes();
  };

  // Lógica de cálculo de anticipo centralizada
  const calcularAnticipo = () => {
    // IDs de servicios que requieren componentes
    const serviciosConComponentes = [1, 6, 42, 48]; // Armado de PC, Actualización de Componentes, Actualización de Hardware, Actualización de RAM
    const tieneServicioConComponentes = serviciosSeleccionados.some(id => serviciosConComponentes.includes(id));
    
    const totalComponentes = calcularTotalComponentes();
    const totalGeneral = calcularPrecioTotal();

    if (tieneServicioConComponentes) {
      // Si hay servicios que requieren componentes: 100% del total de componentes únicamente
      return totalComponentes;
    } else {
      // Si no hay servicios con componentes: 70% del total (servicios + componentes)
      return totalGeneral * 0.7;
    }
  };
  return (
    <div className="mt-2 sm:mt-3 pt-2 border-t border-green-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-green-300">Servicios:</span>
            <span className="text-white">${calcularTotalServicios().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-300">Componentes:</span>
            <span className="text-white">${calcularTotalComponentes().toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t border-green-800 pt-1">
            <span className="text-green-300">PRECIO TOTAL:</span>
            <span className="text-green-400">${calcularPrecioTotal().toFixed(2)}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between font-bold">
            <span className="text-green-300">ANTICIPO SUGERIDO:</span>
            <span className="text-yellow-400">${calcularAnticipo().toFixed(2)}</span>
          </div>
          {(() => {
            const serviciosConComponentes = [1, 6, 42, 48];
            const tieneServicioConComponentes = serviciosSeleccionados.some(id => serviciosConComponentes.includes(id));
            return tieneServicioConComponentes ? (
              <p className="text-xs text-gray-400">100% de componentes</p>
            ) : (
              <p className="text-xs text-gray-400">70% del total</p>
            );
          })()}
        </div>
      </div>
    </div>
  );
}