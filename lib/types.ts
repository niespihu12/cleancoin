// Tipos centralizados para Clean Point

// ===== AUTHENTICATION =====
export interface User {
  id: number;
  nombre: string;
  email?: string;
  cleanpoints: number;
  fecha_registro?: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token?: string;
}

// ===== QR VALIDATION =====
export interface QRValidationRequest {
  qr_code: string;
  image_data: string; // base64 encoded image
  user_id: number;
}

export interface QRValidationResponse {
  success: boolean;
  valid: boolean;
  cleanpoints_earned: number;
  message: string;
  timestamp: string;
}

// ===== COURSES =====
export interface Course {
  id: number;
  titulo: string;
  descripcion: string;
  tema: string;
  contenido: string;
  duracion_minutos?: number;
  nivel?: 'principiante' | 'intermedio' | 'avanzado';
  imagen_url?: string;
}

export interface CourseProgress {
  course_id: number;
  user_id: number;
  progress_percentage: number;
  completed: boolean;
  fecha_inicio?: string;
  fecha_completado?: string;
}

// ===== MARKETPLACE =====
export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  stock?: number;
  disponible?: boolean;
  puntos_requeridos?: number;
}

export interface Purchase {
  id: number;
  usuario_id: number;
  producto_id: number;
  precio_pagado: number;
  descuento_aplicado: number;
  fecha: string;
  producto?: Product;
}

// ===== REWARDS =====
export interface Reward {
  id: number;
  nombre: string;
  descripcion?: string;
  puntos_requeridos: number;
  usuario_id?: number;
  imagen_url?: string;
}

// ===== API RESPONSES =====
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// ===== ERROR TYPES =====
export interface ApiError {
  detail: string;
  status_code: number;
  timestamp?: string;
}

// ===== UI STATES =====
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FormState extends LoadingState {
  isSubmitting: boolean;
  isValid: boolean;
}
