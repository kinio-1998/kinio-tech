import { Link } from "react-router-dom";

export default function MainMenu() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-green-400 p-4  ">
      {/* Logo placeholder */}
      <div className="mb-8 ">
        <div className="w-35 h-35  flex items-center justify-center">
          <img src="/Logo.png" alt="Logo" />
        </div>
      </div>

      {/* Desktop rombo */}
      <div className="hidden md:flex relative w-[500px] h-[500px] justify-center items-center mx-auto">
        {/* Registrar (centro) */}
        <Link
          to="/registrar"
          className="absolute flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-32 h-32 bg-black hover:bg-green-300 hover:text-white z-10"
        >
          <span className="-rotate-45">REGISTRAR</span>
        </Link>

        {/* Entregar */}
        <Link
          to="/entregar"
          className="absolute -translate-y-[140px] flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-44 h-44 bg-black hover:bg-green-300 hover:text-white"
        >
          <span className="-rotate-45">ENTREGAR</span>
        </Link>

        {/* Pendientes */}
        <Link
          to="/pendientes"
          className="absolute translate-y-[140px] flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-44 h-44 bg-black hover:bg-green-300 hover:text-white"
        >
          <span className="-rotate-45">PENDIENTES</span>
        </Link>

        {/* Cotizar */}
        <Link
          to="/cotizar"
          className="absolute -translate-x-[140px] flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-44 h-44 bg-black hover:bg-green-300 hover:text-white"
        >
          <span className="-rotate-45">COTIZAR</span>
        </Link>

        {/* Consultar */}
        <Link
          to="/consultar"
          className="absolute translate-x-[140px] flex items-center justify-center border-2 border-green-600 text-green-600 font-bold transform rotate-45 w-44 h-44 bg-black hover:bg-green-300 hover:text-white"
        >
          <span className="-rotate-45">CONSULTAR</span>
        </Link>
      </div>

      {/* Mobile grid estilo Windows Phone */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs md:hidden">
        <Link
          to="/cotizar"
          className="flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-24 bg-black hover:bg-green-300 hover:text-white rounded-2xl"
        >
          COTIZAR
        </Link>
        <Link
          to="/consultar"
          className="flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-24 bg-black hover:bg-green-300 hover:text-white rounded-2xl"
        >
          CONSULTAR
        </Link>
        <Link
          to="/registrar"
          className="flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-24 bg-black hover:bg-green-300 hover:text-white rounded-2xl"
        >
          REGISTRAR
        </Link>
        <Link
          to="/entregar"
          className="flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-24 bg-black hover:bg-green-300 hover:text-white rounded-2xl"
        >
          ENTREGAR
        </Link>
        <Link
          to="/pendientes"
          className="flex items-center justify-center border-2 border-green-600 text-green-600 font-bold h-24 bg-black hover:bg-green-300 hover:text-white rounded-2xl"
        >
          PENDIENTES
        </Link>
      </div>
    </div>
  );
}
