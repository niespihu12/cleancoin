'use client';

import React, { useState, useRef } from 'react';
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
import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api-client';
import { QRValidationRequest, QRValidationResponse } from '@/lib/types';

// Fixed dynamic import for react-qr-reader
const QrReader = dynamic(
  () => import('react-qr-reader').then((mod) => mod.default || mod), 
  { 
    ssr: false,
    loading: () => <div className="text-center p-8">Cargando escáner QR...</div>
  }
);

interface QRScannerProps {
  onValidationComplete?: (response: QRValidationResponse) => void;
}

export const QRScannerNew: React.FC<QRScannerProps> = ({ onValidationComplete }) => {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<QRValidationResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'qr' | 'photo' | 'validating' | 'result'>('qr');
  const [cameraActive, setCameraActive] = useState(false);
  const [qrScannerActive, setQrScannerActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Función para simular escaneo QR
  const simulateQRScan = () => {
    const fakeQRCode = `RECICLAJE_${Math.floor(Math.random() * 1000)}`;
    setQrCode(fakeQRCode);
    setQrScannerActive(false);
    setStep('photo');
  };

  // Función para activar el escáner QR usando la API nativa del navegador
  const activateQRScanner = async () => {
    setQrScannerActive(true);
    setError('');
    
    try {
      // Check if BarcodeDetector is available
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new (window as any).BarcodeDetector({
          formats: ['qr_code']
        });
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          
          // Start detecting QR codes
          const detectQR = async () => {
            if (videoRef.current && qrScannerActive) {
              try {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes.length > 0) {
                  const qrData = barcodes[0].rawValue;
                  handleQRScan(qrData);
                  return;
                }
              } catch (err) {
                console.error('QR detection error:', err);
              }
              
              // Continue detecting if still active
              if (qrScannerActive) {
                setTimeout(detectQR, 100);
              }
            }
          };
          
          videoRef.current.onloadedmetadata = () => {
            detectQR();
          };
        }
      } else {
        // Fallback: Just show camera and let user manually input
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
        
        setError('Detección automática no disponible. Usa la simulación o ingresa el código manualmente.');
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
      setQrScannerActive(false);
    }
  };

  // Función para manejar el escaneo QR exitoso
  const handleQRScan = (data: string) => {
    console.log('QR escaneado:', data);
    setQrCode(data);
    setQrScannerActive(false);
    
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setStep('photo');
  };

  // Función para detener el escáner QR
  const stopQRScanner = () => {
    setQrScannerActive(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Función para activar la cámara para fotos
  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  // Función para desactivar la cámara
  const deactivateCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Función para capturar foto
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'recycling-photo.jpg', { type: 'image/jpeg' });
            setImageFile(file);
            
            // Crear preview
            const reader = new FileReader();
            reader.onload = (e) => {
              setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
          }
        }, 'image/jpeg', 0.8);
      }
    }
    deactivateCamera();
  };

  // Función para validar reciclaje
  const validateRecycling = async () => {
    if (!user || !qrCode || !imageFile) {
      setError('Faltan datos para la validación');
      return;
    }

    setIsValidating(true);
    setStep('validating');
    setError('');

    try {
      // Convertir imagen a base64
      const base64Image = await fileToBase64(imageFile);
      
      const validationData: QRValidationRequest = {
        qr_code: qrCode,
        image_data: base64Image,
        user_id: user.id,
      };

      console.log('Enviando validación:', validationData);
      const response = await apiClient.validateQR(validationData);
      console.log('Respuesta recibida:', response);
      
      setValidationResult(response);
      setStep('result');
      
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
    setQrCode('');
    setImageFile(null);
    setImagePreview('');
    setValidationResult(null);
    setError('');
    setStep('qr');
    setQrScannerActive(false);
    stopQRScanner();
  };

  const goBack = () => {
    if (step === 'photo') {
      setStep('qr');
      setImageFile(null);
      setImagePreview('');
    } else if (step === 'validating') {
      setIsValidating(false);
      setStep('photo');
    }
  };

  // Renderizar contenido según el paso
  if (step === 'qr') {
    return (
      <Card className="w-full max-w-lg mx-auto">
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
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover rounded-lg border-2 border-green-200"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-green-500 border-dashed w-48 h-48 rounded-lg flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-green-500 opacity-50" />
                  </div>
                </div>
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  Buscando código QR...
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={stopQRScanner}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar Escaneo
                </Button>
                <Button
                  onClick={simulateQRScan}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Usar Simulación
                </Button>
              </div>
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
    );
  }

  if (step === 'photo') {
    return (
      <Card className="w-full max-w-lg mx-auto">
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

          <div className="text-center">
            <Camera className="mx-auto h-20 w-20 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold">Toma una Foto</h3>
            <p className="text-gray-600">Captura el material que vas a reciclar</p>
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
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>QR Escaneado:</strong> {qrCode}
                </p>
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
                      className="w-full h-64 object-cover rounded-lg border-2 border-green-200"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-2 border-green-500 border-dashed w-48 h-48 rounded-lg flex items-center justify-center">
                        <Camera className="h-16 w-16 text-green-500 opacity-50" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={capturePhoto}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Capturar Foto
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
              
              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  Usa la cámara para capturar el material
                </p>
              </div>
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
    );
  }

  if (step === 'validating') {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-600">
            Escáner de Reciclaje
          </CardTitle>
          <CardDescription>
            Escanea y valida tu reciclaje para ganar CleanPoints
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-6">
            <Loader2 className="mx-auto h-20 w-20 text-green-600 animate-spin" />
            <h3 className="text-xl font-semibold">Validando Reciclaje...</h3>
            <p className="text-gray-600">Nuestro sistema está analizando tu foto</p>
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

  if (step === 'result') {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-600">
            Escáner de Reciclaje
          </CardTitle>
          <CardDescription>
            Escanea y valida tu reciclaje para ganar CleanPoints
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

  return (
    <>
      {/* Canvas oculto para captura */}
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
};