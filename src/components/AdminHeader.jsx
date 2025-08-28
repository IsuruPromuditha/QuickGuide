import React, { useState } from 'react';
import { FaSignOutAlt, FaCog, FaUsers, FaUserShield, FaRoute, FaClipboardList, FaBars } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  const navItems = [
    { path: '/adminDashboard', label: 'Dashboard', icon: <FaClipboardList className="text-xl" /> },
    { path: '/adminDashboard/manage-guides', label: 'Manage Guides', icon: <FaUserShield className="text-xl" /> },
    { path: '/adminDashboard/manage-trips', label: 'Trip Details', icon: <FaRoute className="text-xl" /> },
    { path: '/adminDashboard/active-guides', label: 'Active Guides', icon: <FaUsers className="text-xl" /> },
  ];

  return (
    <div className="flex">
      {/* Hamburger Menu for Mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 text-white bg-primary p-2 rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars className="text-xl" />
      </button>

      {/* Sidebar */}
      <div
        className={`w-64 bg-travelBlue text-white shadow-travel-shadow h-screen fixed p-4 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Section with Logo */}
        <div>
          <div className="text-2xl flex items-center gap-2 font-bold mb-6">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="text-primary h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M187.737 20.081c-2.019.404-45.235 14.136-45.235 14.136l85.22 27.06s-37.965-41.6-39.985-41.196zm23.281 41.64c-14.49-.219-26.62 2.57-39.84 6.018l-17.77 63.004c-4.761 33.46-10.786 66.5-28.273 95.719 10.939 80.264 13.738 164.088 40.389 237.478 31.632 35.377 68.531 36.233 109.855 8.078 87.857-9.33 112.196-73.646 111.47-147.011L326.266 183.65l-93.7-119.548c-7.886-1.562-14.961-2.282-21.548-2.381z"></path>
            </svg>
            <p>Quick</p>
            <p className="text-secondary">Guide</p>
          </div>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li
                key={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-accent text-travelBlue font-semibold'
                    : 'text-neutralBg hover:bg-accent hover:text-travelBlue'
                }`}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout and Settings Section */}
        <div className="space-y-2">
          <div
            className="flex items-center gap-3 p-3 rounded-lg text-neutralBg hover:bg-accent hover:text-travelBlue cursor-pointer transition-all duration-300"
            onClick={() => navigate('/adminDashboard/settings')}
          >
            <FaCog className="text-xl" />
            <span>Settings</span>
          </div>
          <div
            className="flex items-center gap-3 p-3 rounded-lg text-neutralBg hover:bg-accent hover:text-travelBlue cursor-pointer transition-all duration-300"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminHeader;