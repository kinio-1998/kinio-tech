import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderModal } from "./HeaderModal";
export default function Pendientes({ onClose }) {
  const [items, setItems] = useState([
    { id: 1, folio: "A001", status: "Pendiente" },
    { id: 2, folio: "A002", status: "Pendiente" },
  ]);
  const navigate = useNavigate();

  const handleClose = () => {
    if (typeof onClose === "function") onClose();
    else navigate("/");
  };

  const markDone = (id) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "Entregado" } : i))
    );
  };

  const content = (
    <div className="w-full max-w-2xl rounded-lg p-6 bg-black text-white">
      <HeaderModal texto="PENDIENTES" tamano={24} />

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

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleClose}
          className="bg-red-800 text-white border-2 border-red-600 px-4 py-1 rounded-full"
        >
          CERRAR
        </button>
      </div>
    </div>
  );

  if (typeof onClose === "function") return content;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
      {content}
    </div>
  );
}
