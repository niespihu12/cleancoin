// Cliente API centralizado para Clean Point

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

// Types for QR validation
interface QRValidateRequest {
  userId: number;
  containerId: string;
  photo: string;
}

interface QRValidateResponse {
  success: boolean;
  points_awarded: number;
  new_balance: number;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Método privado para obtener el token de autenticación
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cleanpoint_token');
    }
    return null;
  }

  // Método privado para hacer requests HTTP
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Agregar headers de autenticación si existe token
    const token = this.getAuthToken();
    // Normalize headers to a simple object so we can assign Authorization safely

  // Build a plain headers object from possible headers shapes
  const headersObj: Record<string, string> = {};
  // ensure default header
  headersObj['Content-Type'] = 'application/json';
    const incoming = options.headers;
    if (incoming) {
      if (incoming instanceof Headers) {
        incoming.forEach((v, k) => (headersObj[k] = v));
      } else if (Array.isArray(incoming)) {
        try {
          Object.assign(headersObj, Object.fromEntries(incoming as [string, string][]));
        } catch (e) {
          // ignore malformed
        }
      } else {
        try {
          Object.assign(headersObj, incoming as Record<string, string>);
        } catch (e) {
          // ignore
        }
      }
    }

    if (token) headersObj['Authorization'] = `Bearer ${token}`;

    const config: RequestInit = {
      headers: headersObj,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Manejar errores HTTP
      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem('cleanpoint_token');
          window.location.href = '/login';
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      // Si la respuesta es vacía (DELETE, etc.)
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`Error en API request ${endpoint}:`, error);
      throw error;
    }
  }

  // ===== AUTHENTICATION ENDPOINTS =====
  
  async login(credentials: { email: string; password: string }) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { nombre: string; email: string; password: string }) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // ===== USER PROFILE ENDPOINTS =====
  
  async getUserProfile(userId: number) {
    return this.request<any>(`/usuarios/${userId}`);
  }

  async updateUserProfile(userId: number, userData: Partial<any>) {
    return this.request<any>(`/usuarios/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserCleanPoints(userId: number) {
    return this.request<number>(`/usuarios/${userId}/cleanpoints`);
  }

  // ===== QR VALIDATION ENDPOINTS =====
  
  async validateQR(data: QRValidateRequest): Promise<QRValidateResponse> {
    return this.request<QRValidateResponse>('/qr/validate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ===== COURSES ENDPOINTS =====
  
  async getCourses(skip: number = 0, limit: number = 100) {
    return this.request<any[]>(`/cursos/?skip=${skip}&limit=${limit}`);
  }

  async getCourseById(courseId: number) {
    return this.request<any>(`/cursos/${courseId}`);
  }

  async completeCourse(userId: number, courseId: number) {
    return this.request<any>(`/usuarios/${userId}/completar_curso/${courseId}`, {
      method: 'POST',
    });
  }

  // ===== MARKETPLACE ENDPOINTS =====
  
  async getProducts(skip: number = 0, limit: number = 50) {
    return this.request<any[]>(`/marketplace/productos/?skip=${skip}&limit=${limit}`);
  }

  async getProductById(productId: number) {
    return this.request<any>(`/marketplace/productos/${productId}`);
  }

  // El backend calcula el precio final y el descuento; enviamos solo los ids
  async purchaseProduct(purchaseData: { usuario_id: number; producto_id: number }): Promise<{ compra: any; new_balance: number }> {
    return this.request<{ compra: any; new_balance: number }>('/compras/', {
      method: 'POST',
      body: JSON.stringify(purchaseData),
    });
  }

  async getPurchaseHistory(usuario_id: number) {
    return this.request<any[]>(`/compras/historial/${usuario_id}`);
  }

  // ===== REWARDS ENDPOINTS =====
  
  async getRewards() {
    return this.request<any[]>('/recompensas/');
  }

  async getUserRewards(userId: number) {
    return this.request<any[]>(`/recompensas/?usuario_id=${userId}`);
  }

  // ===== UTILITY METHODS =====
  
  setAuthToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cleanpoint_token', token);
    }
  }

  removeAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cleanpoint_token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient();

// Exportar tipos útiles
export type { ApiClient };
