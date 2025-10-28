import ModalWrapper from "../modals/ModalWrapper";

export default function FinanzasList({ onClose }) {
  return (
    <ModalWrapper title="FINANZAS" onClose={onClose}>
      <div className="text-center text-white p-8">
        <h3 className="text-xl mb-4">Control Financiero</h3>
        <p className="text-gray-400">Próximamente: Gestión de ingresos y gastos</p>
        <div className="mt-4 text-sm text-green-400">
          ✓ Registro de transacciones<br/>
          ✓ Cálculo de IVA<br/>
          ✓ Reportes financieros<br/>
          ✓ Control de métodos de pago
        </div>
      </div>
    </ModalWrapper>
  );
}