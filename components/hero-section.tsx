import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
                Recicla, Aprende y Gana con CleanPoints
              </h1>
              <p className="max-w-xl mx-auto lg:mx-0 text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl">
                Únete a la comunidad que está transformando la forma en que manejamos los residuos. Aprende, actúa y recibe recompensas por tus acciones positivas para el medio ambiente.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row justify-center lg:justify-start">
              <Button size="lg" asChild>
                <Link href="/recolectar">
                  Empezar a Recolectar <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/educacion">Aprender más</Link>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span>4.9/5 calificación</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center h-full">
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl aspect-video rounded-xl overflow-hidden h-full">
              <Image
                src="/hero-section.jpeg"
                alt="CleanPoints App"
                fill
                className="object-cover"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
