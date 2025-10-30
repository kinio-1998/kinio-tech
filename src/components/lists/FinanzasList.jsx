import ModalWrapper from "../modals/ModalWrapper";

export default function FinanzasList({ onClose, noOverlay }) {
  return (
    <ModalWrapper title="FINANZAS" onClose={onClose} noOverlay={noOverlay}>
      <div className="h-full overflow-auto custom-scroll">
        <div className="text-center text-white p-4 sm:p-8">
          <h3 className="text-lg sm:text-xl mb-2 sm:mb-4">Control Financiero</h3>
          <p className="text-gray-400 text-sm sm:text-base">Próximamente: Gestión de ingresos y gastos</p>
          <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-green-400">
            ✓ Registro de transacciones<br/>
            ✓ Cálculo de IVA<br/>
            ✓ Reportes financieros<br/>
            ✓ Control de métodos de pago
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}