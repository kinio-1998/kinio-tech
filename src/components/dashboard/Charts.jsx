import { useState, useEffect } from 'react';
import { ESTADOS_REPARACION, ESTADOS_LABELS, ESTADOS_COLORS } from '../../utils/constants';

export default function Charts({ chartData, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-black border-2 border-green-600 rounded-lg p-6">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="h-64 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="bg-black border-2 border-green-600 rounded-lg p-6">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="h-64 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  const reparacionesPorEstado = chartData?.reparacionesPorEstado || {};
  const ingresosPorMes = chartData?.ingresosPorMes || [];

  // Datos para gráfica de dona (reparaciones por estado)
  const estadosData = Object.entries(reparacionesPorEstado).map(([estado, cantidad]) => ({
    estado,
    cantidad,
    label: ESTADOS_LABELS[estado] || estado,
    color: ESTADOS_COLORS[estado] || 'bg-gray-600'
  }));

  const totalReparaciones = estadosData.reduce((sum, item) => sum + item.cantidad, 0);

  // Datos para gráfica de barras (ingresos por mes)
  const maxIngreso = Math.max(...ingresosPorMes.map(item => item.total || 0));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Gráfica de Reparaciones por Estado */}
      <div className="bg-black border-2 border-green-600 rounded-lg p-6">
        <h3 className="text-xl font-bold text-green-400 mb-6">Reparaciones por Estado</h3>
        
        {totalReparaciones > 0 ? (
          <>
            {/* Gráfica de dona simple */}
            <div className="flex justify-center mb-6">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full bg-gray-800"></div>
                <div className="absolute inset-4 rounded-full bg-black"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{totalReparaciones}</div>
                    <div className="text-sm text-gray-400">Total</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Leyenda */}
            <div className="space-y-2">
              {estadosData.map((item, index) => {
                const percentage = totalReparaciones > 0 ? ((item.cantidad / totalReparaciones) * 100).toFixed(1) : 0;
                return (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${item.color}`}></div>
                      <span className="text-white">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-semibold">{item.cantidad}</span>
                      <span className="text-gray-400 ml-2">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            No hay datos de reparaciones
          </div>
        )}
      </div>

      {/* Gráfica de Ingresos por Mes */}
      <div className="bg-black border-2 border-green-600 rounded-lg p-6">
        <h3 className="text-xl font-bold text-green-400 mb-6">Ingresos por Mes</h3>
        
        {ingresosPorMes.length > 0 ? (
          <div className="space-y-4">
            {ingresosPorMes.map((item, index) => {
              const percentage = maxIngreso > 0 ? (item.total / maxIngreso) * 100 : 0;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm">{item.mes}</span>
                    <span className="text-green-400 font-semibold">
                      ${item.total?.toLocaleString('es-MX') || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            No hay datos de ingresos
          </div>
        )}
      </div>
    </div>
  );
}