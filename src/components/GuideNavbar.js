import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaChartBar, FaCog, FaBars, FaTimes, FaUsers } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const GuideNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [guideName, setGuideName] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
                Authorization: `Bearer ${token}`
              }
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
              to="/guideprofileview"
              className="text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition duration-300"
            >
              <FaUser size={16} />
              Profile
            </Link>
            <Link
              to="/guide-bookings"
              className="text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition duration-300"
            >
              <FaCalendarAlt size={16} />
              Bookings
            </Link>
            <Link
              to="/guide-analytics"
              className="text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition duration-300"
            >
              <FaChartBar size={16} />
              Analytics
            </Link>
            <Link
              to="/guide-social-groups"
              className="text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition duration-300"
            >
              <FaUsers size={16} />
              Social Media Groups
            </Link>
            <Link
              to="/guide-settings"
              className="text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition duration-300"
            >
              <FaCog size={16} />
              Settings
            </Link>
            <span className="text-white text-sm font-medium">
              {guideName || 'Guide'}
            </span>
            <button 
              onClick={handleLogout}
              className="bg-orange-700 hover:bg-orange-800 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Logout
            </button>
          </div>

          <div className="md:hidden" onClick={toggleMenu}>
            <button
              className="text-white hover:text-orange-200 focus:outline-none focus:text-orange-200"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-orange-700">
              <Link
                to="/guideprofileview"
                className="text-white hover:text-orange-200 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                onClick={toggleMenu}
              >
                <FaUser size={16} />
                Profile
              </Link>
              <Link
                to="/guide-bookings"
                className="text-white hover:text-orange-200 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                onClick={toggleMenu}
              >
                <FaCalendarAlt size={16} />
                Bookings
              </Link>
              <Link
                to="/guide-analytics"
                className="text-white hover:text-orange-200 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                onClick={toggleMenu}
              >
                <FaChartBar size={16} />
                Analytics
              </Link>
              <Link
                to="/guide-social-groups"
                className="text-white hover:text-orange-200 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                onClick={toggleMenu}
              >
                <FaUsers size={16} />
                Social Media Groups
              </Link>
              <Link
                to="/guide-settings"
                className="text-white hover:text-orange-200 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                onClick={toggleMenu}
              >
                <FaCog size={16} />
                Settings
              </Link>
              <span className="text-white block px-3 py-2 text-base font-medium">
                {guideName || 'Guide'}
              </span>
              <button 
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="bg-orange-800 hover:bg-orange-900 text-white w-full text-left px-3 py-2 rounded-md text-base font-medium transition duration-300"
              >
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