// Definimos un mapa de tamaños válidos en Tailwind
const sizeMap = {
  16: "w-16 h-16",
  24: "w-24 h-24",
  32: "w-32 h-32",
};

export const HeaderModal = ({ texto, tamano }) => (
  <div className="flex items-center justify-between mb-2">
    <h2 className="text-2xl font-bold text-white mb-3">{texto}</h2>
    <img
      src="/Logo.png"
      alt="Logo"
      className={`${sizeMap[tamano] ?? "w-24 h-24"} object-contain`}
    />
  </div>
);
