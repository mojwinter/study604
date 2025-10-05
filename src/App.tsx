import { Routes, Route, Link, useLocation } from "react-router-dom";
import './App.css'
import Explore from "./pages/Explore/Explore"
import Saved from "./pages/Saved/Saved";
import Profile from "./pages/Profile/Profile";
import Map from "./pages/Map/Map";
import Spot from "./pages/Spot/Spot";
import { Compass, MapIcon, Bookmark, User } from "lucide-react";

function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/map" element={<Map />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/spot/:id" element={<Spot />} />
      </Routes>

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-6">
        <div className="max-w-md mx-auto flex items-center justify-around px-6 pt-2">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 transition-colors ${
              location.pathname === '/' ? 'text-[#5B7553]' : 'text-gray-400'
            }`}
          >
            <Compass className="w-6 h-6" />
            <span className="text-xs font-medium">Explore</span>
          </Link>

          <Link
            to="/map"
            className={`flex flex-col items-center gap-1 transition-colors ${
              location.pathname === '/map' ? 'text-[#5B7553]' : 'text-gray-400'
            }`}
          >
            <MapIcon className="w-6 h-6" />
            <span className="text-xs font-medium">Map</span>
          </Link>

          <Link
            to="/saved"
            className={`flex flex-col items-center gap-1 transition-colors ${
              location.pathname === '/saved' ? 'text-[#5B7553]' : 'text-gray-400'
            }`}
          >
            <Bookmark className="w-6 h-6" />
            <span className="text-xs font-medium">Saved</span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 transition-colors ${
              location.pathname === '/profile' ? 'text-[#5B7553]' : 'text-gray-400'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default App
