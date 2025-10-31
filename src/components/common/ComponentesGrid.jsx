import { useState, useEffect, useRef } from 'react';

export default function ComponentesGrid({ 
  items = [],
  onItemsChange,
  title = "COMPONENTES COMPRADOS",
  variant = "cotizar", // "cotizar" o "reparacion"
  itemErrors = {},
  onErrorsChange
}) {
  // Estado local para validaciones
  const [localErrors, setLocalErrors] = useState({});
  const listRef = useRef(null);

  // Calcular total de componentes
  const calcularTotal = () => {
    return items.reduce((total, item) => {
      const cantidad = parseFloat(item.cantidad || 0);
      const precio = parseFloat(item.precio || 0);
      return total + (cantidad * precio);
    }, 0);
  };

  // Función para agregar item
  const addItem = () => {
    const newItem = variant === "cotizar" 
      ? { 
          id: Date.now(), 
          nombre: "", 
          marca: "", 
          modelo: "", 
          cantidad: 1, 
          precio: "" 
        }
      : { 
          id: Date.now() + Math.random(), 
          concepto: "", 
          cantidad: 1, 
          precio: "" 
        };
    
    onItemsChange([...items, newItem]);
  };

  // Función para eliminar item
  const removeItem = (identifier) => {
    if (variant === "cotizar") {
      // En cotizar usa index
      if (items.length > 1) {
        const newItems = items.filter((_, i) => i !== identifier);
        onItemsChange(newItems);
        
        // Limpiar errores del item eliminado si existe onErrorsChange
        if (onErrorsChange) {
          const newErrors = { ...itemErrors };
          Object.keys(newErrors).forEach(key => {
            if (key.startsWith(`${identifier}_`)) {
              delete newErrors[key];
            }
          });
          onErrorsChange(newErrors);
        }
      }
    } else {
      // En reparacion usa id
      const newItems = items.filter(item => item.id !== identifier);
      onItemsChange(newItems);
    }
  };

  // Función para actualizar item
  const updateItem = (identifier, field, value) => {
    if (variant === "cotizar") {
      // En cotizar usa index
      const newItems = items.map((item, i) => 
        i === identifier ? { ...item, [field]: value } : item
      );
      onItemsChange(newItems);
      
      // Limpiar errores al modificar si existe onErrorsChange
      if (onErrorsChange) {
        const newErrors = { ...itemErrors, [`${identifier}_${field}`]: null };
        onErrorsChange(newErrors);
      }
    } else {
      // En reparacion usa id
      const newItems = items.map(item =>
        item.id === identifier
          ? { ...item, [field]: field === "cantidad" ? Number(value) : value }
          : item
      );
      onItemsChange(newItems);
    }
  };

  // Auto-scroll al último item cuando se agrega uno nuevo (mejora UX en listas con scroll)
  useEffect(() => {
    if (listRef.current && items.length > 3) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [items.length]);

  // Renderizar campos para variante cotizar
  const renderCotizarItem = (item, index) => (
    <div key={index} className="grid grid-cols-2 sm:grid-cols-6 gap-1 p-1 border border-green-800 rounded">
      <div>
        <input
          type="text"
          placeholder="Componente"
          value={item.nombre}
          onChange={(e) => updateItem(index, 'nombre', e.target.value)}
          className={`bg-black border ${itemErrors[`${index}_nombre`] ? 'border-red-600' : 'border-green-700'} text-white px-1.5 py-1 w-full text-xs`}
        />
        {itemErrors[`${index}_nombre`] && (
          <div className="text-red-400 text-xs mt-0.5">{itemErrors[`${index}_nombre`]}</div>
        )}
      </div>
      
      <div>
        <input
          type="text"
          placeholder="Marca"
          value={item.marca}
          onChange={(e) => updateItem(index, 'marca', e.target.value)}
          className="bg-black border border-green-700 text-white px-1.5 py-1 w-full text-xs"
        />
      </div>
      
      <div>
        <input
          type="text"
          placeholder="Modelo"
          value={item.modelo}
          onChange={(e) => updateItem(index, 'modelo', e.target.value)}
          className="bg-black border border-green-700 text-white px-1.5 py-1 w-full text-xs"
        />
      </div>
      
      <div>
        <input
          type="number"
          placeholder="Cant."
          value={item.cantidad}
          onChange={(e) => updateItem(index, 'cantidad', e.target.value)}
          min="1"
          className={`bg-black border ${itemErrors[`${index}_cantidad`] ? 'border-red-600' : 'border-green-700'} text-white px-1.5 py-1 w-full text-xs`}
        />
        {itemErrors[`${index}_cantidad`] && (
          <div className="text-red-400 text-xs mt-0.5">{itemErrors[`${index}_cantidad`]}</div>
        )}
      </div>
      
      <div>
        <input
          type="number"
          placeholder="Precio"
          value={item.precio}
          onChange={(e) => updateItem(index, 'precio', e.target.value)}
          min="0"
          step="0.01"
          className={`bg-black border ${itemErrors[`${index}_precio`] ? 'border-red-600' : 'border-green-700'} text-white px-1.5 py-1 w-full text-xs`}
        />
        {itemErrors[`${index}_precio`] && (
          <div className="text-red-400 text-xs mt-0.5">{itemErrors[`${index}_precio`]}</div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-green-400 text-xs font-bold">
          ${(parseFloat(item.cantidad || 0) * parseFloat(item.precio || 0)).toFixed(2)}
        </span>
        <button
          type="button"
          onClick={() => removeItem(index)}
          className="bg-red-800 text-white px-1 py-0.5 rounded text-xs hover:bg-red-700"
        >
          ✕
        </button>
      </div>
    </div>
  );

  // Renderizar campos para variante reparacion
  const renderReparacionItem = (item, index) => (
    <div key={item.id} className="grid grid-cols-12 gap-1 sm:gap-1 items-center text-white text-xs">
      <div className="col-span-6 relative">
        <input
          value={item.concepto}
          onChange={(e) => updateItem(item.id, "concepto", e.target.value)}
          placeholder="Concepto"
          className={`w-full bg-black border ${itemErrors[index]?.concepto ? 'border-red-600' : 'border-green-800'} px-1 sm:px-2 py-1 text-white text-xs`}
        />
        {itemErrors[index]?.concepto && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="pointer-events-none absolute -top-16 right-0 w-48 bg-red-900 border-l-2 border-red-500 text-xs text-white p-2 rounded shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all z-50">
              {itemErrors[index].concepto}
            </div>
          </div>
        )}
      </div>
      <div className="col-span-2 relative">
        <input
          type="number"
          value={item.cantidad}
          min="1"
          onChange={(e) => updateItem(item.id, "cantidad", e.target.value)}
          className={`w-full bg-black border ${itemErrors[index]?.cantidad ? 'border-red-600' : 'border-green-800'} px-1 sm:px-2 py-1 text-white text-center text-xs`}
        />
        {itemErrors[index]?.cantidad && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="pointer-events-none absolute -top-16 right-0 w-48 bg-red-900 border-l-2 border-red-500 text-xs text-white p-2 rounded shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all z-50">
              {itemErrors[index].cantidad}
            </div>
          </div>
        )}
      </div>
      <div className="col-span-3 relative">
        <input
          type="number"
          value={item.precio}
          min="0"
          step="0.01"
          onChange={(e) => updateItem(item.id, "precio", e.target.value)}
          className={`w-full bg-black border ${itemErrors[index]?.precio ? 'border-red-600' : 'border-green-800'} px-1 sm:px-2 py-1 text-white text-right text-xs`}
        />
        {itemErrors[index]?.precio && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="pointer-events-none absolute -top-16 right-0 w-48 bg-red-900 border-l-2 border-red-500 text-xs text-white p-2 rounded shadow-lg opacity-0 translate-y-1 group-hover:translate-y-0 transition-all z-50">
              {itemErrors[index].precio}
            </div>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => removeItem(item.id)}
        className="col-span-1 bg-red-800 text-white px-1 py-0.5 rounded text-xs"
      >
        ✕
      </button>
    </div>
  );

  // Limitar altura del contenedor principal y hacer scroll solo en la lista
  const manyItems = items.length > 3;
  const containerHeightClass = manyItems
    ? (variant === "cotizar"
        ? "max-h-56 sm:max-h-64 md:max-h-72"
        : "max-h-48 sm:max-h-56 md:max-h-64")
    : "";
  const containerFlexClass = manyItems ? "flex flex-col overflow-hidden relative min-h-0" : "";

  return (
    <div className="space-y-1">
      <label className="text-green-300 text-xs font-semibold">
        {title}
      </label>
      
      <div className={`bg-black border-2 border-green-700 rounded p-1 space-y-1 ${containerFlexClass} ${containerHeightClass}`}>
        {variant === "reparacion" && (
          <div className="grid grid-cols-12 gap-1 text-xs text-green-300 border-b border-green-700 pb-1 mb-1 sm:pb-2 sm:mb-2">
            <div className="col-span-6 truncate">CONCEPTO</div>
            <div className="col-span-2 text-center truncate">CANTIDAD</div>
            <div className="col-span-3 text-center truncate">PRECIO</div>
            <div className="col-span-1" />
          </div>
        )}
        {variant === "cotizar" && (
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-1 text-xs text-green-300 border-b border-green-700 pb-1 mb-1 sm:pb-2 sm:mb-2">
            <div className="truncate">COMPONENTE</div>
            <div className="truncate hidden sm:block">MARCA</div>
            <div className="truncate hidden sm:block">MODELO</div>
            <div className="truncate text-center">CANT.</div>
            <div className="truncate">PRECIO</div>
            <div className="truncate text-right">TOTAL</div>
          </div>
        )}
        
        {/* Contenedor con scroll optimizado para más de 2 items */}
        <div
          ref={listRef}
          className={items.length > 3 ? 
            "min-h-0 flex-1 overflow-y-auto space-y-1" : 
            "space-y-1"
          }
        >
          {items.map((item, index) => 
            variant === "cotizar" 
              ? renderCotizarItem(item, index)
              : renderReparacionItem(item, index)
          )}
        </div>
        
  <div className={`${items.length > 3 ? "flex-shrink-0" : ""} mt-1 flex items-center justify-between`}>
          <button
            type="button"
            onClick={addItem}
            className="bg-green-700 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
          >
            {variant === "cotizar" ? "+ COMPONENTE" : "AGREGAR ITEM"}
          </button>
          <div className="text-white text-xs">
            Total{variant === "reparacion" ? " Componentes" : ""}: {" "}
            <span className="text-green-300 font-bold">${calcularTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}