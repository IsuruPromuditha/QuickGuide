import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TouristLeaderBoard = () => {
  const [tourists, setTourists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTouristLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get('http://localhost:5000/api/tourist-leaderboard/tourist-leaderboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTourists(response.data);
        setLoading(false);
      } catch (err) {
        const errorMessage = err.response
          ? `Server error: ${err.response.status} - ${err.response.data.error || err.message}`
          : err.message || 'Failed to fetch leaderboard data';
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchTouristLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-neutralBg">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Tourist Leaderboard</h1>
        {loading && (
          <div className="text-center text-gray-600">Loading...</div>
        )}
        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}
        {!loading && !error && tourists.length === 0 && (
          <div className="text-center text-gray-600">No tourists found.</div>
        )}
        {!loading && !error && tourists.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tourists.map((tourist, index) => (
              <div
                key={tourist.id}
                className="bg-white p-6 rounded-lg shadow-travel-shadow hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-primary">#{index + 1}</span>
                  {tourist.profile_image ? (
                    <img
                      src={`http://localhost:5000${tourist.profile_image}`}
                      alt={tourist.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-travelBlue">{tourist.name}</h2>
                    <p className="text-gray-600">
                      Completed Trips: <span className="font-bold">{tourist.completed_trips}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristLeaderBoard;