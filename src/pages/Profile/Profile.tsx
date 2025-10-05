import { useNavigate } from "react-router-dom";
import { Star, MapPin, Edit } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  // Mock user data
  const user = {
    name: "Mitchell Winter",
    username: "@mitchell.winter",
    email: "mitchell.winter@queensu.ca",
    phone: "+1 (778) 989-7215",
    initials: "MW",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  };

  // Mock user reviews
  const userReviews = [
    {
      id: 1,
      spotName: "Revolver",
      address: "325 Cambie St., Vancouver, BC",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
      review: "The vibes were amazing! WiFi available and outlets at every table, come by..."
    },
    {
      id: 2,
      spotName: "Cafe Kitsune",
      address: "157 Water St, Vancouver, BC",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop",
      review: "This cafe is great for studying! I think others would enjoy using this space..."
    }
  ];

  // Mock stats
  const stats = {
    studySessions: 123,
    uniqueSpots: 67,
    totalReviews: 4,
    mostVisited: "Prototype Coffee"
  };

  return (
    <div className="min-h-screen bg-white pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="px-6 pt-3 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {/* Avatar and Info */}
          <div className="flex items-start gap-3 mb-5">
            {/* Avatar with Initials */}
            <div className="w-16 h-16 rounded-full bg-[#C8E6C9] flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-[#2E7D32]">{user.initials}</span>
            </div>

            {/* User Info */}
            <div className="flex-1 pt-1">
              <h2 className="text-xl font-bold text-gray-900 mb-0.5">{user.name}</h2>
              <p className="text-sm text-gray-600 mb-0.5">{user.email}</p>
              <p className="text-sm text-gray-600">{user.phone}</p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button className="w-full py-2 px-4 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="px-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
        <div className="space-y-3">
          {userReviews.map((review) => (
            <div
              key={review.id}
              onClick={() => navigate(`/spot/${review.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex gap-3 p-3">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={review.image}
                    alt={review.spotName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-gray-900">{review.spotName}</h3>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-sm">{review.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-1 mb-2">
                    <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500 line-clamp-1">{review.address}</p>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{review.review}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Profile;
