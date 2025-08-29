// services/marketService.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://back-cleanpoint.onrender.com/';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  vendedor: string;
  categoria: string;
  stock?: number;
  disponible?: boolean;
}

export interface ProductoCreate {
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  vendedor: string;
  categoria: string;
  stock?: number;
}

export interface CanjearRequest {
  usuario_id: number;
  producto_id: number;
  precio_base: number;
}

export interface CanjearResponse {
  usuario_id: number;
  producto_id: number;
  cleanpoints_usuario: number;
  precio_base: number;
  descuento_aplicado: string;
  precio_final: number;
  detalle: string;
}

class MarketService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error en ${endpoint}:`, error);
      throw error;
    }
  }

  // Obtener todos los productos
  async getProductos(skip: number = 0, limit: number = 50): Promise<Producto[]> {
    return this.makeRequest<Producto[]>(`/marketplace/productos/?skip=${skip}&limit=${limit}`);
  }

  // Obtener un producto específico
  async getProducto(id: number): Promise<Producto> {
    return this.makeRequest<Producto>(`/marketplace/productos/${id}`);
  }

  // Crear un nuevo producto
  async crearProducto(producto: ProductoCreate): Promise<Producto> {
    return this.makeRequest<Producto>('/marketplace/productos/', {
      method: 'POST',
      body: JSON.stringify(producto),
    });
  }

  // Actualizar un producto
  async actualizarProducto(id: number, producto: ProductoCreate): Promise<Producto> {
    return this.makeRequest<Producto>(`/marketplace/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(producto),
    });
  }

  // Eliminar un producto
  async eliminarProducto(id: number): Promise<{ detail: string }> {
    return this.makeRequest<{ detail: string }>(`/marketplace/productos/${id}`, {
      method: 'DELETE',
    });
  }

  // Canjear producto
  async canjearProducto(data: CanjearRequest): Promise<CanjearResponse> {
    return this.makeRequest<CanjearResponse>('/marketplace/canjear/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Filtrar productos por categoría
  async getProductosPorCategoria(categoria: string): Promise<Producto[]> {
    const productos = await this.getProductos();
    return productos.filter(p => p.categoria === categoria);
  }

  // Buscar productos
  async buscarProductos(termino: string): Promise<Producto[]> {
    const productos = await this.getProductos();
    return productos.filter(p => 
      p.nombre.toLowerCase().includes(termino.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(termino.toLowerCase()) ||
      p.vendedor.toLowerCase().includes(termino.toLowerCase())
    );
  }

  // Filtrar productos por precio máximo
  async getProductosPorPrecioMax(precioMax: number): Promise<Producto[]> {
    const productos = await this.getProductos();
    return productos.filter(p => p.precio <= precioMax);
  }

  // Filtrar productos por vendedor
  async getProductosPorVendedor(vendedor: string): Promise<Producto[]> {
    const productos = await this.getProductos();
    return productos.filter(p => p.vendedor.toLowerCase() === vendedor.toLowerCase());
  }

  // Ordenar productos
  sortProductos(productos: Producto[], criterio: string): Producto[] {
    switch (criterio) {
      case 'precio-asc':
        return [...productos].sort((a, b) => a.precio - b.precio);
      case 'precio-desc':
        return [...productos].sort((a, b) => b.precio - a.precio);
      case 'nombre':
        return [...productos].sort((a, b) => a.nombre.localeCompare(b.nombre));
      case 'vendedor':
        return [...productos].sort((a, b) => a.vendedor.localeCompare(b.vendedor));
      default:
        return productos;
    }
  }

  // Aplicar filtros múltiples
  async aplicarFiltros(filtros: {
    categoria?: string;
    precioMax?: number;
    vendedor?: string;
    busqueda?: string;
    ordenar?: string;
  }): Promise<Producto[]> {
    let productos = await this.getProductos();

    if (filtros.categoria && filtros.categoria !== 'todos') {
      productos = productos.filter(p => p.categoria === filtros.categoria);
    }

    if (filtros.precioMax) {
      productos = productos.filter(p => p.precio <= filtros.precioMax);
    }

    if (filtros.vendedor && filtros.vendedor !== 'todos') {
      productos = productos.filter(p => p.vendedor.toLowerCase() === filtros.vendedor.toLowerCase());
    }

    if (filtros.busqueda) {
      const termino = filtros.busqueda.toLowerCase();
      productos = productos.filter(p => 
        p.nombre.toLowerCase().includes(termino) ||
        p.descripcion.toLowerCase().includes(termino) ||
        p.vendedor.toLowerCase().includes(termino)
      );
    }

    if (filtros.ordenar) {
      productos = this.sortProductos(productos, filtros.ordenar);
    }

    return productos;
  }
}

// Instancia singleton del servicio
export const marketService = new MarketService();

// Hook personalizado para React (opcional)
export const useMarketplace = () => {
  return {
    getProductos: marketService.getProductos,
    getProducto: marketService.getProducto,
    crearProducto: marketService.crearProducto,
    actualizarProducto: marketService.actualizarProducto,
    eliminarProducto: marketService.eliminarProducto,
    canjearProducto: marketService.canjearProducto,
    aplicarFiltros: marketService.aplicarFiltros,
  };
};