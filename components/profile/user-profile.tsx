'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Award, 
  TrendingUp, 
  Calendar,
  Edit,
  Settings,
  LogOut,
  Coins,
  BookOpen,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api-client';
import { Course, Product, Reward } from '@/lib/types';

interface UserStats {
  totalCleanPoints: number;
  totalRecycledItems: number;
  completedCourses: number;
  purchasedItems: number;
  currentStreak: number;
  level: number;
  experience: number;
  experienceToNextLevel: number;
}

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalCleanPoints: 0,
    totalRecycledItems: 0,
    completedCourses: 0,
    purchasedItems: 0,
    currentStreak: 0,
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
  });
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [recentPurchases, setRecentPurchases] = useState<Product[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Cargar datos del usuario en paralelo
      const [cleanPoints, courses, userRewards, purchaseHistory] = await Promise.all([
        apiClient.getUserCleanPoints(user.id),
        apiClient.getCourses(),
        apiClient.getUserRewards(user.id),
        apiClient.getPurchaseHistory(user.id),
      ]);

      // Estadísticas basadas en datos reales
      // Intentar obtener el usuario completo (incluye total_recycled_items)
      let totalRecycled = Math.floor(cleanPoints / 50);
      try {
        const fullUser = await apiClient.getUserProfile(user.id);
        if (fullUser && typeof fullUser.total_recycled_items === 'number') {
          totalRecycled = fullUser.total_recycled_items;
        }
      } catch (e) {
        // fallback: mantener el cálculo por puntos
      }

      setStats({
        totalCleanPoints: cleanPoints,
        totalRecycledItems: totalRecycled,
        completedCourses: courses.filter(c => Math.random() > 0.5).length, // Mock
        purchasedItems: purchaseHistory ? purchaseHistory.length : 0,
        currentStreak: Math.floor(Math.random() * 30) + 1, // Mock
        level: Math.floor(cleanPoints / 100) + 1,
        experience: cleanPoints % 100,
        experienceToNextLevel: 100,
      });

      setRecentCourses(courses.slice(0, 3));
      // Map purchase history entries to Product objects when possible.
      // The backend returns Compra objects that may include the `producto` relation.
      const recent = (purchaseHistory || []).slice(0, 3).map((p: any) => {
        if (p.producto) return p.producto as Product;
        // Fallback minimal mapping if producto isn't populated
        return {
          id: p.producto_id,
          nombre: `Producto #${p.producto_id}`,
          descripcion: '',
          precio: p.precio_pagado || 0,
          imagen: '',
          categoria: '',
        } as Product;
      });
      setRecentPurchases(recent);
      setRewards(userRewards);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p>Usuario no autenticado</p>
      </div>
    );
  }

  const progressPercentage = (stats.experience / stats.experienceToNextLevel) * 100;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header del Perfil */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
              <AvatarImage src={user.avatar} alt={user.nombre} />
              <AvatarFallback className="text-2xl font-bold bg-green-600 text-white">
                {user.nombre.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.nombre}</h1>
              <p className="text-gray-600">Nivel {stats.level} • Experiencia {stats.experience}/{stats.experienceToNextLevel}</p>
              
              <div className="mt-2">
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2 text-2xl font-bold text-green-600">
                <Coins className="h-6 w-6" />
                <span>{stats.totalCleanPoints}</span>
              </div>
              <p className="text-sm text-gray-600">CleanPoints</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.totalRecycledItems}</div>
            <p className="text-sm text-gray-600">Items Reciclados</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.completedCourses}</div>
            <p className="text-sm text-gray-600">Cursos Completados</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.purchasedItems}</div>
            <p className="text-sm text-gray-600">Productos Comprados</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
            <p className="text-sm text-gray-600">Días Seguidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Contenido */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="rewards">Logros</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Cursos Recientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Cursos Recientes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentCourses.length > 0 ? (
                  <div className="space-y-3">
                    {recentCourses.map((course) => (
                      <div key={course.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{course.titulo}</p>
                          <p className="text-xs text-gray-600">{course.tema}</p>
                        </div>
                        <Badge variant="secondary">Completado</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay cursos completados</p>
                )}
              </CardContent>
            </Card>

            {/* Compras Recientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Compras Recientes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentPurchases.length > 0 ? (
                  <div className="space-y-3">
                    {recentPurchases.map((product) => (
                      <div key={product.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product.nombre}</p>
                          <p className="text-xs text-gray-600">{product.categoria}</p>
                        </div>
                        <Badge variant="outline">{product.precio} pts</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay compras recientes</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progreso de Cursos</CardTitle>
              <CardDescription>Continúa aprendiendo sobre sostenibilidad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{course.titulo}</h3>
                      <Badge variant="secondary">100%</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{course.descripcion}</p>
                    <Progress value={100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logros y Recompensas</CardTitle>
              <CardDescription>Celebra tus logros en sostenibilidad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {rewards.length > 0 ? (
                  rewards.map((reward) => (
                    <div key={reward.id} className="text-center p-4 border rounded-lg">
                      <Award className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                      <h3 className="font-medium text-sm">{reward.nombre}</h3>
                      <p className="text-xs text-gray-600">{reward.puntos_requeridos} pts</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Aún no tienes logros</p>
                    <p className="text-sm text-gray-400">¡Comienza a reciclar para ganar!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Cuenta</CardTitle>
              <CardDescription>Gestiona tu perfil y preferencias</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Edit className="mr-2 h-4 w-4" />
                Editar Perfil
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Preferencias
              </Button>
              
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
