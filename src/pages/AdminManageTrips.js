import React from 'react';
import { FaRoute, FaEdit, FaTrash } from 'react-icons/fa';
import AdminHeader from '../components/AdminHeader';

const AdminManageTrips = () => {
  const trips = [
    { id: 1, title: 'Kandy Cultural Tour', guide: 'Kasun Munasinghe', date: '2025-09-01', status: 'Scheduled' },
    { id: 2, title: 'Colombo City Adventure', guide: 'Nimal Perera', date: '2025-09-05', status: 'Completed' },
    { id: 3, title: 'Galle Coastal Escape', guide: 'Samanthi Silva', date: '2025-09-10', status: 'Pending' },
  ];

  return (
    <div className="min-h-screen bg-neutralBg">
      <AdminHeader />
      <div className="p-6 lg:ml-64">
        <h1 className="text-3xl font-bold mb-6 text-primary">Manage Trips</h1>
        <div className="bg-white p-6 rounded-lg shadow-travel-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-travelBlue">Trip Details</h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-secondary bg-accent">
                <th className="p-3 font-semibold">Trip Title</th>
                <th className="p-3 font-semibold">Guide</th>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-t border-accent hover:bg-accent transition-colors duration-300">
                  <td className="p-3 text-gray-800">{trip.title}</td>
                  <td className="p-3 text-gray-800">{trip.guide}</td>
                  <td className="p-3 text-gray-800">{trip.date}</td>
                  <td className="p-3">
                    <span
                      className={
                        trip.status === 'Scheduled'
                          ? 'text-primary'
                          : trip.status === 'Completed'
                          ? 'text-travelGreen'
                          : 'text-yellow-500'
                      }
                    >
                      {trip.status}
                    </span>
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

export default AdminManageTrips;