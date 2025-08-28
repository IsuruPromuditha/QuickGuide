import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = 'http://localhost:5000';

const GuideSocialMediaGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [newGroup, setNewGroup] = useState({ title: '', image: null });
  const [selectedSocials, setSelectedSocials] = useState([]);
  const [socialLinks, setSocialLinks] = useState({ Facebook: '', Twitter: '', Instagram: '', WhatsApp: '' });

  const socialMediaOptions = ['Facebook', 'Twitter', 'Instagram', 'WhatsApp'];

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const authHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Missing auth token. Please log in again.');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/socialmedia/social-groups`, {
        headers: authHeader()
      });
      setGroups(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching social groups:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to fetch social groups');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setNewGroup({ title: '', image: null });
    setSelectedSocials([]);
    setSocialLinks({ Facebook: '', Twitter: '', Instagram: '', WhatsApp: '' });
    setEditingGroup(null);
  };

  const toggleAddModal = () => {
    setIsAddModalOpen(!isAddModalOpen);
    if (!isAddModalOpen) resetModal();
  };

  const toggleEditModal = (group = null) => {
    setIsEditModalOpen(!isEditModalOpen);
    if (group) {
      setEditingGroup(group);
      setNewGroup({ title: group.title || '', image: null });
      setSelectedSocials(group.socialMedias?.map(s => s.name) || []);
      const links = { Facebook: '', Twitter: '', Instagram: '', WhatsApp: '' };
      (group.socialMedias || []).forEach(social => { links[social.name] = social.link || ''; });
      setSocialLinks(links);
    } else {
      resetModal();
    }
  };

  const handleCheckboxChange = (social) => {
    setSelectedSocials(prev => prev.includes(social) ? prev.filter(s => s !== social) : [...prev, social]);
  };

  const handleLinkChange = (social, link) => {
    setSocialLinks(prev => ({ ...prev, [social]: link }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setNewGroup(prev => ({ ...prev, image: file }));
  };

  const buildFormData = () => {
    const socialMedias = selectedSocials
      .map(social => ({ name: social, link: (socialLinks[social] || '').trim() }))
      .filter(sm => sm.link);

    const formData = new FormData();
    formData.append('title', newGroup.title.trim());
    formData.append('socialMedias', JSON.stringify(socialMedias));
    if (newGroup.image) formData.append('image', newGroup.image);
    return formData;
  };

  const handleAddGroup = async () => {
    try {
      if (!newGroup.title.trim()) return toast.error('Group title is required');
      const formData = buildFormData();

      await axios.post(`${API}/api/socialmedia/social-groups`, formData, {
        headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Social group added successfully');
      fetchGroups();
      toggleAddModal();
    } catch (error) {
      console.error('Error adding social group:', error);
      toast.error(error.response?.data?.error || 'Failed to add social group');
    }
  };

  const handleEditGroup = async () => {
    try {
      if (!newGroup.title.trim()) return toast.error('Group title is required');
      const formData = buildFormData();

      await axios.put(`${API}/api/socialmedia/social-groups/${editingGroup.id}`, formData, {
        headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Social group updated successfully');
      fetchGroups();
      toggleEditModal();
    } catch (error) {
      console.error('Error updating social group:', error);
      toast.error(error.response?.data?.error || 'Failed to update social group');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;
    try {
      await axios.delete(`${API}/api/socialmedia/social-groups/${groupId}`, {
        headers: authHeader()
      });
      toast.success('Social group deleted successfully');
      fetchGroups();
    } catch (error) {
      console.error('Error deleting social group:', error);
      toast.error(error.response?.data?.error || 'Failed to delete social group');
    }
  };

  const getSocialIcon = (name) => {
    switch (name) {
      case 'Facebook': return <FaFacebook className="text-blue-600 text-lg" />;
      case 'Twitter': return <FaTwitter className="text-blue-400 text-lg" />;
      case 'Instagram': return <FaInstagram className="text-pink-500 text-lg" />;
      case 'WhatsApp': return <FaWhatsapp className="text-green-500 text-lg" />;
      default: return null;
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 rounded-full border-primary border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading social groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-100">
      <div className="p-6 mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Social Media Groups</h1>
          <button
            onClick={toggleAddModal}
            className="bg-primary text-white px-4 py-2 rounded-full hover:bg-secondary transition-colors flex items-center gap-2 shadow-md"
          >
            <FaPlus /> Add Group
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No social groups found. Create your first group!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 relative group"
              >
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleEditModal(group)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-blue-600"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-red-600"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
                <img
                  src={group.image || 'https://placehold.co/600x400?text=Group+Image'}
                  alt={group.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-3">{group.title}</h2>
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(group.status)}`}>
                    Status: {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                  </span>
                  {group.status === 'rejected' && group.reason && (
                    <p className="text-red-600 text-sm mt-2">Reason: {group.reason}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {(group.socialMedias || []).map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-secondary transition-colors"
                    >
                      {getSocialIcon(social.name)}
                      <span className="text-sm">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Group</h2>
              <input
                type="text"
                placeholder="Group Title"
                value={newGroup.title}
                onChange={(e) => setNewGroup({ ...newGroup, title: e.target.value })}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              />
              <h3 className="text-sm font-medium mb-2 text-gray-700">Select Social Medias</h3>
              <div className="space-y-3 mb-4">
                {socialMediaOptions.map((social) => (
                  <div key={social} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedSocials.includes(social)}
                      onChange={() => handleCheckboxChange(social)}
                      className="form-checkbox h-5 w-5 text-primary rounded"
                    />
                    <label className="text-gray-700">{social}</label>
                    {selectedSocials.includes(social) && (
                      <input
                        type="url"
                        placeholder={`${social} Link (https://...)`}
                        value={socialLinks[social]}
                        onChange={(e) => handleLinkChange(social, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={toggleAddModal} className="text-red-600 hover:text-red-700 font-medium">Cancel</button>
                <button onClick={handleAddGroup} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary">Add</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Group</h2>
              <input
                type="text"
                placeholder="Group Title"
                value={newGroup.title}
                onChange={(e) => setNewGroup({ ...newGroup, title: e.target.value })}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              />
              <h3 className="text-sm font-medium mb-2 text-gray-700">Select Social Medias</h3>
              <div className="space-y-3 mb-4">
                {socialMediaOptions.map((social) => (
                  <div key={social} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedSocials.includes(social)}
                      onChange={() => handleCheckboxChange(social)}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    />
                    <label className="text-gray-700">{social}</label>
                    {selectedSocials.includes(social) && (
                      <input
                        type="url"
                        placeholder={`${social} Link (https://...)`}
                        value={socialLinks[social]}
                        onChange={(e) => handleLinkChange(social, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={toggleEditModal} className="text-red-600 hover:text-red-700 font-medium">Cancel</button>
                <button onClick={handleEditGroup} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary">Update</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideSocialMediaGroups;