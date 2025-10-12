import { Routes, Route, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import './App.css'
import Explore from "./pages/Explore/Explore"
import Saved from "./pages/Saved/Saved";
import Profile from "./pages/Profile/Profile";
import Map from "./pages/Map/Map";
import Spot from "./pages/Spot/Spot";
import Review from "./pages/Review/Review";
import { Compass, MapIcon, Bookmark, User } from "lucide-react";

function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-white">
      {/* Desktop Sidebar - hidden on mobile */}
      <nav className="hidden md:fixed md:flex md:flex-col md:left-0 md:top-0 md:bottom-0 md:w-64 md:bg-white md:border-r md:border-gray-200 md:z-50">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <img src="/study604.png" alt="study604" className="h-10" />
            <h1 className="text-xl font-bold text-gray-900">study604</h1>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-[#C8E6C9] flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[#2E7D32]">MW</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Mitchell Winter</p>
              <p className="text-xs text-gray-500">Vancouver, BC</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/"
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
              location.pathname === '/'
                ? 'bg-[#E8F0E6] text-[#5B7553]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="font-medium">Explore</span>
          </Link>

          <Link
            to="/map"
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
              location.pathname === '/map'
                ? 'bg-[#E8F0E6] text-[#5B7553]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MapIcon className="w-5 h-5" />
            <span className="font-medium">Map</span>
          </Link>

          <Link
            to="/saved"
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
              location.pathname === '/saved'
                ? 'bg-[#E8F0E6] text-[#5B7553]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span className="font-medium">Saved</span>
          </Link>

          <Link
            to="/profile"
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
              location.pathname === '/profile'
                ? 'bg-[#E8F0E6] text-[#5B7553]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </Link>
        </div>
      </nav>

      {/* Main Content - with padding for desktop sidebar */}
      <div className="md:ml-64 pb-20 md:pb-0">
        <AnimatePresence mode="sync">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
              >
                <Explore />
              </motion.div>
            } />
            <Route path="/map" element={
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
              >
                <Map />
              </motion.div>
            } />
            <Route path="/saved" element={
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
              >
                <Saved />
              </motion.div>
            } />
            <Route path="/profile" element={
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
              >
                <Profile />
              </motion.div>
            } />
            <Route path="/spot/:id" element={
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
              >
                <Spot />
              </motion.div>
            } />
            <Route path="/review/:id" element={
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
              >
                <Review />
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Navigation - hidden on desktop */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
              location.pathname === '/' ? 'text-[#5B7553]' : 'text-gray-600'
            }`}
          >
            <Compass className="w-6 h-6" />
            <span className="text-xs font-medium">Explore</span>
          </Link>

          <Link
            to="/map"
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
              location.pathname === '/map' ? 'text-[#5B7553]' : 'text-gray-600'
            }`}
          >
            <MapIcon className="w-6 h-6" />
            <span className="text-xs font-medium">Map</span>
          </Link>

          <Link
            to="/saved"
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
              location.pathname === '/saved' ? 'text-[#5B7553]' : 'text-gray-600'
            }`}
          >
            <Bookmark className="w-6 h-6" />
            <span className="text-xs font-medium">Saved</span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
              location.pathname === '/profile' ? 'text-[#5B7553]' : 'text-gray-600'
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
