"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Camera, Check, MapPin, QrCode, Upload, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function RecolectarPage() {
  const [activeStep, setActiveStep] = useState(1)
  const [qrScanned, setQrScanned] = useState(false)
  const [photoTaken, setPhotoTaken] = useState(false)
  const [photoUrl, setPhotoUrl] = useState("")
  const { toast } = useToast()

  const handleScanQR = () => {
    // Simulación de escaneo QR
    setQrScanned(true)
    toast({
      title: "QR Escaneado",
      description: "Contenedor de plástico identificado correctamente",
    })
    setActiveStep(2)
  }

  const handleTakePhoto = () => {
    // Simulación de toma de foto
    setPhotoTaken(true)
    setPhotoUrl("/placeholder.svg?height=300&width=400&text=Foto+de+Evidencia")
    toast({
      title: "Foto Capturada",
      description: "Evidencia registrada correctamente",
    })
  }

  const handleSubmitEvidence = () => {
    // Simulación de envío de evidencia
    toast({
      title: "¡Felicidades!",
      description: "Has ganado 50 CleanCoins por tu contribución",
      variant: "success",
    })
    setActiveStep(3)
  }

  const handleReset = () => {
    setActiveStep(1)
    setQrScanned(false)
    setPhotoTaken(false)
    setPhotoUrl("")
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recolectar Residuos</h1>
          <p className="text-muted-foreground">Escanea, deposita y gana CleanCoins</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Proceso de Recolección</CardTitle>
                <Badge variant="outline">Paso {activeStep} de 3</Badge>
              </div>
              <CardDescription>Sigue los pasos para completar tu acción de reciclaje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-8">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${activeStep >= 1 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
                  >
                    <QrCode className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2">Escanear QR</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className={`h-1 w-full ${activeStep >= 2 ? "bg-green-500" : "bg-muted"}`}></div>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${activeStep >= 2 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
                  >
                    <Camera className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2">Evidencia</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className={`h-1 w-full ${activeStep >= 3 ? "bg-green-500" : "bg-muted"}`}></div>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${activeStep >= 3 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
                  >
                    <Check className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2">Completado</span>
                </div>
              </div>

              {activeStep === 1 && (
                <div className="flex flex-col items-center justify-center space-y-6 py-8">
                  <div className="h-48 w-48 bg-muted rounded-lg flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Escanea el código QR del contenedor</h3>
                    <p className="text-muted-foreground mb-4">
                      Acércate al contenedor y escanea el código QR para identificarlo
                    </p>
                    <Button onClick={handleScanQR}>
                      <QrCode className="mr-2 h-4 w-4" />
                      Escanear QR
                    </Button>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="flex flex-col items-center justify-center space-y-6 py-8">
                  {!photoTaken ? (
                    <>
                      <div className="h-48 w-48 bg-muted rounded-lg flex items-center justify-center">
                        <Camera className="h-24 w-24 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-medium mb-2">Toma una foto de evidencia</h3>
                        <p className="text-muted-foreground mb-4">
                          Captura una imagen que muestre que has depositado correctamente tus residuos
                        </p>
                        <div className="flex gap-2">
                          <Button onClick={handleTakePhoto}>
                            <Camera className="mx-auto" />
                            Tomar Foto
                          </Button>
                      
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative h-64 w-full max-w-md rounded-lg overflow-hidden">
                        <Image src={photoUrl || "/placeholder.svg"} alt="Evidencia" fill className="object-cover" />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => setPhotoTaken(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-medium mb-2">¡Excelente trabajo!</h3>
                        <p className="text-muted-foreground mb-4">
                          Tu evidencia ha sido capturada. Confirma para recibir tus CleanCoins.
                        </p>
                        <Button onClick={handleSubmitEvidence}>Confirmar y Recibir Recompensa</Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeStep === 3 && (
                <div className="flex flex-col items-center justify-center space-y-6 py-8">
                  <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-12 w-12 text-green-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-medium mb-2">¡Acción Completada!</h3>
                    <p className="text-muted-foreground mb-2">Gracias por tu contribución al medio ambiente</p>
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <Image src="/placeholder.svg?height=24&width=24&text=$" alt="CleanCoin" width={24} height={24} />
                      <span className="text-2xl font-bold">+50</span>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleReset}>Reciclar Más</Button>
                      <Button variant="outline" asChild>
                        <Link href="/marketplace">Ir al Marketplace</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Información del Contenedor</CardTitle>
              <CardDescription>
                {qrScanned ? "Contenedor identificado" : "Escanea un QR para ver detalles"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!qrScanned ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <QrCode className="h-12 w-12 mb-4" />
                  <p>Aún no has escaneado ningún contenedor</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tipo:</span>
                    <Badge>Plástico</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Ubicación:</span>
                    <span className="text-sm">Plaza Central</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Estado:</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Disponible
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Capacidad:</span>
                    <span className="text-sm">65% lleno</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Recompensa:</span>
                    <div className="flex items-center">
                      <Image
                        src="/placeholder.svg?height=16&width=16&text=$"
                        alt="CleanCoin"
                        width={16}
                        height={16}
                        className="mr-1"
                      />
                      <span>50 CleanCoins</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/mapa">
                        <MapPin className="mr-2 h-4 w-4" />
                        Ver en Mapa
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Consejos de Reciclaje</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="plastico">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="plastico">Plástico</TabsTrigger>
                  <TabsTrigger value="papel">Papel</TabsTrigger>
                  <TabsTrigger value="vidrio">Vidrio</TabsTrigger>
                  <TabsTrigger value="organico">Orgánico</TabsTrigger>
                </TabsList>
                <TabsContent value="plastico" className="mt-4 space-y-2">
                  <p className="text-sm">Consejos para reciclar plástico:</p>
                  <ul className="text-sm space-y-1 list-disc pl-4">
                    <li>Enjuaga los envases antes de reciclarlos</li>
                    <li>Retira las tapas y etiquetas si es posible</li>
                    <li>Aplasta las botellas para ahorrar espacio</li>
                    <li>Verifica el código de reciclaje en la base</li>
                  </ul>
                </TabsContent>
                {/* Contenido similar para otras pestañas */}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
