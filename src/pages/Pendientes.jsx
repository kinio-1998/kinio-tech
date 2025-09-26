import { useNavigate } from "react-router-dom";

export default function Pendientes() {
  const navigate = useNavigate();

  // sample data
  const rows = [
    { folio: "123456", equipo: "LAP HP", servicio: "LIMPIEZA", estatus: "REVISADO" },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
      <div className="w-full max-w-md border-4 border-green-600 rounded-lg p-4 bg-black text-white">
        <h2 className="text-2xl font-bold mb-3">PENDIENTES</h2>

        <div className="bg-black border-2 border-green-500 rounded-md p-3">
          <div className="border-2 border-green-700 p-2">
            <div className="grid grid-cols-4 text-green-300 text-sm border-b border-green-700">
              <div className="p-2">FOLIO</div>
              <div className="p-2">EQUIPO</div>
              <div className="p-2">SERVICIO</div>
              <div className="p-2">ESTATUS</div>
            </div>
            <div className="h-48 overflow-y-auto">
              {rows.map((r, i) => (
                <div key={i} className="grid grid-cols-4 text-white text-sm border-b border-green-900">
                  <div className="p-2">{r.folio}</div>
                  <div className="p-2">{r.equipo}</div>
                  <div className="p-2">{r.servicio}</div>
                  <div className="p-2">{r.estatus}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button onClick={() => navigate('/')} className="bg-red-800 text-white border-2 border-red-600 px-6 py-1 rounded-full">SALIR</button>
          </div>
        </div>
      </div>
    </div>
  );
}
