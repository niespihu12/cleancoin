import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Award, MapPin, Recycle, Users } from "lucide-react"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />

      {/* Sección de Retos */}
      <section className="py-12 bg-green-50 dark:bg-green-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Badge className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
              Retos Diarios
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Participa en Retos Ambientales
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Completa retos individuales y grupales para ganar más puntos y contribuir a un planeta más limpio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Reto del Día</CardTitle>
                <CardDescription>Recolecta 5 botellas plásticas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <Recycle className="h-16 w-16 text-green-500" />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">Recompensa:</span>
                  <Badge variant="outline" className="flex items-center">
                    <Image
                      src="/placeholder.svg?height=16&width=16&text=$"
                      alt="CleanPoints"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    50 CleanPointss
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/retos">
                    Participar <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Reto Grupal</CardTitle>
                <CardDescription>Limpieza de parque comunitario</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <Users className="h-16 w-16 text-blue-500" />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">Participantes: 12/20</span>
                  <Badge variant="outline" className="flex items-center">
                    <Image
                      src="/placeholder.svg?height=16&width=16&text=$"
                      alt="CleanPoints"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    200 CleanPointss
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/retos/grupales">
                    Unirse al Grupo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Reto Semanal</CardTitle>
                <CardDescription>Reduce tu huella de carbono</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <Award className="h-16 w-16 text-yellow-500" />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">Tiempo restante: 3 días</span>
                  <Badge variant="outline" className="flex items-center">
                    <Image
                      src="/placeholder.svg?height=16&width=16&text=$"
                      alt="CleanPoints"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    150 CleanPointss
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="secondary" asChild>
                  <Link href="/retos/semanales">
                    Ver Detalles <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Sección de Llamada a la Acción */}
      <section className="py-12 bg-green-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              ¡Empieza a Recolectar Ahora!
            </h2>
            <p className="max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Gana CleanPointss mientras ayudas al planeta. Encuentra contenedores cercanos y comienza tu viaje ecológico.
            </p>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
              <Link href="/recolectar">
                Empezar a Recolectar <MapPin className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
