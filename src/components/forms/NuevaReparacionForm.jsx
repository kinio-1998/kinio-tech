import ModalWrapper from "../modals/ModalWrapper";

export default function NuevaReparacionForm({ onClose }) {
  return (
    <ModalWrapper title="NUEVA REPARACIÓN" onClose={onClose}>
      <div className="text-center text-white p-8">
        <h3 className="text-xl mb-4">Registrar Nueva Reparación</h3>
        <p className="text-gray-400">Próximamente: Formulario unificado</p>
        <div className="mt-4 text-sm text-green-400">
          ✓ Datos del cliente<br/>
          ✓ Información del equipo<br/>
          ✓ Problema reportado<br/>
          ✓ Generación automática de folio<br/>
          ✓ Subida de imágenes
        </div>
      </div>
    </ModalWrapper>
  );
}