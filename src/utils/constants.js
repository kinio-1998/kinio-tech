// Constantes del sistema
export const ESTADOS_REPARACION = {
  RECIBIDO: 'recibido',
  DIAGNOSTICADO: 'diagnosticado',
  EN_REPARACION: 'en_reparacion',
  LISTO: 'listo',
  ENTREGADO: 'entregado',
  CANCELADO: 'cancelado'
};

export const ESTADOS_LABELS = {
  [ESTADOS_REPARACION.RECIBIDO]: 'Recibido',
  [ESTADOS_REPARACION.DIAGNOSTICADO]: 'Diagnosticado',
  [ESTADOS_REPARACION.EN_REPARACION]: 'En Reparación',
  [ESTADOS_REPARACION.LISTO]: 'Listo',
  [ESTADOS_REPARACION.ENTREGADO]: 'Entregado',
  [ESTADOS_REPARACION.CANCELADO]: 'Cancelado'
};

export const ESTADOS_COLORS = {
  [ESTADOS_REPARACION.RECIBIDO]: 'bg-blue-600',
  [ESTADOS_REPARACION.DIAGNOSTICADO]: 'bg-yellow-600',
  [ESTADOS_REPARACION.EN_REPARACION]: 'bg-orange-600',
  [ESTADOS_REPARACION.LISTO]: 'bg-green-600',
  [ESTADOS_REPARACION.ENTREGADO]: 'bg-gray-600',
  [ESTADOS_REPARACION.CANCELADO]: 'bg-red-600'
};

export const TIPOS_TRANSACCION = {
  INGRESO: 'ingreso',
  GASTO: 'gasto'
};

export const METODOS_PAGO = [
  'efectivo',
  'tarjeta',
  'transferencia',
  'cheque',
  'paypal',
  'otro'
];

export const CATEGORIAS_SERVICIO = [
  'diagnóstico',
  'reparación',
  'mantenimiento',
  'actualización',
  'instalación',
  'consultoría',
  'otro'
];

export const REDES_SOCIALES = [
  'facebook',
  'instagram',
  'twitter',
  'linkedin',
  'whatsapp',
  'telegram'
];

export const IVA_RATE = 0.16; // 16% IVA México

// Funciones utilitarias
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const calculateIVA = (amount) => {
  return amount * IVA_RATE;
};

export const calculateTotal = (amount) => {
  return amount + calculateIVA(amount);
};

export const generateFolioDisplay = (folio) => {
  return folio ? folio.toUpperCase() : '';
};