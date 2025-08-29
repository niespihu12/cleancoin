"use client"

import { CoursesGrid } from "@/components/courses/courses-grid"

export default function EducacionPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Centro Educativo</h1>
        <p className="text-muted-foreground">
          Aprende sobre el manejo adecuado de residuos sólidos y sostenibilidad
        </p>
      </div>
      
      <CoursesGrid 
        onCourseComplete={(course) => {
          console.log('Curso completado:', course);
          // Aquí podrías actualizar el estado global o mostrar notificaciones
        }}
      />
    </div>
  )
}