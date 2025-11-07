
import React, { useState, useEffect } from 'react';
import ModalWrapper from '../modals/ModalWrapper';
import { API } from '../../utils/api';

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
  const [recent, setRecent] = useState([]);
  // IA / Hugging Face state
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [promptData, setPromptData] = useState(null); // { prompt, segments, suggested_hashtags, caption, assets }
  const [lastUploaded, setLastUploaded] = useState(null); // publicacion devuelta por /publicar
  const [videoResponse, setVideoResponse] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [videoPreviewIsBlob, setVideoPreviewIsBlob] = useState(false);
  const [videoDetails, setVideoDetails] = useState(null);
  const API_ORIGIN = ((import.meta?.env?.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()) || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

  function asReadableError(value, fallback = 'Ha ocurrido un error inesperado.') {
    if (!value) return fallback;
    if (typeof value === 'string') return value;
    if (value instanceof Error) return value.message || fallback;
    if (typeof value === 'object') {
      const maybeError = value.error || value.detail || value.message;
      if (typeof maybeError === 'string' && maybeError.trim()) return maybeError;
      if (maybeError) return asReadableError(maybeError, fallback);
      try {
        return JSON.stringify(value);
      } catch (e) {
        return fallback;
      }
    }
    return String(value);
  }

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(beforePreview);
      URL.revokeObjectURL(duringPreview);
      URL.revokeObjectURL(afterPreview);
    };
  }, [beforePreview, duringPreview, afterPreview]);

  useEffect(() => {
    // cargar últimas publicaciones al abrir
    (async () => {
      const res = await API.marketing.list();
      if (res.success) setRecent(res.data.items || []);
    })();
  }, []);

  useEffect(() => {
    return () => {
      if (videoPreviewIsBlob && videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl, videoPreviewIsBlob]);

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
    setPromptData(null);
    setLastUploaded(null);
    setVideoResponse(null);
    setVideoDetails(null);
    if (videoPreviewIsBlob && videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoPreviewUrl(null);
    setVideoPreviewIsBlob(false);
  }

  async function handleSubmit(e) {
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
    if (duringFile) form.append('during', duringFile);
    if (afterFile) form.append('after', afterFile);
    form.append('comment', comment || '');

    try {
      setUploading(true);
      setProgress(10);
      const res = await API.marketing.publish(form);
      setUploading(false);
      if (res.success) {
        setProgress(100);
        setSuccess('Enviado correctamente.');
        setTimeout(() => { resetForm(); onClose(); }, 1000);
      } else {
        setError(asReadableError(res.error || res.data?.error, `Error ${res.status || ''}`));
      }
    } catch (err) {
      setUploading(false);
      setError(asReadableError(err, 'Error de red al enviar los archivos.'));
    }
  }

  // Sube imágenes al backend (si no se han subido) y devuelve las rutas de la publicación
  async function uploadAssetsForAI() {
    setAiError(null);
    if (!beforeFile) {
      setAiError('Debes seleccionar al menos la imagen del antes.');
      return null;
    }
    const form = new FormData();
    form.append('before', beforeFile);
    if (showDuring && duringFile) form.append('during', duringFile);
    if (showAfter && afterFile) form.append('after', afterFile);
    form.append('comment', comment || '');
    const res = await API.marketing.publish(form);
    if (!res.success || !res.data?.publicacion) {
      setAiError(asReadableError(res.error || res.data?.error, `Error ${res.status || ''} subiendo assets`));
      return null;
    }
    setLastUploaded(res.data.publicacion);
    return res.data.publicacion; // { before, during, after, comment, created }
  }

  async function handleGeneratePrompt(options = {}) {
    const { skipBusy = false } = options;
    try {
      if (!skipBusy) setAiBusy(true);
      setAiError(null);
      const pub = lastUploaded || (await uploadAssetsForAI());
      if (!pub) return null;
      const payload = {
        // podemos mandar rutas directas; el backend las volverá absolutas
        before: pub.before,
        during: pub.during,
        after: pub.after,
        comment: comment || pub.comment || '',
        brand: { name: 'KinioTech', colors: ['#16A34A', '#000000'], cta: 'Escríbenos para tu reparación' },
      };
      const resp = await API.marketing.reelPrompt(payload);
      if (!resp.success) {
        setAiError(asReadableError(resp.error || resp.data?.error, 'Error generando prompt'));
        return null;
      }
      setPromptData(resp.data);
      return resp.data;
    } catch (e) {
      setAiError(asReadableError(e, 'Fallo generando prompt'));
      return null;
    } finally {
      if (!skipBusy) setAiBusy(false);
    }
  }

  function toAbsolute(urlMaybeRelative) {
    if (!urlMaybeRelative) return null;
    if (/^https?:\/\//i.test(urlMaybeRelative)) return urlMaybeRelative;
    return API_ORIGIN + urlMaybeRelative;
  }

  function base64ToBlob(base64String, mimeType) {
    const safeMime = mimeType || 'application/octet-stream';
    try {
      const binary = atob(base64String);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new Blob([bytes], { type: safeMime });
    } catch (e) {
      console.error('Error convirtiendo base64 a Blob', e);
      return null;
    }
  }

  function formatBytes(bytes) {
    if (!bytes || Number.isNaN(Number(bytes))) return null;
    const thresh = 1024;
    if (bytes < thresh) return `${bytes} B`;
    const units = ['KB', 'MB', 'GB', 'TB'];
    let u = -1;
    let val = bytes;
    do {
      val /= thresh;
      u += 1;
    } while (val >= thresh && u < units.length - 1);
    return `${val.toFixed(1)} ${units[u]}`;
  }

  function buildVideoMeta(details) {
    if (!details) return '';
    const parts = [];
    parts.push(details.source === 'simulado' ? 'Simulación' : 'Hugging Face');
    const sizeText = details.size ? formatBytes(details.size) : null;
    if (sizeText) parts.push(sizeText);
    if (details.mimeType) parts.push(details.mimeType);
    return parts.join(' · ');
  }

  async function handleGenerateVideo() {
    try {
      setAiBusy(true);
      setAiError(null);
    setVideoResponse(null);
    setVideoDetails(null);
    setSuccess(null);

      let pub = lastUploaded;
      if (!pub) {
        pub = await uploadAssetsForAI();
      }
      if (!pub) return;

      let promptPayload = promptData;
      if (!promptPayload) {
        promptPayload = await handleGeneratePrompt({ skipBusy: true });
      }
      if (!promptPayload) return;

      const payload = {
        use_huggingface: true,
        prompt: promptPayload?.prompt || promptPayload?.caption || '',
        before_url: toAbsolute(pub.before),
        during_url: toAbsolute(pub.during),
        after_url: toAbsolute(pub.after),
        logo_url: toAbsolute('/Logo.png'),
        brand_colors: ['#16A34A', '#000000'],
      };
      const resp = await API.marketing.generateVideo(payload);
      if (!resp.success) {
        setAiError(asReadableError(resp.error || resp.data?.error, 'Error generando video con Hugging Face'));
        return;
      }

      const hfBlock = resp.data?.huggingface || resp.data;
      if (!hfBlock) {
        setAiError('Respuesta inesperada del servidor al generar video.');
        return;
      }
      setVideoResponse(hfBlock);

      const data = hfBlock?.data || {};
      const fallbackUrl = resp.data?.video_url;
      const fallbackBase64 = resp.data?.video_base64;
      const mimeType = data?.mime_type || resp.data?.video_mime_type || 'video/mp4';
      const base64Payload = data?.video_base64 || fallbackBase64;
      const remoteUrl = data?.video_url || fallbackUrl;

      if (base64Payload) {
        const blob = base64ToBlob(base64Payload, mimeType);
        if (!blob) {
          setAiError('No se pudo decodificar el video generado.');
          return;
        }
        if (videoPreviewIsBlob && videoPreviewUrl) {
          URL.revokeObjectURL(videoPreviewUrl);
        }
        const url = URL.createObjectURL(blob);
        setVideoPreviewIsBlob(true);
        setVideoPreviewUrl(url);
        setVideoDetails({ mimeType, size: blob.size, source: hfBlock.simulated ? 'simulado' : 'huggingface' });
        setSuccess('Video generado con Hugging Face.');
        return;
      }

      if (remoteUrl) {
        if (videoPreviewIsBlob && videoPreviewUrl) {
          URL.revokeObjectURL(videoPreviewUrl);
        }
        setVideoPreviewIsBlob(false);
        setVideoPreviewUrl(remoteUrl);
        setVideoDetails({ mimeType, size: data?.bytes || null, source: hfBlock.simulated ? 'simulado' : 'huggingface' });
        setSuccess('Video generado con Hugging Face.');
        return;
      }

      if (hfBlock.ok === false) {
        setAiError(asReadableError(hfBlock.error, 'Hugging Face devolvió un error.'));
      } else {
        setAiError('No se recibió video desde Hugging Face.');
      }
    } catch (e) {
      setAiError(asReadableError(e, 'Fallo generando video con Hugging Face'));
    } finally {
      setAiBusy(false);
    }
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
        {/* Botón de submit removido: el ModalWrapper ya provee el botón principal usando el id=form-publicar */}

        {/* Últimas publicaciones */}
        {recent.length > 0 && (
          <div className="mt-4">
            <h4 className="text-green-300 text-sm mb-2">Últimas publicaciones</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {recent.slice(0, 6).map((p, idx) => (
                <div key={idx} className="bg-gray-900 border border-green-800 rounded p-1">
                  <div className="flex gap-1">
                    {p.before && (<img src={p.before} alt="before" className="w-16 h-12 object-cover rounded" />)}
                    {p.after && (<img src={p.after} alt="after" className="w-16 h-12 object-cover rounded hidden sm:block" />)}
                  </div>
                  {p.comment && <div className="text-xs text-gray-300 mt-1 line-clamp-2" title={p.comment}>{p.comment}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IA / Reel */}
        <div className="mt-4 space-y-2">
          <h4 className="text-green-300 text-sm">Reel con IA</h4>
          {aiError && <div className="text-red-400 text-xs p-2 bg-red-900/30 rounded border border-red-700">{aiError}</div>}
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleGeneratePrompt} disabled={aiBusy} className="bg-emerald-800 border border-emerald-600 px-3 py-1 rounded-full text-xs disabled:opacity-50">
              {aiBusy ? 'Generando...' : 'Generar prompt'}
            </button>
            <button type="button" onClick={handleGenerateVideo} disabled={aiBusy} className="bg-blue-800 border border-blue-600 px-3 py-1 rounded-full text-xs disabled:opacity-50">
              {aiBusy ? 'Generando video…' : 'Generar video (Hugging Face)'}
            </button>
          </div>
          {promptData && (
            <div className="mt-2 grid gap-2">
              <div>
                <label className="block text-xs text-green-300 mb-1">Prompt</label>
                <textarea readOnly value={promptData.prompt || ''} className="w-full bg-black border border-green-700 text-white p-2 rounded text-xs" rows={5} />
              </div>
              <div>
                <label className="block text-xs text-green-300 mb-1">Caption</label>
                <textarea readOnly value={promptData.caption || ''} className="w-full bg-black border border-green-700 text-white p-2 rounded text-xs" rows={2} />
              </div>
            </div>
          )}
          {videoResponse && (
            <div className="space-y-2">
              <div className="text-xs text-gray-300">
                {videoResponse.ok === false
                  ? `Hugging Face: ${videoResponse.error || 'Error'}`
                  : videoResponse.simulated
                    ? 'Video generado en modo simulación de Hugging Face.'
                    : 'Video generado con Hugging Face.'}
              </div>
              {videoDetails && (
                <div className="text-[11px] text-gray-400">
                  {buildVideoMeta(videoDetails)}
                </div>
              )}
              {videoPreviewUrl && (
                <div className="mt-2">
                  <label className="block text-xs text-green-300 mb-1">Preview del video</label>
                  <video src={videoPreviewUrl} controls className="w-full max-h-80 border border-green-700 rounded" />
                  {videoPreviewIsBlob ? (
                    <a href={videoPreviewUrl} download="huggingface-reel.mp4" className="text-xs text-blue-300 hover:underline block mt-1">Descargar video</a>
                  ) : (
                    <a href={videoPreviewUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-300 hover:underline block mt-1">Abrir en nueva pestaña</a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
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
