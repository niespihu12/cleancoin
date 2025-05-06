import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Search, ShoppingBag, Filter, Heart } from "lucide-react"

export default function MarketplacePage() {
  const productos = [
    {
      id: 1,
      nombre: "Bolsa Ecológica",
      descripcion: "Bolsa reutilizable hecha de materiales reciclados",
      precio: 150,
      imagen: "/WhatsApp Image 2025-05-06 at 9.40.36 AM (1).jpeg",
      vendedor: "EcoTienda",
      categoria: "accesorios",
    },
    {
      id: 2,
      nombre: "Cuaderno Reciclado",
      descripcion: "Cuaderno hecho con papel 100% reciclado",
      precio: 100,
      imagen: "/WhatsApp Image 2025-05-06 at 9.40.37 AM.jpeg",
      vendedor: "PapelVerde",
      categoria: "papeleria",
    },
    {
      id: 3,
      nombre: "Botella Reutilizable",
      descripcion: "Botella de acero inoxidable para reducir plásticos de un solo uso",
      precio: 200,
      imagen: "/WhatsApp Image 2025-05-06 at 9.40.36 AM.jpeg",
      vendedor: "ZeroWaste",
      categoria: "accesorios",
    },
    {
      id: 4,
      nombre: "Maceta Biodegradable",
      descripcion: "Maceta hecha de materiales compostables para tus plantas",
      precio: 80,
      imagen: "/WhatsApp Image 2025-05-06 at 9.40.35 AM (1).jpeg",
      vendedor: "PlantaVida",
      categoria: "hogar",
    },
    {
      id: 5,
      nombre: "Jabón Artesanal",
      descripcion: "Jabón natural hecho con ingredientes orgánicos",
      precio: 50,
      imagen: "/images.jpeg",
      vendedor: "NaturalSoap",
      categoria: "hogar",
    },
    {
      id: 6,
      nombre: "Cepillo de Bambú",
      descripcion: "Cepillo de dientes biodegradable con mango de bambú",
      precio: 70,
      imagen: "/WhatsApp Image 2025-05-06 at 9.40.35 AM.jpeg",
      vendedor: "EcoDental",
      categoria: "cuidado-personal",
    },
  ]

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">Canjea tus CleanCoins por productos sostenibles</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center px-3 py-1">
            <Image
              src="/placeholder.svg?height=16&width=16&text=$"
              alt="CleanCoin"
              width={16}
              height={16}
              className="mr-1"
            />
            <span>250 CleanCoins disponibles</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Categoría</label>
                <Select defaultValue="todos">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas las categorías</SelectItem>
                    <SelectItem value="accesorios">Accesorios</SelectItem>
                    <SelectItem value="hogar">Hogar</SelectItem>
                    <SelectItem value="papeleria">Papelería</SelectItem>
                    <SelectItem value="cuidado-personal">Cuidado Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Precio máximo</label>
                <Select defaultValue="todos">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar precio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Cualquier precio</SelectItem>
                    <SelectItem value="100">Hasta 100 CleanCoins</SelectItem>
                    <SelectItem value="200">Hasta 200 CleanCoins</SelectItem>
                    <SelectItem value="300">Hasta 300 CleanCoins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Vendedor</label>
                <Select defaultValue="todos">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los vendedores</SelectItem>
                    <SelectItem value="ecoTienda">EcoTienda</SelectItem>
                    <SelectItem value="papelVerde">PapelVerde</SelectItem>
                    <SelectItem value="zeroWaste">ZeroWaste</SelectItem>
                    <SelectItem value="plantaVida">PlantaVida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Aplicar Filtros
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar productos..." className="pl-8" />
            </div>
            <Select defaultValue="recientes">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recientes">Más recientes</SelectItem>
                <SelectItem value="precio-asc">Precio: menor a mayor</SelectItem>
                <SelectItem value="precio-desc">Precio: mayor a menor</SelectItem>
                <SelectItem value="populares">Más populares</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 z-0">
            {productos.map((producto) => (
              <Card key={producto.id} className="overflow-hidden">
                <div className="relative aspect-square ">
                  <Image
                    src={producto.imagen || "/placeholder.svg"}
                    alt={producto.nombre}
                    fill
                    className="object-cover z-[0] transition-transform duration-300 hover:scale-105"
                  />
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/80 rounded-full">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{producto.nombre}</CardTitle>
                  <CardDescription>{producto.descripcion}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{producto.categoria}</Badge>
                    <span className="text-sm text-muted-foreground">Por: {producto.vendedor}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <Image
                      src="/placeholder.svg?height=16&width=16&text=$"
                      alt="CleanCoin"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    <span className="font-bold">{producto.precio}</span>
                  </div>
                  <Button>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Canjear
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
