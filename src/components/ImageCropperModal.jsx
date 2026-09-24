import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { ZoomIn, ZoomOut, RotateCw, X, Check, Circle, Square, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

function calculateRotatedBox(width, height, rotation) {
  const rad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rad) * width) + Math.abs(Math.sin(rad) * height),
    height: Math.abs(Math.sin(rad) * width) + Math.abs(Math.cos(rad) * height),
  };
}

async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = calculateRotatedBox(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) return null;

  // Resolución óptima de 400x400 para nitidez máxima sin peso excesivo
  const TARGET_SIZE = 400;
  croppedCanvas.width = TARGET_SIZE;
  croppedCanvas.height = TARGET_SIZE;

  croppedCtx.imageSmoothingEnabled = true;
  croppedCtx.imageSmoothingQuality = 'high';

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    TARGET_SIZE,
    TARGET_SIZE
  );

  return croppedCanvas.toDataURL('image/jpeg', 0.88);
}

export const ImageCropperModal = ({ isOpen, imageSrc, onClose, onSaveCrop }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropShape, setCropShape] = useState('round'); // 'round' | 'rect'
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3, +(prev + 0.2).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(1, +(prev - 0.2).toFixed(2)));
  };

  const handleConfirmSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedDataUrl = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      if (croppedDataUrl) {
        onSaveCrop(croppedDataUrl);
      }
    } catch (err) {
      console.error('Error recortando imagen:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-[#11131c] border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black flex flex-col gap-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del modal */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
              {isEn ? 'Adjust Profile Picture' : 'Ajustar Foto de Perfil'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEn
                ? 'Drag to position, zoom, and rotate to frame your photo at will.'
                : 'Arrastra para encuadrar, ajusta el zoom o rota a tu gusto.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            title={isEn ? 'Cancel' : 'Cancelar'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenedor del Cropper interactivo */}
        <div className="relative w-full h-64 sm:h-80 bg-[#07080b] rounded-2xl overflow-hidden border border-white/10 shadow-inner">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape={cropShape}
            showGrid={true}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Barra de Controles y Herramientas */}
        <div className="space-y-3 pt-1">
          {/* Fila de Zoom */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title={isEn ? 'Zoom Out' : 'Alejar'}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-white cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
            />
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title={isEn ? 'Zoom In' : 'Acercar'}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold text-slate-300 w-11 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Fila de Herramientas Rápidas (Rotar y Forma) */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all active:scale-95"
                title={isEn ? 'Rotate 90 degrees' : 'Rotar 90 grados'}
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{isEn ? 'Rotate 90°' : 'Rotar 90°'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCropShape(cropShape === 'round' ? 'rect' : 'round')}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all active:scale-95"
                title={isEn ? 'Toggle circle or square mask' : 'Alternar máscara redonda o cuadrada'}
              >
                {cropShape === 'round' ? (
                  <>
                    <Circle className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isEn ? 'Circle Mask' : 'Círculo'}</span>
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isEn ? 'Square Mask' : 'Cuadrado'}</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setCrop({ x: 0, y: 0 });
                setZoom(1);
                setRotation(0);
              }}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline font-medium px-1"
            >
              {isEn ? 'Reset' : 'Restablecer'}
            </button>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-3 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs sm:text-sm border border-white/10 transition-all cursor-pointer disabled:opacity-50"
          >
            {isEn ? 'Cancel' : 'Cancelar'}
          </button>

          <button
            type="button"
            onClick={handleConfirmSave}
            disabled={isProcessing}
            className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 active:scale-95"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>{isEn ? 'Saving...' : 'Guardando...'}</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>{isEn ? 'Save Picture' : 'Guardar Foto'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
