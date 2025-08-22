import React from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaCar, FaUsers, FaCalendarAlt, FaTimesCircle, FaUserShield, FaRoute } from 'react-icons/fa';

const TouristTripDetails = () => {
  const { id } = useParams();

  const tripDetails = {
    id: parseInt(id),
    guide_id: 1,
    tourist_id: 100,
    start_location: 'Colombo Airport',
    destinations: 'Kandy Temple, Peradeniya Gardens, Tea Factory',
    vehicle: 'Van',
    category: 'Cultural',
    passenger_count: 4,
    status: 'Scheduled',
    created_at: '2025-08-20',
    decline_reason: null,
  };

  // Sample guide details (fetch from guide_id in production)
  const guideDetails = {
    name: 'Kasun Munasinghe',
    rating: 4.8,
  };

  return (
    <div className="min-h-screen bg-neutralBg">
      <div className="p-6 mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-primary">Trip Details</h1>
        <div className="bg-white p-6 rounded-lg shadow-travel-shadow mb-8">
          <h2 className="text-lg font-semibold mb-4 text-travelBlue">Trip Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary text-xl" />
              <p className="text-sm text-gray-800">
                <span className="font-medium">Start Location:</span> {tripDetails.start_location}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FaRoute className="text-primary text-xl" />
              <p className="text-sm text-gray-800">
                <span className="font-medium">Destinations:</span> {tripDetails.destinations}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FaCar className="text-primary text-xl" />
              <p className="text-sm text-gray-800">
                <span className="font-medium">Vehicle:</span> {tripDetails.vehicle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers className="text-primary text-xl" />
              <p className="text-sm text-gray-800">
                <span className="font-medium">Passenger Count:</span> {tripDetails.passenger_count}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-primary text-xl" />
              <p className="text-sm text-gray-800">
                <span className="font-medium">Created At:</span> {tripDetails.created_at}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FaUserShield className="text-primary text-xl" />
              <p className="text-sm text-gray-800">
                <span className="font-medium">Status:</span>
                <span
                  className={
                    tripDetails.status === 'Scheduled'
                      ? 'text-primary'
                      : tripDetails.status === 'Completed'
                      ? 'text-travelGreen'
                      : 'text-yellow-500'
                  }
                >
                  {tripDetails.status}
                </span>
              </p>
            </div>
            {tripDetails.decline_reason && (
              <div className="flex items-center gap-2 col-span-1 md:col-span-2">
                <FaTimesCircle className="text-red-500 text-xl" />
                <p className="text-sm text-gray-800">
                  <span className="font-medium">Decline Reason:</span> {tripDetails.decline_reason}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-travel-shadow">
          <h2 className="text-lg font-semibold mb-4 text-travelBlue">Guide Details</h2>
          <div className="flex items-center gap-4">
            <FaUserShield className="text-primary text-3xl" />
            <div>
              <p className="text-lg font-medium text-gray-800">{guideDetails.name}</p>
              <div className="flex items-center text-secondary text-sm">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < Math.floor(guideDetails.rating) ? 'text-travelGreen' : 'text-gray-300'}
                  />
                ))}
                <span className="ml-2 text-gray-600">({guideDetails.rating})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristTripDetails;