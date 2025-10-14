import { useNavigate } from "react-router-dom";
import { Heart, Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface SavedSpot {
  id: string;
  spot_id: number;
  spot_name: string;
  address: string;
  rating: number;
  image: string;
}

const Saved = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: savedSpots = [] } = useQuery({
    queryKey: ['saved'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as SavedSpot[];
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

  const handleUnsave = (e: React.MouseEvent, savedId: string) => {
    e.stopPropagation();
    unsaveMutation.mutate(savedId);
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8 max-w-md md:max-w-7xl mx-auto">
      {/* Header */}
      <div className="px-6 pt-3 pb-4 md:pt-8 md:pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Saved</h1>
        <p className="text-sm md:text-base text-gray-500">{savedSpots.length} saved locations</p>
      </div>

      {/* Saved Locations List */}
      <div className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {savedSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => navigate(`/spot/${spot.spot_id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={spot.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop"}
                  alt={spot.spot_name}
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
                  <h3 className="font-bold text-gray-900 text-lg">{spot.spot_name}</h3>
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