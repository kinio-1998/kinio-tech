import { useState, useEffect } from "react";
import ModalWrapper from "../modals/ModalWrapper";
import ClienteDataForm from "../common/ClienteDataForm";
import PresupuestoResumen from "../common/PresupuestoResumen";
import ServicioSelector from "../common/ServicioSelector";
import ComponentesGrid from "../common/ComponentesGrid";
import { ESTADOS_REPARACION } from "../../utils/constants";

// Simulación de servicios por categoría de equipo desde BD
const SERVICIOS_POR_CATEGORIA = {
  Desktop: [
    { id: 1, nombre: 'Armado De PC', precio: 500 },
    { id: 2, nombre: 'Cambio de Pasta Térmica', precio: 150 },
    { id: 3, nombre: 'Diagnóstico de Hardware', precio: 100 },
    { id: 4, nombre: 'Formateo e Instalación SO', precio: 200 },
    { id: 5, nombre: 'Limpieza Interna', precio: 120 },
    { id: 6, nombre: 'Actualización de Componentes', precio: 80 },
    { id: 7, nombre: 'Recuperación de Datos', precio: 800 },
    { id: 8, nombre: 'Reemplazo de Fuente', precio: 100 },
    { id: 9, nombre: 'Instalación de RAM', precio: 50 },
    { id: 10, nombre: 'Instalación de Disco Duro', precio: 80 },
  ],
  Laptop: [
    { id: 11, nombre: 'Cambio de Pasta Térmica', precio: 200 },
    { id: 12, nombre: 'Diagnóstico de Hardware', precio: 150 },
    { id: 13, nombre: 'Formateo e Instalación SO', precio: 200 },
    { id: 14, nombre: 'Limpieza Interna', precio: 180 },
    { id: 15, nombre: 'Reemplazo de Pantalla', precio: 800 },
    { id: 16, nombre: 'Reemplazo de Teclado', precio: 300 },
    { id: 17, nombre: 'Recuperación de Datos', precio: 800 },
    { id: 18, nombre: 'Reemplazo de Batería', precio: 400 },
    { id: 19, nombre: 'Reparación de Bisagras', precio: 250 },
    { id: 20, nombre: 'Instalación de RAM', precio: 80 },
  ],
  Celular: [
    { id: 21, nombre: 'Reemplazo de Pantalla', precio: 600 },
    { id: 22, nombre: 'Cambio de Batería', precio: 300 },
    { id: 23, nombre: 'Reparación de Puerto de Carga', precio: 200 },
    { id: 24, nombre: 'Liberación de Equipo', precio: 150 },
    { id: 25, nombre: 'Formateo y Configuración', precio: 100 },
    { id: 26, nombre: 'Recuperación de Datos', precio: 400 },
    { id: 27, nombre: 'Reparación de Botones', precio: 180 },
    { id: 28, nombre: 'Cambio de Cámara', precio: 350 },
    { id: 29, nombre: 'Reparación de Audio', precio: 250 },
  ],
  Tablet: [
    { id: 30, nombre: 'Reemplazo de Pantalla', precio: 500 },
    { id: 31, nombre: 'Cambio de Batería', precio: 250 },
    { id: 32, nombre: 'Reparación de Puerto de Carga', precio: 180 },
    { id: 33, nombre: 'Formateo y Configuración', precio: 120 },
    { id: 34, nombre: 'Recuperación de Datos', precio: 400 },
    { id: 35, nombre: 'Reparación de Botones', precio: 150 },
    { id: 36, nombre: 'Cambio de Cristal Templado', precio: 80 },
  ],
  'All-in-One': [
    { id: 37, nombre: 'Diagnóstico de Hardware', precio: 120 },
    { id: 38, nombre: 'Formateo e Instalación SO', precio: 200 },
    { id: 39, nombre: 'Limpieza Interna', precio: 150 },
    { id: 40, nombre: 'Reemplazo de Pantalla', precio: 1200 },
    { id: 41, nombre: 'Recuperación de Datos', precio: 800 },
    { id: 42, nombre: 'Actualización de RAM', precio: 100 },
  ],
  Servidor: [
    { id: 43, nombre: 'Diagnóstico de Sistema', precio: 300 },
    { id: 44, nombre: 'Configuración de RAID', precio: 500 },
    { id: 45, nombre: 'Instalación de Sistema Operativo', precio: 400 },
    { id: 46, nombre: 'Recuperación de Datos', precio: 1200 },
    { id: 47, nombre: 'Mantenimiento Preventivo', precio: 250 },
    { id: 48, nombre: 'Actualización de Hardware', precio: 200 },
  ]
};

// Simulación de clientes desde BD
const CLIENTES_SIMULADOS = [
  { id: 1, nombre: 'Juan Pérez', correo: 'juan@email.com', telefono: '5551234567' },
  { id: 2, nombre: 'María García', correo: 'maria@email.com', telefono: '5559876543' },
  { id: 3, nombre: 'Carlos López', correo: 'carlos@email.com', telefono: '5555555555' },
  { id: 4, nombre: 'Ana Martínez', correo: 'ana@email.com', telefono: '5554443332' },
  { id: 5, nombre: 'Luis Rodríguez', correo: 'luis@email.com', telefono: '5556667778' },
];

// Simulación de componentes para armado de PC desde BD
const COMPONENTES_SIMULADOS = {
  Procesador: [
    { id: 1, nombre: 'Intel Core i5-12400F', precio: 4500 },
    { id: 2, nombre: 'AMD Ryzen 5 5600X', precio: 5200 },
    { id: 3, nombre: 'Intel Core i7-12700K', precio: 7800 },
    { id: 4, nombre: 'AMD Ryzen 7 5700X', precio: 6900 },
  ],
  RAM: [
    { id: 5, nombre: 'Corsair Vengeance 16GB DDR4', precio: 1800 },
    { id: 6, nombre: 'Kingston Fury 32GB DDR4', precio: 3200 },
    { id: 7, nombre: 'G.Skill Trident 16GB DDR5', precio: 2400 },
    { id: 8, nombre: 'Crucial Ballistix 32GB DDR4', precio: 2900 },
  ],
  'Tarjeta Madre': [
    { id: 9, nombre: 'ASUS ROG STRIX B550-F', precio: 3500 },
    { id: 10, nombre: 'MSI MAG B460M', precio: 2200 },
    { id: 11, nombre: 'Gigabyte B550 AORUS', precio: 4100 },
    { id: 12, nombre: 'ASRock B450M PRO4', precio: 1800 },
  ],
  'Disco Duro': [
    { id: 13, nombre: 'Samsung 970 EVO 1TB NVMe', precio: 2800 },
    { id: 14, nombre: 'WD Blue 500GB SSD', precio: 1200 },
    { id: 15, nombre: 'Seagate Barracuda 2TB HDD', precio: 1600 },
    { id: 16, nombre: 'Kingston NV2 1TB NVMe', precio: 2200 },
  ],
  'Tarjeta de Video': [
    { id: 17, nombre: 'NVIDIA RTX 4060', precio: 8500 },
    { id: 18, nombre: 'AMD RX 6600 XT', precio: 7200 },
    { id: 19, nombre: 'NVIDIA RTX 4070', precio: 12500 },
    { id: 20, nombre: 'AMD RX 7600', precio: 6800 },
  ],
  Fuente: [
    { id: 21, nombre: 'Corsair CV650 650W', precio: 1800 },
    { id: 22, nombre: 'EVGA 600W Bronze', precio: 1400 },
    { id: 23, nombre: 'Seasonic Focus 750W Gold', precio: 2800 },
    { id: 24, nombre: 'Thermaltake Smart 500W', precio: 1100 },
  ],
  Gabinete: [
    { id: 25, nombre: 'Corsair 4000D Airflow', precio: 2400 },
    { id: 26, nombre: 'NZXT H510', precio: 1900 },
    { id: 27, nombre: 'Fractal Design Core 1000', precio: 1200 },
    { id: 28, nombre: 'Cooler Master MasterBox', precio: 1600 },
  ],
};

export default function NuevaReparacionForm({ onClose, noOverlay }) {
  const [form, setForm] = useState({
    cliente_nombre: "",
    cliente_correo: "",
    cliente_telefono: "",
    equipo_tipo: "",
    equipo_marca: "",
    equipo_modelo: "",
    equipo_serie: "",
    equipo_contrasena: "",
    equipo_accesorios: "",
    problema: "",
    servicios_seleccionados: [],
    observaciones: "",
    precio_estimado: "",
    anticipo: "",
    componentes: []
  });

  const [items, setItems] = useState([
    { id: Date.now(), concepto: "", cantidad: 1, precio: "" },
  ]);
  const [itemErrors, setItemErrors] = useState({});

  const [clienteBusqueda, setClienteBusqueda] = useState("");
  const [clientesEncontrados, setClientesEncontrados] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [componentesDisponibles, setComponentesDisponibles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [result, setResult] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  
  // Estado para controlar si es cliente nuevo o existente
  const [esClienteNuevo, setEsClienteNuevo] = useState(true);

  // Estado para mostrar grid de componentes cuando se selecciona "Armado de PC"
  const [mostrarComponentes, setMostrarComponentes] = useState(false);
  
  // Estado para mostrar modal de selección de servicios
  const [mostrarModalServicios, setMostrarModalServicios] = useState(false);
  
  // Estado para mostrar modal de búsqueda de cliente
  const [mostrarModalBusqueda, setMostrarModalBusqueda] = useState(false);

  useEffect(() => {
    setComponentesDisponibles(COMPONENTES_SIMULADOS);
  }, []);

  // Cargar servicios cuando cambia el tipo de equipo
  useEffect(() => {
    if (form.equipo_tipo) {
      const servicios = SERVICIOS_POR_CATEGORIA[form.equipo_tipo] || [];
      setServiciosDisponibles(servicios);
      // Limpiar servicios seleccionados cuando cambia el tipo de equipo
      setForm(prev => ({ ...prev, servicios_seleccionados: [] }));
    } else {
      setServiciosDisponibles([]);
    }
  }, [form.equipo_tipo]);

  // Verificar si se seleccionó algún servicio que requiere componentes
  useEffect(() => {
    // IDs de servicios que requieren componentes:
    // 1 = Armado de PC, 6 = Actualización de Componentes, 42 = Actualización de RAM, 48 = Actualización de Hardware
    const serviciosConComponentes = [1, 6, 42, 48];
    const tieneServicioConComponentes = form.servicios_seleccionados.some(id => serviciosConComponentes.includes(id));
    
    setMostrarComponentes(tieneServicioConComponentes);
    
    // Si se quitan todos los servicios que requieren componentes, limpiar el grid
    if (!tieneServicioConComponentes) {
      setForm(prev => ({ ...prev, componentes: [] }));
      setItems([{ id: Date.now(), concepto: "", cantidad: 1, precio: "" }]); // Resetear el grid
      setItemErrors({}); // Limpiar errores del grid
    }
  }, [form.servicios_seleccionados]);

  // Búsqueda de clientes
  const buscarClientes = (texto) => {
    setClienteBusqueda(texto);
    if (texto.length > 2) {
      const encontrados = CLIENTES_SIMULADOS.filter(cliente =>
        cliente.nombre.toLowerCase().includes(texto.toLowerCase()) ||
        cliente.correo.toLowerCase().includes(texto.toLowerCase()) ||
        cliente.telefono.includes(texto)
      );
      setClientesEncontrados(encontrados);
    } else {
      setClientesEncontrados([]);
    }
  };

  // Seleccionar cliente existente
  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setForm(prev => ({
      ...prev,
      cliente_nombre: cliente.nombre,
      cliente_correo: cliente.correo,
      cliente_telefono: cliente.telefono
    }));
    setClienteBusqueda("");
  };

  // Manejar cambio en búsqueda de cliente
  const handleClienteBusquedaChange = (e) => {
    setClienteBusqueda(e.target.value);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Manejar selección múltiple de servicios
  const handleServicioChange = (servicioId) => {
    setForm(prev => {
      const servicios = prev.servicios_seleccionados.includes(servicioId)
        ? prev.servicios_seleccionados.filter(id => id !== servicioId)
        : [...prev.servicios_seleccionados, servicioId];
      
      return { ...prev, servicios_seleccionados: servicios };
    });
  };

  // Manejar componentes para armado de PC
  const handleComponenteChange = (categoria, componenteId) => {
    setForm(prev => {
      const componentes = [...prev.componentes];
      const existeIndex = componentes.findIndex(c => c.categoria === categoria);
      
      if (existeIndex >= 0) {
        if (componenteId) {
          componentes[existeIndex] = { categoria, componenteId };
        } else {
          componentes.splice(existeIndex, 1);
        }
      } else if (componenteId) {
        componentes.push({ categoria, componenteId });
      }
      
      return { ...prev, componentes };
    });
  };

  // Validar items del grid de componentes
  const validateItem = (item) => {
    const errors = {};
    
    // Validar concepto (solo letras, números y espacios)
    if (!item.concepto.trim() || !/^[a-zA-Z0-9\s]+$/.test(item.concepto)) {
      errors.concepto = "El concepto debe contener solo letras, números y espacios";
    }
    
    // Validar cantidad (número entero positivo)
    if (!Number.isInteger(Number(item.cantidad)) || Number(item.cantidad) <= 0) {
      errors.cantidad = "La cantidad debe ser un número entero positivo";
    }
    
    // Validar precio (número decimal positivo)
    if (isNaN(Number(item.precio)) || Number(item.precio) <= 0) {
      errors.precio = "El precio debe ser un número positivo";
    }
    
    return errors;
  };

  // Funciones auxiliares para cálculos internos del formulario (envío de datos)
  const calcularTotalComponentesParaEnvio = () => {
    return items.reduce(
      (sum, it) => sum + (Number(it.cantidad) || 0) * (Number(it.precio) || 0),
      0
    );
  };

  const calcularTotalServiciosParaEnvio = () => {
    let total = 0;
    form.servicios_seleccionados.forEach(servicioId => {
      const servicio = serviciosDisponibles.find(s => s.id === servicioId);
      if (servicio) total += servicio.precio;
    });
    return total;
  };

  const calcularPrecioTotalParaEnvio = () => {
    const totalServicios = calcularTotalServiciosParaEnvio();
    const totalComponentes = calcularTotalComponentesParaEnvio();
    return totalServicios + totalComponentes;
  };

  const calcularAnticipoParaEnvio = () => {
    const serviciosConComponentes = [1, 6, 42, 48];
    const tieneServicioConComponentes = form.servicios_seleccionados.some(id => serviciosConComponentes.includes(id));
    const totalComponentes = calcularTotalComponentesParaEnvio();
    const totalGeneral = calcularPrecioTotalParaEnvio();
    
    return tieneServicioConComponentes ? totalComponentes : totalGeneral * 0.7;
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    // Validar datos del cliente (solo si es nuevo o no hay cliente seleccionado)
    if (esClienteNuevo || !clienteSeleccionado) {
      if (!form.cliente_nombre.trim()) errors.cliente_nombre = "El nombre es obligatorio";
      if (!form.cliente_correo.trim()) errors.cliente_correo = "El correo es obligatorio";
      if (!form.cliente_telefono.trim()) errors.cliente_telefono = "El teléfono es obligatorio";
      if (form.cliente_telefono.length !== 10) errors.cliente_telefono = "El teléfono debe tener 10 dígitos";
    }
    
    if (!form.equipo_tipo) errors.equipo_tipo = "El tipo de equipo es obligatorio";
    if (!form.problema.trim()) errors.problema = "La descripción del problema es obligatoria";
    if (form.servicios_seleccionados.length === 0) errors.servicios_seleccionados = "Debe seleccionar al menos un servicio";
    
    // Validar items del grid cuando hay servicios que requieren componentes
    const serviciosConComponentes = [1, 6, 42, 48]; // Armado de PC, Actualización de Componentes, Actualización de RAM, Actualización de Hardware
    const tieneServicioConComponentes = form.servicios_seleccionados.some(id => serviciosConComponentes.includes(id));
    
    if (tieneServicioConComponentes) {
      const itemValidationErrors = {};
      let hasValidItem = false;

      items.forEach((item, index) => {
        const itemValidation = validateItem(item);
        if (Object.keys(itemValidation).length === 0) {
          hasValidItem = true;
        }
        if (Object.keys(itemValidation).length > 0) {
          itemValidationErrors[index] = itemValidation;
        }
      });

      if (!hasValidItem) {
        errors.items = "Debe agregar al menos 1 componente válido para el servicio seleccionado";
      }
      
      setItemErrors(itemValidationErrors);
    } else {
      setItemErrors({});
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Preparar datos del cliente
      const datosCliente = esClienteNuevo ? {
        nombre: form.cliente_nombre,
        correo: form.cliente_correo,
        telefono: form.cliente_telefono
      } : clienteSeleccionado;

      // Preparar componentes filtrados
      const componentesValidos = items
        .filter((item) => (Number(item.cantidad) > 0) && (Number(item.precio) > 0) && item.concepto.trim())
        .map((item) => ({ description: item.concepto, qty: item.cantidad, price: Number(item.precio) }));

      // Simular envío a API
      console.log("Enviando reparación:", {
        ...form,
        cliente: datosCliente,
        componentes: componentesValidos,
        precio_servicios: calcularTotalServiciosParaEnvio(),
        precio_componentes: calcularTotalComponentesParaEnvio(),
        precio_total: calcularPrecioTotalParaEnvio(),
        anticipo_sugerido: calcularAnticipoParaEnvio(),
        estado: REPAIR_STATES.PENDIENTE,
        fecha_ingreso: new Date().toISOString(),
        es_cliente_nuevo: esClienteNuevo
      });
      
      setResult("success");
      setStatusMsg("✅ Reparación registrada correctamente!");
      
      // Limpiar formulario
      setForm({
        cliente_nombre: "",
        cliente_correo: "",
        cliente_telefono: "",
        equipo_tipo: "",
        equipo_marca: "",
        equipo_modelo: "",
        equipo_serie: "",
  equipo_contrasena: "",
  equipo_accesorios: "",
        problema: "",
        servicios_seleccionados: [],
        observaciones: "",
        precio_estimado: "",
        anticipo: "",
        componentes: []
      });
      setItems([{ id: Date.now(), concepto: "", cantidad: 1, precio: "" }]); // Limpiar grid
      setItemErrors({}); // Limpiar errores del grid
      setClienteBusqueda("");
      setClienteSeleccionado(null);
      setEsClienteNuevo(true);
      
    } catch (error) {
      setResult("error");
      setStatusMsg("❌ Error al registrar la reparación: " + error.message);
    }
  };

  // Contenido del resultado
  const resultContent = (
    <div className="bg-black border-2 border-green-500 rounded-md p-6 text-center space-y-4">
      <h2 className="text-2xl font-bold text-green-500 mb-4">RESULTADO</h2>
      <p className={result === "success" ? "text-green-400 text-xl" : "text-red-400 text-xl"}>
        {statusMsg}
      </p>
      <div className="flex justify-center gap-4 mt-6">
        {result === "success" ? (
          <button
            onClick={onClose}
            className="bg-red-800 text-white border-2 border-red-600 px-4 py-1 rounded-full"
          >
            CERRAR
          </button>
        ) : (
          <>
            <button
              onClick={() => setResult(null)}
              className="bg-yellow-600 text-white border-2 border-yellow-500 px-4 py-1 rounded-full"
            >
              REINTENTAR
            </button>
            <button
              onClick={onClose}
              className="bg-red-800 text-white border-2 border-red-600 px-4 py-1 rounded-full"
            >
              CERRAR
            </button>
          </>
        )}
      </div>
    </div>
  );

  // Modal de búsqueda de clientes
  const modalBusquedaCliente = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-black border-2 border-green-500 rounded-md p-3 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] flex flex-col">
        <h3 className="text-green-300 font-bold mb-2 sm:mb-4 text-sm sm:text-base">BUSCAR CLIENTE EXISTENTE</h3>
        
        <div className="mb-2 sm:mb-4">
          <input
            type="text"
            value={clienteBusqueda}
            onChange={(e) => buscarClientes(e.target.value)}
            placeholder="Buscar por nombre, correo o teléfono"
            className="bg-black border-2 border-green-700 text-white px-2 py-1 w-full text-xs sm:text-sm"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-auto custom-scroll mb-2 sm:mb-4 min-h-0">
          {clienteBusqueda.length > 2 ? (
            clientesEncontrados.length > 0 ? (
              clientesEncontrados.map(cliente => (
                <div
                  key={cliente.id}
                  onClick={() => seleccionarCliente(cliente)}
                  className="p-2 hover:bg-green-900 cursor-pointer text-white text-xs sm:text-sm border-b border-green-800"
                >
                  <div className="font-bold">{cliente.nombre}</div>
                  <div className="text-green-300 text-xs">{cliente.correo} - {cliente.telefono}</div>
                </div>
              ))
            ) : (
              <p className="text-yellow-300 text-xs sm:text-sm text-center">No se encontraron clientes</p>
            )
          ) : (
            <p className="text-gray-400 text-xs sm:text-sm text-center">Escriba al menos 3 caracteres para buscar</p>
          )}
        </div>

        <div className="flex gap-2 justify-end flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              setMostrarModalBusqueda(false);
              setClienteBusqueda("");
              setEsClienteNuevo(true);
            }}
            className="bg-red-800 text-white border-2 border-red-600 px-2 sm:px-4 py-1 rounded text-xs sm:text-sm"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );

  // Modal de selección de servicios
  const modalSeleccionServicios = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-black border-2 border-green-500 rounded-md p-3 sm:p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <h3 className="text-green-300 font-bold mb-2 sm:mb-4 text-sm sm:text-base">
          SERVICIOS DISPONIBLES {form.equipo_tipo && `PARA ${form.equipo_tipo.toUpperCase()}`}
        </h3>
        
        <div className="flex-1 overflow-auto custom-scroll mb-2 sm:mb-4 min-h-0">
          {!form.equipo_tipo ? (
            <p className="text-yellow-300 text-xs sm:text-sm italic">Seleccione el tipo de equipo primero</p>
          ) : (
            <ServicioSelector
              equipoTipo={form.equipo_tipo}
              serviciosDisponibles={serviciosDisponibles}
              serviciosSeleccionados={form.servicios_seleccionados}
              onServicioChange={handleServicioChange}
              formErrors={formErrors}
            />
          )}
        </div>

        <div className="flex gap-2 justify-between items-center flex-shrink-0 flex-wrap">
          <span className="text-green-300 text-xs sm:text-sm">
            Servicios seleccionados: {form.servicios_seleccionados.length}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMostrarModalServicios(false)}
              className="bg-green-700 text-white border-2 border-green-600 px-2 sm:px-4 py-1 rounded text-xs sm:text-sm"
            >
              CONFIRMAR
            </button>
            <button
              type="button"
              onClick={() => {
                setMostrarModalServicios(false);
                setForm(prev => ({ ...prev, servicios_seleccionados: [] }));
              }}
              className="bg-red-800 text-white border-2 border-red-600 px-2 sm:px-4 py-1 rounded text-xs sm:text-sm"
            >
              CANCELAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Formulario principal
  const reparacionForm = (
    <form
      id="form-reparacion"
      onSubmit={handleSubmit}
      className="bg-black border-2 border-green-500 rounded-md p-2 sm:p-3 space-y-2 sm:space-y-3"
    >
        {/* Datos del cliente */}
        <ClienteDataForm
          form={form}
          setForm={setForm}
          formErrors={formErrors}
          handleChange={handleChange}
          includeEquipoTipo={false}
          nombreField="cliente_nombre"
          correoField="cliente_correo"
          telefonoField="cliente_telefono"
        />

      {/* Formulario en 3 columnas - Responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-3">
        
  {/* COLUMNA 1: DATOS DEL EQUIPO */}
        <div className="space-y-1 sm:space-y-2">
          <h3 className="text-green-300 font-bold text-xs sm:text-sm mb-1 sm:mb-2">DATOS DEL EQUIPO</h3>
          
          <label className="flex flex-col text-green-300 gap-1">
            <span className="text-xs">TIPO:</span>
            <div className="relative">
              <select
                name="equipo_tipo"
                value={form.equipo_tipo}
                onChange={handleChange}
                className={`bg-black border ${formErrors.equipo_tipo ? 'border-red-600' : 'border-green-700'} text-white px-2 py-1 w-full text-xs`}
              >
                <option value="">Seleccione tipo</option>
                <option value="Desktop">Desktop</option>
                <option value="Laptop">Laptop</option>
                <option value="Celular">Celular</option>
                <option value="Tablet">Tablet</option>
                <option value="All-in-One">All-in-One</option>
                <option value="Servidor">Servidor</option>
              </select>
              {formErrors.equipo_tipo && (
                <div className="absolute right-1 top-1/2 -translate-y-1/2 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </label>

          <label className="flex flex-col text-green-300 gap-1">
            <span className="text-xs">MARCA:</span>
            <input
              type="text"
              name="equipo_marca"
              value={form.equipo_marca}
              onChange={handleChange}
              className="bg-black border border-green-700 text-white px-2 py-1 w-full text-xs"
            />
          </label>

          <label className="flex flex-col text-green-300 gap-1">
            <span className="text-xs">MODELO:</span>
            <input
              type="text"
              name="equipo_modelo"
              value={form.equipo_modelo}
              onChange={handleChange}
              className="bg-black border border-green-700 text-white px-2 py-1 w-full text-xs"
            />
          </label>

          <label className="flex flex-col text-green-300 gap-1">
            <span className="text-xs">SERIE:</span>
            <input
              type="text"
              name="equipo_serie"
              value={form.equipo_serie}
              onChange={handleChange}
              className="bg-black border border-green-700 text-white px-2 py-1 w-full text-xs"
            />
          </label>

          <label className="flex flex-col text-green-300 gap-1">
            <span className="text-xs">CONTRASEÑA / PIN (opcional):</span>
            <input
              type="text"
              name="equipo_contrasena"
              value={form.equipo_contrasena}
              onChange={handleChange}
              className="bg-black border border-green-700 text-white px-2 py-1 w-full text-xs"
              placeholder="Clave, PIN o patrón"
            />
          </label>

          <label className="flex flex-col text-green-300 gap-1">
            <span className="text-xs">ACCESORIOS RECIBIDOS (opcional):</span>
            <input
              type="text"
              name="equipo_accesorios"
              value={form.equipo_accesorios}
              onChange={handleChange}
              className="bg-black border border-green-700 text-white px-2 py-1 w-full text-xs"
              placeholder="Cargador, funda, cable, etc."
            />
          </label>
        </div>

        {/* COLUMNA 2: DATOS DEL EQUIPO O PROBLEMA */}
        <div className="space-y-1 sm:space-y-2">
          <h3 className="text-green-300 font-bold text-xs sm:text-sm mb-1 sm:mb-2">
            {esClienteNuevo ? 'DATOS DEL EQUIPO' : 'PROBLEMA Y SERVICIOS'}
          </h3>
          
          {esClienteNuevo && (
            <div className="text-gray-400 text-xs">
              Use la columna izquierda para registrar los datos del equipo.
            </div>
          )}
        </div>

        {/* COLUMNA 3: PROBLEMA/SERVICIOS O PRECIOS */}
        <div className="space-y-1 sm:space-y-2">
          <h3 className="text-green-300 font-bold text-xs sm:text-sm mb-1 sm:mb-2">
            {esClienteNuevo ? 'PROBLEMA Y SERVICIOS' : 'PRECIOS Y OBSERVACIONES'}
          </h3>
          
          {esClienteNuevo ? (
            <>
              <label className="flex flex-col text-green-300 gap-1">
                <span className="text-xs">PROBLEMA REPORTADO:</span>
                <div className="relative">
                  <textarea
                    name="problema"
                    value={form.problema}
                    onChange={handleChange}
                    rows={3}
                    className={`bg-black border ${formErrors.problema ? 'border-red-600' : 'border-green-700'} text-white px-2 py-1 w-full text-xs resize-none`}
                    placeholder="Describa el problema del equipo"
                  />
                  {formErrors.problema && (
                    <div className="absolute right-1 top-1 group">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </label>

              {/* Servicios */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-green-300 text-xs font-bold">SERVICIOS:</span>
                  <button
                    type="button"
                    onClick={() => setMostrarModalServicios(true)}
                    className={`px-2 py-1 rounded text-xs ${
                      !form.equipo_tipo 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-green-700 text-white hover:bg-green-600'
                    }`}
                    disabled={!form.equipo_tipo}
                    title={!form.equipo_tipo ? "Seleccione el tipo de equipo primero" : "Seleccionar servicios"}
                  >
                    SELECCIONAR
                  </button>
                </div>
                
                {!form.equipo_tipo && (
                  <p className="text-yellow-400 text-xs italic">Seleccione el tipo de equipo para ver servicios disponibles</p>
                )}
                
                {formErrors.servicios_seleccionados && (
                  <p className="text-red-400 text-xs">{formErrors.servicios_seleccionados}</p>
                )}
                
                {form.servicios_seleccionados.length > 0 && (
                  <div className="bg-gray-900 border border-green-800 rounded p-1 max-h-16 overflow-y-auto">
                    <p className="text-green-300 text-xs mb-1">Seleccionados ({form.servicios_seleccionados.length}):</p>
                    {form.servicios_seleccionados.slice(0, 3).map(servicioId => {
                      const servicio = serviciosDisponibles.find(s => s.id === servicioId);
                      return servicio ? (
                        <div key={servicioId} className="text-white text-xs flex justify-between">
                          <span className="truncate">{servicio.nombre}</span>
                          <span className="text-green-400">${servicio.precio}</span>
                        </div>
                      ) : null;
                    })}
                    {form.servicios_seleccionados.length > 3 && (
                      <div className="text-yellow-300 text-xs">+{form.servicios_seleccionados.length - 3} más...</div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <label className="flex flex-col text-green-300 gap-1">
                <span className="text-xs">ANTICIPO:</span>
                <input
                  type="number"
                  name="anticipo"
                  value={form.anticipo}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="bg-black border border-green-700 text-white px-2 py-1 w-full text-xs"
                  placeholder="0.00"
                />
              </label>

              <label className="flex flex-col text-green-300 gap-1">
                <span className="text-xs">OBSERVACIONES:</span>
                <textarea
                  name="observaciones"
                  value={form.observaciones}
                  onChange={handleChange}
                  rows={4}
                  className="bg-black border border-green-700 text-white px-2 py-1 w-full text-xs resize-none"
                  placeholder="Observaciones adicionales (opcional)"
                />
              </label>
            </>
          )}
        </div>
      </div>

      {/* Grid de Componentes (solo si se selecciona Armado de PC) */}
      {mostrarComponentes && (
        <div className="mb-2 sm:mb-3">
          <ComponentesGrid
            items={items}
            onItemsChange={setItems}
            title="COMPONENTES REQUERIDOS"
            variant="reparacion"
            itemErrors={itemErrors}
          />
        </div>
      )}

      {/* Resumen de presupuesto - Componente separado */}
      <PresupuestoResumen 
        serviciosSeleccionados={form.servicios_seleccionados}
        serviciosDisponibles={serviciosDisponibles}
        componentesItems={items}
        mostrarComponentes={mostrarComponentes}
      />
      </form>
  );

  return (
    <>
      <ModalWrapper 
        title="NUEVA REPARACIÓN" 
        onClose={onClose}
        id={result ? undefined : "form-reparacion"}
        hideDefaultButtons={!!result}
        className="w-full max-w-7xl max-h-[90vh]"
        noOverlay={noOverlay}
      >
        {result ? resultContent : reparacionForm}
      </ModalWrapper>
      
      {/* Modales */}
      {mostrarModalBusqueda && modalBusquedaCliente}
      {mostrarModalServicios && modalSeleccionServicios}
    </>
  );
}