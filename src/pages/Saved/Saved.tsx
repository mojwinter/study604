import { useNavigate } from "react-router-dom";
import { Heart, Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Saved = () => {
  const navigate = useNavigate();

  // Mock saved locations data
  const savedSpots = [
    {
      id: 1,
      name: "Prototype Coffee",
      address: "883 E Hastings St, Vancouver, BC",
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
      status: "Open",
      closingTime: "10 p.m."
    },
    {
      id: 2,
      name: "Di Beppe Caffè",
      address: "2 W Cordova St, Vancouver, BC",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop",
      status: "Open",
      closingTime: "10 p.m."
    },
    {
      id: 3,
      name: "Revolver",
      address: "325 Cambie St., Vancouver, BC",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
      status: "Open",
      closingTime: "5 p.m."
    },
    {
      id: 4,
      name: "Nemesis Coffee",
      address: "127 W Pender St, Vancouver, BC",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
      status: "Open",
      closingTime: "6 p.m."
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="px-6 pt-3 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Saved</h1>
        <p className="text-sm text-gray-500">{savedSpots.length} saved locations</p>
      </div>

      {/* Saved Locations List */}
      <div className="px-6">
        <div className="space-y-4">
          {savedSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => navigate(`/spot/${spot.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={spot.image}
                  alt={spot.name}
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle remove from saved
                  }}
                >
                  <Heart className="w-5 h-5 text-[#5B7553] fill-[#5B7553]" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-gray-900 text-lg">{spot.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-sm">{spot.rating}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-500">{spot.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#E8F0E6] text-[#5B7553] border-0 text-xs font-semibold">
                    {spot.status}
                  </Badge>
                  <span className="text-sm text-gray-500">• Closes {spot.closingTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Saved;