import { MapPin, Bell, Plug, Wifi, UtensilsCrossed, Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface Spot {
  id: string;
  name: string;
  address: string;
  image: string;
  rating: number;
  isOpen: boolean;
  closingTime: string;
  popularity: number;
  nearness: number;
}

const Explore = () => {
  const navigate = useNavigate();
  const [nearSpots, setNearSpots] = useState<Spot[]>([]);
  const [popularSpots, setPopularSpots] = useState<Spot[]>([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
    fetch(`${apiUrl}/spots`)
      .then(res => res.json())
      .then((spots: Spot[]) => {
        // Sort by nearness (lower is closer) for "Near Locations"
        const sortedByNearness = [...spots].sort((a, b) => a.nearness - b.nearness);
        setNearSpots(sortedByNearness.slice(0, 5));

        // Sort by popularity (higher is more popular) for "Popular Spots"
        const sortedByPopularity = [...spots].sort((a, b) => b.popularity - a.popularity);
        setPopularSpots(sortedByPopularity.slice(0, 5));
      })
      .catch(err => console.error('Failed to fetch spots:', err));
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20 max-w-md mx-auto">
      {/* Header with Location */}
      <div className="px-6 pt-3 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current location</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#5B7553]" />
              <span className="font-semibold text-gray-900">Downtown, Vancouver</span>
            </div>
          </div>
          <button className="relative p-2">
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#8B4513] rounded-full"></span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex gap-3">
          <Button className="bg-[#5B7553] hover:bg-[#4a6044] text-white rounded-lg gap-2">
            <Plug className="w-4 h-4" />
            Outlets
          </Button>
          <Button className="bg-[#5B7553] hover:bg-[#4a6044] text-white rounded-lg gap-2">
            <Wifi className="w-4 h-4" />
            Wifi
          </Button>
          <Button className="bg-[#5B7553] hover:bg-[#4a6044] text-white rounded-lg gap-2">
            <UtensilsCrossed className="w-4 h-4" />
            Food
          </Button>
        </div>
      </div>

      {/* Near Locations Section */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Near Locations</h2>
          <button className="text-[#5B7553] font-medium text-sm">See all</button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {nearSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => navigate(`/spot/${spot.id}`)}
              className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={spot.image}
                  alt={spot.name}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-gray-900">{spot.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-sm">{spot.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{spot.address}</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#E8F0E6] text-[#5B7553] border-0 text-xs font-semibold">
                    {spot.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                  <span className="text-sm text-gray-500">• Closes {spot.closingTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Spots Section */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Popular Spots</h2>
          <button className="text-[#5B7553] font-medium text-sm">See all</button>
        </div>

        <div className="space-y-4">
          {popularSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => navigate(`/spot/${spot.id}`)}
              className="flex gap-4 cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors"
            >
              <img
                src={spot.image}
                alt={spot.name}
                className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-gray-900">{spot.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-sm">{spot.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{spot.address}</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#E8F0E6] text-[#5B7553] border-0 text-xs font-semibold">
                    {spot.isOpen ? 'Open' : 'Closed'}
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

export default Explore;
