import React, { useState, useEffect } from 'react';
import { FaGlobe, FaSearch, FaUserTie, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import axios from 'axios'; // Add Axios import

import coverImage from '../assets/HomeBG.jpg';
import Anuradhapura from '../assets/Anuradhapura.jpg';
import destination2 from '../assets/Colombo.jpg';
import destination3 from '../assets/Mirissa.jpg';

const Home = () => {
  const sliderImages = [Anuradhapura, destination2, destination3, Anuradhapura, destination2, destination3, destination2, destination3];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Add states for translation
  const [sourceText, setSourceText] = useState(''); // Input text
  const [translatedText, setTranslatedText] = useState(''); // Translated output
  const [sourceLang] = useState('en'); // Fixed to English for simplicity
  const [targetLang, setTargetLang] = useState('si'); // Default to Sinhala
  const [loading, setLoading] = useState(false); // Loading state for API call

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    }
  }, []);

  // Function to handle translation API call
  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      alert('Please enter text to translate');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/translate', {
        text: sourceText,
        sourceLang,
        targetLang,
      });
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Failed to translate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="w-full bg-gray-50">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative h-[80vh] bg-cover bg-center rounded-b-[40px] shadow-2xl overflow-hidden"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 flex flex-col items-center justify-center text-white text-center px-4 sm:px-6">
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight"
          >
            QuickGuide Sri Lanka
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl max-w-2xl leading-relaxed"
          >
            Discover authentic Sri Lankan adventures with verified local guides for unforgettable experiences.
          </motion.p>
        </div>
      </motion.div>

      {/* Translate-style UI */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="max-w-4xl mx-auto mt-12 px-4 sm:px-6"
      >
        {/* --- Google Translate Section --- */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <FaGlobe className="text-blue-500 text-2xl" />
            <span className="font-semibold text-gray-700">From: English</span>
          </div>
          <textarea
            className="w-full h-24 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter text to translate..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <FaGlobe className="text-green-500 text-2xl" />
            <span className="font-semibold text-gray-700">To:</span>
            <select
              className="border border-gray-200 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              <option value="si">Sinhala</option>
              <option value="ta">Tamil</option>
            </select>
          </div>
          <textarea
            className="w-full h-24 p-4 border border-gray-200 rounded-xl resize-none bg-gray-50"
            placeholder="Translated text will appear here..."
            value={translatedText}
            readOnly
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTranslate}
            disabled={loading || !sourceText.trim()}
            className="bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-secondary transition duration-300 shadow-md disabled:opacity-50"
          >
            {loading ? 'Translating...' : 'Translate'}
          </motion.button>
        </div>

        {/* --- Search Section --- */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-gray-100">
          <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-primary transition">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search your destination or guide..."
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </motion.div>

      {/* Tour Guide Categories */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="max-w-7xl mx-auto mt-16 px-4 sm:px-6"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Explore by Interest</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {[
            { emoji: '🏞️', label: 'Nature' },
            { emoji: '🏛️', label: 'History' },
            { emoji: '🌊', label: 'Beach' },
            { emoji: '🍛', label: 'Food' },
            { emoji: '🛍️', label: 'Shopping' },
            { emoji: '🧗', label: 'Adventure' },
            { emoji: '🕌', label: 'Cultural' },
            { emoji: '🚴', label: 'Sports' },
          ].map((category, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-gray-200 shadow-md hover:bg-primary hover:text-white transition duration-300"
            >
              <span className="text-xl">{category.emoji}</span>
              <span className="text-base font-semibold">{category.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Top Destinations */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="max-w-7xl mx-auto mt-16 px-4 sm:px-6"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Top Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {sliderImages.map((img, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="relative rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition duration-300"
            >
              <img
                src={img}
                alt={`Destination ${index + 1}`}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center transition duration-300 pb-4">
                <p className="text-white text-lg font-semibold">
                  Destination {index + 1}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Find a Guide Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="max-w-7xl mx-auto mt-16 px-4 sm:px-6"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Find Your Perfect Guide</h2>
        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 border border-gray-100">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-7xl text-primary"
          >
            <FaUserTie />
          </motion.div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Connect with verified local guides who specialize in your interests, from exploring ancient ruins to discovering hidden beaches, for a truly personalized Sri Lankan adventure.
            </p>
            <Link
              to={isLoggedIn ? '/guides' : '/login'}
              className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-full hover:bg-secondary transition duration-300 shadow-md"
            >
              {isLoggedIn ? 'Find a Guide Now' : 'Login to Find a Guide'}
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Connect with Social Groups Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="max-w-7xl mx-auto mt-16 px-4 sm:px-6 mb-16"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Join Our Travel Community</h2>
        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 border border-gray-100">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-7xl text-primary"
          >
            <FaUsers />
          </motion.div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Connect with fellow travelers, share experiences, and plan group adventures. Join vibrant social groups to make lifelong friends while exploring the wonders of Sri Lanka.
            </p>
            <Link
              to={isLoggedIn ? '/tourist-socialgroup' : '/login'}
              className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-full hover:bg-secondary transition duration-300 shadow-md"
            >
              {isLoggedIn ? 'Join Social Groups' : 'Login to Connect'}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;