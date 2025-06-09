import React from 'react';
import { FaGlobe, FaSearch } from 'react-icons/fa';

import coverImage from '../assets/HomeBG.jpg';
import destination1 from '../assets/profile2.jpg';
import destination2 from '../assets/profile3.jpg';
import destination3 from '../assets/profile4.jpg';

const Home = () => {
  const sliderImages = [destination1, destination2, destination3];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div
        className="relative h-[70vh] bg-cover bg-center rounded-b-3xl shadow-xl"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center p-6">
          <h1 className="text-5xl font-bold mb-4">QuickGuide Sri Lanka</h1>
          <p className="text-lg max-w-xl">
            Connect with verified local tour guides for authentic, seamless, and memorable experiences across Sri Lanka.
          </p>
        </div>
      </div>

      {/* Translate-style UI */}
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="border rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 items-center bg-white">
          <div className="flex items-center gap-2 w-full md:w-1/2">
            <FaGlobe className="text-blue-600" />
            <span className="font-medium">From: English</span>
          </div>
          <div className="flex items-center gap-2 w-full md:w-1/2">
            <FaGlobe className="text-green-600" />
            <span className="font-medium">To: Sinhala / Tamil</span>
          </div>
          <div className="w-full mt-4">
            <div className="flex items-center border rounded-md px-2 py-1">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search your destination or guide..."
                className="w-full outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="max-w-5xl mx-auto mt-12 px-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Top Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sliderImages.map((img, index) => (
            <div key={index} className="rounded-xl overflow-hidden shadow-lg">
              <img src={img} alt={`Destination ${index + 1}`} className="w-full h-48 object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
