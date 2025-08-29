'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface Html5QrcodePluginProps {
  onScan: (decodedText: string) => void;
  onError?: (error: string) => void;
  containerStyle?: string;
  active?: boolean;
}

export function Html5QrcodePlugin({ 
  onScan, 
  onError, 
  containerStyle = "w-full h-[300px]",
  active = true 
}: Html5QrcodePluginProps) {
  const html5QrCode = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const qrCodeId = "clean-point-qr-reader";
  const cleanupInProgress = useRef(false);
  const mountedRef = useRef(true);
  const lastForwardedErrorRef = useRef<number>(0);
  const consecutiveMissesRef = useRef<number>(0);
  const MISS_THRESHOLD = 10; // number of consecutive 'not found' before reporting
  const MISS_COOLDOWN_MS = 5000; // after reporting misses, wait before reporting again

  // Función de limpieza
  const cleanupScanner = async () => {
    if (cleanupInProgress.current) {
      console.log("Limpieza ya en progreso, esperando...");
      return;
    }

    cleanupInProgress.current = true;
    console.log("Iniciando limpieza del escáner");

    try {
      // Detener el escaneo si está activo
      if (html5QrCode.current?.isScanning) {
        console.log("Deteniendo escaneo activo...");
        try {
          await html5QrCode.current.stop();
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (stopError) {
          console.error("Error al detener el escaneo:", stopError);
        }
      }

      // Limpiar recursos de video
      if (typeof document !== 'undefined') {
        try {
          const videoElements = document.querySelectorAll(`#${qrCodeId} video`);
          videoElements.forEach(videoElement => {
            const video = videoElement as HTMLVideoElement;
            if (video.srcObject) {
              const stream = video.srcObject as MediaStream;
              stream.getTracks().forEach(track => {
                track.stop();
                stream.removeTrack(track);
              });
              video.srcObject = null;
            }
            video.remove();
          });
        } catch (streamError) {
          console.error("Error al limpiar streams de video:", streamError);
        }
      }

      // Limpiar instancia del scanner
      if (html5QrCode.current) {
        try {
          await html5QrCode.current.clear();
        } catch (clearError) {
          console.error("Error al limpiar el scanner:", clearError);
        }
        html5QrCode.current = null;
      }

      // Limpiar el contenedor
      if (containerRef.current && mountedRef.current) {
        containerRef.current.innerHTML = '';
      }

      setIsInitialized(false);
      setIsScanning(false);
    } catch (error) {
      console.error('Error en el proceso de limpieza:', error);
    } finally {
      cleanupInProgress.current = false;
    }
  };

  useEffect(() => {
    // Manejar la activación/desactivación del escáner
    let cleanupTimeout: NodeJS.Timeout;
    
    if (!active && isInitialized) {
      cleanupTimeout = setTimeout(cleanupScanner, 1000);
    }

    return () => {
      if (cleanupTimeout) {
        clearTimeout(cleanupTimeout);
      }
    };
  }, [active, isInitialized]);

  const handleScan = useRef((decodedText: string) => {
    if (mountedRef.current && html5QrCode.current?.isScanning) {
      onScan(decodedText);
      html5QrCode.current.stop().catch(console.error);
      setIsScanning(false);
    }
  });

  const handleError = useRef((errorMessage: string) => {
    const msg = (errorMessage || '').toString();
    // Filtrar errores de parseo ruidosos que se esperan mientras se escanea frames
    const ignorePatterns = [
      'No QR code found',
      'IndexSizeError',
      'getImageData',
      'source width is 0',
      'NotFoundException',
      'No MultiFormat Readers were able to detect the code'
    ];

    if (ignorePatterns.some(p => msg.includes(p))) {
      // Es un 'miss' esperado (no QR en el frame)
      consecutiveMissesRef.current += 1;
      console.debug('Scanner miss:', msg, 'count=', consecutiveMissesRef.current);

      // Si supera el umbral y no hemos informado recientemente, informar al UI
      const now = Date.now();
      if (consecutiveMissesRef.current >= MISS_THRESHOLD && (now - (lastForwardedErrorRef.current || 0)) > MISS_COOLDOWN_MS) {
        lastForwardedErrorRef.current = now;
        console.warn('Varios frames sin QR detectado, informando al UI');
        onError?.('No se detecta un código QR. Ajusta la cámara, iluminación o acércate al código.');
      }

      return;
    }

    // Para errores distintos a 'not found', resetear contador
    consecutiveMissesRef.current = 0;

    // Rate-limit forwarded errors to avoid UI spam (only forward one every 2s)
    const now = Date.now();
    const since = now - (lastForwardedErrorRef.current || 0);
    if (since < 2000) {
      console.debug('Throttled scanner error:', msg);
      return;
    }

    lastForwardedErrorRef.current = now;
    console.warn('Error en escaneo:', msg);
    onError?.(msg);
  });

  useEffect(() => {
    handleScan.current = (decodedText: string) => {
      if (mountedRef.current && html5QrCode.current?.isScanning) {
        onScan(decodedText);
        html5QrCode.current.stop().catch(console.error);
        setIsScanning(false);
      }
    };
  }, [onScan]);

  useEffect(() => {
    handleError.current = (errorMessage: string) => {
      if (!errorMessage.includes('No QR code found')) {
        console.warn("Error en escaneo:", errorMessage);
        onError?.(errorMessage);
      }
    };
  }, [onError]);

  useEffect(() => {
    mountedRef.current = true;

    const initializeScanner = async () => {
      if (!containerRef.current || isInitialized || !active || isScanning) {
        console.log("Inicialización cancelada:", { isInitialized, active, isScanning });
        return;
      }

      try {
        await cleanupScanner();

        // Crear contenedor del scanner
        const container = document.createElement('div');
        container.id = qrCodeId;
        container.style.cssText = 'width: 100%; height: 100%; min-height: 300px;';
        
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(container);
        }

        // Crear instancia del scanner
        html5QrCode.current = new Html5Qrcode(qrCodeId);
        
        if (!html5QrCode.current) {
          throw new Error('No se pudo crear la instancia del scanner');
        }

        const qrboxSize = 250;
        const config = {
          fps: 10,
          qrbox: qrboxSize,
          aspectRatio: 1.0
        };

        console.log('Iniciando scanner...');
        // Esperar a que el contenedor tenga dimensiones válidas para evitar canvas con ancho 0
        const waitForContainerSize = async (timeout = 2000) => {
          const start = Date.now();
          while (Date.now() - start < timeout) {
            const w = containerRef.current?.clientWidth || 0;
            const h = containerRef.current?.clientHeight || 0;
            if (w > 0 && h > 0) return true;
            // small delay
            // eslint-disable-next-line no-await-in-loop
            await new Promise(res => setTimeout(res, 50));
          }
          return false;
        };

        const ready = await waitForContainerSize(3000);
        if (!ready) {
          console.warn('Contenedor del escáner no tuvo tamaño válido antes del timeout');
        }

        setIsScanning(true);

        await html5QrCode.current.start(
          { facingMode: "environment" },
          config,
          (text: string) => handleScan.current(text),
          (error: string) => handleError.current(error)
        );

        setIsInitialized(true);
        console.log('Scanner iniciado correctamente');
      } catch (error) {
        console.error('Error al inicializar:', error);
        onError?.(error instanceof Error ? error.message : 'Error al inicializar el scanner');
        setIsScanning(false);
        setIsInitialized(false);
      }
    };

    initializeScanner();

    return () => {
      mountedRef.current = false;
      cleanupScanner();
    };
  }, [active]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={containerRef} 
        className={`${containerStyle} absolute inset-0 bg-black qr-scanner-container`}
      />
      <style jsx global>{`
        .qr-scanner-container video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 0.5rem;
        }
        #clean-point-qr-reader {
          width: 100% !important;
          height: 100% !important;
        }
        #clean-point-qr-reader video {
          max-height: none !important;
        }
      `}</style>
    </div>
  );
}
