import ModalWrapper from "../modals/ModalWrapper";

export default function ClientesList({ onClose, noOverlay }) {
  return (
    <ModalWrapper title="CLIENTES" onClose={onClose} noOverlay={noOverlay}>
      <div className="text-center text-white p-4 sm:p-8">
        <h3 className="text-lg sm:text-xl mb-2 sm:mb-4">Gestión de Clientes</h3>
        <p className="text-gray-400 text-sm sm:text-base">Próximamente: Base completa de clientes</p>
        <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-green-400">
          ✓ Lista de clientes<br/>
          ✓ Historial de reparaciones<br/>
          ✓ Datos de contacto<br/>
          ✓ Búsqueda y filtros
        </div>
      </div>
    </ModalWrapper>
  );
}