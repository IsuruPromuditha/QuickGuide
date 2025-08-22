import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRoute, FaMapMarkerAlt } from 'react-icons/fa';

const TouristTrips = () => {
  const [activeTab, setActiveTab] = useState('current');

  const navigate = useNavigate();

  const currentTrip = {
    id: 1,
    title: 'Kandy Cultural Tour',
    guide_id: 1,
    guide: 'Kasun Munasinghe',
    date: '2025-09-01',
    location: 'Kandy',
    status: 'Scheduled',
  };

  const tripHistory = [
    { id: 2, title: 'Colombo City Adventure', guide_id: 2, guide: 'Nimal Perera', date: '2025-08-15', location: 'Colombo', status: 'Completed' },
    { id: 3, title: 'Galle Coastal Escape', guide_id: 3, guide: 'Samanthi Silva', date: '2025-07-20', location: 'Galle', status: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-neutralBg">
      <div className="p-6 mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-primary">My Trips</h1>
        {/* Tabbed Pane */}
        <div className="mb-6">
          <div className="flex border-b border-accent">
            <button
              className={`flex-1 py-3 px-4 text-lg font-semibold text-center transition-colors duration-300 ${
                activeTab === 'current'
                  ? 'bg-travelBlue text-white border-b-2 border-primary'
                  : 'text-gray-600 hover:bg-accent hover:text-primary'
              }`}
              onClick={() => setActiveTab('current')}
            >
              Current Trip
            </button>
            <button
              className={`flex-1 py-3 px-4 text-lg font-semibold text-center transition-colors duration-300 ${
                activeTab === 'history'
                  ? 'bg-travelBlue text-white border-b-2 border-primary'
                  : 'text-gray-600 hover:bg-accent hover:text-primary'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Trip History
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'current' && (
          <div className="bg-white p-6 rounded-lg shadow-travel-shadow">
            <h2 className="text-lg font-semibold mb-4 text-travelBlue">Current Trip</h2>
            {currentTrip ? (
              <div className="border border-accent p-4 rounded-lg hover:bg-accent transition-colors duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <FaRoute className="text-primary text-xl" />
                  <h3 className="text-lg font-medium text-gray-800">{currentTrip.title}</h3>
                </div>
                <p className="text-sm text-secondary">
                  <FaMapMarkerAlt className="inline mr-1 text-travelBlue" /> {currentTrip.location}
                </p>
                <p className="text-sm text-gray-600">Guide: {currentTrip.guide}</p>
                <p className="text-sm text-gray-600">Date: {currentTrip.date}</p>
                <p className="text-sm">
                  <span
                    className={currentTrip.status === 'Scheduled' ? 'text-primary' : 'text-travelGreen'}
                  >
                    {currentTrip.status}
                  </span>
                </p>
                <button
                  className="mt-2 text-travelBlue hover:text-primary font-medium transition-colors"
                  onClick={() => navigate(`/tourist-trip-details/${currentTrip.id}`)}
                >
                  View Details
                </button>
              </div>
            ) : (
              <p className="text-gray-600">No current trip scheduled.</p>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white p-6 rounded-lg shadow-travel-shadow">
            <h2 className="text-lg font-semibold mb-4 text-travelBlue">Trip History</h2>
            {tripHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tripHistory.map((trip) => (
                  <div
                    key={trip.id}
                    className="border border-accent p-4 rounded-lg hover:bg-accent transition-colors duration-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaRoute className="text-primary text-xl" />
                      <h3 className="text-lg font-medium text-gray-800">{trip.title}</h3>
                    </div>
                    <p className="text-sm text-secondary">
                      <FaMapMarkerAlt className="inline mr-1 text-travelBlue" /> {trip.location}
                    </p>
                    <p className="text-sm text-gray-600">Guide: {trip.guide}</p>
                    <p className="text-sm text-gray-600">Date: {trip.date}</p>
                    <p className="text-sm">
                      <span
                        className={trip.status === 'Completed' ? 'text-travelGreen' : 'text-yellow-500'}
                      >
                        {trip.status}
                      </span>
                    </p>
                    <button
                      className="mt-2 text-travelBlue hover:text-primary font-medium transition-colors"
                      onClick={() => navigate(`/tourist-trip-details/${trip.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No trip history available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristTrips;