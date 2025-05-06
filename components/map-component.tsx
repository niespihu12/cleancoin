import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// Importamos el CSS de Leaflet
import "leaflet/dist/leaflet.css";
import { icon } from "leaflet";

// Creamos íconos personalizados para los marcadores
const createIcon = (iconUrl) => {
  return icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

// Definimos los íconos para usuario y contenedores
const userIcon = createIcon("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png");
const containerIcon = createIcon("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png");

interface MapComponentProps {
  userLocation: { lat: number; lng: number } | null;
  contenedores: Array<{
    id: number;
    nombre: string;
    lat: number;
    lng: number;
    tipo: string;
    disponible: boolean;
  }>;
  isLoading: boolean;
}

export default function MapComponent({ userLocation, contenedores, isLoading }: MapComponentProps) {
  // Definimos una ubicación central para Santa Marta, Colombia
  const santaMartaPosition = { lat: 11.24079, lng: -74.1992 };
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Simulamos un tiempo de carga si es necesario
    if (!isLoading) {
      const timer = setTimeout(() => {
        setMapReady(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading || !mapReady) {
    return (
      <div className="flex h-64 w-full items-center justify-center bg-gray-100 rounded-lg">
        <div className="flex flex-col items-center gap-2 text-gray-600">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Cargando mapa...</p>
        </div>
      </div>
    );
  }

  // Determinamos el centro del mapa: la ubicación del usuario o la posición predeterminada de Santa Marta
  const mapCenter = userLocation || santaMartaPosition;

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        whenReady={() => console.log("Mapa cargado correctamente")}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador para la ubicación del usuario */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="text-center font-medium">Tu ubicación actual</div>
            </Popup>
          </Marker>
        )}

        {/* Marcadores para los contenedores */}
        {contenedores.map((contenedor) => (
          <Marker 
            key={contenedor.id} 
            position={[contenedor.lat, contenedor.lng]} 
            icon={containerIcon}
          >
            <Popup>
              <div className="p-1">
                <p className="font-bold text-base">{contenedor.nombre}</p>
                <p className="text-sm">Tipo: {contenedor.tipo}</p>
                <p className="text-sm">
                  Estado: <span className={contenedor.disponible ? "text-green-600" : "text-red-600"}>
                    {contenedor.disponible ? "Disponible" : "No disponible"}
                  </span>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}