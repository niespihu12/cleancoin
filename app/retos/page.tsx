import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import Link from "next/link"
import { Award, Calendar, Clock, Share, Trophy, Users } from "lucide-react"

export default function RetosPage() {
  const retosIndividuales = [
    {
      id: 1,
      titulo: "Recolecta 5 botellas plásticas",
      descripcion: "Encuentra y deposita 5 botellas de plástico en los contenedores designados",
      recompensa: 50,
      progreso: 60,
      completado: 3,
      total: 5,
      tiempoRestante: "1 día",
      dificultad: "Fácil",
    },
    {
      id: 2,
      titulo: "Recicla papel durante una semana",
      descripcion: "Deposita papel para reciclar durante 7 días consecutivos",
      recompensa: 100,
      progreso: 40,
      completado: 3,
      total: 7,
      tiempoRestante: "4 días",
      dificultad: "Media",
    },
    {
      id: 3,
      titulo: "Recolecta residuos electrónicos",
      descripcion: "Deposita al menos 2 residuos electrónicos en puntos especiales",
      recompensa: 150,
      progreso: 0,
      completado: 0,
      total: 2,
      tiempoRestante: "5 días",
      dificultad: "Difícil",
    },
  ]

  const retosGrupales = [
    {
      id: 1,
      titulo: "Limpieza de parque comunitario",
      descripcion: "Únete a un grupo para limpiar el parque central",
      recompensa: 200,
      participantes: 12,
      maxParticipantes: 20,
      fecha: "15 de mayo, 2023",
      hora: "9:00 AM",
      ubicacion: "Parque Central",
    },
    {
      id: 2,
      titulo: "Reciclaje en escuela local",
      descripcion: "Ayuda a implementar sistema de reciclaje en una escuela",
      recompensa: 250,
      participantes: 8,
      maxParticipantes: 15,
      fecha: "22 de mayo, 2023",
      hora: "2:00 PM",
      ubicacion: "Escuela Primaria Norte",
    },
  ]

  const referidos = [
    {
      id: 1,
      nombre: "Carlos Rodríguez",
      puntos: 120,
      fechaUnion: "Hace 2 semanas",
      avatar: "/placeholder.svg?height=40&width=40&text=CR",
    },
    {
      id: 2,
      nombre: "Ana Martínez",
      puntos: 85,
      fechaUnion: "Hace 1 mes",
      avatar: "/placeholder.svg?height=40&width=40&text=AM",
    },
  ]

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Retos Ambientales</h1>
          <p className="text-muted-foreground">Completa retos y gana recompensas mientras ayudas al planeta</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center px-3 py-1">
            <Trophy className="mr-1 h-3 w-3" />
            <span>Nivel 3: Reciclador Activo</span>
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="individuales" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="individuales">Retos Individuales</TabsTrigger>
          <TabsTrigger value="grupales">Retos Grupales</TabsTrigger>
          <TabsTrigger value="referidos">Referidos</TabsTrigger>
        </TabsList>

        <TabsContent value="individuales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {retosIndividuales.map((reto) => (
              <Card key={reto.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{reto.titulo}</CardTitle>
                    <Badge>{reto.dificultad}</Badge>
                  </div>
                  <CardDescription>{reto.descripcion}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        Progreso: {reto.completado}/{reto.total}
                      </span>
                      <span>{reto.progreso}%</span>
                    </div>
                    <Progress value={reto.progreso} />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {reto.tiempoRestante} restante
                    </div>
                    <div className="flex items-center">
                      <Image
                        src="/placeholder.svg?height=16&width=16&text=$"
                        alt="CleanCoin"
                        width={16}
                        height={16}
                        className="mr-1"
                      />
                      <span className="font-bold">{reto.recompensa}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/recolectar`}>Continuar Reto</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grupales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {retosGrupales.map((reto) => (
              <Card key={reto.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{reto.titulo}</CardTitle>
                    <Badge variant="secondary">Grupal</Badge>
                  </div>
                  <CardDescription>{reto.descripcion}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Fecha</div>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-1 h-3 w-3" />
                        {reto.fecha}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Hora</div>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-1 h-3 w-3" />
                        {reto.hora}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Ubicación</div>
                    <div className="text-sm">{reto.ubicacion}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        Participantes: {reto.participantes}/{reto.maxParticipantes}
                      </span>
                    </div>
                    <Progress value={(reto.participantes / reto.maxParticipantes) * 100} />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <Users className="mr-1 h-3 w-3" />
                      {reto.maxParticipantes - reto.participantes} lugares disponibles
                    </div>
                    <div className="flex items-center">
                      <Image
                        src="/placeholder.svg?height=16&width=16&text=$"
                        alt="CleanCoin"
                        width={16}
                        height={16}
                        className="mr-1"
                      />
                      <span className="font-bold">{reto.recompensa}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button className="flex-1">Unirse</Button>
                  <Button variant="outline" size="icon">
                    <Share className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="referidos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invita a tus amigos</CardTitle>
              <CardDescription>
                Gana CleanCoins adicionales por cada amigo que se una y complete su primer reto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Award className="h-8 w-8 text-yellow-500" />
                  <div>
                    <h3 className="font-medium">Código de referido</h3>
                    <p className="text-sm text-muted-foreground">Comparte este código con tus amigos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">CLEAN123</code>
                  <Button variant="outline" size="sm">
                    Copiar
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="font-medium">Enlace de invitación</h3>
                    <p className="text-sm text-muted-foreground">Comparte este enlace en redes sociales</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Share className="mr-2 h-4 w-4" />
                    Compartir
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Tus referidos</h3>
                {referidos.length > 0 ? (
                  <div className="space-y-4">
                    {referidos.map((referido) => (
                      <div key={referido.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Image
                            src={referido.avatar || "/placeholder.svg"}
                            alt={referido.nombre}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div>
                            <h4 className="font-medium">{referido.nombre}</h4>
                            <p className="text-xs text-muted-foreground">{referido.fechaUnion}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Image
                            src="/placeholder.svg?height=16&width=16&text=$"
                            alt="CleanCoin"
                            width={16}
                            height={16}
                            className="mr-1"
                          />
                          <span className="font-bold">{referido.puntos}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aún no tienes referidos</p>
                    <p className="text-sm">¡Comparte tu código y comienza a ganar!</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Invitar Amigos</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
