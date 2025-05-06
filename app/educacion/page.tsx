import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle } from "lucide-react"

export default function EducacionPage() {
  const categorias = [
    {
      id: "plasticos",
      nombre: "Plásticos",
      color: "blue",
      modulos: [
        {
          id: "tipos-plasticos",
          titulo: "Tipos de Plásticos",
          descripcion: "Aprende a identificar los diferentes tipos de plásticos y cómo reciclarlos correctamente.",
          duracion: "10 min",
          completado: true,
          imagen: "/placeholder.svg?height=200&width=300&text=Plásticos",
        },
        {
          id: "reduccion-plasticos",
          titulo: "Reducción de Plásticos",
          descripcion: "Estrategias para reducir el consumo de plásticos de un solo uso en tu vida diaria.",
          duracion: "15 min",
          completado: false,
          imagen: "/placeholder.svg?height=200&width=300&text=Reducción",
        },
      ],
    },
    {
      id: "papel",
      nombre: "Papel y Cartón",
      color: "yellow",
      modulos: [
        {
          id: "reciclaje-papel",
          titulo: "Reciclaje de Papel",
          descripcion: "Aprende qué tipos de papel se pueden reciclar y cómo prepararlos correctamente.",
          duracion: "8 min",
          completado: true,
          imagen: "/placeholder.svg?height=200&width=300&text=Papel",
        },
        {
          id: "impacto-papel",
          titulo: "Impacto Ambiental",
          descripcion: "Conoce el impacto de la producción de papel y los beneficios de su reciclaje.",
          duracion: "12 min",
          completado: false,
          imagen: "/placeholder.svg?height=200&width=300&text=Impacto",
        },
      ],
    },
    {
      id: "vidrio",
      nombre: "Vidrio",
      color: "green",
      modulos: [
        {
          id: "reciclaje-vidrio",
          titulo: "Reciclaje de Vidrio",
          descripcion: "Aprende sobre el proceso de reciclaje del vidrio y su importancia para el medio ambiente.",
          duracion: "10 min",
          completado: false,
          imagen: "/placeholder.svg?height=200&width=300&text=Vidrio",
        },
      ],
    },
    {
      id: "organicos",
      nombre: "Residuos Orgánicos",
      color: "brown",
      modulos: [
        {
          id: "compostaje",
          titulo: "Compostaje Doméstico",
          descripcion: "Aprende a crear tu propio compost con residuos orgánicos de tu hogar.",
          duracion: "20 min",
          completado: false,
          imagen: "/placeholder.svg?height=200&width=300&text=Compostaje",
        },
      ],
    },
  ]

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Centro Educativo</h1>
          <p className="text-muted-foreground">Aprende sobre el manejo adecuado de residuos sólidos</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <CheckCircle className="mr-1 h-3 w-3" />
            3/8 módulos completados
          </Badge>
          <Progress value={37.5} className="w-[100px]" />
        </div>
      </div>

      <Tabs defaultValue="plasticos" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          {categorias.map((categoria) => (
            <TabsTrigger key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </TabsTrigger>
          ))}
        </TabsList>

        {categorias.map((categoria) => (
          <TabsContent key={categoria.id} value={categoria.id} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoria.modulos.map((modulo) => (
                <Card key={modulo.id} className="overflow-hidden">
                  <div className="relative h-[200px] w-full">
                    <Image
                      src={modulo.imagen || "/placeholder.svg"}
                      alt={modulo.titulo}
                      fill
                      className="object-cover"
                    />
                    {modulo.completado && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-500">Completado</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{modulo.titulo}</CardTitle>
                    <CardDescription className="flex items-center">
                      <BookOpen className="mr-1 h-4 w-4" />
                      {modulo.duracion} de lectura
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{modulo.descripcion}</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/educacion/${categoria.id}/${modulo.id}`}>
                        {modulo.completado ? "Repasar" : "Comenzar"} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
