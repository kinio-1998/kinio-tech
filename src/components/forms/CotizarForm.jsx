import { useState, useEffect } from "react";
import ModalWrapper from "../modals/ModalWrapper";
import ClienteDataForm from "../common/ClienteDataForm";
import ServicioSelector from "../common/ServicioSelector";
import PresupuestoResumen from "../common/PresupuestoResumen";
import ComponentesGrid from "../common/ComponentesGrid";

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
    { id: 12, nombre: 'Reemplazo de Pantalla', precio: 2500 },
    { id: 13, nombre: 'Cambio de Teclado', precio: 800 },
    { id: 14, nombre: 'Reparación de Bisagras', precio: 600 },
    { id: 15, nombre: 'Diagnóstico de Hardware', precio: 120 },
    { id: 16, nombre: 'Formateo e Instalación SO', precio: 250 },
    { id: 17, nombre: 'Limpieza Interna', precio: 180 },
    { id: 18, nombre: 'Recuperación de Datos', precio: 900 },
    { id: 19, nombre: 'Cambio de Batería', precio: 400 },
    { id: 20, nombre: 'Reparación de Puerto de Carga', precio: 350 },
  ],
  Tablet: [
    { id: 21, nombre: 'Reemplazo de Pantalla Táctil', precio: 1800 },
    { id: 22, nombre: 'Cambio de Batería', precio: 600 },
    { id: 23, nombre: 'Reparación de Puerto de Carga', precio: 400 },
    { id: 24, nombre: 'Diagnóstico de Hardware', precio: 150 },
    { id: 25, nombre: 'Recuperación de Datos', precio: 700 },
    { id: 26, nombre: 'Formateo e Instalación SO', precio: 300 },
    { id: 27, nombre: 'Calibración de Pantalla', precio: 200 },
    { id: 28, nombre: 'Limpieza Interna', precio: 250 },
  ],
  Smartphone: [
    { id: 29, nombre: 'Reemplazo de Pantalla', precio: 1200 },
    { id: 30, nombre: 'Cambio de Batería', precio: 350 },
    { id: 31, nombre: 'Reparación de Puerto de Carga', precio: 300 },
    { id: 32, nombre: 'Cambio de Cámara', precio: 800 },
    { id: 33, nombre: 'Reparación de Botones', precio: 250 },
    { id: 34, nombre: 'Recuperación de Datos', precio: 500 },
    { id: 35, nombre: 'Limpieza de Puerto', precio: 100 },
    { id: 36, nombre: 'Cambio de Altavoz', precio: 400 },
    { id: 37, nombre: 'Reparación de Micrófono', precio: 350 },
    { id: 38, nombre: 'Desbloqueo', precio: 200 },
  ],
  Consola: [
    { id: 39, nombre: 'Limpieza Interna', precio: 300 },
    { id: 40, nombre: 'Cambio de Pasta Térmica', precio: 250 },
    { id: 41, nombre: 'Reparación de Puerto HDMI', precio: 800 },
    { id: 42, nombre: 'Actualización de Hardware', precio: 150 },
    { id: 43, nombre: 'Diagnóstico de Hardware', precio: 200 },
    { id: 44, nombre: 'Reparación de Controles', precio: 400 },
    { id: 45, nombre: 'Cambio de Fuente', precio: 600 },
    { id: 46, nombre: 'Instalación de Disco Duro', precio: 200 },
    { id: 47, nombre: 'Formateo', precio: 150 },
    { id: 48, nombre: 'Actualización de RAM', precio: 100 },
  ],
};

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
    { id: 15, nombre: 'Seagate Barracuda 2TB HDD', precio: 1500 },
    { id: 16, nombre: 'Crucial MX4 1TB SSD', precio: 2200 },
  ],
  'Tarjeta Gráfica': [
    { id: 17, nombre: 'NVIDIA RTX 4060', precio: 8500 },
    { id: 18, nombre: 'AMD RX 6600', precio: 6800 },
    { id: 19, nombre: 'NVIDIA RTX 4070', precio: 12000 },
    { id: 20, nombre: 'AMD RX 7600', precio: 7200 },
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

export default function Cotizar({ onClose, noOverlay }) {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    servicio: "",
    // Nuevos campos para selección de servicios y componentes
    equipo_tipo: "",
    servicios_seleccionados: [],
    componentes: []
  });
  const [items, setItems] = useState([
    { id: Date.now(), nombre: "", marca: "", modelo: "", cantidad: 1, precio: "" },
  ]);
  
  // Estados para la funcionalidad de servicios y componentes
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [componentesDisponibles, setComponentesDisponibles] = useState([]);
  const [mostrarComponentes, setMostrarComponentes] = useState(false);
  
  const [statusMsg, setStatusMsg] = useState("");
  const [result, setResult] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [itemErrors, setItemErrors] = useState({});

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
    // 1 = Armado de PC, 6 = Actualización de Componentes, 42 = Actualización de Hardware, 48 = Actualización de RAM
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    // Limpiar error al modificar el campo
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("Enviando cotización...");

    // Validar el formulario
    const errors = {};
    if (!form.nombre.trim()) errors.nombre = "El nombre es requerido";
    if (!form.correo.trim()) errors.correo = "El correo es requerido";
    if (!form.telefono.trim() || !/^\d{10}$/.test(form.telefono)) errors.telefono = "El teléfono debe tener 10 dígitos";
    
    // Validar tipo de equipo y servicios
    if (!form.equipo_tipo) errors.equipo_tipo = "Debe seleccionar un tipo de equipo";
    if (form.servicios_seleccionados.length === 0) errors.servicios_seleccionados = "Debe seleccionar al menos un servicio";

    // Validar items cuando se requieren componentes
    if (mostrarComponentes) {
      const itemErrors = {};
      let hasValidItem = false;

      items.forEach((item, index) => {
        const itemValidation = validateItem(item);
        if (Object.keys(itemValidation).length === 0 && item.concepto.trim()) {
          hasValidItem = true;
        }
        if (Object.keys(itemValidation).length > 0) {
          itemErrors[index] = itemValidation;
        }
      });

      if (mostrarComponentes && !hasValidItem) {
        setStatusMsg("❌ Debe agregar al menos 1 componente con todos los campos válidos");
        setFormErrors({ ...errors, items: itemErrors });
        setItemErrors(itemErrors);
        return;
      }

      if (mostrarComponentes && !hasValidItem) {
        setStatusMsg("❌ Debe agregar al menos 1 ítem con todos los campos válidos");
        setFormErrors({ ...errors, items: itemErrors });
        setItemErrors(itemErrors);
        return;
      }

      setItemErrors(itemErrors);
    }

    // Si hay errores en el formulario principal, mostrarlos
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setStatusMsg("❌ Por favor corrija los errores en el formulario");
      return;
    }

    try {
      const res = await fetch(
        "https://kiniotech-backend.onrender.com/api/cotizar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_name: form.nombre,
            client_email: form.correo,
            client_phone: form.telefono,
            equipment_type: form.equipo_tipo,
            selected_services: form.servicios_seleccionados.map(id => {
              const servicio = serviciosDisponibles.find(s => s.id === id);
              return { id, name: servicio?.nombre, price: servicio?.precio };
            }),
            components: form.componentes.map(comp => {
              const categoria = componentesDisponibles[comp.categoria];
              const componente = categoria?.find(c => c.id === comp.componenteId);
              return { 
                category: comp.categoria, 
                component: componente?.nombre, 
                price: componente?.precio 
              };
            }),
            items: mostrarComponentes
              ? items
                  .filter((it) => it.concepto.trim() && (Number(it.cantidad) > 0) && (Number(it.precio) > 0))
                  .map((it) => ({ description: it.concepto, qty: it.cantidad, price: Number(it.precio) }))
              : [],
            total_services: calcularTotalServiciosParaEnvio(),
            total_components: mostrarComponentes ? calcularTotalComponentesParaEnvio() : 0,
            total_general: calcularTotalGeneralParaEnvio(),
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setResult("success");
        setStatusMsg("✅ Cotización enviada correctamente!");
        setForm({ 
          nombre: "", 
          correo: "", 
          telefono: "", 
          servicio: "",
          equipo_tipo: "",
          servicios_seleccionados: [],
          componentes: []
        });
        setItems([{ id: Date.now(), concepto: "", cantidad: 1, precio: "" }]);
        setItemErrors({});
      } else {
        setResult("error");
        setStatusMsg("❌ Error al enviar la cotización: " + data.detail);
      }
    } catch (err) {
      setResult("error");
      setStatusMsg("❌ Error al enviar la cotización: " + err.message);
    }
  };

  // Funciones auxiliares para cálculos internos del formulario (envío de datos)
  const calcularTotalComponentesParaEnvio = () => {
    return items.reduce(
      (sum, it) => sum + (Number(it.cantidad) || 0) * (Number(it.precio) || 0),
      0
    );
  };

  const calcularTotalServiciosParaEnvio = () => {
    return form.servicios_seleccionados.reduce((total, servicioId) => {
      const servicio = serviciosDisponibles.find(s => s.id === servicioId);
      return total + (servicio ? servicio.precio : 0);
    }, 0);
  };

  const calcularTotalGeneralParaEnvio = () => {
    const totalServicios = calcularTotalServiciosParaEnvio();
    const totalComponentes = mostrarComponentes ? calcularTotalComponentesParaEnvio() : 0;
    return totalServicios + totalComponentes;
  };
  
  const resultContent = (
    <div className="bg-black border-2 border-green-500 rounded-md p-6 text-center space-y-4">
      <h2 className="text-2xl font-bold text-green-500 mb-4">RESULTADO</h2>
      <p
        className={
          result === "success"
            ? "text-green-400 text-xl "
            : "text-red-400 text-xl"
        }
      >
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
  
  const cotizarForm = (
    <form
      id="form-cotizar"
      onSubmit={handleSubmit}
      className="bg-black border-2 border-green-500 rounded-md p-1 space-y-1"
    >
      {/* datos cliente en grid compacto */}
      <ClienteDataForm
        form={form}
        setForm={setForm}
        formErrors={formErrors}
        handleChange={handleChange}
        includeEquipoTipo={true}
        nombreField="nombre"
        correoField="correo"
        telefonoField="telefono"
        equipoTipoField="equipo_tipo"
      />

      {/* Servicios y componentes */}
      <div className="space-y-1">
        {/* Servicios Disponibles - Componente separado */}
        <ServicioSelector 
          equipoTipo={form.equipo_tipo}
          serviciosDisponibles={serviciosDisponibles}
          serviciosSeleccionados={form.servicios_seleccionados}
          onServicioChange={handleServicioChange}
          formErrors={formErrors}
        />

        {/* Grid de componentes cuando se seleccionan servicios que requieren componentes */}
        {mostrarComponentes && (
          <ComponentesGrid
            items={items}
            onItemsChange={setItems}
            title="COMPONENTES COMPRADOS:"
            variant="cotizar"
            itemErrors={itemErrors}
            onErrorsChange={setItemErrors}
          />
        )}

        {/* Resumen de presupuesto */}
        {(form.servicios_seleccionados.length > 0 || mostrarComponentes) && (
          <PresupuestoResumen 
            serviciosSeleccionados={form.servicios_seleccionados}
            serviciosDisponibles={serviciosDisponibles}
            componentesItems={items}
            mostrarComponentes={mostrarComponentes}
          />
        )}
      </div>

    </form>
  );

  return (
    <ModalWrapper 
      title="COTIZAR" 
      onClose={onClose} 
      id={result ? undefined : "form-cotizar"}
      hideDefaultButtons={!!result}
      className="w-full max-w-4xl"
      noOverlay={noOverlay}
    >
      {result ? resultContent : cotizarForm}
    </ModalWrapper>
  );
}
