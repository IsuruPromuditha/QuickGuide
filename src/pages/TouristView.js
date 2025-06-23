import React from 'react';
import { GiSriLanka } from 'react-icons/gi';
import { FaStar } from 'react-icons/fa';

const guideCategories = [
  { label: '🏯 History', value: 'History' },
  { label: '🌊 Beach', value: 'Beach' },
  { label: '🦁 Wildlife', value: 'Wildlife' },
  { label: '🏕️ Nature', value: 'Nature' },
  { label: '🍛 Food', value: 'Food' },
  { label: '🏄 Surfing', value: 'Surfing' },
];

const guides = [
  {
    name: 'Saman Perera',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=60',
    rating: 4.7,
    categories: ['History', 'Nature'],
  },
  {
    name: 'Dilani Silva',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=60',
    rating: 4.9,
    categories: ['Beach', 'Food'],
  },
];

const topLocations = [
  {
    name: 'Sigiriya Rock Fortress',
    image: 'https://source.unsplash.com/400x300/?sigiriya',
  },
  {
    name: 'Ella Train Ride',
    image: 'https://source.unsplash.com/400x300/?srilanka,train',
  },
  {
    name: 'Mirissa Beach',
    image: 'https://source.unsplash.com/400x300/?beach,srilanka',
  },
];

const TouristView = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-teal-50">
        <div className="text-3xl font-bold text-gray-700 flex justify-center items-center gap-2">
          <GiSriLanka className="text-primary text-4xl" />
          Explore Sri Lanka with Quick<span className="text-secondary">Guide</span>
        </div>
        <p className="text-gray-600 mt-4 max-w-xl mx-auto">
          Browse verified guides and beautiful destinations—no login needed!
        </p>
      </div>

      {/* Categories */}
      <div className="px-4 mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Explore by Category</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {guideCategories.map((cat, index) => (
            <button
              key={index}
              className="px-4 py-2 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-primary hover:text-white transition whitespace-nowrap"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guide Cards */}
      <div className="px-4 mt-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {guides.map((guide, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
              <img
                src={guide.image}
                alt={guide.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="text-lg font-semibold text-gray-800 mt-4 text-center">{guide.name}</h3>
              <div className="flex justify-center mt-2 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < Math.round(guide.rating) ? '' : 'text-gray-300'}
                  />
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {guide.categories.map((cat, i) => (
                  <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-700">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Locations */}
      <div className="px-4 mt-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Top Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {topLocations.map((location, idx) => (
            <div key={idx} className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition">
              <img src={location.image} alt={location.name} className="w-full h-48 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm px-4 py-2">
                {location.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TouristView;
