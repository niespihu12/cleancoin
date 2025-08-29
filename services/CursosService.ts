// services/cursosService.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  // agrega otros campos que tenga tu modelo
}

export interface CursoCreate {
  titulo: string;
  descripcion: string;
  categoria: string;
}

class CursosService {
  async obtenerTodosLosCursos(skip: number = 0, limit: number = 100): Promise<Curso[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cursos/?skip=${skip}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      throw error;
    }
  }

  async obtenerCursoPorId(cursoId: number): Promise<Curso> {
    try {
      const response = await fetch(`${API_BASE_URL}/cursos/${cursoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Curso no encontrado');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener curso:', error);
      throw error;
    }
  }

  async crearCurso(cursoData: CursoCreate): Promise<Curso> {
    try {
      const response = await fetch(`${API_BASE_URL}/cursos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cursoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear curso:', error);
      throw error;
    }
  }

  async actualizarCurso(cursoId: number, cursoData: CursoCreate): Promise<Curso> {
    try {
      const response = await fetch(`${API_BASE_URL}/cursos/${cursoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cursoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar curso:', error);
      throw error;
    }
  }

  async eliminarCurso(cursoId: number): Promise<{ detail: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/cursos/${cursoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      throw error;
    }
  }

  async obtenerCursosPorCategoria(categoria: string, skip: number = 0, limit: number = 100): Promise<Curso[]> {
    try {
      const cursos = await this.obtenerTodosLosCursos(skip, limit);
      return cursos.filter(curso =>
        curso.categoria?.toLowerCase() === categoria.toLowerCase()
      );
    } catch (error) {
      console.error('Error al obtener cursos por categoría:', error);
      throw error;
    }
  }

  async verificarComplecion(cursoId: number, usuarioId: number): Promise<boolean> {
    try {
      // Mock temporal
      return Math.random() > 0.5;
    } catch (error) {
      console.error('Error al verificar completación:', error);
      return false;
    }
  }
}

const cursosService = new CursosService();

export default cursosService;
export { CursosService };
