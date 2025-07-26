import React, { useState, useEffect } from 'react';
import { FaStar, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const TouristGuideProfileView = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [expandedCaptions, setExpandedCaptions] = useState({});
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showAllGallery, setShowAllGallery] = useState(false);

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        const [guideResponse, postsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/guide/profile/${id}`),
          axios.get(`http://localhost:5000/api/guide/profile/${id}/posts`)
        ]);
        setGuide(guideResponse.data);
        setPosts(postsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load guide profile or posts. Please try again later.');
        setLoading(false);
      }
    };
    fetchGuideData();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedPost) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPost]);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <div className="slick-next bg-primary text-white rounded-full p-2 hover:bg-secondary"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></div>,
    prevArrow: <div className="slick-prev bg-primary text-white rounded-full p-2 hover:bg-secondary"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></div>,
  };

  const toggleCaption = (postId) => {
    setExpandedCaptions((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const renderCaption = (caption, postId) => {
    const maxLength = 100;
    if (caption.length <= maxLength || expandedCaptions[postId]) {
      return <p className="text-gray-600 text-base mb-2">{caption}</p>;
    }
    return (
      <>
        <p className="text-gray-600 text-base mb-2">{caption.substring(0, maxLength)}...</p>
        <button
          className="text-primary hover:text-secondary text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation();
            toggleCaption(postId);
          }}
        >
          See More
        </button>
      </>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-2xl text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-2xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-2xl text-gray-600">Guide not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto bg-white shadow-2xl rounded-2xl p-8 transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={guide.profile_image ? `http://localhost:5000${guide.profile_image}` : 'https://via.placeholder.com/150'}
            alt={guide.name}
            className="w-48 h-48 rounded-full object-cover shadow-lg mx-auto md:mx-0 border-4 border-orange-100"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">{guide.name}</h1>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">{guide.bio}</p>

            <div className="flex flex-wrap gap-3 mb-4">
              {guide.categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="bg-orange-100 text-gray-800 text-sm font-medium px-4 py-1.5 rounded-full"
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
                  size={24}
                />
              ))}
              <span className="text-gray-600 text-base ml-2">({guide.rating.toFixed(1)}/5 from {guide.reviews} reviews)</span>
            </div>

            <div className="flex gap-6 text-3xl text-gray-600">
              {guide.social.tiktok && (
                <a href={guide.social.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors duration-200">
                  <FaTiktok />
                </a>
              )}
              {guide.social.facebook && (
                <a href={guide.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-200">
                  <FaFacebook />
                </a>
              )}
              {guide.social.instagram && (
                <a href={guide.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors duration-200">
                  <FaInstagram />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Past Tour Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {guide.gallery.slice(0, showAllGallery ? guide.gallery.length : 3).map((img, i) => (
              <img
                key={i}
                src={`http://localhost:5000${img}`}
                alt={`Gallery ${i + 1}`}
                className="w-full h-64 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
          {guide.gallery.length > 3 && !showAllGallery && (
            <div className="text-center mt-6">
              <button
                className="bg-primary hover:bg-secondary text-white font-semibold text-base px-6 py-2 rounded-full transition-all duration-300"
                onClick={() => setShowAllGallery(true)}
                aria-label="Show all gallery images"
              >
                See More
              </button>
            </div>
          )}
        </div>

        {/* Posts Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Posts</h2>
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(0, showAllPosts ? posts.length : 3).map((post) => (
                  <div
                    key={post.id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                    onClick={() => openModal(post)}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{post.title}</h3>
                    {renderCaption(post.caption, post.id)}
                    <p className="text-sm text-gray-500 mb-2">Location: {post.location}</p>
                    <p className="text-sm text-gray-400 mb-4">Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
                    {post.images.length > 1 ? (
                      <Slider {...carouselSettings}>
                        {post.images.map((img, i) => (
                          <div key={i}>
                            <img
                              src={`http://localhost:5000${img}`}
                              alt={`Post ${post.id} image ${i + 1}`}
                              className="w-full h-56 object-cover rounded-lg"
                            />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <img
                        src={post.images[0] ? `http://localhost:5000${post.images[0]}` : 'https://via.placeholder.com/150'}
                        alt={`Post ${post.id} image`}
                        className="w-full h-56 object-cover rounded-lg"
                      />
                    )}
                  </div>
                ))}
              </div>
              {posts.length > 3 && !showAllPosts && (
                <div className="text-center mt-6">
                  <button
                    className="bg-primary hover:bg-secondary text-white font-semibold text-base px-6 py-2 rounded-full transition-all duration-300"
                    onClick={() => setShowAllPosts(true)}
                    aria-label="Show all posts"
                  >
                    See More
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-lg text-gray-500 text-center">No posts available.</p>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link to="/guidebooking">
            <button className="bg-primary hover:bg-secondary text-white font-semibold text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300">
              Contact / Book Now
            </button>
          </Link>
        </div>

        {selectedPost && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
            role="dialog"
            aria-labelledby="post-modal-title"
            aria-modal="true"
          >
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl transform scale-95 animate-modal-open">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 id="post-modal-title" className="text-3xl font-bold text-gray-800">{selectedPost.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">Posted on: {new Date(selectedPost.created_at).toLocaleDateString()}</p>
                  </div>
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 text-2xl focus:outline-none transition-all duration-200"
                    onClick={closeModal}
                    aria-label="Close modal"
                  >
                    &times;
                  </button>
                </div>
              </div>
              {selectedPost.caption.length > 100 && !expandedCaptions[selectedPost.id] ? (
                <>
                  <p className="text-lg text-gray-600 mb-3 leading-relaxed">{selectedPost.caption.substring(0, 100)}...</p>
                  <button
                    className="text-primary hover:text-secondary text-sm font-medium mb-4"
                    onClick={() => toggleCaption(selectedPost.id)}
                  >
                    See More
                  </button>
                </>
              ) : (
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">{selectedPost.caption}</p>
              )}
              <p className="text-sm text-gray-500 mb-6">Location: {selectedPost.location}</p>
              {selectedPost.images.length > 0 ? (
                <Slider {...carouselSettings}>
                  {selectedPost.images.map((img, i) => (
                    <div key={i}>
                      <img
                        src={`http://localhost:5000${img}`}
                        alt={`Post ${selectedPost.id} image ${i + 1}`}
                        className="w-full max-h-[32rem] object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                <p className="text-lg text-gray-500 text-center">No images available.</p>
              )}
              <div className="mt-6 text-center">
                <button
                  className="bg-primary hover:bg-secondary text-white font-semibold text-base px-6 py-2 rounded-full transition-all duration-300"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristGuideProfileView;