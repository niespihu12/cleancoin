'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  QrCode,
  Camera,
  CheckCircle,
  XCircle,
  Loader2,
  Trophy,
  RotateCcw,
  ArrowLeft,
  Scan,
  Save
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/contexts/auth-context';

// Cargar Html5QrcodeScanner solo en el cliente
const Html5QrcodePlugin = dynamic(() => import('./html5-qrcode-plugin-new').then((mod) => mod.Html5QrcodePlugin), {
  ssr: false,
  loading: () => <div className="text-center p-8">Cargando escáner QR...</div>
});

// Simulación de tipos para el ejemplo
interface QRValidationRequest {
  qr_code: string;
  image_data: string;
  user_id: string;
}

interface QRValidationResponse {
  valid: boolean;
  message: string;
  cleanpoints_earned?: number;
}

// Mock user context
const mockUser = { id: 'user-123' };

// Mock API client
const mockApiClient = {
  validateQR: async (data: QRValidationRequest): Promise<QRValidationResponse> => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simular respuesta exitosa o fallida aleatoriamente
    const isValid = Math.random() > 0.3; // 70% de éxito

    return {
      valid: isValid,
      message: isValid ? 'Material reciclable detectado correctamente' : 'No se pudo validar el material reciclable',
      cleanpoints_earned: isValid ? Math.floor(Math.random() * 50) + 10 : 0
    };
  }
};

interface QRScannerProps {
  onValidationComplete?: (response: QRValidationResponse) => void;
}

export function QRScannerNew({ onValidationComplete }: QRScannerProps) {
  const { user, refreshUser } = useAuth();

  const postToBackend = async (payload: { qr_code: string; image_data: string; user_id: number }) => {
  const base = (process.env.NEXT_PUBLIC_API_URL || 'https://back-cleanpoint.onrender.com').replace(/\/$/, '');
  const url = `${base}${'/qr/validate'}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('cleanpoint_token') : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.detail || `Error ${resp.status}: ${resp.statusText}`);
    }

    return resp.json();
  };
  // Estados principales
  const [mounted, setMounted] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<QRValidationResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'qr' | 'photo' | 'validating' | 'result'>('qr');

  // Solo montar el componente en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Estados de cámara
  const [cameraActive, setCameraActive] = useState(false);
  const [qrScannerActive, setQrScannerActive] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Limpiar stream cuando el componente se desmonta
  useEffect(() => {
    return () => {
      deactivateCamera();
    };
  }, []);

  // Función para simular escaneo QR
  const simulateQRScan = () => {
    try {
      console.log('Iniciando simulación de escaneo QR');

      const fakeQRCode = `RECICLAJE_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      console.log(`QR generado: ${fakeQRCode}`);

      // Limpiar errores previos
      setError('');

      // Actualizar estados
      setQrCode(fakeQRCode);
      setQrScannerActive(false);

      console.log('Cambiando a paso de foto');

      // Cambiar al siguiente paso
      setStep('photo');

      // Si el usuario está autenticado, intentar notificar al backend de la simulación
      if (user && user.id) {
        (async () => {
          try {
            const placeholder = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='; // base64 PNG 1x1
            const payload = {
              qr_code: fakeQRCode,
              image_data: placeholder,
              user_id: user.id
            };
            const resp = await postToBackend(payload);
            console.log('Simulación backend respuesta:', resp);
            setValidationResult({
              valid: resp.valid ?? resp.valid === undefined ? resp.valid : resp.valid,
              message: resp.message || resp.detail || 'Respuesta del servidor',
              cleanpoints_earned: resp.cleanpoints_earned ?? resp.points_awarded ?? 0
            } as any);
            setStep('result');
            if (onValidationComplete) onValidationComplete(resp as any);
            if (user && refreshUser) {
              try { await refreshUser(); } catch (e) { console.warn('Error refrescando usuario tras simulación', e); }
            }
          } catch (err) {
            console.error('Error enviando simulación al backend:', err);
          }
        })();
      }

      console.log('Simulación completada exitosamente');

    } catch (err) {
      console.error('Error en simulación:', err);
      setError(`Error en simulación: ${err}`);
    }
  };

  // Función para activar el escáner QR real
  const activateQRScanner = () => {
    setError(''); // Clear any previous errors
    setQrScannerActive(true);
  };

  // Limpiar estados cuando se cambia de paso
  useEffect(() => {
    if (step !== 'qr') {
      setQrScannerActive(false);
    }
  }, [step]);

  // Función para manejar el escaneo QR exitoso (v3.0.0-beta-1 API)
  const handleQRScan = (result: any) => {
    if (result) {
      console.log('QR escaneado:', result);
      // En v3.0.0-beta-1, el resultado puede venir en diferentes formatos
      const data = result.text || result.data || result;
      setQrCode(data);
      setQrScannerActive(false);
      setStep('photo');
    }
  };

  // Función para manejar errores del escáner QR
  const handleQRError = (err: any) => {
    console.error('Error en escáner QR:', err);
    setError('Error con el escáner QR. Usa la simulación o revisa los permisos de la cámara.');
  };

  // Función para activar cámara (mejorada)
  const activateCamera = async () => {
    try {
      console.log('Intentando activar cámara');
      setError(''); // Limpiar errores previos
      
      // Primero desactivar cualquier stream existente
      deactivateCamera();

      // Obtener el stream primero
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        }
      });

      console.log('Stream obtenido exitosamente');
      
      // Activar estado de cámara para renderizar elementos
      setCameraActive(true);
      streamRef.current = stream;

      // Esperar un momento para que React renderice los elementos
      await new Promise(resolve => setTimeout(resolve, 200));

      // Verificar que el elemento video está disponible
      if (!videoRef.current) {
        throw new Error('Elemento de video no disponible después del render');
      }

      // Asignar el stream al video
      videoRef.current.srcObject = stream;

      // Configurar event listeners del video
      const video = videoRef.current;
      
      const onLoadedMetadata = () => {
        console.log('Video metadata cargada:', video.videoWidth, 'x', video.videoHeight);
        setVideoLoaded(true);
      };

      const onError = (e: Event) => {
        console.error('Error en elemento video:', e);
        setError('Error cargando el video de la cámara');
        deactivateCamera();
      };

      video.addEventListener('loadedmetadata', onLoadedMetadata);
      video.addEventListener('error', onError);

      // Reproducir el video
      try {
        await video.play();
        console.log('Video iniciado exitosamente');
      } catch (playError) {
        console.error('Error reproduciendo video:', playError);
        throw new Error('No se pudo iniciar la reproducción del video');
      }

    } catch (err) {
      console.error('Error activando cámara:', err);
      setCameraActive(false);
      setVideoLoaded(false);
      
      let errorMessage = 'No se pudo acceder a la cámara. ';
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage += 'Permisos de cámara denegados. Por favor, permite el acceso a la cámara.';
        } else if (err.name === 'NotFoundError') {
          errorMessage += 'No se encontró una cámara disponible.';
        } else if (err.name === 'NotSupportedError') {
          errorMessage += 'La cámara no es compatible con este navegador.';
        } else {
          errorMessage += err.message;
        }
      }
      
      setError(errorMessage);

      // Limpiar stream si se creó pero falló después
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  // Función para desactivar la cámara
  const deactivateCamera = () => {
    console.log('Desactivando cámara');

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Track detenido:', track.kind);
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    setVideoLoaded(false);
  };

  // Función mejorada para capturar foto
  const capturePhoto = () => {
    console.log('Intentando capturar foto');
    setError(''); // Limpiar errores previos

    // Verificar que todos los elementos están disponibles
    if (!videoRef.current) {
      console.error('Elemento video no disponible');
      setError('Error: elemento de video no disponible. Intenta activar la cámara nuevamente.');
      return;
    }

    if (!canvasRef.current) {
      console.error('Elemento canvas no disponible');
      setError('Error: elemento canvas no disponible. Por favor, recarga la página.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Verificar que el video está listo
    if (!videoLoaded || video.readyState < 2) {
      console.error('Video no está listo. ReadyState:', video.readyState);
      setError('El video no está listo. Espera un momento e intenta de nuevo.');
      return;
    }

    // Verificar que el video tiene dimensiones válidas
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Video sin dimensiones válidas');
      setError('Error: el video no tiene dimensiones válidas. Intenta reactivar la cámara.');
      return;
    }

    try {
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('No se pudo obtener el contexto 2D del canvas');
      }

      // Configurar dimensiones del canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      console.log(`Capturando foto: ${canvas.width}x${canvas.height}`);

      // Limpiar canvas antes de dibujar
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar el frame actual del video en el canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Verificar que se dibujó algo en el canvas
      const imageData = context.getImageData(0, 0, 1, 1);
      if (imageData.data.every(pixel => pixel === 0)) {
        throw new Error('El canvas está vacío después de dibujar');
      }

      // Convertir a blob con callback más robusto
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('No se pudo crear el blob');
          setError('Error creando la imagen. Intenta de nuevo.');
          return;
        }

        console.log('Blob creado exitosamente, tamaño:', blob.size);

        const file = new File([blob], `recycling-photo-${Date.now()}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        
        setImageFile(file);
        console.log('Archivo creado:', file.name, 'Tamaño:', file.size);

        // Crear preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            setImagePreview(result);
            console.log('Preview creado exitosamente');
            // Desactivar cámara después de capturar exitosamente
            deactivateCamera();
          } else {
            setError('Error creando la vista previa de la imagen');
          }
        };
        reader.onerror = (e) => {
          console.error('Error creando preview:', e);
          setError('Error creando vista previa de la imagen');
        };
        reader.readAsDataURL(file);

      }, 'image/jpeg', 0.85); // Aumentar calidad a 85%

    } catch (err) {
      console.error('Error capturando foto:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error capturando foto: ${errorMessage}`);
    }
  };

  // Función para validar reciclaje
  const validateRecycling = async () => {
    if (!mockUser || !qrCode || !imageFile) {
      setError('Faltan datos para la validación');
      return;
    }

    setIsValidating(true);
    setStep('validating');
    setError('');

    try {
      console.log('Iniciando validación...');

      // Convertir imagen a base64
      const base64Image = await fileToBase64(imageFile);

      const validationData: any = {
        qr_code: qrCode,
        image_data: base64Image,
        user_id: user ? user.id : null,
      };

      console.log('Enviando validación:', {
        ...validationData,
        image_data: `${base64Image.substring(0, 50)}...` // Solo mostrar primeros 50 chars
      });

      let response: any;
      if (user && user.id) {
        // Usar backend real
        response = await postToBackend(validationData);
      } else {
        // Fallback a mock
        response = await (async () => {
          await new Promise(r => setTimeout(r, 1000));
          const ok = Math.random() > 0.3;
          return {
            valid: ok,
            message: ok ? 'Material reciclable detectado correctamente' : 'No se pudo validar el material reciclable',
            cleanpoints_earned: ok ? Math.floor(Math.random() * 50) + 10 : 0
          };
        })();
      }

      console.log('Respuesta recibida:', response);

      setValidationResult(response);
      setStep('result');

      // Si se usó el backend real, refrescar el perfil del usuario para actualizar CleanPoints en UI
      if (user && refreshUser) {
        try {
          await refreshUser();
        } catch (e) {
          console.warn('No se pudo refrescar el usuario después de validación:', e);
        }
      }

      if (onValidationComplete) {
        onValidationComplete(response);
      }
    } catch (error) {
      console.error('Error en validación:', error);
      setError(error instanceof Error ? error.message : 'Error en la validación');
      setStep('photo'); // Return to photo step on error
    } finally {
      setIsValidating(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remover el prefijo data:image/...;base64,
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const resetScanner = () => {
    console.log('Reiniciando escáner');
    setQrCode('');
    setImageFile(null);
    setImagePreview('');
    setValidationResult(null);
    setError('');
    setStep('qr');
    setQrScannerActive(false);
    deactivateCamera();
  };

  const goBack = () => {
    if (step === 'photo') {
      setStep('qr');
      setImageFile(null);
      setImagePreview('');
      deactivateCamera();
    } else if (step === 'validating') {
      setIsValidating(false);
      setStep('photo');
    }
  };

  // No renderizar nada hasta que el componente esté montado en el cliente
  if (!mounted) return null;

  // Renderizar paso QR
  if (step === 'qr') {
    return (
      <div className="w-full max-w-lg mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-600">
              Escáner de Reciclaje
            </CardTitle>
            <CardDescription>
              Escanea y valida tu reciclaje para ganar CleanPoints
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {qrScannerActive ? (
              <div className="space-y-4">
                <div className="text-center">
                  <QrCode className="mx-auto h-16 w-16 text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold">Escaneando Código QR</h3>
                  <p className="text-gray-600">Apunta la cámara al código QR del contenedor</p>
                </div>

                <div className="relative">
                  {qrScannerActive && (
                    <div className="w-full aspect-square">
                      <Html5QrcodePlugin
                        onScan={(decodedText: string) => {
                          console.log("QR escaneado:", decodedText);
                          setQrCode(decodedText);
                          setQrScannerActive(false);
                          setStep("photo");
                        }}
                        onError={(errorMessage: string) => {
                          if (!errorMessage.includes('No QR code found')) {
                            console.error("Error escáner:", errorMessage);
                            setError("Error con el escáner QR. Por favor, intenta de nuevo.");
                          }
                        }}
                        containerStyle="w-full h-full rounded-lg overflow-hidden border-2 border-green-200"
                      />
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => setQrScannerActive(false)}
                  variant="outline"
                  className="w-full"
                >
                  Cancelar Escaneo
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <QrCode className="mx-auto h-20 w-20 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold">Escanea el Código QR</h3>
                  <p className="text-gray-600">Coloca el código QR del contenedor de reciclaje</p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={activateQRScanner}
                    className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                  >
                    <Scan className="mr-3 h-5 w-5" />
                    Activar Escáner QR Real
                  </Button>

                  <Button
                    onClick={simulateQRScan}
                    variant="outline"
                    className="w-full h-12 text-lg"
                  >
                    <Save className="mr-3 h-5 w-5" />
                    Simular Escaneo QR
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-gray-500 text-sm">
                    Usa el escáner real o la simulación para desarrollo
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Canvas para captura - ahora visible pero fuera de la vista */}
        <canvas 
          ref={canvasRef} 
          style={{ 
            position: 'absolute', 
            left: '-9999px', 
            top: '-9999px',
            width: '1px',
            height: '1px'
          }} 
        />
      </div>
    );
  }

  // Renderizar paso de foto
  if (step === 'photo') {
    return (
      <div className="w-full max-w-lg mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-600">
              Toma una Foto
            </CardTitle>
            <CardDescription>
              Captura el material que vas a reciclar
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>QR Escaneado:</strong> {qrCode}
              </p>
            </div>

            {imagePreview ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-green-200"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-white"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={validateRecycling}
                  className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                  disabled={!qrCode || !imageFile}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Validar Reciclaje
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cameraActive ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-64 object-cover rounded-lg border-2 border-green-200 bg-black"
                      />
                      {!videoLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                          <div className="text-center text-white">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin mb-2" />
                            <p className="text-sm">Cargando cámara...</p>
                          </div>
                        </div>
                      )}
                      {videoLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="border-2 border-green-500 border-dashed w-48 h-48 rounded-lg flex items-center justify-center">
                            <Camera className="h-16 w-16 text-green-500 opacity-50" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={capturePhoto}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={!videoLoaded}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        {videoLoaded ? 'Capturar Foto' : 'Cargando...'}
                      </Button>
                      <Button
                        onClick={deactivateCamera}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={activateCamera}
                    className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Activar Cámara
                  </Button>
                )}
              </div>
            )}

            <Button
              onClick={goBack}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Escaneo QR
            </Button>
          </CardContent>
        </Card>

        {/* Canvas para captura - ahora visible pero fuera de la vista */}
        <canvas 
          ref={canvasRef} 
          style={{ 
            position: 'absolute', 
            left: '-9999px', 
            top: '-9999px',
            width: '1px',
            height: '1px'
          }} 
        />
      </div>
    );
  }

  // Renderizar paso de validación
  if (step === 'validating') {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-600">
            Validando Reciclaje
          </CardTitle>
          <CardDescription>
            Nuestro sistema está analizando tu foto
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-6">
            <Loader2 className="mx-auto h-20 w-20 text-green-600 animate-spin" />
            <h3 className="text-xl font-semibold">Procesando...</h3>
            <Progress value={75} className="w-full" />

            <Button
              onClick={goBack}
              variant="outline"
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Renderizar resultado
  if (step === 'result') {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-600">
            Resultado de Validación
          </CardTitle>
          <CardDescription>
            {validationResult?.valid ? '¡Felicitaciones!' : 'Intenta de nuevo'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-6">
            {validationResult?.valid ? (
              <>
                <CheckCircle className="mx-auto h-20 w-20 text-green-600" />
                <h3 className="text-xl font-semibold text-green-600">
                  ¡Reciclaje Validado!
                </h3>
                <div className="bg-green-50 p-6 rounded-lg">
                  <Badge variant="secondary" className="text-green-700 bg-green-100 text-lg px-4 py-2">
                    <Trophy className="mr-2 h-5 w-5" />
                    +{validationResult.cleanpoints_earned} CleanPoints
                  </Badge>
                </div>
                <p className="text-gray-600">{validationResult.message}</p>
              </>
            ) : (
              <>
                <XCircle className="mx-auto h-20 w-20 text-red-600" />
                <h3 className="text-xl font-semibold text-red-600">
                  Validación Fallida
                </h3>
                <p className="text-gray-600">{validationResult?.message}</p>
              </>
            )}

            <Button
              onClick={resetScanner}
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Escanear Otro
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}