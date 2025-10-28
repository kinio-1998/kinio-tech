import { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/constants';

export default function MetricCards({ metrics, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-black border-2 border-green-600 rounded-lg p-6 animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-2"></div>
            <div className="h-12 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Reparaciones Activas',
      value: metrics?.reparacionesActivas || 0,
      icon: '🔧',
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/30'
    },
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(metrics?.ingresosMes || 0),
      icon: '💰',
      color: 'text-green-400',
      bgColor: 'bg-green-900/30'
    },
    {
      title: 'Clientes Nuevos',
      value: metrics?.clientesNuevos || 0,
      icon: '👥',
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/30'
    },
    {
      title: 'Equipos Listos',
      value: metrics?.equiposListos || 0,
      icon: '✅',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-black border-2 border-green-600 rounded-lg p-6 hover:border-green-400 transition-colors ${card.bgColor}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`text-3xl ${card.color}`}>
              {card.icon}
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                {card.title}
              </h3>
            </div>
          </div>
          <div className={`text-3xl font-bold ${card.color}`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}