import React, { useState, useEffect } from 'react';
import { FaStar, FaTiktok, FaFacebook, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const GuideCard = ({ guide }) => {
    const rating = parseFloat(guide.rating) || 0;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
            <img
                src={guide.profile_image ? `http://localhost:5000${guide.profile_image}` : 'https://via.placeholder.com/150'}
                alt={guide.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{guide.name}</h3>
                
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {guide.categories.map((category, index) => (
                        <span
                            key={index}
                            className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
                        >
                            {category}
                        </span>
                    ))}
                </div>

                <div className="flex-grow"></div>
                
                <div className="flex justify-center items-center mb-4">
                    {[...Array(5)].map((_, index) => (
                        <FaStar
                            key={index}
                            className={index < Math.round(rating) ? 'text-primary' : 'text-gray-300'}
                        />
                    ))}
                    <span className="ml-2 text-gray-600">({rating.toFixed(1)}/5)</span>
                </div>
                
                <div className="flex justify-center gap-4">
                    {guide.social.tiktok && (
                        <a href={guide.social.tiktok} target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-500 hover:text-gray-900">
                            <FaTiktok />
                        </a>
                    )}
                    {guide.social.facebook && (
                        <a href={guide.social.facebook} target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-500 hover:text-primary">
                            <FaFacebook />
                        </a>
                    )}
                    {guide.social.instagram && (
                        <a href={guide.social.instagram} target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-500 hover:text-secondary">
                            <FaInstagram />
                        </a>
                    )}
                </div>
                <Link to={`/tourist-guideprofileview/${guide.id}`}>
                    <button className="mt-auto text-center bg-primary text-white py-2 px-4 rounded-full hover:bg-secondary transition duration-200">
                        View Profile
                    </button>
                </Link>
            </div>
        </div>
    );
};

const Guides = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/guide/guides');
                setGuides(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load guides. Please try again later.');
                setLoading(false);
            }
        };
        fetchGuides();
    }, []);


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
            <div className="container mx-auto py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Guides</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover our verified local tour guides, each offering unique expertise to make your Sri Lankan adventure unforgettable.
                    </p>
                </div>

                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search by name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 mb-6 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                    />

                    <div className="overflow-x-auto whitespace-nowrap pb-2 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        <div className="inline-flex gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                                        selectedCategory === category
                                            ? 'bg-primary text-white shadow'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-500">Loading guides...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <p className="text-xl text-red-500">{error}</p>
                    </div>
                ) : filteredGuides.length > 0 ? (
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