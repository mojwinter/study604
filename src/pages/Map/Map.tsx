import { useState, useEffect, useMemo } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import MarkerDialog from "../../components/MarkerDialog"

// Example marker data
const markers = [
  { id: 1, position: { lat: 49.2827, lng: -123.1207 }, content: "Marker 1: Vancouver" },
  { id: 2, position: { lat: 49.25, lng: -123.1 }, content: "Marker 2: Gastown" },
  { id: 3, position: { lat: 49.28, lng: -123.12 }, content: "Marker 3: Downtown" },
];

const Map = () => {
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const center = useMemo(() => ({
        lat: 49.2827, // Vancouver latitude
        lng: -123.1207, // Vancouver longitude
  }), []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API || ""
  });
  // Vancouver area
  const vancouverBounds = {
    north: 49.4,
    south: 49.0,
    west: -123.4,
    east: -122.4,
  };

  // Prevent scrolling on the map page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="px-6 pt-3 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Map</h1>
        <p className="text-sm text-gray-500">Explore Vancouver study spots</p>
      </div>

      {/* Map Container */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100" style={{ height: 'calc(100vh - 180px)' }}>
        <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={12}
            options={{
              fullscreenControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              zoomControl: false,
              panControl: false,
              rotateControl: false,
              scaleControl: false,
              styles: [],
              restriction: {
                latLngBounds: vancouverBounds,
                strictBounds: true
              },
              gestureHandling: 'greedy',
              disableDefaultUI: true
            }}
          >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              onClick={() => setSelectedMarkerId(marker.id)}
            >
              {selectedMarkerId === marker.id && (
                <InfoWindow onCloseClick={() => setSelectedMarkerId(null)}>
                  <MarkerDialog marker={marker} />
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}

export default Map;
