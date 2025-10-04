import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: '100%',
  height: '600px'
};

const Map = () => {
  const center = {
        lat: 49.2827, // Vancouver latitude
        lng: -123.1207, // Vancouver longitude
  };

  return <>
    <h1>Map Page</h1>
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  </>;
}

export default Map;