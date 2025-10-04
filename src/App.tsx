import { Routes, Route, Link } from "react-router-dom";
import './App.css'
import Explore from "./pages/Explore/Explore"
import Saved from "./pages/Saved/Saved";
import Profile from "./pages/Profile/Profile";
import Map from "./pages/Map/Map";
import Spot from "./pages/Spot/Spot";

function App() {
  return (
    <>
      <nav>
        <Link to="/">Explore</Link>
        <Link to="/map">Map</Link>
        <Link to="/saved">Saved Spots</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/map" element={<Map />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/spot/:id" element={<Spot />} />
      </Routes>
    </>
  )
}

export default App
