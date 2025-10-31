import { useState, useEffect } from 'react';
import ModalWrapper from '../modals/ModalWrapper';
import MetricCards from './MetricCards';
import Charts from './Charts';
import { API } from '../../utils/api';
import { formatCurrency, calculateIVA } from '../../utils/constants';

export default function Dashboard({ onClose, noOverlay }) {
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [urgentRepairs, setUrgentRepairs] = useState([]);
  const [taxes, setTaxes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadTaxData();
  }, [selectedMonth, selectedYear]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsRes, chartRes, urgentRes] = await Promise.all([
        API.dashboard.getMetrics(),
        API.dashboard.getChartData(),
        API.reparaciones.getAll({ urgente: true, limit: 5 })
      ]);

      if (metricsRes.success) setMetrics(metricsRes.data);
      if (chartRes.success) setChartData(chartRes.data);
      if (urgentRes.success) setUrgentRepairs(urgentRes.data?.reparaciones || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTaxData = async () => {
    try {
      const taxRes = await API.dashboard.getTaxes(selectedMonth, selectedYear);
      if (taxRes.success) setTaxes(taxRes.data);
    } catch (error) {
      console.error('Error loading tax data:', error);
    }
  };

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <ModalWrapper title="DASHBOARD" onClose={onClose} noOverlay={noOverlay}>
      <div className="space-y-6">
        {/* Métricas principales */}
        <MetricCards metrics={metrics} loading={loading} />

        {/* Gráficas */}
        <Charts chartData={chartData} loading={loading} />

        {/* Sección de Impuestos SAT */}
        <div className="bg-black border-2 border-green-600 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-xl font-bold text-green-400 mb-4 sm:mb-0">
              Cálculo de Impuestos SAT
            </h3>
            <div className="flex gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-black border border-green-600 text-white px-3 py-1 rounded text-sm"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-black border border-green-600 text-white px-3 py-1 rounded text-sm"
              >
                {[2023, 2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {taxes ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-900/30 border border-green-600 rounded p-4">
                <h4 className="text-green-400 text-sm font-semibold mb-2">Ingresos Totales</h4>
                <p className="text-white text-lg font-bold">
                  {formatCurrency(taxes.ingresosBrutos || 0)}
                </p>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-600 rounded p-4">
                <h4 className="text-yellow-400 text-sm font-semibold mb-2">IVA a Pagar</h4>
                <p className="text-white text-lg font-bold">
                  {formatCurrency(taxes.ivaPagar || 0)}
                </p>
              </div>
              <div className="bg-blue-900/30 border border-blue-600 rounded p-4">
                <h4 className="text-blue-400 text-sm font-semibold mb-2">Utilidad Neta</h4>
                <p className="text-white text-lg font-bold">
                  {formatCurrency(taxes.utilidadNeta || 0)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              Cargando datos fiscales...
            </div>
          )}
        </div>

        {/* Lista de reparaciones urgentes */}
        <div className="bg-black border-2 border-green-600 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-400 mb-4">Reparaciones Urgentes</h3>
          
          {urgentRepairs.length > 0 ? (
            <div className="space-y-2">
              {urgentRepairs.map((repair, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-red-900/30 border border-red-600 rounded"
                >
                  <div>
                    <div className="text-white font-semibold">
                      Folio: {repair.folio}
                    </div>
                    <div className="text-gray-300 text-sm">
                      {repair.cliente_nombre} - {repair.equipo_tipo}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400 text-sm font-semibold">
                      {repair.dias_pendiente} días
                    </div>
                    <div className="text-gray-400 text-xs">
                      {repair.estado}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              🎉 No hay reparaciones urgentes
            </div>
          )}
        </div>

        {/* Botón de actualizar */}
        <div className="flex justify-center">
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-colors disabled:opacity-50"
          >
            {loading ? 'Actualizando...' : '🔄 Actualizar Datos'}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}