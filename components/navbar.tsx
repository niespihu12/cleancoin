"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Menu } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Educación", href: "/educacion" },
    { name: "Mapa", href: "/mapa" },
    { name: "Retos", href: "/retos" },
    { name: "Marketplace", href: "/marketplace" },
  ]

  return (
    <header className="sticky top-0 z-10000000 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10000">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Toggle Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button className="mt-4 w-full" asChild>
                  <Link href="/recolectar" onClick={() => setIsOpen(false)}>
                    Empezar a Recolectar
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/WhatsApp Image 2025-05-05 at 10.12.34 PM.jpeg" alt="CleanCoin Logo" width={32} height={32} />
            <span className="font-bold text-xl hidden md:inline-block">CleanCoin</span>
          </Link>
        </div>
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Button className="hidden md:flex" asChild>
            <Link href="/recolectar">Empezar a Recolectar</Link>
          </Button>
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="outline" className="flex items-center">
              <Image
                src="/placeholder.svg?height=16&width=16&text=$"
                alt="CleanCoin"
                width={16}
                height={16}
                className="mr-1"
              />
              <span>250</span>
            </Badge>
          </div>
          <ModeToggle />
           <Link href="/perfil">
            <Avatar className="cursor-pointer">
              <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
              <AvatarFallback>
              U
              </AvatarFallback>
            </Avatar>
          </Link>
          
         
        </div>
      </div>
    </header>
  )
}
