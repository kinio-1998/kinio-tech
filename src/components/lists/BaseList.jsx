import { useState } from 'react';

export default function BaseList({
  title,
  data = [],
  loading = false,
  columns = [],
  searchFields = [],
  filters = [],
  onRowClick = null,
  onAdd = null,
  onEdit = null,
  onDelete = null,
  emptyMessage = "No hay datos disponibles",
  searchPlaceholder = "Buscar...",
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  // Función auxiliar para obtener valores anidados
  const getNestedValue = (obj, path) => {
    if (!obj || !path) return '';
    return path.split('.').reduce((current, key) => current?.[key], obj) || '';
  };

  // Filtrar datos basado en búsqueda
  const filteredData = data.filter(item => {
    // Filtro de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchFields.some(field => {
        const value = getNestedValue(item, field);
        return value && value.toString().toLowerCase().includes(searchLower);
      });
      if (!matchesSearch) return false;
    }

    // Filtros adicionales
    for (const [filterKey, filterValue] of Object.entries(activeFilters)) {
      if (filterValue && getNestedValue(item, filterKey) !== filterValue) {
        return false;
      }
    }

    return true;
  });

  // Ordenar datos
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = getNestedValue(a, sortField);
    const bValue = getNestedValue(b, sortField);

    if (aValue === bValue) return 0;

    const comparison = aValue < bValue ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Manejar ordenamiento
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Manejar filtros
  const handleFilterChange = (filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  return (
    <div className="space-y-3">
      {/* Header con título y botón agregar */}
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-xl font-bold text-green-400">{title}</h3>
          {onAdd && (
            <button
              onClick={onAdd}
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors"
            >
              ➕ Agregar
            </button>
          )}
        </div>
      )}

      {/* Barra de búsqueda y filtros en una sola línea */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        {/* Búsqueda compacta */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border-2 border-green-600 text-white px-3 py-2 rounded text-sm pr-8"
            title={`Buscar por: ${searchFields.join(', ')}`}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-400 text-sm">
            🔍
          </div>
        </div>

        {/* Filtros */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {filters.map((filter, index) => (
              <select
                key={index}
                value={activeFilters[filter.field] || ''}
                onChange={(e) => handleFilterChange(filter.field, e.target.value)}
                className="bg-black border border-green-600 text-white px-3 py-2 rounded text-sm min-w-0"
              >
                <option value="">{filter.label}</option>
                {filter.options.map((option, optIndex) => (
                  <option key={optIndex} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
            {Object.keys(activeFilters).some(key => activeFilters[key]) && (
              <button
                onClick={() => setActiveFilters({})}
                className="text-red-400 hover:text-red-300 text-sm px-2 py-1 whitespace-nowrap"
                title="Limpiar todos los filtros"
              >
                Limpiar
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="border-2 border-green-600 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            <p className="text-gray-400 mt-2">Cargando...</p>
          </div>
        ) : sortedData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-900/30">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className={`px-3 py-2 text-left text-green-400 font-semibold text-sm ${
                        column.sortable ? 'cursor-pointer hover:bg-green-800/30' : ''
                      }`}
                      onClick={column.sortable ? () => handleSort(column.field) : undefined}
                    >
                      <div className="flex items-center gap-1">
                        {column.label}
                        {column.sortable && sortField === column.field && (
                          <span className="text-xs">
                            {sortDirection === 'asc' ? '▲' : '▼'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  {(onEdit || onDelete) && (
                    <th className="px-3 py-2 text-center text-green-400 font-semibold text-sm">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-t border-green-800 hover:bg-green-900/20 transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                  >
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="px-3 py-2 text-white text-sm">
                        {column.render 
                          ? column.render(getNestedValue(item, column.field), item)
                          : getNestedValue(item, column.field) || '-'
                        }
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-3 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          {onEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(item);
                              }}
                              className="text-blue-400 hover:text-blue-300 text-sm px-2 py-1 rounded"
                            >
                              ✏️
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(item);
                              }}
                              className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            {searchTerm || Object.keys(activeFilters).some(key => activeFilters[key]) 
              ? 'No se encontraron resultados con los filtros aplicados'
              : emptyMessage
            }
          </div>
        )}
      </div>

      {/* Info de resultados */}
      {!loading && data.length > 0 && (
        <div className="text-sm text-gray-400 text-center">
          Mostrando {sortedData.length} de {data.length} resultados
        </div>
      )}
    </div>
  );
}