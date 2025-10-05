import { useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import MarkerDialog from "../../components/MarkerDialog"

const containerStyle = {
  width: '100%',
  height: '600px',
  margin: 0,
  padding: 0
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

  const mapOptions = {
    streetViewControl: false, // This line disables the Street View control
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    rotateControl: false,
    fullscreenControl: false
  };

  return <>
    <h1>Map Page</h1>
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        options={mapOptions}
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
  </>;
}

export default Map;