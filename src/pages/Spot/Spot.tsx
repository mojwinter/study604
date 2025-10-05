import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Menu, MapPin, Wifi, Coffee, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Spot = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

      {/* Get Directions Button */}
      <div className="px-6">
        <Button className="w-full bg-[#5B7553] hover:bg-[#4a6044] text-white rounded-xl py-6 text-base font-semibold">
          Get Directions
        </Button>
      </div>
    </div>
  );
};

export default Spot;
