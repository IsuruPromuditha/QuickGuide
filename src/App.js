import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Guides from './pages/Guides';
import TouristSignup from './pages/TouristSignup';
import GuideProfileView from './pages/GuideProfileView';
import GuideBooking from './components/GuideBooking';
import GuideRequestInbox from './components/GuideRequest';
import MapView from './pages/mapView';
import Leaderboard from './pages/Leaderboard';
import TouristView from './pages/TouristView';
import SocialGroups from './pages/SocialGroups';
import AdminDashboard from './pages/AdminDashboard';




function App() {
  return (
    <Router>
      <div className="overflow-x-hidden">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/tourist-registeration" element={<TouristSignup />} />
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <About />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <Contact />
              </>
            }
          />
          <Route
            path="/guides"
            element={
              <>
                <Navbar />
                <Guides />
              </>
            }
          />
          
          <Route
            path="/guideprofileview"
            element={
              <>
                <Navbar />
                <GuideProfileView />
              </>
            }
          />
          <Route
            path="/guidebooking"
            element={
              <>
                <Navbar />
                <GuideBooking />
              </>
            }
          />
          <Route
            path="/guiderequst"
            element={
              <>
                <Navbar />
                <GuideRequestInbox />
              </>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <>
                <Navbar />
                <Leaderboard />
              </>
            }
          />
          <Route
            path="/mapView"
            element={
              <>
                <Navbar />
                <MapView />
              </>
            }
          />
          <Route
            path="/TouristView"
            element={
              <>
                <Navbar />
                <TouristView />
              </>
            }
          />
          <Route
            path="/socialgroup"
            element={
              <>
                <Navbar />
                <SocialGroups />
              </>
            }
          />
          <Route
            path="/adminDashboard"
            element={
              <>
                
                <AdminDashboard />
              </>
            }
          />
          
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;