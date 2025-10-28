import { useState, useEffect } from 'react';
import ModalWrapper from "../modals/ModalWrapper";
import BaseList from './BaseList';
import { API } from '../../utils/api';
import { ESTADOS_REPARACION, ESTADOS_LABELS, ESTADOS_COLORS, formatDate, formatDateTime } from '../../utils/constants';

export default function ReparacionesList({ onClose }) {
  const [reparaciones, setReparaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReparacion, setSelectedReparacion] = useState(null);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [showEntregarModal, setShowEntregarModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para modal de entrega
  const [entregarData, setEntregarData] = useState({
    folio: '',
    contrasena: '',
    resultado: ''
  });

  useEffect(() => {
    loadReparaciones();
  }, []);

  const loadReparaciones = async () => {
    setLoading(true);
    try {
      const response = await API.reparaciones.getAll();
      if (response.success) {
        setReparaciones(response.data.reparaciones || []);
      } else {
        // Si no hay respuesta exitosa, cargar datos de prueba
        loadTestData();
      }
    } catch (error) {
      console.error('Error loading reparaciones:', error);
      // Cargar datos de prueba para desarrollo
      loadTestData();
    } finally {
      setLoading(false);
    }
  };

  const loadTestData = () => {
    setReparaciones([
      {
        id: 1,
        folio: 'REP001',
        cliente_nombre: 'Juan Pérez',
        cliente_telefono: '1234567890',
        equipo_tipo: 'Laptop',
        equipo_marca: 'HP',
        problema: 'No enciende',
        estado: ESTADOS_REPARACION.RECIBIDO,
        fecha_recepcion: new Date().toISOString(),
        fecha_estimada: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        tecnico_asignado: 'Carlos Tech',
        precio_estimado: 800,
        notas_tecnicas: 'Revisar fuente de poder'
      },
      {
        id: 2,
        folio: 'REP002',
        cliente_nombre: 'Ana García',
        cliente_telefono: '0987654321',
        equipo_tipo: 'PC Escritorio',
        equipo_marca: 'Dell',
        problema: 'Lento, posible virus',
        estado: ESTADOS_REPARACION.DIAGNOSTICADO,
        fecha_recepcion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        fecha_estimada: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        tecnico_asignado: 'Carlos Tech',
        precio_estimado: 300,
        notas_tecnicas: 'Formateo completo requerido'
      },
      {
        id: 3,
        folio: 'REP003',
        cliente_nombre: 'Luis Martínez',
        cliente_telefono: '1122334455',
        equipo_tipo: 'Laptop Gaming',
        equipo_marca: 'ASUS',
        problema: 'Sobrecalentamiento',
        estado: ESTADOS_REPARACION.LISTO,
        fecha_recepcion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        fecha_estimada: new Date().toISOString(),
        tecnico_asignado: 'Carlos Tech',
        precio_estimado: 450,
        notas_tecnicas: 'Limpieza y cambio de pasta térmica completado'
      }
    ]);
  };

  // Función unificada de búsqueda que reemplaza la consulta rápida
  const handleSearch = (term) => {
    setSearchTerm(term);
    
    // Si el término parece ser un folio específico (formato típico), mostrar resultado específico
    if (term.trim()) {
      const reparacion = reparaciones.find(r => 
        r.folio.toLowerCase() === term.toLowerCase()
      );
      
      if (reparacion) {
        // Auto-seleccionar la reparación encontrada para mostrar detalles rápidos
        setSelectedReparacion(reparacion);
      }
    }
  };

  // Función para cambiar estado de reparación
  const cambiarEstado = async (folio, nuevoEstado) => {
    try {
      const response = await API.reparaciones.updateStatus(folio, nuevoEstado);
      if (response.success) {
        setReparaciones(prev => 
          prev.map(r => r.folio === folio ? { ...r, estado: nuevoEstado } : r)
        );
      }
    } catch (error) {
      console.error('Error changing status:', error);
      // Simulación local para desarrollo
      setReparaciones(prev => 
        prev.map(r => r.folio === folio ? { ...r, estado: nuevoEstado } : r)
      );
    }
  };

  // Función para entregar equipo
  const handleEntregar = () => {
    const { folio, contrasena } = entregarData;
    
    if (!folio || !contrasena) {
      setEntregarData(prev => ({ 
        ...prev, 
        resultado: 'Ingrese folio y contraseña.' 
      }));
      return;
    }

    const reparacion = reparaciones.find(r => r.folio === folio);
    if (!reparacion) {
      setEntregarData(prev => ({ 
        ...prev, 
        resultado: 'Folio no encontrado.' 
      }));
      return;
    }

    if (reparacion.estado !== ESTADOS_REPARACION.LISTO) {
      setEntregarData(prev => ({ 
        ...prev, 
        resultado: 'El equipo no está listo para entrega.' 
      }));
      return;
    }

    // Aquí iría la validación de contraseña con el backend
    cambiarEstado(folio, ESTADOS_REPARACION.ENTREGADO);
    setEntregarData(prev => ({ 
      ...prev, 
      resultado: `Folio ${folio} entregado exitosamente.` 
    }));
  };

  // Configuración de columnas para BaseList
  const columns = [
    {
      field: 'folio',
      label: 'Folio',
      sortable: true,
      render: (value) => <span className="font-bold text-green-400 text-sm">{value}</span>
    },
    {
      field: 'cliente_nombre',
      label: 'Cliente',
      sortable: true,
      render: (value) => <span className="text-sm">{value}</span>
    },
    {
      field: 'equipo_tipo',
      label: 'Equipo',
      sortable: true,
      render: (value, item) => <span className="text-sm">{`${value} ${item.equipo_marca || ''}`}</span>
    },
    {
      field: 'problema',
      label: 'Problema',
      render: (value) => (
        <span className="text-xs" title={value}>
          {value.length > 25 ? `${value.substring(0, 25)}...` : value}
        </span>
      )
    },
    {
      field: 'estado',
      label: 'Estado',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${ESTADOS_COLORS[value]}`}>
          {ESTADOS_LABELS[value]}
        </span>
      )
    },
    {
      field: 'acciones',
      label: 'Acciones',
      render: (value, item) => (
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedReparacion(item);
              setShowDetalleModal(true);
            }}
            className="bg-blue-700 hover:bg-blue-600 text-white px-1 py-1 rounded text-xs"
            title="Ver detalles y cambiar estado"
          >
            ✏️
          </button>
          {item.estado === ESTADOS_REPARACION.LISTO && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEntregarData({ folio: item.folio, contrasena: '', resultado: '' });
                setShowEntregarModal(true);
              }}
              className="bg-green-700 hover:bg-green-600 text-white px-1 py-1 rounded text-xs"
              title="Entregar equipo"
            >
              📦
            </button>
          )}
        </div>
      )
    }
  ];

  // Filtros disponibles
  const filters = [
    {
      field: 'estado',
      label: 'Filtrar por Estado',
      options: Object.entries(ESTADOS_LABELS).map(([value, label]) => ({
        value,
        label
      }))
    }
  ];

  const handleRowClick = (reparacion) => {
    setSelectedReparacion(reparacion);
    setShowDetalleModal(true);
  };

  return (
    <ModalWrapper title="GESTIÓN DE REPARACIONES" onClose={onClose}>
      <div className="space-y-4 max-h-96 overflow-y-auto custom-scroll">

        {/* Lista principal de reparaciones */}
        <BaseList
          title=""
          data={reparaciones}
          loading={loading}
          columns={columns}
          searchFields={['folio', 'cliente_nombre', 'equipo_tipo', 'problema']}
          filters={filters}
          onRowClick={handleRowClick}
          searchPlaceholder="🔍 Buscar por folio, cliente, equipo o problema..."
          emptyMessage="No hay reparaciones registradas"
        />
      </div>

      {/* Modal de detalle de reparación */}
      {showDetalleModal && selectedReparacion && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border-2 border-green-600 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-green-400">
                Detalle: {selectedReparacion.folio}
              </h3>
              <button
                onClick={() => setShowDetalleModal(false)}
                className="text-red-400 hover:text-red-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
              <div>
                <h4 className="text-green-400 font-semibold mb-2">Información del Cliente</h4>
                <p><strong>Nombre:</strong> {selectedReparacion.cliente_nombre}</p>
                <p><strong>Teléfono:</strong> {selectedReparacion.cliente_telefono}</p>
              </div>

              <div>
                <h4 className="text-green-400 font-semibold mb-2">Información del Equipo</h4>
                <p><strong>Tipo:</strong> {selectedReparacion.equipo_tipo}</p>
                <p><strong>Marca:</strong> {selectedReparacion.equipo_marca}</p>
                <p><strong>Problema:</strong> {selectedReparacion.problema}</p>
              </div>

              <div>
                <h4 className="text-green-400 font-semibold mb-2">Estado y Fechas</h4>
                <p><strong>Estado:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${ESTADOS_COLORS[selectedReparacion.estado]}`}>
                    {ESTADOS_LABELS[selectedReparacion.estado]}
                  </span>
                </p>
                <p><strong>Recepción:</strong> {formatDateTime(selectedReparacion.fecha_recepcion)}</p>
                <p><strong>Estimada:</strong> {formatDateTime(selectedReparacion.fecha_estimada)}</p>
              </div>

              <div>
                <h4 className="text-green-400 font-semibold mb-2">Información Técnica</h4>
                <p><strong>Técnico:</strong> {selectedReparacion.tecnico_asignado}</p>
                <p><strong>Precio Estimado:</strong> ${selectedReparacion.precio_estimado}</p>
                <p><strong>Notas:</strong> {selectedReparacion.notas_tecnicas}</p>
              </div>
            </div>

            {/* Botones de cambio de estado */}
            <div className="mt-6">
              <h4 className="text-green-400 font-semibold mb-2">Cambiar Estado</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ESTADOS_LABELS).map(([estado, label]) => (
                  <button
                    key={estado}
                    onClick={() => cambiarEstado(selectedReparacion.folio, estado)}
                    disabled={selectedReparacion.estado === estado}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      selectedReparacion.estado === estado
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-green-700 hover:bg-green-600 text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de entrega */}
      {showEntregarModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border-2 border-green-600 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-green-400">📦 Entregar Equipo</h3>
              <button
                onClick={() => {
                  setShowEntregarModal(false);
                  setEntregarData({ folio: '', contrasena: '', resultado: '' });
                }}
                className="text-red-400 hover:text-red-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-green-300 block mb-2">FOLIO:</label>
                <input
                  type="text"
                  value={entregarData.folio}
                  onChange={(e) => setEntregarData(prev => ({ ...prev, folio: e.target.value }))}
                  className="w-full bg-black border-2 border-green-700 text-white px-3 py-2 rounded"
                  placeholder="Ingrese folio"
                />
              </div>

              <div>
                <label className="text-green-300 block mb-2">CONTRASEÑA DEL CLIENTE:</label>
                <input
                  type="password"
                  value={entregarData.contrasena}
                  onChange={(e) => setEntregarData(prev => ({ ...prev, contrasena: e.target.value }))}
                  className="w-full bg-black border-2 border-green-700 text-white px-3 py-2 rounded"
                  placeholder="Contraseña"
                />
              </div>

              {entregarData.resultado && (
                <div className={`p-3 rounded ${
                  entregarData.resultado.includes('exitosamente') 
                    ? 'text-green-400 border border-green-600' 
                    : 'text-red-400 border border-red-600'
                }`}>
                  {entregarData.resultado}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowEntregarModal(false);
                    setEntregarData({ folio: '', contrasena: '', resultado: '' });
                  }}
                  className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEntregar}
                  className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Entregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}