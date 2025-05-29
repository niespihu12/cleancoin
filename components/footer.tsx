import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/WhatsApp_Image_2025-05-28_at_3.56.55_PM-removebg-preview (1).png" alt="CleanCoin Logo" width={32} height={32} className="mix-blend-multiply" />
              <span className="font-bold text-xl">CleanCoin</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Educando para un manejo adecuado de residuos sólidos y promoviendo un planeta más limpio.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/educacion" className="text-sm text-muted-foreground hover:text-primary">
                  Educación
                </Link>
              </li>
              <li>
                <Link href="/mapa" className="text-sm text-muted-foreground hover:text-primary">
                  Mapa
                </Link>
              </li>
              <li>
                <Link href="/retos" className="text-sm text-muted-foreground hover:text-primary">
                  Retos
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-sm text-muted-foreground hover:text-primary">
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/guia" className="text-sm text-muted-foreground hover:text-primary">
                  Guía de Reciclaje
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-muted-foreground hover:text-primary">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CleanCoin. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/terminos" className="text-xs text-muted-foreground hover:text-primary">
              Términos de Servicio
            </Link>
            <Link href="/privacidad" className="text-xs text-muted-foreground hover:text-primary">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
