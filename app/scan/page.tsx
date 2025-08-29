'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Html5QrcodePlugin } from '@/components/qr-scanner/html5-qrcode-plugin-new';

enum ScanningStep {
  Instructions,
  ScanQR,
  TakePhoto,
  Processing,
  Success
}

export default function QRValidationScreen() {
  const [step, setStep] = useState<ScanningStep>(ScanningStep.Instructions);
  const { toast } = useToast();
  const router = useRouter();

  const startScanning = () => {
    toast({
      title: "Iniciando escaneo",
      description: "Preparando la cámara para escanear el código QR...",
    });
    setStep(ScanningStep.ScanQR);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 max-w-md mx-auto">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Image
              src="/placeholder-logo.svg"
              alt="Recycling Icon"
              width={100}
              height={100}
              className="mb-4"
            />
          </div>
          
          <h1 className="text-2xl font-bold">Validar Reciclaje</h1>
          <p className="text-gray-600">
            Sigue los pasos para ganar Clean Points
          </p>

          {step === ScanningStep.Instructions && (
            <div className="space-y-4">
              <div className="text-left space-y-2">
                <h3 className="font-medium">Paso 1:</h3>
                <p>Escanea el código QR del contenedor.</p>
                <h3 className="font-medium">Paso 2:</h3>
                <p>Toma una foto del material que vas a reciclar.</p>
                <h3 className="font-medium">Paso 3:</h3>
                <p>Espera la validación y recibe tus puntos.</p>
              </div>
              <Button 
                onClick={startScanning}
                className="w-full"
              >
                Comenzar Validación
              </Button>
            </div>
          )}

          {step === ScanningStep.ScanQR && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2">Escaneando Código QR</h2>
              <p className="text-sm text-gray-600 mb-4">Apunta la cámara al código QR del contenedor</p>
              <div className="relative w-full h-[400px] border rounded-lg overflow-hidden bg-black">
                <Html5QrcodePlugin
                  onScan={(decodedText) => {
                    toast({
                      title: "QR Escaneado",
                      description: `Código validado: ${decodedText}`,
                    });
                    setStep(ScanningStep.Success);
                  }}
                  onError={(error) => {
                    console.error(error);
                    toast({
                      title: "Error",
                      description: "Hubo un problema al escanear el código QR",
                      variant: "destructive",
                    });
                  }}
                  containerStyle="w-full h-full"
                />
              </div>
              <Button 
                onClick={() => setStep(ScanningStep.Instructions)}
                variant="outline"
                className="w-full mt-4"
              >
                Cancelar Escaneo
              </Button>
            </div>
          )}

          {step === ScanningStep.Success && (
            <div className="space-y-4">
              <h3 className="text-green-600 font-bold">¡Validación Exitosa!</h3>
              <p>Has ganado 50 Clean Points</p>
              <Button 
                onClick={() => {
                  setStep(ScanningStep.Instructions);
                }}
                variant="outline"
              >
                Volver a Empezar
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
