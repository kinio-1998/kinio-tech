
import React, { useState, useEffect } from 'react';
import ModalWrapper from '../modals/ModalWrapper';

const DEFAULT_BACKEND = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/publicar';

export default function Publicar({ onClose, noOverlay }) {
  const [beforeFile, setBeforeFile] = useState(null);
  const [duringFile, setDuringFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [duringPreview, setDuringPreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  const [showDuring, setShowDuring] = useState(false);
  const [showAfter, setShowAfter] = useState(false);
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(beforePreview);
      URL.revokeObjectURL(duringPreview);
      URL.revokeObjectURL(afterPreview);
    };
  }, [beforePreview, duringPreview, afterPreview]);

  function handleFileChange(e, setter, setPreview) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen.');
      return;
    }
    const maxSize = 10 * 1024 * 1024;
    if (f.size > maxSize) {
      setError('Cada imagen debe ser menor a 10 MB.');
      return;
    }
    setError(null);
    setter(f);
    setPreview(URL.createObjectURL(f));
  }

  function resetForm() {
    setBeforeFile(null);
    setDuringFile(null);
    setAfterFile(null);
    setBeforePreview(null);
    setDuringPreview(null);
    setAfterPreview(null);
    setComment('');
    setProgress(0);
    setError(null);
    setSuccess(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!beforeFile) {
      setError('Debes seleccionar al menos la imagen del antes.');
      return;
    }
    
    if (showDuring && !duringFile) {
      setError('Has activado la imagen del durante pero no has seleccionado ninguna imagen.');
      return;
    }
    
    if (showAfter && !afterFile) {
      setError('Has activado la imagen del después pero no has seleccionado ninguna imagen.');
      return;
    }
    const form = new FormData();
    form.append('before', beforeFile);
    form.append('during', duringFile);
    form.append('after', afterFile);
    form.append('comment', comment || '');

    setUploading(true);
    setProgress(0);

    const xhr = new XMLHttpRequest();
    const url = DEFAULT_BACKEND;
    xhr.open('POST', url, true);
    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable) {
        const p = Math.round((evt.loaded / evt.total) * 100);
        setProgress(p);
      }
    };
    xhr.onload = () => {
      setUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        setSuccess('Enviado correctamente. El backend procesará las imágenes.');
        setTimeout(() => {
          resetForm();
          onClose();
        }, 1200);
      } else {
        setError(`Error del servidor: ${xhr.status} ${xhr.statusText}`);
      }
    };
    xhr.onerror = () => {
      setUploading(false);
      setError('Error de red al enviar los archivos.');
    };
    xhr.send(form);
  }

  const form = (
    <div className="h-full overflow-auto custom-scroll">
      <form id="form-publicar" onSubmit={handleSubmit} className="space-y-2 sm:space-y-4 p-2 sm:p-3">
        <div className="space-y-2 sm:space-y-4">
          <div className="space-y-1 sm:space-y-2">
            <label className="block text-xs sm:text-sm text-green-300">Imagen - Antes</label>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <div className="flex-grow">
                <input
                  accept="image/*"
                  type="file"
                  onChange={(e) => handleFileChange(e, setBeforeFile, setBeforePreview)}
                  className="w-full text-xs sm:text-sm"
                />
              </div>
              {beforePreview && (
                <div className="mt-2 sm:mt-0">
                  <img src={beforePreview} alt="Antes" className="w-24 h-16 sm:w-36 sm:h-24 object-cover rounded border border-green-600" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <label className="text-green-300 text-xs sm:text-sm flex items-center gap-2 sm:gap-3">
                <span>Imagen - Durante</span>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDuring}
                  onChange={(e) => {
                    setShowDuring(e.target.checked);
                    if (!e.target.checked) {
                      setDuringFile(null);
                      setDuringPreview(null);
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-800 rounded-full peer-checked:bg-green-500 transition-colors" />
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </div>
          {showDuring && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <div className="flex-grow">
                <input
                  accept="image/*"
                  type="file"
                  onChange={(e) => handleFileChange(e, setDuringFile, setDuringPreview)}
                  className="w-full"
                />
              </div>
              {duringPreview && (
                <div className="mt-2 sm:mt-0">
                  <img src={duringPreview} alt="Durante" className="w-36 h-24 object-cover rounded border border-green-600" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-green-300 text-sm flex items-center gap-3">
              <span>Imagen - Final</span>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAfter}
                  onChange={(e) => {
                    setShowAfter(e.target.checked);
                    if (!e.target.checked) {
                      setAfterFile(null);
                      setAfterPreview(null);
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-800 rounded-full peer-checked:bg-green-500 transition-colors" />
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </div>
          {showAfter && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <div className="flex-grow">
                <input
                  accept="image/*"
                  type="file"
                  onChange={(e) => handleFileChange(e, setAfterFile, setAfterPreview)}
                  className="w-full"
                />
              </div>
              {afterPreview && (
                <div className="mt-2 sm:mt-0">
                  <img src={afterPreview} alt="Después" className="w-36 h-24 object-cover rounded border border-green-600" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

        <div>
          <label className="block text-xs sm:text-sm text-green-300 mb-1">Comentario</label>
          <textarea 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            className="w-full bg-black border border-green-600 text-white p-2 rounded text-xs sm:text-sm" 
            rows={3} 
            placeholder="Pequeña descripción..." 
          />
        </div>

        {error && <div className="text-red-400 text-xs sm:text-sm p-2 bg-red-900 bg-opacity-30 rounded border border-red-700">{error}</div>}
        {success && <div className="text-green-400 text-xs sm:text-sm p-2 bg-green-900 bg-opacity-30 rounded border border-green-700">{success}</div>}

        {uploading && (
          <div className="w-full bg-gray-700 rounded h-2 sm:h-3 overflow-hidden">
            <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        )}
      </form>
    </div>
  );

  return (
    <ModalWrapper
      title="PUBLICAR"
      onClose={onClose}
      id="form-publicar"
      isLoading={uploading}
      loadingText={`Enviando... ${progress}%`}
      noOverlay={noOverlay}
    >
      {form}
    </ModalWrapper>
  );
}
