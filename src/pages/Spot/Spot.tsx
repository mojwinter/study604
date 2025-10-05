import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Menu, MapPin, Wifi, Coffee, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const Spot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    if (location.state?.reviewSubmitted) {
      setShowConfirmation(true);
      setHasReviewed(true);
      // Clear the state
      window.history.replaceState({}, document.title);
      // Hide after 2 seconds
      setTimeout(() => {
        setShowConfirmation(false);
      }, 2000);
    }
  }, [location]);

  useEffect(() => {
    // Check if user has already reviewed this spot
    const checkReview = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
        const response = await fetch(`${apiUrl}/reviews?spotId=${id}`);
        if (response.ok) {
          const reviews = await response.json();
          setHasReviewed(reviews.length > 0);
        }
      } catch (error) {
        console.error("Error checking reviews:", error);
      }
    };
    checkReview();
  }, [id]);

  // Mock data - in a real app this would come from an API or state management
  const spot = {
    id: id,
    name: "Prototype Coffee",
    address: "883 E Hastings St, Vancouver, BC",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=400&fit=crop",
    amenities: [
      { icon: Wifi, label: "Free Wifi" },
      { icon: Coffee, label: "Free Breakfast" }
    ],
    description: "Coffee roastery, tasting room, waffle donut bakery, coffee drink bottle shop. We serve an extensive and well curated menu of 12+ different single origin coffees",
    previewImages: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=200&h=200&fit=crop"
    ]
  };

  return (
    <div className="min-h-screen bg-white pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">{spot.name}</h1>
        <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Hero Image */}
      <div className="px-6 mb-4">
        <img
          src={spot.image}
          alt={spot.name}
          className="w-full h-52 rounded-2xl object-cover"
        />
      </div>

      {/* Amenities & Rating */}
      <div className="px-6 mb-6 flex items-center gap-3">
        {spot.amenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <amenity.icon className="w-4 h-4 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">{amenity.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1 ml-auto">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-base font-bold text-gray-900">{spot.rating}</span>
        </div>
      </div>

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
          {spot.description}{" "}
          <button className="text-[#5B7553] font-semibold">Read More...</button>
        </p>
      </div>

      {/* Preview Images */}
      <div className="px-6 mb-6">
        <h3 className="text-base font-bold text-gray-900 mb-3">Preview</h3>
        <div className="grid grid-cols-3 gap-3">
          {spot.previewImages.map((image, index) => (
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
