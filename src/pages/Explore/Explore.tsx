import { MapPin, Bell, Plug, Wifi, UtensilsCrossed, Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Explore = () => {
  const navigate = useNavigate();

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
          {/* Location Card 1 */}
          <div
            onClick={() => navigate('/spot/1')}
            className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="relative h-48">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop"
                alt="Di Beppe Caffè"
                className="w-full h-full object-cover"
              />
              <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                <Heart className="w-5 h-5 text-[#8B4513] fill-[#8B4513]" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-bold text-gray-900">Di Beppe Caffè</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-sm">4.6</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">2 W Cordova St, Vancouver, BC</p>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#E8F0E6] text-[#5B7553] border-0 text-xs font-semibold">Open</Badge>
                <span className="text-sm text-gray-500">• Closes 10 p.m.</span>
              </div>
            </div>
          </div>

          {/* Location Card 2 */}
          <div
            onClick={() => navigate('/spot/2')}
            className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="relative h-48">
              <img
                src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop"
                alt="Deville Coffee"
                className="w-full h-full object-cover"
              />
              <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                <Heart className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-bold text-gray-900">Deville Coffee</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-sm">4.8</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">325 Cambie St, Vancouver, BC</p>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#E8F0E6] text-[#5B7553] border-0 text-xs font-semibold">Open</Badge>
                <span className="text-sm text-gray-500">• Closes 8 p.m.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Spots Section */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Popular Spots</h2>
          <button className="text-[#5B7553] font-medium text-sm">See all</button>
        </div>

        <div className="space-y-4">
          {/* Popular Spot Item */}
          <div
            onClick={() => navigate('/spot/3')}
            className="flex gap-4 cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=120&h=120&fit=crop"
              alt="Revolver"
              className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-bold text-gray-900">Revolver</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-sm">4.6</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">325 Cambie St., Vancouver, BC</p>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#E8F0E6] text-[#5B7553] border-0 text-xs font-semibold">Open</Badge>
                <span className="text-sm text-gray-500">• Closes 5 p.m.</span>
              </div>
            </div>
          </div>

          {/* Add more popular spots as needed */}
          <div
            onClick={() => navigate('/spot/4')}
            className="flex gap-4 cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=120&h=120&fit=crop"
              alt="Nemesis Coffee"
              className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-bold text-gray-900">Nemesis Coffee</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-sm">4.7</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">127 W Pender St, Vancouver, BC</p>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#E8F0E6] text-[#5B7553] border-0 text-xs font-semibold">Open</Badge>
                <span className="text-sm text-gray-500">• Closes 6 p.m.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
