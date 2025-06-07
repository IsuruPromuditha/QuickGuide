import React, { useState } from 'react';
import { FaStar, FaTiktok, FaFacebook, FaInstagram } from 'react-icons/fa';

// GuideCard Component
const GuideCard = ({ guide }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <img
        src={guide.image || 'https://via.placeholder.com/150'}
        alt={guide.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-semibold text-gray-600 mb-2 text-center">{guide.name}</h3>
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
      <div className="flex justify-center mb-4">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={index < guide.rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-2 text-gray-600">({guide.rating}/5)</span>
      </div>
      <div className="flex justify-center gap-4">
        {guide.social.tiktok && (
          <a href={guide.social.tiktok} target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-600 hover:text-primary">
            <FaTiktok />
          </a>
        )}
        {guide.social.facebook && (
          <a href={guide.social.facebook} target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-600 hover:text-primary">
            <FaFacebook />
          </a>
        )}
        {guide.social.instagram && (
          <a href={guide.social.instagram} target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-600 hover:text-primary">
            <FaInstagram />
          </a>
        )}
      </div>
    </div>
  );
};

// Guides Page Component
const Guides = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'All',
    'Historical Tours',
    'Cultural Experiences',
    'Adventure Tours',
    'Wildlife Safaris',
    'Beach Tours',
    'Food & Culinary',
    'Surfing',
    'Partying',
    'Nature Walks',
  ];

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
      categories: ['Beach Tours', 'Food & Culinary', 'Surfing'],
      rating: 3,
      social: {
        facebook: 'https://www.facebook.com/kamalwijesinghe',
        instagram: 'https://www.instagram.com/kamalwijesinghe',
      },
    },
    {
      id: 4,
      name: 'Dilani Rajapaksha',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      categories: ['Partying', 'Nature Walks'],
      rating: 5,
      social: {
        instagram: 'https://www.instagram.com/dilanir',
      },
    },
  ];

  const filteredGuides = guides.filter((guide) => {
    const matchesCategory =
      selectedCategory === 'All' || guide.categories.includes(selectedCategory);

    const matchesSearch =
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.categories.some((cat) =>
        cat.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-600 mb-4">Meet Our Guides</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our verified local tour guides, each offering unique expertise to make your Sri Lankan adventure unforgettable.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search guides..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        />

        {/* Horizontal Scroll Category Buttons */}
        <div className="overflow-x-auto whitespace-nowrap pb-2 scrollbar-thin scrollbar-thumb-gray-400">
          <div className="inline-flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full border ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guide Cards */}
      {filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No guides found.</p>
      )}
    </div>
  );
};

export default Guides;
