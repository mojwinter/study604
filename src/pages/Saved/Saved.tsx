import { useNavigate } from "react-router-dom";
import { Heart, Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface SavedSpot {
  id: string;
  spotId: string;
  spotName: string;
  address: string;
  rating: number;
  image: string;
}

const Saved = () => {
  const navigate = useNavigate();
  const [savedSpots, setSavedSpots] = useState<SavedSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedSpots = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
        const response = await fetch(`${apiUrl}/saved`);
        if (response.ok) {
          const data = await response.json();
          setSavedSpots(data);
        }
      } catch (error) {
        console.error("Error fetching saved spots:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedSpots();
  }, []);

  const handleUnsave = async (e: React.MouseEvent, savedId: string) => {
    e.stopPropagation();
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

    try {
      const response = await fetch(`${apiUrl}/saved/${savedId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSavedSpots(prev => prev.filter(spot => spot.id !== savedId));
      }
    } catch (error) {
      console.error("Error removing saved spot:", error);
    }
  };

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
              onClick={() => navigate(`/spot/${spot.spotId}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={spot.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop"}
                  alt={spot.spotName}
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                  onClick={(e) => handleUnsave(e, spot.id)}
                >
                  <Heart className="w-5 h-5 text-[#5B7553] fill-[#5B7553]" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-gray-900 text-lg">{spot.spotName}</h3>
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
                    Open
                  </Badge>
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