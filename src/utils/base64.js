/**
 * Utilidades para manejo de archivos base64
 */

/**
 * Convierte un archivo a base64
 * @param {File} file - El archivo a convertir
 * @returns {Promise<string>} - String base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Valida el tipo y tamaño de archivo
 * @param {File} file - El archivo a validar
 * @param {Object} options - Opciones de validación
 * @returns {Object} - {valid: boolean, error?: string}
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB por defecto
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  } = options;

  if (!file) {
    return { valid: false, error: 'No se ha seleccionado ningún archivo' };
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return { valid: false, error: `El archivo debe ser menor a ${maxSizeMB}MB` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Tipo de archivo no permitido' };
  }

  return { valid: true };
};

/**
 * Convierte un archivo de imagen y lo redimensiona si es necesario
 * @param {File} file - Archivo de imagen
 * @param {Object} options - Opciones de redimensionado
 * @returns {Promise<string>} - Base64 de la imagen procesada
 */
export const processImage = (file, options = {}) => {
  const { maxWidth = 1200, maxHeight = 800, quality = 0.8 } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo proporción
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      // Configurar canvas
      canvas.width = width;
      canvas.height = height;

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir a base64
      const base64 = canvas.toDataURL('image/jpeg', quality);
      resolve(base64);
    };

    img.onerror = () => reject(new Error('Error al procesar la imagen'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Extrae el tipo MIME de un string base64
 * @param {string} base64 - String base64
 * @returns {string} - Tipo MIME
 */
export const getMimeTypeFromBase64 = (base64) => {
  const match = base64.match(/^data:([^;]+);base64,/);
  return match ? match[1] : '';
};

/**
 * Obtiene el tamaño de un archivo base64 en bytes
 * @param {string} base64 - String base64
 * @returns {number} - Tamaño en bytes
 */
export const getBase64Size = (base64) => {
  const base64String = base64.split(',')[1] || base64;
  return Math.round((base64String.length * 3) / 4);
};