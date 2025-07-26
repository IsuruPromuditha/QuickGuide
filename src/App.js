import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import GuideNavbar from './components/GuideNavbar';
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
import TouristView from './pages/TouristView';
import SocialGroups from './pages/SocialGroups';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <div className="overflow-x-hidden">
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<UserSelection />} />
                    <Route path="/tourist-registeration" element={<TouristSignup />} />
                    <Route path="/guide-registeration" element={<GuideSignup />} />
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