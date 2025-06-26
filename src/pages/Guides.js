import React, { useState } from 'react';
import { FaStar, FaTiktok, FaFacebook, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// GuideCard Component: Displays a single guide's information
const GuideCard = ({ guide }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      <img
        src={guide.image || 'https://via.placeholder.com/150'}
        alt={guide.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <div className="flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">{guide.name}</h3>
        
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {guide.categories.map((category, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="flex-grow"></div> {/* This pushes the content below to the bottom */}
        
        <div className="flex justify-center items-center mb-4">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={index < guide.rating ? 'text-yellow-400' : 'text-gray-300'}
            />
          ))}
          <span className="ml-2 text-gray-600">({guide.rating.toFixed(1)}/5)</span>
        </div>
        
        <div className="flex justify-center gap-4">
          {guide.social.tiktok && (
            <a href={guide.social.tiktok} target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-500 hover:text-black">
              <FaTiktok />
            </a>
          )}
          {guide.social.facebook && (
            <a href={guide.social.facebook} target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-500 hover:text-blue-600">
              <FaFacebook />
            </a>
          )}
          {guide.social.instagram && (
            <a href={guide.social.instagram} target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-500 hover:text-pink-500">
              <FaInstagram />
            </a>
          )}
        </div>
        <Link
          to="/guideprofileview">
          <button className="mt-auto text-center bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-200">View Profile</button>
          
        </Link>
      </div>
    </div>
  );
};

// Guides Page Component: The main page that holds the layout and logic
const Guides = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // You can easily add or remove categories here
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

  // In a real application, you would fetch this data from an API
  const guides = [
    {
      id: 1,
      name: 'Saman Perera',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      categories: ['Historical Tours', 'Cultural Experiences'],
      rating: 4.5,
      social: {
        tiktok: 'https://www.tiktok.com/@samanperera',
        facebook: 'https://www.facebook.com/samanperera',
        instagram: 'https://www.instagram.com/samanperera',
      },
    },
    {
      id: 2,
      name: 'Nimali Silva',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      categories: ['Adventure Tours', 'Wildlife Safaris'],
      rating: 5.0,
      social: {
        tiktok: 'https://www.tiktok.com/@nimalisilva',
        instagram: 'https://www.instagram.com/nimalisilva',
      },
    },
    {
      id: 3,
      name: 'Kamal Wijesinghe',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      categories: ['Beach Tours', 'Food & Culinary', 'Surfing'],
      rating: 3.5,
      social: {
        facebook: 'https://www.facebook.com/kamalwijesinghe',
        instagram: 'https://www.instagram.com/kamalwijesinghe',
      },
    },
    {
      id: 4,
      name: 'Dilani Rajapaksha',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      categories: ['Partying', 'Nature Walks'],
      rating: 4.8,
      social: {
        instagram: 'https://www.instagram.com/dilanir',
      },
    },
     {
      id: 5,
      name: 'Ravi Fernando',
      image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      categories: ['Historical Tours', 'Food & Culinary'],
      rating: 4.2,
      social: {
        facebook: 'https://www.facebook.com/ravifernando',
      },
    },
    {
      id: 6,
      name: 'Anusha Bandara',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      categories: ['Cultural Experiences', 'Nature Walks'],
      rating: 4.9,
      social: {
        tiktok: 'https://www.tiktok.com/@anushabandara',
        instagram: 'https://www.instagram.com/anushabandara',
      },
    },
  ];

  // Logic to filter guides based on selected category and search term
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
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Guides</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our verified local tour guides, each offering unique expertise to make your Sri Lankan adventure unforgettable.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="mb-8">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          {/* Horizontal Scroll for Category Buttons */}
          <div className="overflow-x-auto whitespace-nowrap pb-2 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <div className="inline-flex gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Guide Cards Grid */}
        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No guides found for your search.</p>
            <p className="text-md text-gray-400 mt-2">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guides;