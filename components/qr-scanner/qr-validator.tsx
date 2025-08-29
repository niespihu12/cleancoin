"use client";

import React, { useState, useRef, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api-client';
import { QRValidationResponse } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Camera, ScanLine, XCircle, CheckCircle2, PartyPopper } from 'lucide-react';

type ValidationStep = 'SCANNING_QR' | 'CAPTURING_PHOTO' | 'PREVIEWING_PHOTO' | 'UPLOADING' | 'RESULT';

export function QrValidator() {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<ValidationStep>('SCANNING_QR');
  const [qrData, setQrData] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [response, setResponse] = useState<QRValidationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (step === 'CAPTURING_PHOTO') {
      startVideoStream();
    } else {
      stopVideoStream();
    }

    return () => stopVideoStream();
  }, [step]);

  const startVideoStream = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("No se pudo acceder a la cámara. Asegúrate de haber otorgado los permisos necesarios.");
      setError("Error de cámara. No se puede continuar.");
      setStep('SCANNING_QR');
    }
  };

  const stopVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleQrScan = (result: any, error: any) => {
    if (result) {
      setQrData(result?.text);
      setStep('CAPTURING_PHOTO');
    }
    if (error) {
      // Errors are frequent, so we only log them for debugging
      // console.info("QR Scan Error:", error);
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageData(dataUrl);
        setStep('PREVIEWING_PHOTO');
      }
    }
  };

  const handleSubmit = async () => {
    if (!qrData || !imageData || !user) {
      setError("Faltan datos para la validación. Inténtalo de nuevo.");
      return;
    }

    setStep('UPLOADING');
    setError(null);

    try {
      // Remove the "data:image/jpeg;base64," prefix
      const base64Image = imageData.split(',')[1];
      
      const res = await apiClient.validateQR({
        qr_code: qrData,
        image_data: base64Image,
        user_id: user.id,
      });
      setResponse(res);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocurrió un error desconocido.";
      setError(errorMessage);
    } finally {
      setStep('RESULT');
    }
  };

  const reset = () => {
    setStep('SCANNING_QR');
    setQrData(null);
    setImageData(null);
    setResponse(null);
    setError(null);
    setCameraError(null);
  };

  if (!isAuthenticated || !user) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Acceso Denegado</AlertTitle>
        <AlertDescription>Debes iniciar sesión para poder validar un reciclaje.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          <ScanLine className="mr-2" /> Validar Reciclaje
        </CardTitle>
        <CardDescription className="text-center">
          Sigue los pasos para ganar CleanPoints.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          
          {cameraError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error de Cámara</AlertTitle>
              <AlertDescription>{cameraError}</AlertDescription>
            </Alert>
          )}

          {step === 'SCANNING_QR' && (
            <>
              <p className="text-sm text-muted-foreground">Paso 1: Escanea el código QR del contenedor.</p>
              <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
                <QrReader
                  onResult={handleQrScan}
                  constraints={{ facingMode: 'environment' }}
                  ViewFinder={() => (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '60%',
                      height: '60%',
                      border: '2px solid #10B981',
                      borderRadius: '8px',
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                    }} />
                  )}
                  videoContainerStyle={{
                    width: '100%',
                    height: '100%',
                    paddingTop: '0'
                  }}
                  videoStyle={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </>
          )}

          {step === 'CAPTURING_PHOTO' && (
            <>
              <p className="text-sm text-muted-foreground">Paso 2: Toma una foto clara del residuo que depositaste.</p>
              <div className="w-full aspect-square bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              </div>
              <Button onClick={handleCapturePhoto} size="lg">
                <Camera className="mr-2 h-5 w-5" />
                Tomar Foto
              </Button>
            </>
          )}

          {step === 'PREVIEWING_PHOTO' && imageData && (
            <>
              <p className="text-sm text-muted-foreground">Paso 3: Confirma la foto y envía para validación.</p>
              <img src={imageData} alt="Vista previa del reciclaje" className="rounded-lg max-w-full" />
              <div className="flex gap-4">
                <Button onClick={() => setStep('CAPTURING_PHOTO')} variant="outline">Tomar de Nuevo</Button>
                <Button onClick={handleSubmit}>Confirmar y Validar</Button>
              </div>
            </>
          )}

          {step === 'UPLOADING' && (
            <div className="flex flex-col items-center justify-center space-y-2 p-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-semibold">Validando...</p>
              <p className="text-sm text-muted-foreground">Nuestro sistema está analizando tu foto.</p>
            </div>
          )}

          {step === 'RESULT' && (
            <div className="flex flex-col items-center justify-center space-y-4 p-4 text-center">
              {response && response.valid && (
                <>
                  <PartyPopper className="h-16 w-16 text-green-500" />
                  <h3 className="text-2xl font-bold text-green-600">¡Validación Exitosa!</h3>
                  <p className="text-lg">Has ganado <span className="font-bold">{response.cleanpoints_earned}</span> CleanPoints.</p>
                  <p className="text-sm text-muted-foreground">{response.message}</p>
                </>
              )}
              {(response && !response.valid) && (
                 <>
                  <XCircle className="h-16 w-16 text-destructive" />
                  <h3 className="text-2xl font-bold text-destructive">Validación Fallida</h3>
                  <p className="text-sm text-muted-foreground">{response.message}</p>
                </>
              )}
              {error && (
                <>
                  <XCircle className="h-16 w-16 text-destructive" />
                  <h3 className="text-2xl font-bold text-destructive">Ocurrió un Error</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </>
              )}
              <Button onClick={reset} className="mt-4">Escanear Otro</Button>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
