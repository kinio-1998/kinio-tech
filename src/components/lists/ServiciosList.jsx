import ModalWrapper from "../modals/ModalWrapper";

export default function ServiciosList({ onClose, noOverlay }) {
  return (
    <ModalWrapper title="SERVICIOS & PRECIOS" onClose={onClose} noOverlay={noOverlay}>
      <div className="h-full overflow-auto custom-scroll">
        <div className="text-center text-white p-4 sm:p-8">
          <h3 className="text-lg sm:text-xl mb-2 sm:mb-4">Gestión de Servicios</h3>
          <p className="text-gray-400 text-sm sm:text-base">Próximamente: CRUD completo de servicios</p>
          <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-green-400">
            ✓ Lista de servicios<br/>
            ✓ Crear y editar servicios<br/>
            ✓ Gestión de precios<br/>
            ✓ Categorías de servicio
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}