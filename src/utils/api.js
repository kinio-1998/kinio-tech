// Configuración base para las APIs
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://kiniotech-backend.onrender.com/api';

/**
 * Función utilitaria para hacer requests a la API
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error(`API Error en ${endpoint}:`, error);
    return { success: false, error: error.message };
  }
};

// API específicas para cada módulo
export const API = {
  // Dashboard
  dashboard: {
    getMetrics: () => apiRequest('/dashboard/metrics'),
    getChartData: (period = 'month') => apiRequest(`/dashboard/charts?period=${period}`),
    getTaxes: (month, year) => apiRequest(`/dashboard/taxes?month=${month}&year=${year}`),
  },

  // Reparaciones
  reparaciones: {
    create: (data) => apiRequest('/reparaciones', { method: 'POST', body: JSON.stringify(data) }),
    getAll: (filters = {}) => {
      const query = new URLSearchParams(filters).toString();
      return apiRequest(`/reparaciones?${query}`);
    },
    getByFolio: (folio) => apiRequest(`/reparaciones/${folio}`),
    updateStatus: (folio, status) => apiRequest(`/reparaciones/${folio}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado: status })
    }),
    update: (folio, data) => apiRequest(`/reparaciones/${folio}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  },

  // Clientes
  clientes: {
    getAll: (search = '') => apiRequest(`/clientes?search=${search}`),
    create: (data) => apiRequest('/clientes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getHistory: (id) => apiRequest(`/clientes/${id}/historial`),
  },

  // Servicios
  servicios: {
    getAll: () => apiRequest('/servicios'),
    create: (data) => apiRequest('/servicios', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/servicios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/servicios/${id}`, { method: 'DELETE' }),
  },

  // Finanzas
  finanzas: {
    getAll: (filters = {}) => {
      const query = new URLSearchParams(filters).toString();
      return apiRequest(`/finanzas?${query}`);
    },
    create: (data) => apiRequest('/finanzas', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/finanzas/${id}`, { method: 'DELETE' }),
  },

  // Cotizaciones
  cotizaciones: {
    generate: (data) => apiRequest('/cotizaciones/generar', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Marketing
  marketing: {
    publish: (data) => apiRequest('/marketing/publicar', { method: 'POST', body: JSON.stringify(data) }),
  },
};