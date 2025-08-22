import React from 'react';
import { FaUserShield, FaEdit, FaTrash } from 'react-icons/fa';
import AdminHeader from '../components/AdminHeader';

const AdminManageGuides = () => {
  const guides = [
    { id: 1, name: 'Kasun Munasinghe', location: 'Kandy', status: 'Active' },
    { id: 2, name: 'Nimal Perera', location: 'Colombo', status: 'Pending' },
    { id: 3, name: 'Samanthi Silva', location: 'Galle', status: 'Active' },
  ];

  return (
    <div className="min-h-screen bg-neutralBg">
      <AdminHeader />
      <div className="p-6 lg:ml-64">
        <h1 className="text-3xl font-bold mb-6 text-primary">Manage Guides</h1>
        <div className="bg-white p-6 rounded-lg shadow-travel-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-travelBlue">Tour Guides</h2>
            <button className="bg-travelBlue text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2">
              <FaUserShield className="text-xl" /> Add New Guide
            </button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-secondary bg-accent">
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Location</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guides.map((guide) => (
                <tr key={guide.id} className="border-t border-accent hover:bg-accent transition-colors duration-300">
                  <td className="p-3 text-gray-800">{guide.name}</td>
                  <td className="p-3 text-gray-800">{guide.location}</td>
                  <td className="p-3">
                    <span
                      className={
                        guide.status === 'Active' ? 'text-travelGreen' : 'text-yellow-500'
                      }
                    >
                      {guide.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button className="text-travelBlue hover:text-primary">
                      <FaEdit className="text-lg" />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManageGuides;