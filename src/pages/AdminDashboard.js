import React from 'react';
import { FaUsers, FaMapMarkedAlt, FaUserShield, FaStar } from 'react-icons/fa';
import { MdRateReview } from 'react-icons/md';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaUserShield className="text-3xl text-blue-500" />
          <div>
            <p className="text-xl font-semibold">54</p>
            <p className="text-gray-600 text-sm">Tour Guides</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaUsers className="text-3xl text-green-500" />
          <div>
            <p className="text-xl font-semibold">132</p>
            <p className="text-gray-600 text-sm">Users</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <MdRateReview className="text-3xl text-yellow-500" />
          <div>
            <p className="text-xl font-semibold">23</p>
            <p className="text-gray-600 text-sm">Reviews Today</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaMapMarkedAlt className="text-3xl text-red-400" />
          <div>
            <p className="text-xl font-semibold">16</p>
            <p className="text-gray-600 text-sm">Active Locations</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <ul className="space-y-2 text-blue-600 font-medium">
            <li className="hover:underline cursor-pointer">➕ Add New Guide</li>
            <li className="hover:underline cursor-pointer">👥 View All Users</li>
            <li className="hover:underline cursor-pointer">📝 Moderate Reviews</li>
          </ul>
        </div>

        {/* QR Stats Chart Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
          <h2 className="text-lg font-semibold mb-4">QR Scans (Last 7 Days)</h2>
          <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-500">
            {/* You can replace with chart library later */}
            [QR Chart Placeholder]
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Recent Reviews</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="border-b pb-2">
              <p className="text-sm text-gray-700 font-medium">
                John Doe reviewed <span className="text-blue-600">Kasun Munasinghe</span>
              </p>
              <p className="text-xs text-gray-500">"Amazing food tour around Kandy!"</p>
              <div className="flex items-center text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
