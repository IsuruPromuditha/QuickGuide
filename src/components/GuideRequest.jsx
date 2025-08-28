import React, { useState } from 'react';

const mockRequests = [
  {
    id: 1,
    touristName: 'John Doe',
    start: 'Colombo',
    destinations: ['Kandy', 'Ella'],
    vehicle: 'Car',
    category: 'Premium',
    message: 'Looking for a reliable guide for a 3-day trip.',
  },
  {
    id: 2,
    touristName: 'Emma Watson',
    start: 'Negombo',
    destinations: ['Sigiriya'],
    vehicle: 'Tuk Tuk',
    category: 'Standard',
    message: 'Solo traveler exploring the cultural triangle.',
  },
];

export default function GuideRequestInbox() {
  const [requests, setRequests] = useState(mockRequests);

  const handleAccept = (id) => {
    alert(`Accepted request #${id}`);
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleReject = (id) => {
    alert(`Rejected request #${id}`);
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Tourist Booking Requests</h2>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No new requests.</p>
      ) : (
        requests.map((req) => (
          <div
            key={req.id}
            className="border border-gray-200 rounded p-4 mb-4 shadow-sm bg-gray-50"
          >
            <h3 className="text-lg font-semibold mb-2">
              Request from: {req.touristName}
            </h3>
            <p><strong>Start:</strong> {req.start}</p>
            <p><strong>Destinations:</strong> {req.destinations.join(', ')}</p>
            <p><strong>Vehicle:</strong> {req.vehicle}</p>
            <p><strong>Guide Category:</strong> {req.category}</p>
            <p className="italic mt-2 text-gray-700">"{req.message}"</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleAccept(req.id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(req.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
