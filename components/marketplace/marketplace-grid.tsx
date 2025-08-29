'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Coins, 
  Star,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api-client';
import { Product } from '@/lib/types';

interface MarketplaceGridProps {
  onPurchaseComplete?: (product: Product) => void;
}

export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({ onPurchaseComplete }) => {
  const { user, refreshUser, setUserState } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<string>('nombre');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [purchaseError, setPurchaseError] = useState<string>('');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const productsData = await apiClient.getProducts();
      setProducts(productsData);
    } catch (error) {
      setError('Error al cargar productos');
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(product => product.categoria === selectedCategory);
    }

    // Ordenar
    switch (sortBy) {
      case 'precio-asc':
        filtered.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        filtered.sort((a, b) => b.precio - a.precio);
        break;
      case 'nombre':
        filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'popularidad':
        // Mock de popularidad basado en ID
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredProducts(filtered);
  };

  const handlePurchase = async (product: Product) => {
    if (!user) {
      setPurchaseError('Debes iniciar sesión para comprar');
      setPurchaseStatus('error');
      return;
    }

    if (user.cleanpoints < product.precio) {
      setPurchaseError('No tienes suficientes CleanPoints');
      setPurchaseStatus('error');
      return;
    }

    setSelectedProduct(product);
    setIsPurchaseDialogOpen(true);
    setPurchaseStatus('idle');
    setPurchaseError('');
  };

  const confirmPurchase = async () => {
    if (!selectedProduct || !user) return;

    try {
      setPurchaseStatus('processing');

      // Llamar al endpoint real de compra
      const purchasePayload = {
        usuario_id: user.id,
        producto_id: selectedProduct.id,
      };

      const purchaseResponse = await apiClient.purchaseProduct(purchasePayload);

      setPurchaseStatus('success');

      // Notificar al componente padre
      if (onPurchaseComplete) {
        onPurchaseComplete(selectedProduct);
      }

      // Si el usuario está en el contexto, refrescar su perfil para actualizar saldo y compras
      if (refreshUser) {
        await refreshUser();
      }

      // Siempre intentar actualizar en caliente con el new_balance retornado
      if (purchaseResponse && purchaseResponse.new_balance !== undefined) {
        if (setUserState && user) {
          setUserState({ ...user, cleanpoints: purchaseResponse.new_balance });
        } else {
          const stored = localStorage.getItem('cleanpoint_user');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              parsed.cleanpoints = purchaseResponse.new_balance;
              localStorage.setItem('cleanpoint_user', JSON.stringify(parsed));
            } catch (err) {
              // ignore
            }
          }
        }
      }

      // Cerrar diálogo después de un momento
      setTimeout(() => {
        setIsPurchaseDialogOpen(false);
        setPurchaseStatus('idle');
        setSelectedProduct(null);
      }, 1200);

    } catch (error) {
      setPurchaseStatus('error');
      setPurchaseError('Error al procesar la compra');
    }
  };

  const getCategoryOptions = () => {
    const categories = ['todos', ...Array.from(new Set(products.map(p => p.categoria)))];
    return categories;
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {getCategoryOptions().map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'todos' ? 'Todas las categorías' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nombre">Nombre</SelectItem>
              <SelectItem value="precio-asc">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="precio-desc">Precio: Mayor a Menor</SelectItem>
              <SelectItem value="popularidad">Popularidad</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid de Productos */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
          <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                <img
                  src={product.imagen || '/placeholder.jpg'}
                  alt={product.nombre}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-green-600">
                  {product.categoria}
                </Badge>
              </div>
              
              <CardHeader className="p-4">
                <CardTitle className="text-lg line-clamp-2">{product.nombre}</CardTitle>
                <CardDescription className="line-clamp-2">{product.descripcion}</CardDescription>
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold text-lg">{product.precio}</span>
                    <span className="text-sm text-gray-600">pts</span>
                  </div>
                  
                  {product.stock !== undefined && (
                    <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                      {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                    </Badge>
                  )}
                </div>
                
                <Button
                  onClick={() => handlePurchase(product)}
                  className="w-full"
                  disabled={!product.disponible || (product.stock !== undefined && product.stock <= 0)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Canjear
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Diálogo de Compra */}
      <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Compra</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres canjear este producto?
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={selectedProduct.imagen || '/placeholder.jpg'}
                  alt={selectedProduct.nombre}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">{selectedProduct.nombre}</h3>
                  <p className="text-sm text-gray-600">{selectedProduct.descripcion}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold">{selectedProduct.precio} CleanPoints</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600">Tu saldo actual:</span>
                <div className="flex items-center space-x-1">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold">{user?.cleanpoints || 0} CleanPoints</span>
                </div>
              </div>
              
              {purchaseStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{purchaseError}</AlertDescription>
                </Alert>
              )}
              
              {purchaseStatus === 'success' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>¡Compra exitosa! El producto ha sido agregado a tu cuenta.</AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          <DialogFooter>
            {purchaseStatus === 'idle' && (
              <>
                <Button variant="outline" onClick={() => setIsPurchaseDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={confirmPurchase} disabled={!user || (user.cleanpoints < (selectedProduct?.precio || 0))}>
                  Confirmar Compra
                </Button>
              </>
            )}
            
            {purchaseStatus === 'processing' && (
              <Button disabled>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Procesando...
              </Button>
            )}
            
            {purchaseStatus === 'success' && (
              <Button onClick={() => setIsPurchaseDialogOpen(false)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                ¡Perfecto!
              </Button>
            )}
            
            {purchaseStatus === 'error' && (
              <Button onClick={() => setIsPurchaseDialogOpen(false)}>
                <XCircle className="mr-2 h-4 w-4" />
                Cerrar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
