'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, Camera, CheckCircle, XCircle } from 'lucide-react';

export const QRTest: React.FC = () => {
  const [qrCode, setQrCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testBackend = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/qr/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ Backend funcionando: ${data.message}`);
      } else {
        setMessage(`❌ Error del backend: ${response.status}`);
      }
    } catch (error) {
      setMessage(`⚠️ No se pudo conectar al backend: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateQR = () => {
    const fakeQR = `RECICLAJE_${Math.floor(Math.random() * 1000)}`;
    setQrCode(fakeQR);
    setMessage(`🎯 QR simulado: ${fakeQR}`);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-green-600">
          Prueba QR Scanner
        </CardTitle>
        <CardDescription>
          Componente de prueba para verificar la funcionalidad
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="text-center">
            <QrCode className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold">Prueba de Funcionalidad</h3>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={testBackend}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Probando...' : 'Probar Conexión Backend'}
            </Button>
            
            <Button
              onClick={simulateQR}
              variant="outline"
              className="w-full"
            >
              Simular Escaneo QR
            </Button>
          </div>
        </div>

        {qrCode && (
          <div className="space-y-2">
            <Label htmlFor="qr-code">Código QR:</Label>
            <Input
              id="qr-code"
              value={qrCode}
              readOnly
              className="text-center font-mono"
            />
          </div>
        )}

        {message && (
          <Alert variant={message.includes('✅') ? 'default' : message.includes('❌') ? 'destructive' : 'default'}>
            {message.includes('✅') ? (
              <CheckCircle className="h-4 w-4" />
            ) : message.includes('❌') ? (
              <XCircle className="h-4 w-4" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
