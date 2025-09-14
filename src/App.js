import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import Navbar from './components/Navbar';
import GuideNavbar from './components/GuideNavbar';
import AdminHeader from './components/AdminHeader';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Guides from './pages/Guides';
import TouristSignup from './pages/TouristSignup';
import GuideSignup from './pages/GuideSignup';
import UserSelection from './pages/UserSelection';
import TouristGuideProfileView from './pages/TouristGuideProfileView';
import GuideBooking from './components/GuideBooking';
import GuideRequestInbox from './components/GuideRequest';
import GuideProfileView from './pages/GuideProfileView';
import MapView from './pages/mapView';
import Leaderboard from './pages/Leaderboard';
import SocialGroups from './pages/SocialGroups';
import AdminDashboard from './pages/AdminDashboard';
import AdminActiveGuides from './pages/AdminActiveGuides';
import AdminManageGuides from './pages/AdminManageGuides';
import AdminManageTrips from './pages/AdminManageTrips';
import GuideBookingRequest from './pages/GuideBookingRequest';
import GuideSettings from './pages/GuideSettings';
import AdminLogin from './pages/AdminLogin';
import TouristTrips from './pages/TouristTrips';
import TouristTripDetails from './pages/TouristTripDetails';
import GuideSocialMediaGroups from './pages/GuideSocialMediaGroups';
import GuideLeaderBoard from './pages/GuideLeaderBoard';
import TouristLeaderBoard from './pages/TouristLeaderBoard';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/admin-login" />;
  }

  try {
    const decoded = jwtDecode(token);
    if (role && decoded.role !== role) {
      return <Navigate to="/admin-login" />;
    }
    return children;
  } catch (err) {
    console.error('Invalid token:', err);
    return <Navigate to="/admin-login" />;
  }
};

function App() {
  return (
    <Router>
      <div className="overflow-x-hidden">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<UserSelection />} />
          <Route path="/tourist-registeration" element={<TouristSignup />} />
          <Route path="/guide-registeration" element={<GuideSignup />} />
          <Route
            path="/guide-settings"
            element={
              <ProtectedRoute role="guide">
                <GuideNavbar />
                <GuideSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide-bookings"
            element={
              <ProtectedRoute role="guide">
                <GuideNavbar />
                <GuideBookingRequest />
              </ProtectedRoute>
            }
          />
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
            path="/tourist-guideprofileview/:id"
            element={
              <>
                <Navbar />
                <TouristGuideProfileView />
              </>
            }
          />
          <Route
            path="/guideprofileview"
            element={
              <ProtectedRoute role="guide">
                <GuideNavbar />
                <GuideProfileView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guidebooking"
            element={
              <GuideBooking />
            }
          />
          <Route
            path="/guiderequest"
            element={
              <>
                <Navbar />
                <GuideRequestInbox />
              </>
            }
          />
          <Route
            path="/guide-social-groups"
            element={
              <ProtectedRoute role="guide">
                <GuideNavbar />
                <GuideSocialMediaGroups />
              </ProtectedRoute>
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
            path="/tourist-leaderboard"
            element={
              <>
                <Navbar />
                <TouristLeaderBoard />
              </>
            }
          />
          <Route
            path="/guide-leaderboard"
            element={
              <>
                <GuideNavbar />
                <GuideLeaderBoard />
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
            path="/tourist-socialgroup"
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
              <ProtectedRoute role="admin">
                <AdminHeader />
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminDashboard/active-guides"
            element={
              <ProtectedRoute role="admin">
                <AdminHeader />
                <AdminActiveGuides />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminDashboard/manage-guides"
            element={
              <ProtectedRoute role="admin">
                <AdminHeader />
                <AdminManageGuides />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminDashboard/manage-trips"
            element={
              <ProtectedRoute role="admin">
                <AdminHeader />
                <AdminManageTrips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tourist-trips"
            element={
              <ProtectedRoute role="tourist">
                <Navbar />
                <TouristTrips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tourist-trip-details/:id"
            element={
              <ProtectedRoute role="tourist">
                <Navbar />
                <TouristTripDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;