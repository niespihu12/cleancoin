"use client"

import React, { useEffect, useState } from 'react'
import { marketService } from '@/services/MarketService'
import cursosService from '@/services/CursosService'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'

export default function AdminPage() {
  // Productos
  const [productos, setProductos] = useState<any[]>([])
  const [loadingP, setLoadingP] = useState(false)
  const [errorP, setErrorP] = useState<string | null>(null)

  const [nuevoProducto, setNuevoProducto] = useState<any>({ nombre: '', descripcion: '', precio: 0, imagen: '', categoria: '', stock: 0, disponible: true, puntos_requeridos: 0 })
  const [editingProductoId, setEditingProductoId] = useState<number | null>(null)

  // Cursos
  const [cursos, setCursos] = useState<any[]>([])
  const [loadingC, setLoadingC] = useState(false)
  const [errorC, setErrorC] = useState<string | null>(null)

  const [nuevoCurso, setNuevoCurso] = useState<any>({ titulo: '', descripcion: '', tema: '', contenido: '', duracion_minutos: 30, nivel: 'principiante', imagen_url: '' })
  const [editingCursoId, setEditingCursoId] = useState<number | null>(null)

  useEffect(() => {
    loadProductos()
    loadCursos()
  }, [])

  const { toast } = useToast()

  async function loadProductos() {
    try {
      setLoadingP(true)
      const list = await marketService.getProductos()
      setProductos(list)
    } catch (err: any) {
      setErrorP(err?.message || 'Error cargando productos')
    } finally { setLoadingP(false) }
  }

  async function loadCursos() {
    try {
      setLoadingC(true)
  const list = await cursosService.obtenerTodosLosCursos()
  // Normalizar campo de imagen: algunos registros vienen como `imagen`, otros como `imagen_url`
    const normalized = list.map((c: any) => ({ ...c, imagen_url: c.imagen_url || c.imagen || '', categoria: c.categoria || c.tema || '' }))
  setCursos(normalized)
    } catch (err: any) {
      setErrorC(err?.message || 'Error cargando cursos')
    } finally { setLoadingC(false) }
  }

  // Productos: crear/actualizar/eliminar
  async function handleCrearOActualizarProducto() {
    try {
      // Validación simple
      if (!nuevoProducto.nombre || !nuevoProducto.categoria) {
        setErrorP('Nombre y categoría son obligatorios')
        return
      }

      const payload = {
        nombre: nuevoProducto.nombre,
        descripcion: nuevoProducto.descripcion,
        precio: Number(nuevoProducto.precio),
        categoria: nuevoProducto.categoria,
        imagen: nuevoProducto.imagen,
  stock: nuevoProducto.stock !== undefined ? Number(nuevoProducto.stock) : undefined,
  disponible: nuevoProducto.disponible ? 1 : 0,
  puntos_requeridos: nuevoProducto.puntos_requeridos ? Number(nuevoProducto.puntos_requeridos) : undefined,
  vendedor: nuevoProducto.vendedor || 'admin',
      }

      if (editingProductoId) {
        await marketService.actualizarProducto(editingProductoId, payload)
      } else {
        await marketService.crearProducto(payload)
      }
  setErrorP(null)
  toast({ title: 'Producto guardado', description: 'Se guardó el producto correctamente.' })
      setNuevoProducto({ nombre: '', descripcion: '', precio: 0, imagen: '', categoria: '', stock: 0, disponible: true, puntos_requeridos: 0 })
      setEditingProductoId(null)
      await loadProductos()
    } catch (err: any) {
      setErrorP(err?.message || 'Error al guardar producto')
    }
  }

  async function handleEditarProducto(p: any) {
    setEditingProductoId(p.id)
  setNuevoProducto({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, imagen: p.imagen, categoria: p.categoria, stock: p.stock || 0, disponible: p.disponible === 1 || p.disponible === true, puntos_requeridos: p.puntos_requeridos || 0 })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleEliminarProducto(id: number) {
    if (!confirm('¿Eliminar producto?')) return
    try {
      await marketService.eliminarProducto(id)
      await loadProductos()
    } catch (err: any) {
      setErrorP(err?.message || 'Error al eliminar producto')
    }
  }

  // Cursos: crear/actualizar/eliminar
  async function handleCrearOActualizarCurso() {
    try {
      if (!nuevoCurso.titulo || !nuevoCurso.tema) {
        setErrorC('Título y tema son obligatorios')
        return
      }

      const payload = {
        titulo: nuevoCurso.titulo,
        descripcion: nuevoCurso.descripcion,
        tema: nuevoCurso.tema,
        contenido: nuevoCurso.contenido,
         categoria: nuevoCurso.tema || '',
         // campos opcionales duracion/nivel/imagen se envían si existen en backend
         ...(nuevoCurso.duracion_minutos !== undefined ? { duracion_minutos: Number(nuevoCurso.duracion_minutos) } : {}),
         ...(nuevoCurso.nivel ? { nivel: nuevoCurso.nivel } : {}),
         ...(nuevoCurso.imagen_url ? { imagen_url: nuevoCurso.imagen_url } : {}),
      }

      if (editingCursoId) {
        await cursosService.actualizarCurso(editingCursoId, payload)
      } else {
        await cursosService.crearCurso(payload)
      }
  setErrorC(null)
  toast({ title: 'Curso guardado', description: 'Se guardó el curso correctamente.' })
      setNuevoCurso({ titulo: '', descripcion: '', tema: '', contenido: '', duracion_minutos: 30, nivel: 'principiante', imagen_url: '' })
      setEditingCursoId(null)
      await loadCursos()
    } catch (err: any) {
      setErrorC(err?.message || 'Error al guardar curso')
    }
  }

  async function handleEditarCurso(c: any) {
    setEditingCursoId(c.id)
    // Rellenar todos los campos del formulario para que el admin vea y pueda editar todo
    setNuevoCurso({
      titulo: c.titulo || '',
      descripcion: c.descripcion || '',
      tema: c.tema || c.categoria || '',
      contenido: c.contenido || '',
      duracion_minutos: c.duracion_minutos || 30,
      nivel: c.nivel || 'principiante',
      imagen_url: c.imagen_url || c.imagen || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleEliminarCurso(id: number) {
    if (!confirm('¿Eliminar curso?')) return
    try {
      await cursosService.eliminarCurso(id)
      await loadCursos()
    } catch (err: any) {
      setErrorC(err?.message || 'Error al eliminar curso')
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

      <Tabs defaultValue="productos" className="mb-6">
        <TabsList>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="cursos">Cursos</TabsTrigger>
        </TabsList>

        <TabsContent value="productos">
          <div className="mb-8">
            <h2 className="font-semibold">Crear / Editar Producto</h2>
        {errorP && <Alert variant="destructive"><AlertDescription>{errorP}</AlertDescription></Alert>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre *</label>
              <Input placeholder="Nombre del producto" value={nuevoProducto.nombre} onChange={(e: any) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Categoría *</label>
              <Input placeholder="ej. Hogar, Jardín" value={nuevoProducto.categoria} onChange={(e: any) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <Input placeholder="Breve descripción" value={nuevoProducto.descripcion} onChange={(e: any) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Imagen (URL)</label>
              <Input placeholder="https://..." value={nuevoProducto.imagen} onChange={(e: any) => setNuevoProducto({ ...nuevoProducto, imagen: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Precio (valor numérico)</label>
              <Input placeholder="0.0" type="number" value={nuevoProducto.precio} onChange={(e: any) => setNuevoProducto({ ...nuevoProducto, precio: Number(e.target.value) })} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <Input placeholder="Cantidad disponible" type="number" value={nuevoProducto.stock} onChange={(e: any) => setNuevoProducto({ ...nuevoProducto, stock: Number(e.target.value) })} />
            </div>

            <div>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={!!nuevoProducto.disponible} onChange={(e: any) => setNuevoProducto({ ...nuevoProducto, disponible: e.target.checked })} />
                <span className="text-sm">Disponible</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Puntos requeridos</label>
              <Input placeholder="puntos para canjear" type="number" value={nuevoProducto.puntos_requeridos} onChange={(e: any) => setNuevoProducto({ ...nuevoProducto, puntos_requeridos: Number(e.target.value) })} />
            </div>
          </div>
            <div className="mt-4">
              <Button onClick={handleCrearOActualizarProducto}>{editingProductoId ? 'Actualizar Producto' : 'Crear Producto'}</Button>
              {editingProductoId && <Button variant="outline" className="ml-2" onClick={() => { setEditingProductoId(null); setNuevoProducto({ nombre: '', descripcion: '', precio: 0, imagen: '', vendedor: '', categoria: '', stock: 0 }) }}>Cancelar</Button>}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-semibold">Listado de Productos</h2>
            {loadingP ? <p>Cargando...</p> : (
              <div className="space-y-3 mt-3">
                {productos.map(p => (
                  <div key={p.id} className="p-3 border rounded flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.nombre} <span className="text-sm text-gray-500">({p.categoria})</span></div>
                      <div className="text-sm text-gray-600">{p.descripcion}</div>
                      <div className="text-xs text-gray-500 mt-1">Precio: {p.precio} — Stock: {p.stock ?? '—'} — Puntos: {p.puntos_requeridos ?? '—'}</div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className={`text-sm ${p.disponible === 1 || p.disponible === true ? 'text-green-600' : 'text-red-600'}`}>{p.disponible === 1 || p.disponible === true ? 'Disponible' : 'No disponible'}</div>
                      <Button size="sm" variant="outline" onClick={() => handleEditarProducto(p)}>Editar</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleEliminarProducto(p.id)}>Eliminar</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="cursos">
          <div className="mb-8">
            <h2 className="font-semibold">Crear / Editar Curso</h2>
            {errorC && <Alert variant="destructive"><AlertDescription>{errorC}</AlertDescription></Alert>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-sm font-medium mb-1">Título *</label>
                <Input placeholder="Título del curso" value={nuevoCurso.titulo} onChange={(e: any) => setNuevoCurso({ ...nuevoCurso, titulo: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tema *</label>
                <Input placeholder="ej. Reciclaje doméstico" value={nuevoCurso.tema} onChange={(e: any) => setNuevoCurso({ ...nuevoCurso, tema: e.target.value })} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <Input placeholder="Breve descripción" value={nuevoCurso.descripcion} onChange={(e: any) => setNuevoCurso({ ...nuevoCurso, descripcion: e.target.value })} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Contenido</label>
                <Input placeholder="Contenido del curso (texto)" value={nuevoCurso.contenido} onChange={(e: any) => setNuevoCurso({ ...nuevoCurso, contenido: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duración (min)</label>
                <Input type="number" value={nuevoCurso.duracion_minutos} onChange={(e: any) => setNuevoCurso({ ...nuevoCurso, duracion_minutos: Number(e.target.value) })} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nivel</label>
                <Input value={nuevoCurso.nivel} onChange={(e: any) => setNuevoCurso({ ...nuevoCurso, nivel: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Imagen (URL)</label>
                <Input placeholder="https://..." value={nuevoCurso.imagen_url} onChange={(e: any) => setNuevoCurso({ ...nuevoCurso, imagen_url: e.target.value })} />
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={handleCrearOActualizarCurso}>{editingCursoId ? 'Actualizar Curso' : 'Crear Curso'}</Button>
              {editingCursoId && <Button variant="outline" className="ml-2" onClick={() => { setEditingCursoId(null); setNuevoCurso({ titulo: '', descripcion: '', categoria: '' }) }}>Cancelar</Button>}
                {editingCursoId && <Button variant="outline" className="ml-2" onClick={() => { setEditingCursoId(null); setNuevoCurso({ titulo: '', descripcion: '', tema: '', contenido: '', duracion_minutos: 30, nivel: 'principiante', imagen_url: '' }) }}>Cancelar</Button>}
                {editingCursoId && <Button variant="outline" className="ml-2" onClick={() => { setEditingCursoId(null); setNuevoCurso({ titulo: '', descripcion: '', tema: '', contenido: '', duracion_minutos: 30, nivel: 'principiante', imagen_url: '' }) }}>Cancelar</Button>}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-semibold">Listado de Cursos</h2>
            {loadingC ? <p>Cargando...</p> : (
              <div className="space-y-3 mt-3">
                {cursos.map(c => (
                  <div key={c.id} className="p-3 border rounded flex items-center justify-between">
                    <div>
                      <div className="font-medium">{c.titulo} <span className="text-sm text-gray-500">({c.categoria})</span></div>
                      <div className="text-sm text-gray-600">{c.descripcion}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditarCurso(c)}>Editar</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleEliminarCurso(c.id)}>Eliminar</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
