import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"


export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-950">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Recicla, Aprende y Gana con CleanCoin
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Únete a la comunidad que está transformando la forma en que manejamos los residuos. Aprende, actúa y
                recibe recompensas por tus acciones positivas para el medio ambiente.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/recolectar">
                  Empezar a Recolectar <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/educacion">Aprender más</Link>
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="inline-block rounded-full overflow-hidden border-2 border-background h-8 w-8"
                    >
                      <Image
                        src={`/placeholder.svg?height=32&width=32&text=U${i}`}
                        alt={`Usuario ${i}`}
                        width={32}
                        height={32}
                      />
                    </div>
                  ))}
                </div>
                <span className="ml-2 text-gray-500 dark:text-gray-400">+2,500 usuarios activos</span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-500 dark:text-gray-400">4.9/5 calificación</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-[500px] max-w-[500px] aspect-video overflow-hidden rounded-xl mt-8">
              <Image
                src="/WhatsApp Image 2025-05-05 at 10.08.04 PM.jpeg"
                alt="CleanCoin App"
                width={800}
                height={600}
                className="object-cover object-center mt-16"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
