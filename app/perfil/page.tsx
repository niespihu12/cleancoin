"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import Link from "next/link"
import { Award, Calendar, Camera, Edit, FileText, LogOut, MapPin, Recycle, Settings, Trophy, User } from "lucide-react"

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState("actividad")

  const usuario = {
    nombre: "María García",
    email: "maria@ejemplo.com",
    nivel: "Reciclador Activo",
    nivelNumero: 3,
    puntos: 250,
    fechaRegistro: "5 de mayo, 2025",
    ubicacion: "Santa Marta",
    avatar: "/placeholder.svg?height=100&width=100&text=MG",
  }

  const estadisticas = {
    totalReciclado: 78,
    retosCompletados: 12,
    puntosGanados: 520,
    contenedoresVisitados: 15,
    diasConsecutivos: 8,
    co2: 0.5,
  }

  const actividades = [
    {
      id: 1,
      tipo: "reciclaje",
      descripcion: "Reciclaste 3 botellas de plástico",
      puntos: 30,
      fecha: "Hoy, 10:30 AM",
      icono: <Recycle className="h-8 w-8 text-green-500" />,
    },
    {
      id: 2,
      tipo: "reto",
      descripcion: "Completaste el reto 'Recolecta papel durante una semana'",
      puntos: 100,
      fecha: "Ayer, 3:45 PM",
      icono: <Trophy className="h-8 w-8 text-yellow-500" />,
    },
    {
      id: 3,
      tipo: "educacion",
      descripcion: "Completaste el módulo 'Tipos de Plásticos'",
      puntos: 20,
      fecha: "20 de abril, 2023",
      icono: <FileText className="h-8 w-8 text-blue-500" />,
    },
    {
      id: 4,
      tipo: "reciclaje",
      descripcion: "Reciclaste residuos orgánicos",
      puntos: 25,
      fecha: "18 de abril, 2023",
      icono: <Recycle className="h-8 w-8 text-green-500" />,
    },
    {
      id: 5,
      tipo: "referido",
      descripcion: "Tu amigo Carlos se unió usando tu código",
      puntos: 50,
      fecha: "15 de abril, 2023",
      icono: <User className="h-8 w-8 text-purple-500" />,
    },
  ]

  const logros = [
    {
      id: 1,
      nombre: "Primer Paso",
      descripcion: "Completaste tu primera acción de reciclaje",
      icono: <Award className="h-10 w-10 text-yellow-500" />,
      completado: true,
      fecha: "15 de enero, 2023",
    },
    {
      id: 2,
      nombre: "Educador Ambiental",
      descripcion: "Completaste 5 módulos educativos",
      icono: <FileText className="h-10 w-10 text-blue-500" />,
      completado: true,
      fecha: "2 de febrero, 2023",
    },
    {
      id: 3,
      nombre: "Reciclador Constante",
      descripcion: "Reciclaste durante 7 días consecutivos",
      icono: <Recycle className="h-10 w-10 text-green-500" />,
      completado: true,
      fecha: "10 de marzo, 2023",
    },
    {
      id: 4,
      nombre: "Maestro del Reciclaje",
      descripcion: "Recicla 100 items",
      icono: <Trophy className="h-10 w-10 text-amber-500" />,
      completado: false,
      progreso: 78,
    },
    {
      id: 5,
      nombre: "Influencer Ambiental",
      descripcion: "Invita a 10 amigos a unirse",
      icono: <User className="h-10 w-10 text-purple-500" />,
      completado: false,
      progreso: 2,
    },
  ]

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-6">
        {/* Sección de perfil */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src={usuario.avatar || "/placeholder.svg"} alt={usuario.nombre} />
                  <AvatarFallback>
                    {usuario.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold">{usuario.nombre}</h1>
                <p className="text-muted-foreground">{usuario.email}</p>
                <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                  <Badge variant="outline" className="flex items-center px-3 py-1">
                    <Trophy className="mr-1 h-3 w-3" />
                    <span>
                      Nivel {usuario.nivelNumero}: {usuario.nivel}
                    </span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center px-3 py-1">
                    <Image
                      src="/placeholder.svg?height=16&width=16&text=$"
                      alt="CleanCoin"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    <span>{usuario.puntos} CleanCoins</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center px-3 py-1">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>Miembro desde {usuario.fechaRegistro}</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center px-3 py-1">
                    <MapPin className="mr-1 h-3 w-3" />
                    <span>{usuario.ubicacion}</span>
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/recolectar">
                    <Recycle className="mr-2 h-4 w-4" />
                    Recolectar
                  </Link>
                </Button>
                
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Reciclado</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{estadisticas.totalReciclado}</div>
              <p className="text-xs text-muted-foreground">items</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm text-muted-foreground">Retos Completados</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{estadisticas.retosCompletados}</div>
              <p className="text-xs text-muted-foreground">retos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm text-muted-foreground">Puntos Ganados</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{estadisticas.puntosGanados}</div>
              <p className="text-xs text-muted-foreground">CleanCoins</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm text-muted-foreground">Contenedores Visitados</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{estadisticas.contenedoresVisitados}</div>
              <p className="text-xs text-muted-foreground">lugares</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm text-muted-foreground">Racha Actual</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{estadisticas.diasConsecutivos}</div>
              <p className="text-xs text-muted-foreground">días consecutivos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm text-muted-foreground">Huella de carbono</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{estadisticas.co2}</div>
              <p className="text-xs text-muted-foreground">Co2</p>
            </CardContent>
          </Card>
        </div>

        {/* Pestañas */}
        <Tabs defaultValue="actividad" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="actividad">Actividad</TabsTrigger>
            <TabsTrigger value="logros">Logros</TabsTrigger>
            <TabsTrigger value="configuracion">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="actividad" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Actividad</CardTitle>
                <CardDescription>Tus acciones recientes de reciclaje y participación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {actividades.map((actividad) => (
                    <div key={actividad.id} className="flex gap-4">
                      <div className="flex-shrink-0 flex items-start justify-center w-12 h-12 rounded-full bg-muted">
                        {actividad.icono}
                      </div>
                      <div className="flex-1 border-b pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{actividad.descripcion}</p>
                            <p className="text-sm text-muted-foreground">{actividad.fecha}</p>
                          </div>
                          <Badge className="flex items-center">
                            <Image
                              src="/placeholder.svg?height=16&width=16&text=$"
                              alt="CleanCoin"
                              width={16}
                              height={16}
                              className="mr-1"
                            />
                            <span>+{actividad.puntos}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Historial Completo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="logros" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Logros y Medallas</CardTitle>
                <CardDescription>Tus reconocimientos por contribuir al medio ambiente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {logros.map((logro) => (
                    <Card
                      key={logro.id}
                      className={`border-2 ${logro.completado ? "border-green-500" : "border-muted"}`}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${logro.completado ? "bg-green-100" : "bg-muted"}`}>
                            {logro.icono}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{logro.nombre}</CardTitle>
                            <CardDescription>{logro.descripcion}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        {logro.completado ? (
                          <div className="flex items-center text-sm text-green-600">
                            <Award className="mr-1 h-4 w-4" />
                            Completado el {logro.fecha}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progreso: {logro.progreso}%</span>
                            </div>
                            <Progress value={logro.progreso} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracion" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Cuenta</CardTitle>
                <CardDescription>Administra tus preferencias y datos personales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Información Personal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input id="nombre" defaultValue={usuario.nombre} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input id="email" defaultValue={usuario.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ubicacion">Ubicación</Label>
                      <Input id="ubicacion" defaultValue={usuario.ubicacion} />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>
                      <Edit className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferencias</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notificaciones">Notificaciones</Label>
                        <p className="text-sm text-muted-foreground">
                          Recibir notificaciones sobre nuevos retos y recompensas
                        </p>
                      </div>
                      <Switch id="notificaciones" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="ubicacion-auto">Ubicación Automática</Label>
                        <p className="text-sm text-muted-foreground">
                          Permitir que la app detecte tu ubicación para encontrar contenedores
                        </p>
                      </div>
                      <Switch id="ubicacion-auto" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="recordatorios">Recordatorios Diarios</Label>
                        <p className="text-sm text-muted-foreground">
                          Recibir recordatorios para mantener tu racha de reciclaje
                        </p>
                      </div>
                      <Switch id="recordatorios" defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Seguridad</h3>
                  <Button variant="outline">Cambiar Contraseña</Button>
                </div>

                <Separator />

                <div className="pt-2">
                  <Button variant="destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
