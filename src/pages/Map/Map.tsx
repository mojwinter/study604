import { useState, useEffect, useMemo } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import MarkerDialog from "../../components/MarkerDialog"
import { supabase, type Spot } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

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

  // Fetch spots data from Supabase with caching
  const { data: spots = [] } = useQuery({
    queryKey: ['spots'],
    queryFn: async () => {
      const { data, error } = await supabase.from('spots').select('*');
      if (error) throw error;
      return data as Spot[];
    },
  });

  // Prevent scrolling on the map page and hide InfoWindow close button
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Add style to hide the default InfoWindow close button
    const style = document.createElement('style');
    style.innerHTML = `
      .gm-style-iw-chr {
        display: none !important;
      }
      .gm-ui-hover-effect {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.style.overflow = 'unset';
      document.head.removeChild(style);
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
          {spots.map((spot) => (
            <Marker
              key={spot.id}
              position={spot.position}
              onClick={() => setSelectedMarkerId(spot.id)}
            >
              {selectedMarkerId === spot.id && (
                <InfoWindow
                  onCloseClick={() => setSelectedMarkerId(null)}
                  options={{
                    disableAutoPan: false,
                    maxWidth: 320,
                    pixelOffset: new window.google.maps.Size(0, -10)
                  }}
                >
                  <MarkerDialog marker={spot} onClose={() => setSelectedMarkerId(null)} />
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
