import React, { useState } from 'react';
import { FaStar, FaFacebook, FaInstagram, FaTiktok, FaCamera, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaMapMarkerAlt, FaImage } from 'react-icons/fa';

const GuideProfileView = () => {
  const [profile, setProfile] = useState({
    name: 'Kasun Buddika',
    profileImage: '/api/placeholder/400/400',
    bio: `Hi! I'm Kasu, a licensed tour guide with 10+ years of experience across Sri Lanka. I specialize in historical, cultural, and food tours, ensuring you feel like a local.`,
    categories: ['Historical Tours', 'Cultural Experiences', 'Food & Culinary'],
    rating: 4.7,
    reviews: 128,
    gallery: [
      '/api/placeholder/400/300',
      '/api/placeholder/400/300',
      '/api/placeholder/400/300'
    ],
    socials: {
      facebook: 'https://facebook.com/samanperera',
      instagram: 'https://instagram.com/samanperera',
      tiktok: 'https://tiktok.com/@samanperera',
    },
  });

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Sigiriya Adventure',
      images: ['/api/placeholder/400/300'],
      caption: 'Amazing day at Sigiriya Rock with wonderful tourists!',
      location: 'Sigiriya, Sri Lanka',
      date: '2024-01-15',
    },
    {
      id: 2,
      title: 'Temple Exploration',
      images: ['/api/placeholder/400/300'],
      caption: 'Exploring the beautiful temples of Kandy',
      location: 'Kandy, Sri Lanka',
      date: '2024-01-10',
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [newPost, setNewPost] = useState({ title: '', images: [], caption: '', location: '' });
  const [showAddPost, setShowAddPost] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setEditForm({
        ...editForm,
        categories: [...editForm.categories, newCategory.trim()]
      });
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (index) => {
    setEditForm({
      ...editForm,
      categories: editForm.categories.filter((_, i) => i !== index)
    });
  };

  const handleAddPost = () => {
    if (newPost.title && newPost.images.length > 0 && newPost.caption && newPost.location) {
      const post = {
        id: Date.now(),
        title: newPost.title,
        images: newPost.images,
        caption: newPost.caption,
        location: newPost.location,
        date: new Date().toISOString().split('T')[0],
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', images: [], caption: '', location: '' });
      setShowAddPost(false);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm({
          ...editForm,
          profileImage: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const imagePromises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then(images => {
        setNewPost({
          ...newPost,
          images: [...newPost.images, ...images]
        });
      });
    }
  };

  const removePostImage = (index) => {
    setNewPost({
      ...newPost,
      images: newPost.images.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition duration-300"
                    >
                      <FaSave size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleEditToggle}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition duration-300"
                    >
                      <FaTimes size={16} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition duration-300"
                  >
                    <FaEdit size={16} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative">
                <img
                  src={isEditing ? editForm.profileImage : profile.profileImage}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover shadow-md mx-auto md:mx-0"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full cursor-pointer transition duration-300">
                    <FaCamera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-orange-200 focus:border-orange-600 outline-none w-full"
                    />
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      className="text-gray-600 mb-4 w-full p-2 border border-gray-300 rounded-md focus:border-orange-600 outline-none"
                      rows="3"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{profile.name}</h2>
                    <p className="text-gray-600 mb-4">{profile.bio}</p>
                  </>
                )}

                {/* Categories */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {(isEditing ? editForm.categories : profile.categories).map((cat, idx) => (
                      <span
                        key={idx}
                        className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {cat}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveCategory(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes size={12} />
                          </button>
                        )}
                      </span>
                    ))}
                    {isEditing && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Add category"
                          className="text-sm px-2 py-1 border border-gray-300 rounded-full focus:border-orange-600 outline-none"
                        />
                        <button
                          onClick={handleAddCategory}
                          className="bg-orange-600 hover:bg-orange-700 text-white p-1 rounded-full"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.floor(profile.rating) ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                  <span className="text-gray-600 ml-2">({profile.rating}/5 from {profile.reviews} reviews)</span>
                </div>

                {/* Social Media */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Social Media</h3>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={editForm.socials.facebook}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          socials: {...editForm.socials, facebook: e.target.value}
                        })}
                        placeholder="Facebook URL"
                        className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-600 outline-none"
                      />
                      <input
                        type="url"
                        value={editForm.socials.instagram}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          socials: {...editForm.socials, instagram: e.target.value}
                        })}
                        placeholder="Instagram URL"
                        className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-600 outline-none"
                      />
                      <input
                        type="url"
                        value={editForm.socials.tiktok}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          socials: {...editForm.socials, tiktok: e.target.value}
                        })}
                        placeholder="TikTok URL"
                        className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-600 outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex gap-4 text-2xl text-gray-600">
                      {profile.socials.facebook && (
                        <a href={profile.socials.facebook} target="_blank" rel="noopener noreferrer">
                          <FaFacebook className="hover:text-blue-600" />
                        </a>
                      )}
                      {profile.socials.instagram && (
                        <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer">
                          <FaInstagram className="hover:text-pink-500" />
                        </a>
                      )}
                      {profile.socials.tiktok && (
                        <a href={profile.socials.tiktok} target="_blank" rel="noopener noreferrer">
                          <FaTiktok className="hover:text-black" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Recent Posts</h2>
              <button
                onClick={() => setShowAddPost(!showAddPost)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition duration-300"
              >
                <FaPlus size={16} />
                Add Post
              </button>
            </div>

            {/* Add Post Form */}
            {showAddPost && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Post</h3>
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      placeholder="Enter post title"
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-600 outline-none"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={newPost.location}
                        onChange={(e) => setNewPost({...newPost, location: e.target.value})}
                        placeholder="Enter location"
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:border-orange-600 outline-none"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                    <div className="space-y-2">
                      <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-orange-600 cursor-pointer transition duration-300">
                        <div className="text-center">
                          <FaImage className="mx-auto text-gray-400 mb-2" size={24} />
                          <p className="text-sm text-gray-600">Click to upload images</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePostImageUpload}
                          className="hidden"
                        />
                      </label>
                      
                      {/* Image Preview */}
                      {newPost.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {newPost.images.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-md"
                              />
                              <button
                                onClick={() => removePostImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-300"
                              >
                                <FaTimes size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Caption */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                    <textarea
                      value={newPost.caption}
                      onChange={(e) => setNewPost({...newPost, caption: e.target.value})}
                      placeholder="Write a caption..."
                      rows="3"
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-600 outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddPost}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition duration-300"
                    >
                      Add Post
                    </button>
                    <button
                      onClick={() => setShowAddPost(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                  {/* Image Carousel */}
                  <div className="relative">
                    <img
                      src={post.images[0]}
                      alt="Post"
                      className="w-full h-48 object-cover"
                    />
                    {post.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                        +{post.images.length - 1}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{post.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <FaMapMarkerAlt className="mr-1" size={12} />
                      <span>{post.location}</span>
                    </div>
                    <p className="text-gray-600 mb-3">{post.caption}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{post.date}</span>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-500 hover:text-red-700 transition duration-300"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery Section */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tour Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {profile.gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideProfileView;