import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaMapMarkedAlt, FaUserShield, FaStar } from 'react-icons/fa';
import { MdRateReview } from 'react-icons/md';
import AdminHeader from '../components/AdminHeader';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutralBg">
      <AdminHeader />
      <div className="p-6 lg:ml-64">
        <h1 className="text-3xl font-bold mb-6 text-primary">Admin Dashboard</h1>
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-travel-shadow flex items-center gap-4 hover:bg-accent transition-colors duration-300">
            <FaUserShield className="text-3xl text-primary" />
            <div>
              <p className="text-xl font-semibold text-gray-800">54</p>
              <p className="text-secondary text-sm">Tour Guides</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-travel-shadow flex items-center gap-4 hover:bg-accent transition-colors duration-300">
            <FaUsers className="text-3xl text-primary" />
            <div>
              <p className="text-xl font-semibold text-gray-800">132</p>
              <p className="text-secondary text-sm">Users</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-travel-shadow flex items-center gap-4 hover:bg-accent transition-colors duration-300">
            <MdRateReview className="text-3xl text-primary" />
            <div>
              <p className="text-xl font-semibold text-gray-800">23</p>
              <p className="text-secondary text-sm">Reviews Today</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-travel-shadow flex items-center gap-4 hover:bg-accent transition-colors duration-300">
            <FaMapMarkedAlt className="text-3xl text-primary" />
            <div>
              <p className="text-xl font-semibold text-gray-800">16</p>
              <p className="text-secondary text-sm">Active Locations</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-travel-shadow">
            <h2 className="text-lg font-semibold mb-4 text-travelBlue">Quick Actions</h2>
            <ul className="space-y-2 text-secondary font-medium">
              <li
                className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2"
                onClick={() => navigate('/adminDashboard/manage-guides')}
              >
                <span className="text-travelBlue">➕</span> Add New Guide
              </li>
              <li
                className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2"
                onClick={() => navigate('/adminDashboard/manage-users')}
              >
                <span className="text-travelBlue">👥</span> View All Users
              </li>
              <li
                className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2"
                onClick={() => navigate('/adminDashboard/moderate-reviews')}
              >
                <span className="text-travelBlue">📝</span> Moderate Reviews
              </li>
            </ul>
          </div>

          {/* QR Stats Chart Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow-travel-shadow col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-travelBlue">QR Scans (Last 7 Days)</h2>
            <div className="h-40 bg-accent rounded-lg flex items-center justify-center text-gray-600">
              [QR Chart Placeholder]
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white p-6 rounded-lg shadow-travel-shadow mb-8">
          <h2 className="text-lg font-semibold mb-4 text-travelBlue">Recent Reviews</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="border-b border-accent pb-2 hover:bg-accent transition-colors duration-300">
                <p className="text-sm text-gray-800 font-medium">
                  John Doe reviewed <span className="text-primary font-semibold">Kasun Munasinghe</span>
                </p>
                <p className="text-xs text-gray-600">"Amazing food tour around Kandy!"</p>
                <div className="flex items-center text-secondary text-sm">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-travelGreen" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;