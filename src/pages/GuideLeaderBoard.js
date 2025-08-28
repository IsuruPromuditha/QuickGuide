import React, { useState, useEffect } from 'react';
import { GiPodium } from 'react-icons/gi';
import { FaMedal } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GuideLeaderBoard = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await axios.get('http://localhost:5000/api/guide-leaderboard/guide-leaderboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Prepend server URL to profile_image paths
        const updatedGuides = response.data.map(guide => ({
          ...guide,
          profile_image: guide.profile_image ? `http://localhost:5000/profiles/${guide.profile_image.split('/profiles/')[1]}` : '/images/default-profile.png'
        }));
        setGuides(updatedGuides);
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch leaderboard data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleGuideClick = (id) => {
    navigate(`/profile/${id}`);
  };


  const getMedalColor = (completedRides) => {
    if (completedRides >= 150) return 'text-yellow-500'; 
    if (completedRides >= 100) return 'text-gray-400'; 
    if (completedRides >= 50) return 'text-orange-400'; 
    return 'text-blue-400'; 
  };

  const getMedalLabel = (completedRides) => {
    if (completedRides >= 150) return 'Gold';
    if (completedRides >= 100) return 'Silver';
    if (completedRides >= 50) return 'Bronze';
    return 'Blue';
  };

  const getTrophyCount = (completedRides) => {
    return Math.floor(completedRides / 50);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-yellow-50 to-green-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-yellow-50 to-green-100">
        <div className="text-red-600 text-lg font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-center mb-8 gap-2 text-3xl font-bold text-center text-gray-700">
          <GiPodium className="text-yellow-500" />
          <h1>Tour Guide Leaderboard</h1>
        </div>

        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ranking and Medal System</h2>
          <p className="text-gray-600 mb-4">
            Guides earn medals based on their completed rides, with a new medal level awarded for every 50 successful rides. Each milestone earns a trophy, displayed next to the medal.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <FaMedal className="text-yellow-500 text-lg" />
              <span><strong>Gold Medal</strong>: Awarded for 150+ rides.</span>
            </li>
            <li className="flex items-center gap-2">
              <FaMedal className="text-gray-400 text-lg" />
              <span><strong>Silver Medal</strong>: Awarded for 100-149 rides.</span>
            </li>
            <li className="flex items-center gap-2">
              <FaMedal className="text-orange-400 text-lg" />
              <span><strong>Bronze Medal</strong>: Awarded for 50-99 rides.</span>
            </li>
            <li className="flex items-center gap-2">
              <FaMedal className="text-blue-400 text-lg" />
              <span><strong>Blue Medal</strong>: Awarded for beginner guides with 0-49 rides.</span>
            </li>
            <li className="flex items-center gap-2">
              <GiPodium className="text-yellow-500 text-lg" />
              <span><strong>Trophy Count</strong>: One trophy is awarded for every 50 rides completed.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          {guides.map((guide, index) => (
            <div
              key={guide.id}
              className={`flex items-center justify-between p-4 rounded-xl shadow-md cursor-pointer ${
                index === 0
                  ? 'bg-yellow-100'
                  : index === 1
                  ? 'bg-gray-100'
                  : index === 2
                  ? 'bg-orange-100'
                  : 'bg-white'
              }`}
              onClick={() => handleGuideClick(guide.id)}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold w-8 text-gray-600">
                  {index + 1}
                </div>
                <img
                  src={guide.profile_image}
                  alt={guide.name}
                  className="w-12 h-12 rounded-full border-2 border-primary object-cover"
                  onError={(e) => {
                    e.target.src = '/images/default-profile.png';
                    console.error(`Failed to load image: ${guide.profile_image}`);
                  }}
                />
                <div>
                  <h2 className="font-semibold text-gray-800">{guide.name}</h2>
                  <p className="text-sm text-gray-500">{guide.categories.join(', ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-semibold text-gray-700">
                <FaMedal
                  className={`${getMedalColor(guide.completed_rides)} text-lg`}
                />
                <span>
                  {getMedalLabel(guide.completed_rides)}: {guide.completed_rides} rides
                  {getTrophyCount(guide.completed_rides) > 0 && (
                    <>
                      {' '}
                      <GiPodium className="inline text-yellow-500 text-lg" /> x{getTrophyCount(guide.completed_rides)}
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuideLeaderBoard;