import { MapPin, Star, Heart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { supabase, type Spot as SupabaseSpot } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all spots with caching
  const { data: allSpots = [] } = useQuery({
    queryKey: ['spots'],
    queryFn: async () => {
      const { data, error } = await supabase.from('spots').select('*');
      if (error) throw error;
      return data as Spot[];
    },
  });

  // Fetch saved spots with caching
  const { data: savedData = [] } = useQuery({
    queryKey: ['saved'],
    queryFn: async () => {
      const { data, error } = await supabase.from('saved').select('*');
      if (error) throw error;
      return data;
    },
  });

  // Compute saved spots set and map from cached data
  const { savedSpots, savedIds } = useMemo(() => {
    const savedSet = new Set(savedData.map(s => String(s.spot_id)));
    const savedMap = new Map(savedData.map(s => [String(s.spot_id), s.id]));
    return { savedSpots: savedSet, savedIds: savedMap };
  }, [savedData]);

  // Compute near and popular spots from cached data
  const nearSpots = useMemo(() => {
    return [...allSpots].sort((a, b) => a.nearness - b.nearness).slice(0, 4);
  }, [allSpots]);

  const popularSpots = useMemo(() => {
    return [...allSpots].sort((a, b) => b.popularity - a.popularity).slice(0, 5);
  }, [allSpots]);

  const saveMutation = useMutation({
    mutationFn: async ({ spotId, spot }: { spotId: number; spot: Spot }) => {
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
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved'] });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async (savedId: string) => {
      const { error } = await supabase.from('saved').delete().eq('id', savedId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved'] });
    },
  });

  const handleSaveToggle = async (e: React.MouseEvent, spotId: number, spot: Spot) => {
    e.stopPropagation();
    const spotIdStr = String(spotId);

    if (savedSpots.has(spotIdStr)) {
      const savedId = savedIds.get(spotIdStr);
      if (savedId) unsaveMutation.mutate(savedId);
    } else {
      saveMutation.mutate({ spotId, spot });
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8 max-w-md md:max-w-[1600px] mx-auto md:px-4 lg:px-8">
      {/* Header - Mobile Only */}
      <div className="md:hidden px-6 pt-3 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Explore</h1>
      </div>

      {/* Hero Section - Desktop Only */}
      <div className="hidden md:block px-6 pt-8 pb-6">
        <div className="bg-[#E8F0E6] rounded-3xl p-8 mb-2 shadow-sm border border-[#5B7553]/10">
          <h1 className="text-4xl font-bold mb-3 leading-tight">
            <span className="text-gray-900">Find Your Perfect </span>
            <span className="text-[#5B7553]">Study Spot</span>
          </h1>
          <p className="text-gray-600 text-lg mb-6 max-w-2xl font-medium">
            Discover the best cafes and libraries in Vancouver
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5B7553] rounded-full shadow-md">
            <MapPin className="w-4 h-4 text-white" />
            <span className="font-semibold text-sm text-white">Downtown, Vancouver</span>
          </div>
        </div>
      </div>

      {/* Location - Mobile Only */}
      <div className="md:hidden px-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current location</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#5B7553]" />
              <span className="font-semibold text-gray-900">Downtown, Vancouver</span>
            </div>
          </div>
          <img
            src="/study604.png"
            alt="study604"
            className="h-12"
          />
        </div>
      </div>

      {/* Search Box and Filters */}
      <div className="px-6 pb-6">
        <div className="relative max-w-2xl md:max-w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for cafes, libraries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border-2 border-[#5B7553] rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5B7553] transition-all"
          />
        </div>

        {/* Quick Filters - Desktop Only */}
        <div className="hidden md:flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
          {['Open Now', 'Near Me', 'Quiet', 'WiFi', 'Outlets', 'Coffee'].map(filter => (
            <button
              key={filter}
              className="px-4 py-2 bg-white border-2 border-gray-200 rounded-full
                         hover:border-[#5B7553] hover:bg-[#E8F0E6] hover:text-[#5B7553] transition-all
                         whitespace-nowrap font-medium text-sm text-gray-700"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results or Near Locations Section */}
      {searchQuery ? (
        <div className="px-6 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allSpots
              .filter(spot =>
                spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                spot.address.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => navigate(`/spot/${spot.id}`)}
                  className="flex gap-4 cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-colors border border-gray-100"
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
              <p className="text-gray-500 text-center py-8 col-span-full">No spots found</p>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Near Locations Section */}
          <div className="px-6 mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-3xl font-bold text-gray-900">Near Locations</h2>
              <button className="text-[#5B7553] font-medium text-sm md:text-base hover:underline">See all</button>
            </div>

        <div className="flex gap-4 overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 pb-2 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide md:overflow-visible">
          {nearSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => navigate(`/spot/${spot.id}`)}
              className="flex-shrink-0 w-64 md:w-auto bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200"
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
                <p className="text-sm text-gray-500 mb-2 line-clamp-1">{spot.address}</p>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge className="bg-[#E8F0E6] text-[#5B7553] border-0 text-xs font-semibold">
                    {spot.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                  {spot.closingTime && <span className="text-xs text-gray-500">Closes {spot.closingTime}</span>}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>{(spot.nearness / 1000).toFixed(1)} km away</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

          {/* Popular Spots Section */}
          <div className="px-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-3xl font-bold text-gray-900">Popular Spots</h2>
              <button className="text-[#5B7553] font-medium text-sm md:text-base hover:underline">See all</button>
            </div>

        <div className="space-y-3 md:space-y-4">
          {popularSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => navigate(`/spot/${spot.id}`)}
              className="flex gap-4 cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-colors border border-gray-100"
            >
              <img
                src={spot.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=120&h=120&fit=crop"}
                alt={spot.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-gray-900 text-base md:text-lg">{spot.name}</h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-sm">{spot.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{spot.address}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-[#E8F0E6] text-[#5B7553] border-0 text-xs font-semibold">
                    {spot.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                  {spot.closingTime && <span className="text-xs text-gray-500">Closes {spot.closingTime}</span>}
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
