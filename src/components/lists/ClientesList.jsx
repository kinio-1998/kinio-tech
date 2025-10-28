import ModalWrapper from "../modals/ModalWrapper";

export default function ClientesList({ onClose }) {
  return (
    <ModalWrapper title="CLIENTES" onClose={onClose}>
      <div className="text-center text-white p-8">
        <h3 className="text-xl mb-4">Gestión de Clientes</h3>
        <p className="text-gray-400">Próximamente: Base completa de clientes</p>
        <div className="mt-4 text-sm text-green-400">
          ✓ Lista de clientes<br/>
          ✓ Historial de reparaciones<br/>
          ✓ Datos de contacto<br/>
          ✓ Búsqueda y filtros
        </div>
      </div>
    </ModalWrapper>
  );
}