import { useState } from "react";
import ModalWrapper from "../modals/ModalWrapper";

export default function Pendientes({ onClose, noOverlay }) {
  const [items, setItems] = useState([
    { id: 1, folio: "A001", status: "Pendiente" },
    { id: 2, folio: "A002", status: "Pendiente" },
  ]);

  const markDone = (id) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "Entregado" } : i))
    );
  };

  const pendientesContent = (
    <div className="h-full overflow-auto custom-scroll">
      <div className="bg-black border-2 border-green-500 rounded-md p-2 sm:p-3 space-y-2">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between p-2 bg-gray-900 bg-opacity-30 rounded border border-green-800">
            <div>
              <div className="text-white font-medium text-sm sm:text-base">{it.folio}</div>
              <div className="text-green-200 text-xs sm:text-sm">{it.status}</div>
            </div>
            <div>
              {it.status !== "Entregado" && (
                <button
                  onClick={() => markDone(it.id)}
                  className="bg-green-700 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm hover:bg-green-600 transition-colors"
                >
                  MARCAR
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ModalWrapper title="PENDIENTES" onClose={onClose} noOverlay={noOverlay}>
      {pendientesContent}
    </ModalWrapper>
  );
}
