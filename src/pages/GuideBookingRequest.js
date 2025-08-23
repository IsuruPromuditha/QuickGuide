import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, MapPin, Users, Car, Tag, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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

        console.log('Raw bookings data:', response.data);
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
    console.log('Received destinations:', destinations, typeof destinations);
    if (
      Array.isArray(destinations) &&
      destinations.length > 0 &&
      destinations.every((dest) => typeof dest === 'string' && dest.trim())
    ) {
      console.log('Parsed destinations:', destinations.join(' → '));
      return destinations.join(' → ');
    }
    console.error(`Invalid or empty destinations format: ${JSON.stringify(destinations)}`);
    return 'No destinations specified';
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: AlertCircle,
        iconColor: 'text-amber-600',
      },
      confirmed: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: CheckCircle,
        iconColor: 'text-emerald-600',
      },
      completed: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: CheckCircle,
        iconColor: 'text-blue-600',
      },
      cancelled: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        badge: 'bg-red-100 text-red-800 border-red-300',
        icon: XCircle,
        iconColor: 'text-red-600',
      },
    };
    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-slate-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
            <h2 className="text-xl font-semibold text-slate-800">Error</h2>
          </div>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer autoClose={5000} hideProgressBar={false} closeOnClick pauseOnClick pauseOnHover />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="px-6 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Management</h1>
                <p className="text-slate-600">Manage your tour bookings and requests</p>
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor="statusFilter" className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  Filter by Status:
                </label>
                <select
                  id="statusFilter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Declined</option>
                  <option value="all">All Status</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Grid */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No bookings found</h3>
            <p className="text-slate-600">There are no bookings matching the selected status.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:gap-8">
            {bookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={booking.id}
                  className={`bg-white rounded-2xl shadow-sm border-2 ${statusConfig.border} hover:shadow-md transition-all duration-300 overflow-hidden`}
                >
                  {/* Card Header */}
                  <div className={`${statusConfig.bg} px-6 py-4 border-b ${statusConfig.border}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white shadow-sm">
                          <StatusIcon className={`w-5 h-5 ${statusConfig.iconColor}`} />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">
                            Booking #{booking.id.toString().padStart(4, '0')}
                          </h2>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-600">
                              Created{' '}
                              {new Date(booking.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border ${statusConfig.badge}`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        {booking.total_amount && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-slate-900">${booking.total_amount}</div>
                            <div className="text-xs text-slate-500">Total Amount</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Main Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      {/* Tourist Info */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-500 mb-1">Tourist</div>
                          <div className="font-semibold text-slate-900">{booking.tourist_name || 'Unknown'}</div>
                        </div>
                      </div>

                      {/* Passengers */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-500 mb-1">Passengers</div>
                          <div className="font-semibold text-slate-900">{booking.passenger_count || 0} people</div>
                        </div>
                      </div>

                      {/* Vehicle */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Car className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-500 mb-1">Vehicle</div>
                          <div className="font-semibold text-slate-900">{booking.vehicle || 'Not specified'}</div>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Tag className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-500 mb-1">Category</div>
                          <div className="font-semibold text-slate-900">{booking.category || 'General Tour'}</div>
                        </div>
                      </div>

                      {/* Duration */}
                      {booking.duration && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <Clock className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-500 mb-1">Duration</div>
                            <div className="font-semibold text-slate-900">{booking.duration}</div>
                          </div>
                        </div>
                      )}

                      {/* Booking Date */}
                      {booking.booking_date && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-teal-100 rounded-lg">
                            <Calendar className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-500 mb-1">Tour Date</div>
                            <div className="font-semibold text-slate-900">
                              {new Date(booking.booking_date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Locations Section */}
                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-5 h-5 text-slate-600" />
                        <h3 className="font-semibold text-slate-900">Tour Route</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium text-slate-500 mb-1">Starting Point</div>
                          <div className="font-medium text-slate-900">{booking.start_location || 'Not specified'}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-500 mb-1">Destinations</div>
                          <div className="font-medium text-slate-900">{parseDestinations(booking.destinations)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAccept(booking.id)}
                              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-200 shadow-sm"
                            >
                              <CheckCircle className="w-5 h-5" />
                              Accept Booking
                            </button>
                            <button
                              onClick={() => openDeclineModal(booking.id)}
                              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-red-300 text-red-700 font-semibold rounded-xl hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-200 shadow-sm"
                            >
                              <XCircle className="w-5 h-5" />
                              Decline
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleComplete(booking.id)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-sm"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Mark as Completed
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Decline Modal */}
        {declineModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Decline Booking</h3>
                    <p className="text-sm text-slate-600">Booking #{selectedBookingId?.toString().padStart(4, '0')}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reason for declining <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Please provide a clear reason for declining this booking..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
                    rows="4"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleDecline}
                    className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-200"
                  >
                    Confirm Decline
                  </button>
                  <button
                    onClick={() => {
                      setDeclineModalOpen(false);
                      setDeclineReason('');
                    }}
                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideBookingRequest;