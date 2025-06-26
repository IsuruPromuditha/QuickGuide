import React from 'react';
import { FaStar, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

import profileImage from '../assets/HomeBG.jpg';
import gallery1 from '../assets/Anuradhapura.jpg';
import gallery2 from '../assets/Colombo.jpg';
import gallery3 from '../assets/Mirissa.jpg';
import { Link } from 'react-router-dom';



const guide = {
  name: 'Kasun Buddika',
  profileImage: profileImage,
  bio: `Hi! I'm Kasu, a licensed tour guide with 10+ years of experience across Sri Lanka. I specialize in historical, cultural, and food tours, ensuring you feel like a local.`,
  categories: ['Historical Tours', 'Cultural Experiences', 'Food & Culinary'],
  rating: 4.7,
  reviews: 128,
  gallery: [
    gallery1,gallery2,gallery3
  ],
  socials: {
    facebook: 'https://facebook.com/samanperera',
    instagram: 'https://instagram.com/samanperera',
    tiktok: 'https://tiktok.com/@samanperera',
  },
};

const GuideProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={guide.profileImage}
            alt={guide.name}
            className="w-40 h-40 rounded-full object-cover shadow-md mx-auto md:mx-0"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{guide.name}</h1>
            <p className="text-gray-600 mb-4">{guide.bio}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {guide.categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                >
                  {cat}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-yellow-500 mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.floor(guide.rating) ? 'text-yellow-400' : 'text-gray-300'}
                />
              ))}
              <span className="text-gray-600 ml-2">({guide.rating}/5 from {guide.reviews} reviews)</span>
            </div>

            <div className="flex gap-4 text-2xl text-gray-600">
              {guide.socials.tiktok && (
                <a href={guide.socials.tiktok} target="_blank" rel="noopener noreferrer">
                  <FaTiktok className="hover:text-black" />
                </a>
              )}
              {guide.socials.facebook && (
                <a href={guide.socials.facebook} target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="hover:text-blue-600" />
                </a>
              )}
              {guide.socials.instagram && (
                <a href={guide.socials.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="hover:text-pink-500" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Past Tour Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {guide.gallery.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Gallery ${i + 1}`}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>

        {/* Contact/Booking */}
        <div className="mt-8 text-center">
          <Link to="/guidebooking">
          <button className="bg-primary hover:bg-secondary text-white font-semibold px-6 py-3 rounded-md shadow-md transition duration-300">
            Contact / Book Now
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuideProfile;
