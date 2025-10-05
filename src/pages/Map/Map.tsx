import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import MarkerDialog from "../../components/MarkerDialog"

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Example marker data
const markers = [
  { id: 1, position: { lat: 49.2827, lng: -123.1207 }, content: "Marker 1: Vancouver" },
  { id: 2, position: { lat: 49.25, lng: -123.1 }, content: "Marker 2: Gastown" },
  { id: 3, position: { lat: 49.28, lng: -123.12 }, content: "Marker 3: Downtown" },
];

const Map = () => {
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const center = {
        lat: 49.2827, // Vancouver latitude
        lng: -123.1207, // Vancouver longitude
  };

  // Prevent scrolling on the map page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          options={{
            fullscreenControl: true,
            fullscreenControlOptions: {
              position: 2 // TOP_RIGHT
            },
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: true,
            zoomControlOptions: {
              position: 7 // RIGHT_CENTER
            },
            styles: [],
            gestureHandling: 'greedy'
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
      </LoadScript>
    </div>
  );
}

export default Map;
