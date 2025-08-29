'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  BookOpen, 
  Clock, 
  Star, 
  Play,
  CheckCircle,
  Lock,
  Award,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api-client';
import { Course, CourseProgress } from '@/lib/types';

interface CoursesGridProps {
  onCourseComplete?: (course: Course) => void;
}

export const CoursesGrid: React.FC<CoursesGridProps> = ({ onCourseComplete }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('todos');
  const [selectedTopic, setSelectedTopic] = useState<string>('todos');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [courseProgress, setCourseProgress] = useState<Map<number, CourseProgress>>(new Map());

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedLevel, selectedTopic]);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const coursesData = await apiClient.getCourses();
      setCourses(coursesData);
      
      // Simular progreso de cursos (en un caso real vendría del backend)
      const progressMap = new Map<number, CourseProgress>();
      coursesData.forEach(course => {
        if (Math.random() > 0.5) { // 50% de probabilidad de tener progreso
          progressMap.set(course.id, {
            course_id: course.id,
            user_id: user?.id || 1,
            progress_percentage: Math.floor(Math.random() * 100),
            completed: Math.random() > 0.7,
            fecha_inicio: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            fecha_completado: Math.random() > 0.7 ? new Date().toISOString() : undefined,
          });
        }
      });
      setCourseProgress(progressMap);
      
    } catch (error) {
      setError('Error al cargar cursos');
      console.error('Error loading courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tema.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por nivel
    if (selectedLevel !== 'todos') {
      filtered = filtered.filter(course => course.nivel === selectedLevel);
    }

    // Filtrar por tema
    if (selectedTopic !== 'todos') {
      filtered = filtered.filter(course => course.tema === selectedTopic);
    }

    setFilteredCourses(filtered);
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setIsCourseDialogOpen(true);
  };

  const handleStartCourse = async (course: Course) => {
    if (!user) {
      // Redirigir al login si no está autenticado
      window.location.href = '/login';
      return;
    }

    try {
      // Aquí podrías iniciar el curso o redirigir a la página del curso
      console.log('Iniciando curso:', course.titulo);
      
      // Simular inicio de curso
      const newProgress: CourseProgress = {
        course_id: course.id,
        user_id: user.id,
        progress_percentage: 0,
        completed: false,
        fecha_inicio: new Date().toISOString(),
      };
      
      setCourseProgress(prev => new Map(prev).set(course.id, newProgress));
      
      // Cerrar diálogo
      setIsCourseDialogOpen(false);
      setSelectedCourse(null);
      
    } catch (error) {
      console.error('Error al iniciar curso:', error);
    }
  };

  const handleCompleteCourse = async (course: Course) => {
    if (!user) return;

    try {
      // Completar curso en el backend
      await apiClient.completeCourse(user.id, course.id);
      
      // Actualizar progreso local
      const updatedProgress: CourseProgress = {
        course_id: course.id,
        user_id: user.id,
        progress_percentage: 100,
        completed: true,
        fecha_inicio: courseProgress.get(course.id)?.fecha_inicio || new Date().toISOString(),
        fecha_completado: new Date().toISOString(),
      };
      
      setCourseProgress(prev => new Map(prev).set(course.id, updatedProgress));
      
      // Notificar al componente padre
      if (onCourseComplete) {
        onCourseComplete(course);
      }
      
    } catch (error) {
      console.error('Error al completar curso:', error);
    }
  };

  const getLevelOptions = () => {
    const levels = ['todos', 'principiante', 'intermedio', 'avanzado'];
    return levels;
  };

  const getTopicOptions = () => {
    const topics = ['todos', ...Array.from(new Set(courses.map(c => c.tema)))];
    return topics;
  };

  const getProgressForCourse = (courseId: number): CourseProgress | undefined => {
    return courseProgress.get(courseId);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'principiante':
        return 'bg-green-100 text-green-800';
      case 'intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'avanzado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Resuelve la URL de la imagen del curso, cubriendo casos donde el backend
  // devuelve `imagen_url` o el campo antiguo `imagen`. Retorna una URL absoluta
  // si es posible; si no, devuelve el placeholder.
  const resolveImage = (c: Course) => {
    const raw: string = (c as any).imagen_url || (c as any).imagen || '';
    if (!raw) return 'https://assets.grok.com/anon-users/cab1b483-a2ad-4aa9-8aa6-3ebeb211c283/generated/5eac2aef-dedd-47db-a98b-54697b209280/image.jpg';
    if (/^https?:\/\//i.test(raw)) return raw;
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    return `${base}${raw.startsWith('/') ? raw : `/${raw}`}`;
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar cursos</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadCourses} variant="outline">
          Reintentar
        </Button>
      </div>
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
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Nivel" />
            </SelectTrigger>
            <SelectContent>
              {getLevelOptions().map((level) => (
                <SelectItem key={level} value={level}>
                  {level === 'todos' ? 'Todos los niveles' : level.charAt(0).toUpperCase() + level.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tema" />
            </SelectTrigger>
            <SelectContent>
              {getTopicOptions().map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic === 'todos' ? 'Todos los temas' : topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid de Cursos */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron cursos</h3>
          <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const progress = getProgressForCourse(course.id);
            const isCompleted = progress?.completed || false;
            const isInProgress = progress && !isCompleted && progress.progress_percentage > 0;
            
            return (
              <Card 
                key={course.id} 
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  isCompleted ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => handleCourseClick(course)}
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img src={resolveImage(course)} alt={course.titulo} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <Badge className={getLevelColor(course.nivel || 'principiante')}>
                      {course.nivel || 'Principiante'}
                    </Badge>
                  </div>
                  {isCompleted && (
                    <div className="absolute top-2 left-2">
                      <CheckCircle className="h-6 w-6 text-green-600 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                
                <CardHeader className="p-4">
                  <CardTitle className="text-lg line-clamp-2">{course.titulo}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.descripcion}</CardDescription>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {course.duracion_minutos || 30} min
                      </span>
                      <span className="flex items-center">
                        <Star className="mr-1 h-4 w-4 text-yellow-500" />
                        {Math.floor(Math.random() * 2) + 4}.{Math.floor(Math.random() * 9)}/5
                      </span>
                    </div>
                    
                    {progress && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progreso</span>
                          <span>{progress.progress_percentage}%</span>
                        </div>
                        <Progress value={progress.progress_percentage} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {isCompleted ? (
                        <Button variant="outline" className="w-full" disabled>
                          <Award className="mr-2 h-4 w-4" />
                          Completado
                        </Button>
                      ) : isInProgress ? (
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <Play className="mr-2 h-4 w-4" />
                          Continuar
                        </Button>
                      ) : (
                        <Button className="w-full">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Comenzar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Diálogo de Detalles del Curso */}
      <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCourse?.titulo}</DialogTitle>
            <DialogDescription>
              {selectedCourse?.descripcion}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCourse && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-600">Nivel:</span>
                  <Badge className={getLevelColor(selectedCourse.nivel || 'principiante')}>
                    {selectedCourse.nivel || 'Principiante'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-600">Tema:</span>
                  <Badge variant="outline">{selectedCourse.tema}</Badge>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-600">Duración:</span>
                  <span className="text-sm">{selectedCourse.duracion_minutos || 30} minutos</span>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-600">Recompensa:</span>
                  <div className="flex items-center">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                    <span className="text-sm">+10 CleanPoints</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-600">Contenido:</span>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm">{selectedCourse.contenido}</p>
                </div>
              </div>
              
              {getProgressForCourse(selectedCourse.id) && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-600">Tu Progreso:</span>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progreso</span>
                      <span>{getProgressForCourse(selectedCourse.id)?.progress_percentage}%</span>
                    </div>
                    <Progress 
                      value={getProgressForCourse(selectedCourse.id)?.progress_percentage || 0} 
                      className="h-2" 
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCourseDialogOpen(false)}>
              Cerrar
            </Button>
            
            {selectedCourse && (
              getProgressForCourse(selectedCourse.id)?.completed ? (
                <Button disabled>
                  <Award className="mr-2 h-4 w-4" />
                  Curso Completado
                </Button>
              ) : getProgressForCourse(selectedCourse.id) ? (
                <Button onClick={() => handleCompleteCourse(selectedCourse)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completar Curso
                </Button>
              ) : (
                <Button onClick={() => handleStartCourse(selectedCourse)}>
                  <Play className="mr-2 h-4 w-4" />
                  Comenzar Curso
                </Button>
              )
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
