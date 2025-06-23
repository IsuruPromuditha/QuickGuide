import React from 'react';
import { GiLaurelCrown, GiPodium } from 'react-icons/gi';
import { FaMedal } from 'react-icons/fa';

const leaderboardData = [
  {
    id: 1,
    name: 'Saman Perera',
    country: 'Sri Lanka',
    points: 980,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 2,
    name: 'Nimali Silva',
    country: 'Sri Lanka',
    points: 920,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 3,
    name: 'Ravi Fernando',
    country: 'Sri Lanka',
    points: 890,
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 4,
    name: 'Dilani Rajapaksha',
    country: 'Sri Lanka',
    points: 850,
    image: 'https://randomuser.me/api/portraits/women/46.jpg',
  },
  {
    id: 5,
    name: 'Kamal Wijesinghe',
    country: 'Sri Lanka',
    points: 830,
    image: 'https://randomuser.me/api/portraits/men/47.jpg',
  },
];

const Leaderboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-2xl">
        {/* Heading */}
        <div className="flex items-center justify-center mb-8 gap-2 text-3xl font-bold text-center text-gray-700">
          <GiPodium className="text-yellow-500" />
          <h1>Tour Guide Leaderboard</h1>
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          {leaderboardData.map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-4 rounded-xl shadow-md ${
                index === 0
                  ? 'bg-yellow-100'
                  : index === 1
                  ? 'bg-gray-100'
                  : index === 2
                  ? 'bg-orange-100'
                  : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold w-8 text-gray-600">
                  {index + 1}
                </div>
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-primary object-cover"
                />
                <div>
                  <h2 className="font-semibold text-gray-800">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-semibold text-gray-700">
                <FaMedal
                  className={`${
                    index === 0
                      ? 'text-yellow-500'
                      : index === 1
                      ? 'text-gray-400'
                      : index === 2
                      ? 'text-orange-400'
                      : 'text-blue-400'
                  } text-lg`}
                />
                {user.points} pts
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
