"use client"

import { MarketplaceGrid } from "@/components/marketplace/marketplace-grid"

export default function MarketplacePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground">Canjea tus CleanPoints por productos sostenibles</p>
      </div>
      
      <MarketplaceGrid 
        onPurchaseComplete={(product) => {
          console.log('Producto comprado:', product);
          // Aquí podrías actualizar el estado global o mostrar notificaciones
        }}
      />
    </div>
  )
}