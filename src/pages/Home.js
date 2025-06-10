import React from 'react';
import { FaGlobe, FaSearch } from 'react-icons/fa';

import coverImage from '../assets/HomeBG.jpg';
import destination1 from '../assets/profile2.jpg';
import destination2 from '../assets/profile3.jpg';
import destination3 from '../assets/profile4.jpg';

const Home = () => {
  const sliderImages = [destination1, destination2, destination3, destination1, destination2, destination3,, destination2, destination3];

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
      {/* Top Destinations */}
<div className="max-w-6xl mx-auto mt-12 px-4">
  <h2 className="text-3xl font-bold text-gray-800 mb-6">Top Destinations</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    {sliderImages.map((img, index) => (
      <div key={index} className="relative rounded-2xl overflow-hidden shadow-xl group hover:shadow-2xl transition duration-300">
        <img
          src={img}
          alt={`Destination ${index + 1}`}
          className="w-full h-56 object-cover transform group-hover:scale-105 transition duration-300"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
          <p className="text-white text-lg font-semibold">
            Destination {index + 1}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default Home;
