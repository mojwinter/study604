import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Wifi, Zap, UtensilsCrossed, Table2, Waves } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Review = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [ratings, setRatings] = useState({
    atmosphere: 0,
    wifi: 0,
    outletAccess: 0,
    foodBeverage: 0,
    tableSpace: 0,
  });

  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock location data - would come from API/context
  const location = {
    name: "Cafe Kitsune",
    address: "157 Water St, Vancouver, BC",
    status: "Open",
    closingTime: "6 p.m.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=120&h=120&fit=crop",
  };

  const ratingCategories = [
    { key: "atmosphere", label: "Atmosphere", icon: Waves },
    { key: "wifi", label: "Wi-Fi", icon: Wifi },
    { key: "outletAccess", label: "Outlet Access", icon: Zap },
    { key: "foodBeverage", label: "Food & Beverage", icon: UtensilsCrossed },
    { key: "tableSpace", label: "Table Space", icon: Table2 },
  ];

  const handleStarClick = (category: string, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const isFormValid = () => {
    // Check if all ratings are filled (greater than 0)
    return Object.values(ratings).every((rating) => rating > 0);
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      return;
    }

    setIsSubmitting(true);

    const reviewData = {
      spotId: id,
      spotName: location.name,
      ratings,
      reviewText,
      timestamp: new Date().toISOString(),
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        // Navigate back to detail page with success state
        navigate(`/spot/${id}`, { state: { reviewSubmitted: true } });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please make sure JSON Server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ category, value }: { category: string; value: number }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleStarClick(category, star)}
          className="focus:outline-none"
        >
          <svg
            className={`w-6 h-6 ${
              star <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="px-6 pt-3 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Add a Review</h1>
      </div>

      <div className="px-6">
        {/* Location Card */}
        <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100">
          <div className="flex gap-3">
            <img
              src={location.image}
              alt={location.name}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-900 text-lg mb-1">{location.name}</h2>
              <p className="text-sm text-gray-500 mb-2">{location.address}</p>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#E8F0E6] text-[#5B7553] border-0 text-xs font-semibold">
                  {location.status}
                </Badge>
                <span className="text-sm text-gray-500">• Closes {location.closingTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Categories */}
        <div className="space-y-5 mb-6">
          {ratingCategories.map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-700" />
                <span className="font-medium text-gray-900">{label}</span>
              </div>
              <StarRating category={key} value={ratings[key as keyof typeof ratings]} />
            </div>
          ))}
        </div>

        {/* Review Text Area */}
        <div className="mb-6">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Describe your experience"
            className="w-full h-48 p-4 bg-gray-50 rounded-2xl text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#5B7553] focus:bg-white transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !isFormValid()}
          className="w-full bg-[#5B7553] text-white font-semibold py-4 rounded-2xl hover:bg-[#4a5f43] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Review;
