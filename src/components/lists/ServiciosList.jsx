import ModalWrapper from "../modals/ModalWrapper";

export default function ServiciosList({ onClose }) {
  return (
    <ModalWrapper title="SERVICIOS & PRECIOS" onClose={onClose}>
      <div className="text-center text-white p-8">
        <h3 className="text-xl mb-4">Gestión de Servicios</h3>
        <p className="text-gray-400">Próximamente: CRUD completo de servicios</p>
        <div className="mt-4 text-sm text-green-400">
          ✓ Lista de servicios<br/>
          ✓ Crear y editar servicios<br/>
          ✓ Gestión de precios<br/>
          ✓ Categorías de servicio
        </div>
      </div>
    </ModalWrapper>
  );
}