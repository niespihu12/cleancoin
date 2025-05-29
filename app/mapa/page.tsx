"use client"

import dynamic from "next/dynamic";
const DynamicMapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
});


import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Navigation, QrCode, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import MapComponent from "@/components/map-component"
import { useToast } from "@/hooks/use-toast"

export default function MapaPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const contenedores = [
    { id: 1, nombre: "Contenedor Plaza Central", direccion: "Cra. 5 con Calle 22", tipo: "Plástico", distancia: "0.3 km", lat: 11.2410, lng: -74.2100, disponible: true },
    { id: 2, nombre: "Contenedor Parque Norte", direccion: "Calle 29 con Cra. 4", tipo: "Papel y Cartón", distancia: "0.7 km", lat: 11.2480, lng: -74.2050, disponible: true },
    { id: 3, nombre: "Contenedor Centro Comercial", direccion: "Av. Libertador con Cra. 16", tipo: "Vidrio", distancia: "1.2 km", lat: 11.2300, lng: -74.1950, disponible: false },
    { id: 4, nombre: "Contenedor Biblioteca Pública", direccion: "Calle 17 con Cra. 3", tipo: "Orgánicos", distancia: "1.5 km", lat: 11.2430, lng: -74.2000, disponible: true },
  ]

  useEffect(() => {
    setTimeout(() => {
      setUserLocation({ lat: 11.24090, lng: -74.19908 })
      setIsLoading(false)
    }, 1500)
  }, [])

  const handleScanQR = () => {
    toast({
      title: "Escáner QR",
      description: "Funcionalidad de escaneo QR en desarrollo",
    })
  }

  const renderContenedores = (filtro?: string) =>
    contenedores
      .filter(c => !filtro || c.tipo.toLowerCase().includes(filtro))
      .map(contenedor => (
        <Card key={contenedor.id} className="cursor-pointer hover:bg-muted/50 mb-4">
          <CardHeader className="p-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{contenedor.nombre}</CardTitle>
                <CardDescription className="text-xs">{contenedor.direccion}</CardDescription>
              </div>
              <Badge variant={contenedor.disponible ? "default" : "destructive"}>
                {contenedor.disponible ? "Disponible" : "Lleno"}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="p-3 pt-0 flex justify-between">
            <Badge variant="outline">{contenedor.tipo}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-3 w-3" />
              {contenedor.distancia}
            </div>
          </CardFooter>
        </Card>
      ))

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mapa de Contenedores</h1>
          <p className="text-muted-foreground">Encuentra contenedores cercanos para depositar tus residuos</p>
        </div>
        <Link href='/recolectar' className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" >
          <QrCode className="mr-2 h-4 w-4" />
          Escanear QR
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[500px] overflow-hidden">
            <CardContent className="p-0 h-full z-[-1]">
             <DynamicMapComponent userLocation={userLocation} contenedores={contenedores} isLoading={isLoading} />

            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contenedores Cercanos</CardTitle>
              <CardDescription>
                {userLocation ? "Basado en tu ubicación actual" : "Obteniendo tu ubicación..."}
              </CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar contenedor" className="pl-8" />
              </div>
            </CardHeader>

            <CardContent className="px-2">
              <Tabs defaultValue="todos">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="plástico">Plástico</TabsTrigger>
                  <TabsTrigger value="papel">Papel</TabsTrigger>
                  <TabsTrigger value="vidrio">Vidrio</TabsTrigger>
                </TabsList>
                <TabsContent value="todos" className="mt-4 space-y-4">{renderContenedores()}</TabsContent>
                <TabsContent value="plástico" className="mt-4 space-y-4">{renderContenedores("plástico")}</TabsContent>
                <TabsContent value="papel" className="mt-4 space-y-4">{renderContenedores("papel")}</TabsContent>
                <TabsContent value="vidrio" className="mt-4 space-y-4">{renderContenedores("vidrio")}</TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter>
              <Button className="w-full" variant="outline">
                <Navigation className="mr-2 h-4 w-4" />
                Obtener Indicaciones
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
