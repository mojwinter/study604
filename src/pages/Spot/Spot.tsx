import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, Wifi, Coffee, Star, CheckCircle, Utensils, Heart, AudioLines, Plug, LampDesk, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  preview_images?: string[];
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
      <div className="min-h-screen bg-white pb-20 md:pb-8 max-w-md md:max-w-6xl mx-auto flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen bg-white pb-20 md:pb-8 max-w-md md:max-w-4xl mx-auto flex items-center justify-center">
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

  const previewImages = spot.preview_images && spot.preview_images.length > 0
    ? spot.preview_images
    : [spot.image, spot.image, spot.image];

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8 max-w-md md:max-w-6xl mx-auto">
      {/* Header - Mobile */}
      <div className="md:hidden flex items-center justify-between px-4 pt-3 pb-3">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-white shadow-sm hover:bg-gray-50 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">{spot.name}</h1>
        <div className="w-10 h-10" />
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block px-6 pt-6 pb-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </button>

        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{spot.name}</h1>
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-[#5B7553] flex-shrink-0 mt-1" />
            <p className="text-lg text-gray-600">{spot.address}</p>
          </div>
        </div>
      </div>

      <div className="md:px-6">
        {/* Hero Image - Full Width */}
        <div className="px-6 md:px-0 mb-6 relative">
          <img
            src={spot.image}
            alt={spot.name}
            className="w-full h-52 md:h-[500px] rounded-2xl object-cover"
          />
          <button
            onClick={handleSaveToggle}
            className="absolute top-3 right-9 md:right-3 bg-white rounded-full p-2.5 shadow-lg hover:bg-gray-50 transition-all hover:scale-110"
          >
            <Heart className={`w-5 h-5 ${isSaved ? "text-[#5B7553] fill-[#5B7553]" : "text-gray-400"}`} />
          </button>
        </div>

        {/* Desktop Category Ratings - Below Hero */}
        {ratingCategories.length > 0 && (
          <div className="hidden md:block px-0 mb-6">
            <div className="flex gap-3 w-full max-w-2xl">
              {ratingCategories.map((category, index) => (
                <div key={index} className="flex flex-col items-center gap-1 bg-gray-50 rounded-lg px-3 py-3 flex-1">
                  <category.icon className="w-5 h-5 text-gray-700" />
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-[#5B7553] fill-[#5B7553]" />
                    <span className="text-sm font-bold text-gray-900">{category.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Section */}
        <div>
            {/* Mobile Category Ratings */}
            {ratingCategories.length > 0 && (
              <div className="md:hidden px-6 mb-6">
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

            {/* Mobile Location Info */}
            <div className="md:hidden px-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{spot.name}</h2>
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-[#5B7553] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{spot.address}</p>
              </div>
            </div>

            {/* Quick Info - Amenities */}
            <div className="px-6 md:px-0 mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {spot.wifi && (
                  <div className="flex items-center gap-3 p-3 bg-white border-2 border-gray-200 rounded-xl">
                    <Wifi className="w-5 h-5 text-[#5B7553]" />
                    <span className="text-sm font-medium text-gray-900">WiFi</span>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-white border-2 border-gray-200 rounded-xl">
                  <Plug className="w-5 h-5 text-[#5B7553]" />
                  <span className="text-sm font-medium text-gray-900">Outlets</span>
                </div>
                {spot.food && (
                  <div className="flex items-center gap-3 p-3 bg-white border-2 border-gray-200 rounded-xl">
                    <Coffee className="w-5 h-5 text-[#5B7553]" />
                    <span className="text-sm font-medium text-gray-900">Coffee</span>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-white border-2 border-gray-200 rounded-xl">
                  <AudioLines className="w-5 h-5 text-[#5B7553]" />
                  <span className="text-sm font-medium text-gray-900">Quiet</span>
                </div>
              </div>
            </div>

            {/* Business Hours & Status */}
            <div className="px-6 md:px-0 mb-6 md:mb-8">
              <div className="bg-[#E8F0E6] rounded-xl p-4 md:p-5 border-2 border-[#5B7553]/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#5B7553]" />
                    <span className="font-bold text-gray-900">Hours</span>
                  </div>
                  <span className="px-3 py-1 bg-[#5B7553] text-white text-xs font-semibold rounded-full">
                    Open Now
                  </span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Monday - Friday</span>
                    <span>7:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Saturday - Sunday</span>
                    <span>8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#5B7553]/20">
                    <p className="text-[#5B7553] font-semibold">Closes at 6:00 PM today</p>
                  </div>
                </div>
              </div>
            </div>

          {/* Description */}
          <div className="px-6 md:px-0 mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Description</h3>
            <div className="bg-gray-50 rounded-xl p-4 md:p-5">
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                {/* Mobile: Show collapsed version, Desktop: Always show full */}
                <span className="md:hidden">
                  {spot.description && spot.description.length > 150 ? (
                    <>
                      {isDescriptionExpanded ? spot.description : `${spot.description.slice(0, 150)}...`}{" "}
                      <button
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="text-[#5B7553] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        {isDescriptionExpanded ? "Read Less" : "Read More..."}
                      </button>
                    </>
                  ) : (
                    spot.description
                  )}
                </span>
                <span className="hidden md:inline">
                  {spot.description}
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 md:px-0 space-y-3 md:space-y-4 mb-8">
            <Button className="w-full bg-[#5B7553] hover:bg-[#4a6044] text-white rounded-xl py-6 md:py-7 text-base md:text-lg font-semibold transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5" />
              Get Directions
            </Button>
            <Button
              onClick={() => !hasReviewed && navigate(`/review/${id}`)}
              disabled={hasReviewed}
              className={`w-full rounded-xl py-6 md:py-7 text-base md:text-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                hasReviewed
                  ? "bg-gray-50 text-gray-400 border-2 border-gray-200 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50 text-[#5B7553] border-2 border-[#5B7553] shadow-md hover:shadow-lg"
              }`}
            >
              {hasReviewed ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Reviewed
                </>
              ) : (
                <>
                  <Star className="w-5 h-5" />
                  Write a Review
                </>
              )}
            </Button>
          </div>

          {/* Preview Images Section - Moved Below */}
          <div className="px-6 md:px-0 mb-6 md:mb-8">
            <h3 className="text-base md:text-xl font-bold text-gray-900 mb-4 md:mb-5">Preview</h3>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-4">
              {previewImages.map((image, index) => (
                <div key={index} className="relative group overflow-hidden rounded-xl shadow-sm border border-gray-100">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 md:h-56 rounded-xl object-cover transition-all duration-300 group-hover:scale-110 cursor-pointer"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed bottom-24 left-0 right-0 flex items-center justify-center z-50 px-6 max-w-md md:max-w-4xl mx-auto">
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
