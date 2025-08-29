'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface Html5QrcodePluginProps {
  onScan: (decodedText: string) => void;
  onError?: (error: string) => void;
  containerStyle?: string;
}

export function Html5QrcodePlugin({ onScan, onError, containerStyle = "w-full h-[300px]" }: Html5QrcodePluginProps) {
  const html5QrCode = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const qrCodeId = "clean-point-qr-reader";

  // Función para limpiar el escáner
  const cleanupScanner = async () => {
    try {
      if (html5QrCode.current) {
        // Detener el escaneo primero
        if (html5QrCode.current.isScanning) {
          await html5QrCode.current.stop();
        }
        
        // Limpiar el stream de video
        const videoElement = document.querySelector(`#${qrCodeId} video`);
        if (videoElement) {
          const stream = (videoElement as HTMLVideoElement).srcObject as MediaStream;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          (videoElement as HTMLVideoElement).srcObject = null;
        }
        
        // Limpiar el scanner
        await html5QrCode.current.clear();
        html5QrCode.current = null;
      }

      // Limpiar el contenedor del QR
      const qrContainer = document.getElementById(qrCodeId);
      if (qrContainer && qrContainer.parentNode) {
        qrContainer.innerHTML = '';
      }

      setIsInitialized(false);
    } catch (error) {
      console.error('Error limpiando el escáner:', error);
    }
  };

  useEffect(() => {
    // Esperar a que el DOM esté listo
    if (!containerRef.current || isInitialized) return;

    const qrCodeId = "clean-point-qr-reader";
    const existingContainer = document.getElementById(qrCodeId);
    
    // Si existe un contenedor previo, eliminarlo
    if (existingContainer) {
      existingContainer.remove();
    }

    // Crear nuevo contenedor
    const container = document.createElement('div');
    container.id = qrCodeId;
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.minHeight = '300px';
    
    // Limpiar el contenedor actual y agregar el nuevo
    if (containerRef.current) {
      containerRef.current.innerHTML = ''; // Usar innerHTML en lugar de removeChild
      containerRef.current.appendChild(container);
    }

    // Crear nueva instancia con un pequeño delay para asegurar que el DOM está listo
    const initTimeout = setTimeout(() => {
      try {
        // Verificar que el contenedor tenga dimensiones válidas
        const containerWidth = containerRef.current?.clientWidth || 0;
        const containerHeight = containerRef.current?.clientHeight || 0;
        
        if (containerWidth === 0 || containerHeight === 0) {
          throw new Error('El contenedor del escáner no tiene dimensiones válidas');
        }

        html5QrCode.current = new Html5Qrcode(qrCodeId);

        const qrboxSize = Math.min(
          Math.min(containerWidth, containerHeight) - 50,
          250
        );

        const config = {
          fps: 10,
          qrbox: {
            width: qrboxSize,
            height: qrboxSize
          },
          aspectRatio: 1.0,
          disableFlip: false,
          formatsToSupport: ['QR_CODE'],
          videoConstraints: {
            width: { min: 640, ideal: 1080, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
            facingMode: "environment"
          }
        };

        html5QrCode.current
          .start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
              console.log("QR detectado:", decodedText);
              onScan(decodedText);
              // Detener el escaneo después de un escaneo exitoso
              if (html5QrCode.current) {
                html5QrCode.current.stop().catch(console.error);
              }
            },
            (errorMessage) => {
              // Solo reportar errores que no sean de escaneo normal o errores de inicialización
              if (!errorMessage.includes('No QR code found') && 
                  !errorMessage.includes('IndexSizeError')) {
                console.warn("Error en escaneo:", errorMessage);
                onError?.(errorMessage);
              }
            }
          )
          .then(() => {
            console.log("Scanner iniciado exitosamente");
            setIsInitialized(true);
          })
          .catch((err) => {
            console.error("Error iniciando scanner:", err);
            onError?.(`Error iniciando el escáner: ${err}`);
          });
      } catch (err) {
        console.error("Error en inicialización:", err);
        onError?.(`Error en inicialización: ${err}`);
      }
    }, 1000); // Dar tiempo para que el DOM se estabilice

    // Cleanup al desmontar
    return () => {
      cleanupScanner();
    };
  }, []);

  return (
    <div ref={containerRef} className={containerStyle}>
      {!isInitialized && (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-2"></div>
            <p className="text-sm text-gray-500">Iniciando cámara...</p>
          </div>
        </div>
      )}
    </div>
  );
}
