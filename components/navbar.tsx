"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Menu, 
  User, 
  LogOut, 
  Coins,
  Settings,
  BookOpen
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Educación", href: "/educacion" },
    { name: "Mapa", href: "/mapa" },
    { name: "Retos", href: "/retos" },
    { name: "Marketplace", href: "/marketplace" },
  ]

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                
                {isAuthenticated ? (
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.nombre} />
                        <AvatarFallback className="text-sm">
                          {user?.nombre?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.nombre}</p>
                        <div className="flex items-center gap-1">
                          <Coins className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs">{user?.cleanpoints || 0} pts</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/perfil" onClick={() => setIsOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Mi Perfil
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full text-red-600 hover:text-red-700" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-4 border-t">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Iniciar Sesión
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        Registrarse
                      </Link>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-cleanpoints.png" alt="CleanPoints Logo" width={32} height={32} />
            <span className="font-bold text-xl hidden md:inline-block">CleanPoints</span>
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
          
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <Badge variant="outline" className="flex items-center bg-green-50 text-green-700 border-green-200">
                  <Coins className="mr-1 h-4 w-4 text-yellow-500" />
                  <span>{user?.cleanpoints || 0}</span>
                </Badge>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer hover:ring-2 hover:ring-green-200 transition-all">
                    <AvatarImage src={user?.avatar} alt={user?.nombre} />
                    <AvatarFallback className="bg-green-600 text-white">
                      {user?.nombre?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.nombre}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.cleanpoints || 0} CleanPoints
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/educacion" className="cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Mis Cursos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/marketplace" className="cursor-pointer">
                      <Coins className="mr-2 h-4 w-4" />
                      Marketplace
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Registrarse</Link>
              </Button>
            </div>
          )}
          
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
