import React from 'react';
import { FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import AdminHeader from '../components/AdminHeader';

const AdminActiveGuides = () => {
  const activeGuides = [
    { id: 1, name: 'Kasun Munasinghe', location: 'Kandy', currentTrip: 'Cultural Tour' },
    { id: 2, name: 'Samanthi Silva', location: 'Galle', currentTrip: 'Coastal Escape' },
  ];

  return (
    <div className="min-h-screen bg-neutralBg">
      <AdminHeader />
      <div className="p-6 lg:ml-64">
        <h1 className="text-3xl font-bold mb-6 text-primary">Active Guides</h1>
        <div className="bg-white p-6 rounded-lg shadow-travel-shadow">
          <h2 className="text-lg font-semibold mb-4 text-travelBlue">Currently Active Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGuides.map((guide) => (
              <div
                key={guide.id}
                className="border border-accent p-4 rounded-lg hover:bg-accent transition-colors duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FaUsers className="text-primary text-xl" />
                  <h3 className="text-lg font-medium text-gray-800">{guide.name}</h3>
                </div>
                <p className="text-sm text-secondary">
                  <FaMapMarkerAlt className="inline mr-1 text-travelBlue" /> {guide.location}
                </p>
                <p className="text-sm text-gray-600">Current Trip: {guide.currentTrip}</p>
                <button className="mt-2 text-travelBlue hover:text-primary font-medium transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminActiveGuides;