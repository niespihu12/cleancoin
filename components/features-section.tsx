import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Coins, MapPin, Recycle, ShoppingBag, Users } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: <BookOpen className="h-10 w-10 text-green-500" />,
      title: "Educación Interactiva",
      description: "Aprende a clasificar y desechar residuos correctamente a través de contenido interactivo y visual.",
    },
    {
      icon: <MapPin className="h-10 w-10 text-blue-500" />,
      title: "Mapa de Contenedores",
      description:
        "Encuentra contenedores cercanos mediante geolocalización y escanea códigos QR al depositar residuos.",
    },
    {
      icon: <Recycle className="h-10 w-10 text-teal-500" />,
      title: "Validación de Acciones",
      description: "Sube fotos como evidencia de tu correcta disposición de residuos y recibe validación.",
    },
    {
      icon: <Coins className="h-10 w-10 text-yellow-500" />,
      title: "Sistema de Puntos",
      description: "Gana CleanCoins por cada acción validada y acumula puntos para canjear por recompensas.",
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-purple-500" />,
      title: "Marketplace Sostenible",
      description: "Canjea tus puntos por productos de pequeños productores que trabajan con materiales reciclados.",
    },
    {
      icon: <Users className="h-10 w-10 text-red-500" />,
      title: "Retos y Referidos",
      description:
        "Participa en retos diarios individuales y grupales, e invita a amigos para completar tareas juntos.",
    },
  ]

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Características Principales</h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            CleanCoin ofrece una experiencia completa para fomentar el manejo adecuado de residuos sólidos.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-green-500 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-center h-16">{feature.icon}</div>
                <CardTitle className="text-xl text-center">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
