'use client';

import dynamic from 'next/dynamic';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

// Importar el QRScanner de manera dinámica para evitar problemas de hidratación
const QRScannerNew = dynamic(
  () => import('@/components/qr-scanner/qr-scanner-new').then(mod => mod.QRScannerNew),
  {
    ssr: false, // Deshabilitamos SSR para este componente
    loading: () => (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">Cargando escáner...</p>
        </div>
      </div>
    )
  }
);

export default function RecolectarPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleValidationComplete = (response: any) => {
    if (response.valid) {
      toast({
        title: "¡Éxito!",
        description: `Has ganado ${response.cleanpoints_earned} CleanPoints por reciclar.`,
      });
    } else {
      toast({
        title: "Validación fallida",
        description: response.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-8">
          Recolectar y Reciclar
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Escanea el código QR de un contenedor y sube una foto de tu reciclaje para ganar CleanPoints.
        </p>
        
        <QRScannerNew onValidationComplete={handleValidationComplete} />
      </div>
    </div>
  );
}