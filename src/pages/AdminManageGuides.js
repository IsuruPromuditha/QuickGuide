import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';

const AdminManageGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [formData, setFormData] = useState({
    status: 'Pending'
  });

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/adminManageGuides', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch guides');
      }
      const data = await response.json();
      setGuides(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/adminManageGuides/${selectedGuide.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: formData.status })
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      await fetchGuides();
      setIsModalOpen(false);
      setSelectedGuide(null);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/adminManageGuides/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      await fetchGuides();
    } catch (err) {
      setError(err.message);
    }
  };

  const openModal = (guide) => {
    setSelectedGuide(guide);
    setFormData({
      status: guide.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      status: 'Pending'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="p-6 lg:ml-64">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Manage Guides</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-blue-600">Tour Guides</h2>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-blue-600 bg-blue-100">
                    <th className="p-3 font-semibold">Name</th>
                    <th className="p-3 font-semibold">Email</th>
                    <th className="p-3 font-semibold">Contact</th>
                    <th className="p-3 font-semibold">Location</th>
                    <th className="p-3 font-semibold">Languages</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {guides.map((guide) => (
                    <tr key={guide.id} className="border-t border-blue-100 hover:bg-blue-50 transition-colors duration-300">
                      <td className="p-3 text-gray-800">
                        <Link 
                          to={`/tourist-guideprofileview/${guide.id}`}
                          className="text-blue-600 hover:underline"
                          title="View Profile"
                        >
                          {guide.name}
                        </Link>
                      </td>
                      <td className="p-3 text-gray-800">{guide.email}</td>
                      <td className="p-3 text-gray-800">{guide.contact}</td>
                      <td className="p-3 text-gray-800">{guide.location}</td>
                      <td className="p-3 text-gray-800">{guide.language || '-'}</td>
                      <td className="p-3">
                        <span className={
                          guide.status === 'Active' ? 'text-green-500' :
                          guide.status === 'Inactive' ? 'text-red-500' : 'text-yellow-500'
                        }>
                          {guide.status}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button 
                          onClick={() => openModal(guide)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit Status"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        {guide.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(guide.id, 'Active')}
                              className="text-green-500 hover:text-green-700"
                              title="Approve"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleStatusChange(guide.id, 'Inactive')}
                              className="text-red-500 hover:text-red-700"
                              title="Decline"
                            >
                              Decline
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for Edit Status */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4">Edit Guide Status</h2>
              <form onSubmit={handleUpdateStatus}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageGuides;