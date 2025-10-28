import { useState } from "react";
import ModalWrapper from "./ModalWrapper";

export default function Pendientes({ onClose }) {
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
    <div className="bg-black border-2 border-green-500 rounded-md p-3">
      {items.map((it) => (
        <div key={it.id} className="flex items-center justify-between mb-2">
          <div>
            <div className="text-white font-medium">{it.folio}</div>
            <div className="text-green-200 text-sm">{it.status}</div>
          </div>
          <div>
            {it.status !== "Entregado" && (
              <button
                onClick={() => markDone(it.id)}
                className="bg-green-700 text-white px-3 py-1 rounded-full"
              >
                MARCAR
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <ModalWrapper title="PENDIENTES" onClose={onClose}>
      {pendientesContent}
    </ModalWrapper>
  );
}
