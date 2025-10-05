import { useState, useEffect, useMemo } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import MarkerDialog from "../../components/MarkerDialog"

// Example marker data
const markers = [
  {
    id: 1,
    name: "Revolver Coffee",
    address: "325 Cambie St, Vancouver, BC V6B 2N4",
    position: { lat: 49.2827, lng: -123.1090 },
    image: "https://source.unsplash.com/400x250/?coffee",
    rating: 4.7,
    description: "Trendy coffee shop with great espresso and a cozy atmosphere perfect for focused studying.",
    wifi: true,
    food: true,
  },
  {
    id: 2,
    name: "Vancouver Public Library - Central Branch",
    address: "350 W Georgia St, Vancouver, BC V6B 6B1",
    position: { lat: 49.2796, lng: -123.1158 },
    image: "https://source.unsplash.com/400x250/?library",
    rating: 4.9,
    description: "Iconic downtown library with plenty of study spaces, quiet zones, and reliable Wi-Fi.",
    wifi: true,
    food: false,
  },
  {
    id: 3,
    name: "Kafka’s Coffee Roasters",
    address: "2525 Main St, Vancouver, BC V5T 3E5",
    position: { lat: 49.2621, lng: -123.1009 },
    image: "https://source.unsplash.com/400x250/?cafe",
    rating: 4.6,
    description: "Spacious café on Main Street with a modern vibe, great lighting, and a strong cup of coffee.",
    wifi: true,
    food: true,
  },
  {
    id: 4,
    name: "Bean Around the World",
    address: "1945 Cornwall Ave, Vancouver, BC V6J 1C8",
    position: { lat: 49.2725, lng: -123.1505 },
    image: "https://source.unsplash.com/400x250/?coffee-shop",
    rating: 4.4,
    description: "Popular Kitsilano café near the beach with relaxed vibes and plenty of tables.",
    wifi: true,
    food: true,
  },
  {
    id: 5,
    name: "Irving K. Barber Learning Centre (UBC Library)",
    address: "1961 East Mall, Vancouver, BC V6T 1Z1",
    position: { lat: 49.2670, lng: -123.2520 },
    image: "https://source.unsplash.com/400x250/?study",
    rating: 4.8,
    description: "Large academic library at UBC with modern study spaces, group rooms, and strong Wi-Fi.",
    wifi: true,
    food: false,
  },
  {
    id: 6,
    name: "Waves Coffee House",
    address: "900 Howe St, Vancouver, BC V6Z 2M4",
    position: { lat: 49.2800, lng: -123.1215 },
    image: "https://source.unsplash.com/400x250/?coffeehouse",
    rating: 4.2,
    description: "Cozy downtown café chain with plenty of seating, free Wi-Fi, and light snacks.",
    wifi: true,
    food: true,
  },
  {
    id: 7,
    name: "Great Northern Way Campus Library",
    address: "577 Great Northern Way, Vancouver, BC V5T 1E1",
    position: { lat: 49.2655, lng: -123.0982 },
    image: "https://source.unsplash.com/400x250/?books",
    rating: 4.5,
    description: "Quiet and modern study space popular with students from Emily Carr and other campuses.",
    wifi: true,
    food: false,
  },
  {
    id: 8,
    name: "Courthouse Library BC",
    address: "800 Smithe Street, Vancouver, BC V6Z 2E1",
    position: { lat: 49.2732, lng: -123.1204 },
    image: "https://source.unsplash.com/400x250/?library,building",  // placeholder
    rating: 4.3,
    description: "Quiet courthouse library with public computers, Wi-Fi, and peaceful study areas away from noise.",
    wifi: true,
    food: false,
  },
  {
    id: 9,
    name: "Britannia Branch Library",
    address: "1661 Napier Street, Vancouver, BC V5L 4X4",
    position: { lat: 49.2629, lng: -123.0617 },
    image: "https://source.unsplash.com/400x250/?books,library",  // placeholder
    rating: 4.2,
    description: "Community library branch, less busy than downtown. Good for reading, studying, and borrowing books.",
    wifi: true,
    food: false,
  },
  {
    id: 10,
    name: "Carnegie Branch Library",
    address: "401 Main Street, Vancouver, BC V6A 2T7",
    position: { lat: 49.2755, lng: -123.0999 },
    image: "https://source.unsplash.com/400x250/?interior,library",  // placeholder
    rating: 4.1,
    description: "Library with multiple seating areas and quiet corners; ideal for afternoon or evening study.",
    wifi: true,
    food: false,
  },
  {
    id: 11,
    name: "Champlain Heights Branch Library",
    address: "7110 Kerr Street, Vancouver, BC V5S 4W2",
    position: { lat: 49.2192, lng: -123.0690 },
    image: "https://source.unsplash.com/400x250/?library,reading",  // placeholder
    rating: 4.0,
    description: "Smaller branch but cozy, with free Wi-Fi and comfortable chairs. Not many distractions.",
    wifi: true,
    food: false,
  },
  {
    id: 12,
    name: "Collingwood Branch Library",
    address: "2985 Kingsway, Vancouver, BC V5R 5J4",
    position: { lat: 49.2515, lng: -123.0556 },
    image: "https://source.unsplash.com/400x250/?quiet,library",  // placeholder
    rating: 4.2,
    description: "Friendly local branch, easy access, decent Wi-Fi, good for solo study sessions.",
    wifi: true,
    food: false,
  },
  {
    id: 13,
    name: "Hidden Café Downtown",
    address: "1234 Hamilton Street, Vancouver, BC V6B 2P8",
    position: { lat: 49.2808, lng: -123.1140 },
    image: "https://source.unsplash.com/400x250/?cafe,coffeeshop",  // placeholder
    rating: 4.4,
    description: "Small, tucked-away café with a calm atmosphere and cozy nooks; ideal for reading and light studying.",
    wifi: true,
    food: true,
  },
  {
    id: 14,
    name: "The Study Lounge Café",
    address: "567 Seymour Street, Vancouver, BC V6B 3K5",
    position: { lat: 49.2841, lng: -123.1151 },
    image: "https://source.unsplash.com/400x250/?coffee,table",  // placeholder
    rating: 4.6,
    description: "Modern café with large windows, good natural light, reliable Wi-Fi, and full food menu.",
    wifi: true,
    food: true,
  },
  {
    id: 15,
    name: "Quiet Corner Tea House",
    address: "889 Denman Street, Vancouver, BC V6G 2L4",
    position: { lat: 49.2911, lng: -123.1360 },
    image: "https://source.unsplash.com/400x250/?tea,house",  // placeholder
    rating: 4.3,
    description: "Tea house with mellow ambiance — soft music, few distractions, good for mellow studying or light reading.",
    wifi: true,
    food: true,
  },
  {
    id: 16,
    name: "Urban Library Café",
    address: "2300 Kingsway, Vancouver, BC V5N 2T8",
    position: { lat: 49.2489, lng: -123.0559 },
    image: "https://source.unsplash.com/400x250/?library,cafe",  // placeholder
    rating: 4.5,
    description: "Hybrid space combining library-like calm with café food; snacks & drinks available, Wi-Fi strong.",
    wifi: true,
    food: true,
  }
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
