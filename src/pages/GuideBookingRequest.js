import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GuideBookingRequest = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view bookings.');
          setLoading(false);
          toast.error('Please log in to view bookings.', {
            position: 'top-right',
            autoClose: 5000,
          });
          return;
        }

        const response = await axios.get('http://localhost:5000/api/booking/guide', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            status: filterStatus,
          },
        });

        console.log('Raw bookings data:', response.data); // Debug log
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to fetch bookings.');
        toast.error(err.response?.data?.error || 'Failed to fetch bookings.', {
          position: 'top-right',
          autoClose: 5000,
        });
        setLoading(false);
      }
    };

    fetchBookings();
  }, [filterStatus]);

  const handleAccept = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/booking/update/${bookingId}`,
        { status: 'confirmed' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(bookings.filter((booking) => booking.id !== bookingId));
      toast.success(`Booking ${bookingId} confirmed`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error accepting booking:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to accept booking.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/booking/update/${bookingId}`,
        { status: 'completed' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(bookings.filter((booking) => booking.id !== bookingId));
      toast.success(`Booking ${bookingId} marked as completed`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error completing booking:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to complete booking.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  const openDeclineModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setDeclineModalOpen(true);
  };

  const handleDecline = async () => {
    if (!declineReason.trim()) {
      toast.error('Please provide a reason for declining the booking.', {
        position: 'top-right',
        autoClose: 4000,
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/booking/update/${selectedBookingId}`,
        { status: 'cancelled', decline_reason: declineReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(bookings.filter((booking) => booking.id !== selectedBookingId));
      setDeclineModalOpen(false);
      setDeclineReason('');
      toast.error(`Booking ${selectedBookingId} declined`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error declining booking:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to decline booking.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  const parseDestinations = (destinations) => {
    console.log('Received destinations:', destinations, typeof destinations); // Debug log
    if (
      Array.isArray(destinations) &&
      destinations.length > 0 &&
      destinations.every(dest => typeof dest === 'string' && dest.trim())
    ) {
      console.log('Parsed destinations:', destinations.join(', '));
      return destinations.join(', ');
    }
    console.error(`Invalid or empty destinations format: ${JSON.stringify(destinations)}`);
    return 'No valid destinations';
  };

  // Map booking status to Tailwind background color classes
  const getStatusBgColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50';
      case 'confirmed':
        return 'bg-green-50';
      case 'completed':
        return 'bg-blue-50';
      case 'cancelled':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl font-semibold text-gray-700 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer autoClose={5000} hideProgressBar={false} closeOnClick pauseOnClick pauseOnHover />
      <div className="container mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Bookings</h2>
          <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Declined</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>
        {bookings.length === 0 ? (
          <p className="text-lg text-gray-500 text-center mb-4">No bookings found for selected status</p>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className={`${getStatusBgColor(booking.status)} p-4 md:p-6 rounded-lg shadow-md border border-gray-200`}
              >
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                  Booking ID: #{booking.id}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <p className="text-gray-600">
                    <strong>Tourist:</strong> {booking.tourist_name || 'Unknown'}
                  </p>
                  <p className="text-gray-600">
                    <strong>Start Location:</strong> {booking.start_location || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <strong>Destinations:</strong> {parseDestinations(booking.destinations)}
                  </p>
                  <p className="text-gray-600">
                    <strong>Vehicle:</strong> {booking.vehicle || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <strong>Category:</strong> {booking.category || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <strong>Passengers:</strong> {booking.passenger_count || '0'}
                  </p>
                  <p className="text-gray-600">
                    <strong>Status:</strong>{' '}
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Unknown'}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    <strong>Created:</strong>{' '}
                    {new Date(booking.created_at).toLocaleDateString()}
                  </p>
                </div>
                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAccept(booking.id)}
                          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => openDeclineModal(booking.id)}
                          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleComplete(booking.id)}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {declineModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-4 md:p-6 max-w-md w-full mx-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-1">
              Decline Booking ID #{selectedBookingId}
            </h3>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Enter reason for cancellation"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => handleDecline()}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setDeclineModalOpen(false);
                  setDeclineReason('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideBookingRequest;