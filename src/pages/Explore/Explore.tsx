import { MapPin, Sun, Star, Heart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase, type Spot as SupabaseSpot } from "@/lib/supabase";

interface Spot {
  id: number;
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
  const [savedSpots, setSavedSpots] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Map<string, string>>(new Map());
  const [searchQuery, setSearchQuery] = useState("");
  const [allSpots, setAllSpots] = useState<Spot[]>([]);

  useEffect(() => {
    // Fetch spots from Supabase
    supabase
      .from('spots')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to fetch spots:', error);
          return;
        }
        const spots = data || [];
        setAllSpots(spots);
        // Sort by nearness (lower is closer) for "Near Locations"
        const sortedByNearness = [...spots].sort((a, b) => a.nearness - b.nearness);
        setNearSpots(sortedByNearness.slice(0, 5));

        // Sort by popularity (higher is more popular) for "Popular Spots"
        const sortedByPopularity = [...spots].sort((a, b) => b.popularity - a.popularity);
        setPopularSpots(sortedByPopularity.slice(0, 5));
      });

    // Fetch saved spots from Supabase
    supabase
      .from('saved')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to fetch saved spots:', error);
          return;
        }
        const saved = data || [];
        const savedSet = new Set(saved.map(s => String(s.spot_id)));
        const savedMap = new Map(saved.map(s => [String(s.spot_id), s.id]));
        setSavedSpots(savedSet);
        setSavedIds(savedMap);
      });
  }, []);

  const handleSaveToggle = async (e: React.MouseEvent, spotId: number, spot: Spot) => {
    e.stopPropagation();
    const spotIdStr = String(spotId);

    try {
      if (savedSpots.has(spotIdStr)) {
        // Remove from saved
        const savedId = savedIds.get(spotIdStr);
        const { error } = await supabase
          .from('saved')
          .delete()
          .eq('id', savedId);

        if (!error) {
          setSavedSpots(prev => {
            const newSet = new Set(prev);
            newSet.delete(spotIdStr);
            return newSet;
          });
          setSavedIds(prev => {
            const newMap = new Map(prev);
            newMap.delete(spotIdStr);
            return newMap;
          });
        }
      } else {
        // Add to saved
        const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { data, error } = await supabase
          .from('saved')
          .insert({
            id: newId,
            spot_id: spotId,
            spot_name: spot.name,
            address: spot.address,
            rating: spot.rating,
            image: spot.image,
          })
          .select()
          .single();

        if (!error && data) {
          setSavedSpots(prev => new Set(prev).add(spotIdStr));
          setSavedIds(prev => new Map(prev).set(spotIdStr, data.id));
        }
      }
    } catch (error) {
      console.error("Error toggling saved:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="px-6 pt-3 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Explore</h1>
      </div>

      {/* Location and Notification */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current location</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#5B7553]" />
              <span className="font-semibold text-gray-900">Downtown, Vancouver</span>
            </div>
          </div>
          <button className="p-2">
            <Sun className="w-6 h-6 text-[#5B7553]" />
          </button>
        </div>

      </div>

      {/* Search Box */}
      <div className="px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for cafes, libraries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#5B7553] rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5B7553] transition-all"
          />
        </div>
      </div>

      {/* Search Results or Near Locations Section */}
      {searchQuery ? (
        <div className="px-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Search Results</h2>
          <div className="space-y-4">
            {allSpots
              .filter(spot =>
                spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                spot.address.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => navigate(`/spot/${spot.id}`)}
                  className="flex gap-4 cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors"
                >
                  <img
                    src={spot.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=120&h=120&fit=crop"}
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
                        Open
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            {allSpots.filter(spot =>
              spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              spot.address.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 && (
              <p className="text-gray-500 text-center py-8">No spots found</p>
            )}
          </div>
        </div>
      ) : (
        <>
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
                  src={spot.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop"}
                  alt={spot.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => handleSaveToggle(e, spot.id, spot)}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${savedSpots.has(String(spot.id)) ? "text-[#5B7553] fill-[#5B7553]" : "text-gray-400"}`} />
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
                  {spot.closingTime && <span className="text-sm text-gray-500">• Closes {spot.closingTime}</span>}
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
                src={spot.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=120&h=120&fit=crop"}
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
                  {spot.closingTime && <span className="text-sm text-gray-500">• Closes {spot.closingTime}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Explore;
