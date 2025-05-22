import React from 'react';
import { FaStar, FaTiktok, FaFacebook, FaInstagram } from 'react-icons/fa';


// GuideCard Component
const GuideCard = ({ guide }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* Guide Image */}
      <img
        src={guide.image || 'https://via.placeholder.com/150'}
        alt={guide.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      {/* Guide Name */}
      <h3 className="text-xl font-semibold text-gray-600 mb-2 text-center">{guide.name}</h3>
      {/* Special Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {guide.categories.map((category, index) => (
          <span
            key={index}
            className="bg-secondary text-white text-sm px-3 py-1 rounded-full"
          >
            {category}
          </span>
        ))}
      </div>
      {/* Ratings */}
      <div className="flex justify-center mb-4">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={index < guide.rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-2 text-gray-600">({guide.rating}/5)</span>
      </div>
      {/* Social Media Icons */}
      <div className="flex justify-center gap-4">
        {guide.social.tiktok && (
          <a
            href={guide.social.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-gray-600 hover:text-primary"
          >
            <FaTiktok />
          </a>
        )}
        {guide.social.facebook && (
          <a
            href={guide.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-gray-600 hover:text-primary"
          >
            <FaFacebook />
          </a>
        )}
        {guide.social.instagram && (
          <a
            href={guide.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-gray-600 hover:text-primary"
          >
            <FaInstagram />
          </a>
        )}
      </div>
    </div>
  );
};

// Guides Page Component
const Guides = () => {
  // Sample guide data (replace with actual data from API or database)
  const guides = [
    {
      id: 1,
      name: 'Saman Perera',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      categories: ['Historical Tours', 'Cultural Experiences'],
      rating: 4,
      social: {
        tiktok: 'https://www.tiktok.com/@samanperera',
        facebook: 'https://www.facebook.com/samanperera',
        instagram: 'https://www.instagram.com/samanperera',
      },
    },
    {
      id: 2,
      name: 'Nimali Silva',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      categories: ['Adventure Tours', 'Wildlife Safaris'],
      rating: 5,
      social: {
        tiktok: 'https://www.tiktok.com/@nimalisilva',
        instagram: 'https://www.instagram.com/nimalisilva',
      },
    },
    {
      id: 3,
      name: 'Kamal Wijesinghe',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      categories: ['Beach Tours', 'Food & Culinary'],
      rating: 3,
      social: {
        facebook: 'https://www.facebook.com/kamalwijesinghe',
        instagram: 'https://www.instagram.com/kamalwijesinghe',
      },
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-600 mb-4">Meet Our Guides</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our verified local tour guides, each offering unique expertise to make your Sri Lankan adventure unforgettable.
        </p>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </div>
  );
};

export default Guides;