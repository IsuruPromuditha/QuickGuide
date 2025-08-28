// GuideBookingRequest.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, MapPin, Users, Car, Tag, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import socketIOClient from 'socket.io-client';

const SOCKET_SERVER = 'http://localhost:5000';

const BookingMap = ({ booking, touristLocation, guideLocation }) => {
  const mapRef = useRef(null);
  const directionsRenderer = useRef(null);

  useEffect(() => {
    if (mapRef.current && guideLocation && touristLocation) {
      // Cleanup previous renderer
      if (directionsRenderer.current) {
        directionsRenderer.current.setMap(null);
      }

      const directionsService = new window.google.maps.DirectionsService();
      const renderer = new window.google.maps.DirectionsRenderer({
        map: mapRef.current,
        suppressMarkers: true, // Avoid duplicating markers
      });

      directionsService.route(
        {
          origin: guideLocation, // From guide to tourist
          destination: touristLocation,
          travelMode: window.google.maps.TravelMode.DRIVING, // Adjust as needed (e.g., WALKING)
        },
        (result, status) => {
          if (status === 'OK') {
            renderer.setDirections(result);
            directionsRenderer.current = renderer;
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );
    }

    return () => {
      if (directionsRenderer.current) {
        directionsRenderer.current.setMap(null);
      }
    };
  }, [guideLocation, touristLocation]);

  return (
    <Map
      style={{ width: '100%', height: '300px' }}
      defaultZoom={12}
      defaultCenter={touristLocation || guideLocation || { lat: 7.8731, lng: 80.7718 }}
      mapId="bea008e60f890fd9160a10a0" 
      ref={mapRef}
    >
      {touristLocation && (
        <AdvancedMarker position={touristLocation}>
          <div style={{ background: 'blue', color: 'white', padding: '5px', borderRadius: '3px' }}>
            Tourist: {booking.tourist_name || 'Unknown'}
          </div>
        </AdvancedMarker>
      )}
      {guideLocation && (
        <AdvancedMarker position={guideLocation}>
          <div style={{ background: 'green', color: 'white', padding: '5px', borderRadius: '3px' }}>
            You (Guide)
          </div>
        </AdvancedMarker>
      )}
    </Map>
  );
};

const GuideBookingRequest = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [touristLocations, setTouristLocations] = useState({});
  const [guideLocation, setGuideLocation] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const apiKey = 'AIzaSyCTkmhSytYSA7BKiczUFWeFIULe-onuHn0'; 
    const mapId = 'bea008e60f890fd9160a10a0'; 
    if (!apiKey) {
      console.error('Google Maps API key is missing.');
      setError('Google Maps API key is missing');
      setLoading(false);
      toast.error('Google Maps API key is missing.', {
        position: 'top-right',
        autoClose: 5000,
      });
      return;
    }
    if (!mapId) {
      console.error('Google Maps Map ID is missing.');
      setError('Google Maps Map ID is missing');
      setLoading(false);
      toast.error('Google Maps Map ID is missing.', {
        position: 'top-right',
        autoClose: 5000,
      });
      return;
    }

    const socket = socketIOClient(SOCKET_SERVER, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
    setSocket(socket);

    socket.on('connect', () => {
      console.log('Socket.IO connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
      toast.error('Failed to connect to real-time server. Location updates may not work.', {
        position: 'top-right',
        autoClose: 5000,
      });
    });

    socket.on('locationUpdate', ({ bookingId, role, latitude, longitude }) => {
      if (typeof latitude === 'number' && typeof longitude === 'number') {
        if (role === 'tourist') {
          setTouristLocations((prev) => ({
            ...prev,
            [bookingId]: { lat: latitude, lng: longitude },
          }));
        } else if (role === 'guide') {
          setGuideLocation({ lat: latitude, lng: longitude });
        }
      } else {
        console.error('Invalid location data received:', { bookingId, role, latitude, longitude });
      }
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (socket) {
      bookings.forEach((booking) => {
        if (booking.status === 'confirmed') {
          socket.emit('joinBooking', booking.id);
        }
      });
    }
  }, [socket, bookings]);

  useEffect(() => {
    if (socket && bookings.some((booking) => booking.status === 'confirmed')) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          bookings.forEach((booking) => {
            if (booking.status === 'confirmed') {
              socket.emit('updateLocation', {
                bookingId: booking.id,
                role: 'guide',
                latitude,
                longitude,
              });
            }
          });
          setGuideLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to retrieve location. Please ensure location services are enabled.', {
            position: 'top-right',
            autoClose: 5000,
          });
          setGuideLocation({ lat: 7.8731, lng: 80.7718 }); // Fallback location
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [socket, bookings]);

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

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: 'confirmed' } : b
        )
      );
      if (socket) {
        socket.emit('joinBooking', bookingId);
      }
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

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: 'completed' } : b
        )
      );
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

      setBookings((prev) =>
        prev.filter((booking) => booking.id !== selectedBookingId)
      );
      setDeclineModalOpen(false);
      setDeclineReason('');
      toast.success(`Booking ${selectedBookingId} declined`, {
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
    try {
      if (Array.isArray(destinations)) {
        return destinations.join(', ');
      } else if (typeof destinations === 'string') {
        return JSON.parse(destinations).join(', ');
      }
      return 'Not specified';
    } catch {
      return 'Not specified';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Booking Requests</h1>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-700 shadow-sm"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-slate-100">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No bookings found</h3>
            <p className="text-slate-500">There are no {filterStatus} bookings at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Tag className="w-4 h-4 text-indigo-600" />
                        <h2 className="text-xl font-bold text-slate-900">{booking.category || 'Custom Tour'}</h2>
                      </div>
                      <div className="text-sm text-slate-500">Booking #{booking.id.toString().padStart(4, '0')}</div>
                    </div>
                    <div className="px-3 py-1 rounded-full text-sm font-medium capitalize"
                         style={{
                           backgroundColor: {
                             pending: '#EFF6FF',
                             confirmed: '#ECFDF5',
                             completed: '#F3F4F6',
                             cancelled: '#FEF2F2',
                           }[booking.status],
                           color: {
                             pending: '#1D4ED8',
                             confirmed: '#065F46',
                             completed: '#4B5563',
                             cancelled: '#B91C1C',
                           }[booking.status],
                         }}>
                      {booking.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-sm font-medium text-slate-500 mb-1">Tourist</div>
                      <div className="font-medium text-slate-900">{booking.tourist_name || 'Anonymous'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-500 mb-1">Vehicle</div>
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-slate-600" />
                        <span className="font-medium text-slate-900">{booking.vehicle || 'Not specified'}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-500 mb-1">Passengers</div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-600" />
                        <span className="font-medium text-slate-900">{booking.passenger_count}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-500 mb-1">Requested On</div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-600" />
                        <span className="font-medium text-slate-900">
                          {new Date(booking.created_at).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

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

                  {booking.status === 'confirmed' && (
                    <APIProvider apiKey="AIzaSyCTkmhSytYSA7BKiczUFWeFIULe-onuHn0" libraries={['places']}>
                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-2 text-slate-900">Live Locations & Directions</h3>
                        <BookingMap
                          booking={booking}
                          touristLocation={touristLocations[booking.id]}
                          guideLocation={guideLocation}
                        />
                      </div>
                    </APIProvider>
                  )}

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
            ))}
          </div>
        )}

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