import React from 'react';
import { FaStar, FaTiktok, FaFacebook, FaInstagram } from 'react-icons/fa';

// Import dummy local images
import coverPhoto from '../assets/Coverphoto.jpeg';
import profileImage from '../assets/profile.jpg';
import gallery1 from '../assets/profile1.jpg';
import gallery2 from '../assets/profile2.jpg';
import gallery3 from '../assets/profile3.jpg';

const GuideProfileView = () => {
  const guide = {
    name: 'Revive',
    coverPhoto,
    image: profileImage,
    description: 'An expert in cultural and historical tours, sharing the rich heritage of Sri Lanka.',
    experience: '5 years of experience in guiding cultural and historical tours.',
    rating: 4,
    social: {
      tiktok: 'https://www.tiktok.com/@samanperera',
      facebook: 'https://www.facebook.com/samanperera',
      instagram: 'https://www.instagram.com/samanperera',
    },
    gallery: [gallery1, gallery2, gallery3],
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Cover Photo and Profile Image */}
      <div className="relative mb-16">
        <img
          src={guide.coverPhoto}
          alt="Cover"
          className="w-full h-56 md:h-64 object-cover rounded-lg"
        />
        <div className="absolute left-6 bottom-[-3rem]">
          <img
            src={guide.image}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl"
          />
        </div>
      </div>

      {/* Guide Info */}
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold text-gray-800">{guide.name}</h1>
        <p className="text-gray-600 mt-2">{guide.description}</p>
        <p className="text-sm text-gray-500 mt-1">{guide.experience}</p>

        {/* Rating */}
        <div className="flex justify-center mt-4">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={index < guide.rating ? 'text-yellow-400' : 'text-gray-300'}
            />
          ))}
          <span className="ml-2 text-gray-600">({guide.rating}/5)</span>
        </div>

        {/* Social Media */}
        <div className="flex justify-center mt-4 space-x-6 text-2xl text-gray-500">
          <a href={guide.social.tiktok} target="_blank" rel="noopener noreferrer">
            <FaTiktok className="hover:text-black" />
          </a>
          <a href={guide.social.facebook} target="_blank" rel="noopener noreferrer">
            <FaFacebook className="hover:text-blue-600" />
          </a>
          <a href={guide.social.instagram} target="_blank" rel="noopener noreferrer">
            <FaInstagram className="hover:text-pink-500" />
          </a>
        </div>
      </div>

      {/* Gallery */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {guide.gallery.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Gallery ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg shadow"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuideProfileView;
