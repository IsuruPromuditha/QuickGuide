import React, { useState, useEffect } from 'react';
import { FaStar, FaFacebook, FaInstagram, FaTiktok, FaCamera, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaMapMarkerAlt, FaImage } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { toast } from 'react-toastify';

const GuideProfileView = () => {
  const [profile, setProfile] = useState({
    name: '',
    profileImage: '',
    bio: '',
    categories: [],
    rating: 0,
    reviews: 0,
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
    country: '',
    language: '',
    experience: ''
  });
  const [posts, setPosts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [newPost, setNewPost] = useState({ title: '', images: [], caption: '', location: '' });
  const [showAddPost, setShowAddPost] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState(null);
  const [showAddGalleryImage, setShowAddGalleryImage] = useState(false);

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          if (decoded.id && decoded.role === 'guide') {
            const guideResponse = await axios.get(`http://localhost:5000/api/guide/guide/${decoded.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const guideData = guideResponse.data;
            console.log('Guide data:', guideData);
            setProfile({
              ...guideData,
              categories: guideData.categories ? JSON.parse(guideData.categories) : [],
              facebook_url: guideData.facebook_url || '',
              instagram_url: guideData.instagram_url || '',
              tiktok_url: guideData.tiktok_url || '',
              profileImage: guideData.profile_image || '/api/placeholder/400/400'
            });
            setEditForm({
              ...guideData,
              categories: guideData.categories ? JSON.parse(guideData.categories) : [],
              facebook_url: guideData.facebook_url || '',
              instagram_url: guideData.instagram_url || '',
              tiktok_url: guideData.tiktok_url || '',
              profileImage: guideData.profile_image || '/api/placeholder/400/400'
            });

            const postsResponse = await axios.get(`http://localhost:5000/api/guide/guide/${decoded.id}/posts`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Posts data:', postsResponse.data);
            setPosts(postsResponse.data);

            const galleryResponse = await axios.get(`http://localhost:5000/api/guide/guide/${decoded.id}/gallery`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Gallery data:', galleryResponse.data);
            setGallery(galleryResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching guide data:', error);
        toast.error('Failed to load profile data');
      }
    };

    fetchGuideData();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('bio', editForm.bio);
      formData.append('facebook_url', editForm.facebook_url);
      formData.append('instagram_url', editForm.instagram_url);
      formData.append('tiktok_url', editForm.tiktok_url);
      formData.append('country', editForm.country);
      formData.append('language', editForm.language);
      formData.append('experience', editForm.experience);
      formData.append('categories', JSON.stringify(editForm.categories));
      if (editForm.profileImage instanceof File) {
        formData.append('profileImage', editForm.profileImage);
      }

      const response = await axios.put(`http://localhost:5000/api/guide/guide/${decoded.id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      console.log('Update response:', response.data);

      setProfile({
        ...editForm,
        categories: editForm.categories,
        profileImage: editForm.profileImage instanceof File ? `/profiles/${editForm.profileImage.name}` : editForm.profileImage
      });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
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

  const handleAddPost = async () => {
    if (newPost.title && newPost.images.length > 0 && newPost.caption && newPost.location) {
      try {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const formData = new FormData();
        formData.append('title', newPost.title);
        formData.append('caption', newPost.caption);
        formData.append('location', newPost.location);
        newPost.images.forEach((image, index) => {
          formData.append('images', image);
        });
        console.log('Post FormData:', Array.from(formData.entries()));

        const response = await axios.post(`http://localhost:5000/api/guide/guide/${decoded.id}/post`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });

        // Fetch the new post's images
        const postResponse = await axios.get(`http://localhost:5000/api/guide/guide/${decoded.id}/posts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const newPostData = postResponse.data.find(post => post.id === response.data.postId);

        setPosts([newPostData || {
          id: response.data.postId,
          title: newPost.title,
          images: newPost.images.map(image => `/posts/${image.name}`),
          caption: newPost.caption,
          location: newPost.location,
          created_at: new Date().toISOString()
        }, ...posts]);
        setNewPost({ title: '', images: [], caption: '', location: '' });
        setShowAddPost(false);
        toast.success('Post added successfully');
      } catch (error) {
        console.error('Error adding post:', error.response?.data || error.message);
        toast.error(`Failed to add post: ${error.response?.data?.error || error.message}`);
      }
    } else {
      toast.error('All fields and at least one image are required');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/guide/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Delete post response:', response.data);
      setPosts(posts.filter(post => post.id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error.response?.data || error.message);
      toast.error(`Failed to delete post: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected profile image:', file);
      setEditForm({ ...editForm, profileImage: file });
    }
  };

  const handlePostImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      console.log('Selected post images:', files);
      setNewPost({ ...newPost, images: files });
    }
  };

  const handleRemovePostImage = (index) => {
    setNewPost({
      ...newPost,
      images: newPost.images.filter((_, i) => i !== index)
    });
  };

  const handleGalleryImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected gallery image:', file);
      setNewGalleryImage(file);
    }
  };

  const handleAddGalleryImage = async () => {
    if (newGalleryImage) {
      try {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const formData = new FormData();
        formData.append('image', newGalleryImage);
        console.log('Gallery FormData:', formData.get('image'));

        const response = await axios.post(`http://localhost:5000/api/guide/guide/${decoded.id}/gallery`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });

        setGallery([{
          id: response.data.imageId,
          image: response.data.image,
          created_at: new Date().toISOString()
        }, ...gallery]);
        setNewGalleryImage(null);
        setShowAddGalleryImage(false);
        toast.success('Gallery image added successfully');
      } catch (error) {
        console.error('Error adding gallery image:', error.response?.data || error.message);
        toast.error(`Failed to add gallery image: ${error.response?.data?.error || error.message}`);
      }
    } else {
      toast.error('Please select an image');
    }
  };

  const handleDeleteGalleryImage = async (imageId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/guide/gallery/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGallery(gallery.filter(img => img.id !== imageId));
      toast.success('Gallery image deleted successfully');
    } catch (error) {
      console.error('Error deleting gallery image:', error.response?.data || error.message);
      toast.error(`Failed to delete gallery image: ${error.response?.data?.error || error.message}`);
    }
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
                  src={isEditing && editForm.profileImage instanceof File ? URL.createObjectURL(editForm.profileImage) : `http://localhost:5000${profile.profileImage}` || '/api/placeholder/400/400'}
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
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-orange-200 focus:border-orange-600 outline-none w-full"
                    />
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="text-gray-600 mb-4 w-full p-2 border border-gray-300 rounded-md focus:border-orange-600 outline-none"
                      rows="3"
                    />
                    <input
                      type="text"
                      value={editForm.country}
                      onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                      placeholder="Country"
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-600 outline-none mb-2"
                    />
                    <input
                      type="text"
                      value={editForm.language}
                      onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                      placeholder="Language"
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-600 outline-none mb-2"
                    />
                    <input
                      type="text"
                      value={editForm.experience}
                      onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                      placeholder="Experience"
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-600 outline-none mb-2"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{profile.name}</h2>
                    <p className="text-gray-600 mb-4">{profile.bio}</p>
                    <p className="text-gray-600 mb-2"><strong>Country:</strong> {profile.country}</p>
                    <p className="text-gray-600 mb-2"><strong>Language:</strong> {profile.language}</p>
                    <p className="text-gray-600 mb-4"><strong>Experience:</strong> {profile.experience}</p>
                  </>
                )}

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

                <div className="flex items-center gap-2 text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.floor(profile.rating) ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                  <span className="text-gray-600 ml-2">({profile.rating}/5 from {profile.reviews} reviews)</span>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Social Media</h3>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={editForm.facebook_url}
                        onChange={(e) => setEditForm({ ...editForm, facebook_url: e.target.value })}
                        placeholder="Facebook URL"
                        className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-600 outline-none"
                      />
                      <input
                        type="url"
                        value={editForm.instagram_url}
                        onChange={(e) => setEditForm({ ...editForm, instagram_url: e.target.value })}
                        placeholder="Instagram URL"
                        className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-600 outline-none"
                      />
                      <input
                        type="url"
                        value={editForm.tiktok_url}
                        onChange={(e) => setEditForm({ ...editForm, tiktok_url: e.target.value })}
                        placeholder="TikTok URL"
                        className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-600 outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex gap-4 text-2xl text-gray-600">
                      {profile.facebook_url && (
                        <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer">
                          <FaFacebook className="hover:text-blue-600" />
                        </a>
                      )}
                      {profile.instagram_url && (
                        <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer">
                          <FaInstagram className="hover:text-pink-500" />
                        </a>
                      )}
                      {profile.tiktok_url && (
                        <a href={profile.tiktok_url} target="_blank" rel="noopener noreferrer">
                          <FaTiktok className="hover:text-black" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

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

            {showAddPost && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Post</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="Enter post title"
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={newPost.location}
                        onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                        placeholder="Enter location"
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:border-orange-600 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images (select multiple)</label>
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
                    {newPost.images.length > 0 && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {newPost.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Post Preview ${index}`}
                              className="w-24 h-24 object-cover rounded-md"
                            />
                            <button
                              onClick={() => handleRemovePostImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-300"
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                    <textarea
                      value={newPost.caption}
                      onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
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
                      onClick={() => {
                        setShowAddPost(false);
                        setNewPost({ title: '', images: [], caption: '', location: '' });
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {post.images && post.images.map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000${image}`}
                        alt={`${post.title} ${index}`}
                        className="w-full h-24 object-cover rounded-md"
                        onError={(e) => {
                          console.error('Image load error:', image);
                          e.target.src = '/api/placeholder/400/400';
                        }}
                      />
                    ))}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{post.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <FaMapMarkerAlt className="mr-1" size={12} />
                      <span>{post.location}</span>
                    </div>
                    <p className="text-gray-600 mb-3">{post.caption}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
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

          <div className="bg-white shadow-lg rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Tour Gallery</h2>
              <button
                onClick={() => setShowAddGalleryImage(!showAddGalleryImage)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition duration-300"
              >
                <FaPlus size={16} />
                Add Gallery Image
              </button>
            </div>

            {showAddGalleryImage && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Gallery Image</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-orange-600 cursor-pointer transition duration-300">
                      <div className="text-center">
                        <FaImage className="mx-auto text-gray-400 mb-2" size={24} />
                        <p className="text-sm text-gray-600">Click to upload image</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGalleryImageUpload}
                        className="hidden"
                      />
                    </label>
                    {newGalleryImage && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(newGalleryImage)}
                          alt="Gallery Preview"
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddGalleryImage}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition duration-300"
                      disabled={!newGalleryImage}
                    >
                      Upload
                    </button>
                    <button
                      onClick={() => {
                        setShowAddGalleryImage(false);
                        setNewGalleryImage(null);
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={`http://localhost:5000${img.image}`}
                    alt={`Gallery ${img.id}`}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      console.error('Gallery image load error:', img.image);
                      e.target.src = '/api/placeholder/400/400';
                    }}
                  />
                  {isEditing && (
                    <button
                      onClick={() => handleDeleteGalleryImage(img.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-300"
                    >
                      <FaTrash size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideProfileView;