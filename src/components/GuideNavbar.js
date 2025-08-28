import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaChartBar, FaUsers, FaCog, FaBars, FaTimes, FaSignOutAlt, FaTrophy } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const GuideNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [guideName, setGuideName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchGuideName = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          if (decoded.id && decoded.role === 'guide') {
            const response = await axios.get(`http://localhost:5000/api/guide/guide/${decoded.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setGuideName(response.data.name);
          }
        }
      } catch (error) {
        console.error('Error fetching guide name:', error);
      }
    };

    fetchGuideName();
  }, []);

  // Function to determine if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-orange-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold">
              QuickGuide
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/guide-bookings"
              className={`text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition duration-300 ${isActive('/guide-bookings') ? 'border-b-2 border-orange-200' : ''
                }`}
            >
              <FaCalendarAlt size={16} />
              Bookings
            </Link>
            {/* <Link
              to="/guide-analytics"
              className={`text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition duration-300 ${isActive('/guide-analytics') ? 'border-b-2 border-orange-200' : ''
                }`}
            >
              <FaChartBar size={16} />
              Analytics
            </Link> */}
            <Link
              to="/guide-leaderboard"
              className={`text-white hover:text-orange-200  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${isActive('/guide-leaderboard') ? 'border-b-2 border-orange-200' : ''
                }`}
            >
              <FaTrophy size={16} />
              Leaderboard
            </Link>
            <Link
              to="/guide-social-groups"
              className={`text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition duration-300 ${isActive('/guide-social-groups') ? 'border-b-2 border-orange-200' : ''
                }`}
            >
              <FaUsers size={16} />
              Social Media Groups
            </Link>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition duration-300"
              >
                <FaUser size={16} />
                {guideName || 'Guide'}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <Link
                    to="/guideprofileview"
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition duration-300 ${isActive('/guideprofileview') ? 'border-b-2 border-orange-600' : ''
                      }`}
                    onClick={toggleDropdown}
                  >
                    <FaUser size={14} className="inline mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/guide-settings"
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition duration-300 ${isActive('/guide-settings') ? 'border-b-2 border-orange-600' : ''
                      }`}
                    onClick={toggleDropdown}
                  >
                    <FaCog size={14} className="inline mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleDropdown();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition duration-300"
                  >
                    <FaSignOutAlt size={14} className="inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
            <div className="md:hidden ml-4" onClick={toggleMenu}>
              <button className="text-white hover:text-orange-200 focus:outline-none focus:text-orange-200">
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-orange-700">
              <Link
                to="/guide-bookings"
                className={`text-white hover:text-orange-200  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${isActive('/guide-bookings') ? 'border-b-2 border-orange-200' : ''
                  }`}
                onClick={toggleMenu}
              >
                <FaCalendarAlt size={16} />
                Bookings
              </Link>
              {/* <Link
                to="/guide-analytics"
                className={`text-white hover:text-orange-200  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${isActive('/guide-analytics') ? 'border-b-2 border-orange-200' : ''
                  }`}
                onClick={toggleMenu}
              >
                <FaChartBar size={16} />
                Analytics
              </Link> */}
              <Link
                to="/guide-leaderboard"
                className={`text-white hover:text-orange-200  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${isActive('/guide-leaderboard') ? 'border-b-2 border-orange-200' : ''
                  }`}
                onClick={toggleMenu}
              >
                <FaTrophy size={16} />
                Leaderboard
              </Link>
              <Link
                to="/guide-social-groups"
                className={`text-white hover:text-orange-200  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${isActive('/guide-social-groups') ? 'border-b-2 border-orange-200' : ''
                  }`}
                onClick={toggleMenu}
              >
                <FaUsers size={16} />
                Social Media Groups
              </Link>
              <Link
                to="/guideprofileview"
                className={`text-white hover:text-orange-200  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${isActive('/guideprofileview') ? 'border-b-2 border-orange-200' : ''
                  }`}
                onClick={toggleMenu}
              >
                <FaUser size={16} />
                Profile
              </Link>
              <Link
                to="/guide-settings"
                className={`text-white hover:text-orange-200  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${isActive('/guide-settings') ? 'border-b-2 border-orange-200' : ''
                  }`}
                onClick={toggleMenu}
              >
                <FaCog size={16} />
                Settings
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="text-white hover:text-orange-200  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 w-full text-left transition duration-300"
              >
                <FaSignOutAlt size={16} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default GuideNavbar;