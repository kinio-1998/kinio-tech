const Logo = ({ className = "", sizeClass = "w-18 h-18 md:w-24 md:h-24", outside = false }) => {
  // outside=true aplica margen negativo para que el logo "salga" por encima del cuadro interno
  const outsideClasses = outside ? "-mt-6 md:-mt-8 transform" : "";
  return (
    <div className={`flex items-center justify-center ${sizeClass} ${outsideClasses} ${className}`}>
      <img src="/Logo.png" alt="Logo" className="w-full h-full object-contain" />
    </div>
  );
};

export default Logo;
