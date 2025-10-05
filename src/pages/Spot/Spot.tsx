import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, Wifi, Coffee, Star, CheckCircle, Utensils, Heart, AudioLines, Plug, LampDesk } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface SpotData {
  id: number;
  name: string;
  address: string;
  position: { lat: number; lng: number };
  image: string;
  rating: number;
  description: string;
  wifi: boolean;
  food: boolean;
  popularity: number;
  nearness: number;
  atmosphere_rating: number;
  wifi_rating: number;
  outlet_access_rating: number;
  food_beverage_rating: number;
  table_space_rating: number;
}

const Spot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (location.state?.reviewSubmitted) {
      setShowConfirmation(true);
      // Clear the state
      window.history.replaceState({}, document.title);
      // Hide after 2 seconds
      setTimeout(() => {
        setShowConfirmation(false);
      }, 2000);
    }
  }, [location]);

  // Fetch spot data with caching
  const { data: spot, isLoading: loading } = useQuery({
    queryKey: ['spot', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spots')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as SpotData;
    },
  });

  // Fetch reviews with caching
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('spot_id', id);
      if (error) throw error;
      return data;
    },
  });

  // Fetch saved status with caching
  const { data: savedData = [] } = useQuery({
    queryKey: ['saved'],
    queryFn: async () => {
      const { data, error } = await supabase.from('saved').select('*');
      if (error) throw error;
      return data;
    },
  });

  const hasReviewed = reviews.length > 0;
  const savedSpot = useMemo(() => {
    return savedData.find(s => String(s.spot_id) === String(id));
  }, [savedData, id]);
  const isSaved = !!savedSpot;
  const savedId = savedSpot?.id;

  const saveMutation = useMutation({
    mutationFn: async () => {
      const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const { data, error } = await supabase
        .from('saved')
        .insert({
          id: newId,
          spot_id: Number(id),
          spot_name: spot?.name || '',
          address: spot?.address || '',
          rating: spot?.rating || 0,
          image: spot?.image || '',
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

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved && savedId) {
      unsaveMutation.mutate(savedId);
    } else {
      saveMutation.mutate();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-20 max-w-md mx-auto flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen bg-white pb-20 max-w-md mx-auto flex items-center justify-center">
        <p className="text-gray-500">Spot not found</p>
      </div>
    );
  }

  const ratingCategories = [
    { icon: AudioLines, label: "Atmosphere", rating: spot.atmosphere_rating.toFixed(1) },
    { icon: Wifi, label: "Wi-Fi", rating: spot.wifi_rating.toFixed(1) },
    { icon: Plug, label: "Outlet Access", rating: spot.outlet_access_rating.toFixed(1) },
    { icon: Utensils, label: "Food & Beverage", rating: spot.food_beverage_rating.toFixed(1) },
    { icon: LampDesk, label: "Table Space", rating: spot.table_space_rating.toFixed(1) },
  ];

  const previewImages = [
    spot.image,
    spot.image,
    spot.image
  ];

  return (
    <div className="min-h-screen bg-white pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-3">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">{spot.name}</h1>
        <div className="w-10 h-10" />
      </div>

      {/* Hero Image */}
      <div className="px-6 mb-4 relative">
        <img
          src={spot.image}
          alt={spot.name}
          className="w-full h-52 rounded-2xl object-cover"
        />
        <button
          onClick={handleSaveToggle}
          className="absolute top-3 right-9 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart className={`w-5 h-5 ${isSaved ? "text-[#5B7553] fill-[#5B7553]" : "text-gray-400"}`} />
        </button>
      </div>

      {/* Category Ratings */}
      {ratingCategories.length > 0 && (
        <div className="px-6 mb-6">
          <div className="flex gap-2 w-full">
            {ratingCategories.map((category, index) => (
              <div key={index} className="flex flex-col items-center gap-1 bg-gray-50 rounded-lg px-2 py-2 flex-1">
                <category.icon className="w-4 h-4 text-gray-700" />
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-[#5B7553] fill-[#5B7553]" />
                  <span className="text-xs font-bold text-gray-900">{category.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location Info */}
      <div className="px-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{spot.name}</h2>
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-500">{spot.address}</p>
        </div>
      </div>

      {/* Description */}
      <div className="px-6 mb-6">
        <h3 className="text-base font-bold text-gray-900 mb-2">Description</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {spot.description && spot.description.length > 150 ? (
            <>
              {isDescriptionExpanded ? spot.description : `${spot.description.slice(0, 150)}...`}{" "}
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-[#5B7553] font-semibold"
              >
                {isDescriptionExpanded ? "Read Less" : "Read More..."}
              </button>
            </>
          ) : (
            spot.description
          )}
        </p>
      </div>

      {/* Preview Images */}
      <div className="px-6 mb-6">
        <h3 className="text-base font-bold text-gray-900 mb-3">Preview</h3>
        <div className="grid grid-cols-3 gap-3">
          {previewImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Preview ${index + 1}`}
              className="w-full h-24 rounded-xl object-cover"
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 space-y-3">
        <Button
          onClick={() => !hasReviewed && navigate(`/review/${id}`)}
          disabled={hasReviewed}
          className={`w-full rounded-xl py-6 text-base font-semibold flex items-center justify-center gap-2 ${
            hasReviewed
              ? "bg-gray-100 text-gray-500 border-2 border-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 text-[#5B7553] border-2 border-[#5B7553]"
          }`}
        >
          {hasReviewed ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Reviewed
            </>
          ) : (
            "Write a Review"
          )}
        </Button>
        <Button className="w-full bg-[#5B7553] hover:bg-[#4a6044] text-white rounded-xl py-6 text-base font-semibold">
          Get Directions
        </Button>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed bottom-24 left-0 right-0 flex items-center justify-center z-50 px-6 max-w-md mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 w-full animate-in fade-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#E8F0E6] rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-7 h-7 text-[#5B7553]" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 mb-0.5">Review Submitted!</h2>
                <p className="text-sm text-gray-500">Thank you for sharing your experience</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Spot;
