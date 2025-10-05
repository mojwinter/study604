import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Menu, MapPin, Wifi, Coffee, Star, CheckCircle, UtensilsCrossed, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

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
}

const Spot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [spot, setSpot] = useState<SpotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

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
    // Fetch spot data from API
    const fetchSpot = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
        const response = await fetch(`${apiUrl}/spots`);
        if (response.ok) {
          const spots = await response.json();
          const foundSpot = spots.find((s: SpotData) => String(s.id) === String(id));
          setSpot(foundSpot || null);
        }
      } catch (error) {
        console.error("Error fetching spot:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpot();
  }, [id]);

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

  useEffect(() => {
    // Check if spot is saved
    const checkSaved = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
        const response = await fetch(`${apiUrl}/saved?spotId=${id}`);
        if (response.ok) {
          const saved = await response.json();
          if (saved.length > 0) {
            setIsSaved(true);
            setSavedId(saved[0].id);
          }
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };
    checkSaved();
  }, [id]);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

    try {
      if (isSaved && savedId) {
        // Remove from saved
        const response = await fetch(`${apiUrl}/saved/${savedId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setIsSaved(false);
          setSavedId(null);
        }
      } else {
        // Add to saved
        const response = await fetch(`${apiUrl}/saved`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            spotId: id,
            spotName: spot?.name,
            address: spot?.address,
            rating: spot?.rating,
            image: spot?.image,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setIsSaved(true);
          setSavedId(data.id);
        }
      }
    } catch (error) {
      console.error("Error toggling saved:", error);
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

  const amenities = [];
  if (spot.wifi) {
    amenities.push({ icon: Wifi, label: "Free Wifi" });
  }
  if (spot.food) {
    amenities.push({ icon: UtensilsCrossed, label: "Food Available" });
  }

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

      {/* Amenities & Rating */}
      <div className="px-6 mb-6 flex items-center gap-3">
        {amenities.map((amenity, index) => (
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
