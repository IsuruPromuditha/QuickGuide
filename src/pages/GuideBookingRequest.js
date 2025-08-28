import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, MapPin, Users, Car, Tag, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import socketIOClient from 'socket.io-client';

const SOCKET_SERVER = 'http://localhost:5000';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error, errorInfo) => {
      console.error('Map ErrorBoundary caught:', error, errorInfo);
      setHasError(true);
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return <div className="text-red-500 text-center p-4">Error rendering map. Please try again.</div>;
  }
  return children;
};

const BookingMap = ({ booking, touristLocation, guideLocation }) => {
  const mapRef = useRef(null);
  const directionsRenderer = useRef(null);

  const isValidLocation = (loc) => loc && Number.isFinite(loc.lat) && Number.isFinite(loc.lng);

  useEffect(() => {
    if (mapRef.current && isValidLocation(guideLocation) && isValidLocation(touristLocation)) {
      if (directionsRenderer.current) {
        directionsRenderer.current.setMap(null);
      }

      const directionsService = new window.google.maps.DirectionsService();
      const renderer = new window.google.maps.DirectionsRenderer({
        map: mapRef.current,
        suppressMarkers: true,
      });

      directionsService.route(
        {
          origin: guideLocation,
          destination: touristLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            renderer.setDirections(result);
            directionsRenderer.current = renderer;
          } else {
            console.error('Directions request failed:', status);
            toast.error('Failed to load directions.', { position: 'top-right', autoClose: 5000 });
          }
        }
      );

      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(guideLocation);
      bounds.extend(touristLocation);
      mapRef.current.fitBounds(bounds);
    }
  }, [guideLocation, touristLocation]);

  if (!isValidLocation(guideLocation) || !isValidLocation(touristLocation)) {
    return <div className="text-gray-500 text-center p-4">Waiting for location data...</div>;
  }

  return (
    <Map
      style={{ width: '100%', height: '300px' }}
      defaultZoom={12}
      defaultCenter={guideLocation}
      mapId="bea008e60f890fd9160a10a0"
      ref={mapRef}
    >
      <AdvancedMarker position={guideLocation}>
        <div style={{ background: 'green', color: 'white', padding: '5px', borderRadius: '3px' }}>
          You (Guide)
        </div>
      </AdvancedMarker>
      <AdvancedMarker position={touristLocation}>
        <div style={{ background: 'blue', color: 'white', padding: '5px', borderRadius: '3px' }}>
          Tourist: {booking.tourist_name || 'Unknown'}
        </div>
      </AdvancedMarker>
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
  const lastUpdateRef = useRef({});

  const isValidLocation = (loc) => loc && Number.isFinite(loc.lat) && Number.isFinite(loc.lng);

  const parseDestinations = (destinations) => {
    if (Array.isArray(destinations)) {
      return destinations.join(', ');
    }
    if (typeof destinations === 'string') {
      try {
        const parsed = JSON.parse(destinations);
        if (Array.isArray(parsed)) {
          return parsed.join(', ');
        }
      } catch (e) {
        console.error('Error parsing destinations:', e);
      }
    }
    return 'Not specified';
  };

  const fetchLocations = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/booking/locations/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { guide, tourist } = response.data;
      if (isValidLocation({ lat: guide.latitude, lng: guide.longitude }) &&
          isValidLocation({ lat: tourist.latitude, lng: tourist.longitude })) {
        console.log(`Fetched locations for booking ${bookingId}:`, response.data);
        setGuideLocation({ lat: guide.latitude, lng: guide.longitude });
        setTouristLocations((prev) => ({
          ...prev,
          [bookingId]: { lat: tourist.latitude, lng: tourist.longitude },
        }));
      } else {
        console.warn(`Invalid location data for booking ${bookingId}:`, response.data);
        setGuideLocation({ lat: 7.8731, lng: 80.7718 });
        setTouristLocations((prev) => ({
          ...prev,
          [bookingId]: { lat: 7.8731, lng: 80.7718 },
        }));
      }
    } catch (error) {
      console.error(`Error fetching locations for booking ${bookingId}:`, error.message);
      toast.error('Failed to fetch locations.', { position: 'top-right', autoClose: 5000 });
      setGuideLocation({ lat: 7.8731, lng: 80.7718 });
      setTouristLocations((prev) => ({
        ...prev,
        [bookingId]: { lat: 7.8731, lng: 80.7718 },
      }));
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view bookings.');
          setLoading(false);
          toast.error('Please log in to view bookings.', { position: 'top-right', autoClose: 5000 });
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/booking/guide?status=${filterStatus}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings(response.data);
        setLoading(false);

        response.data.forEach((booking) => {
          if (booking.status === 'confirmed') {
            fetchLocations(booking.id);
          }
        });
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError(error.response?.data?.error || 'Failed to fetch bookings.');
        setLoading(false);
        toast.error(error.response?.data?.error || 'Failed to fetch bookings.', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    };

    fetchBookings();
  }, [filterStatus]);

  useEffect(() => {
    const apiKey = 'AIzaSyCTkmhSytYSA7BKiczUFWeFIULe-onuHn0';
    if (!apiKey) {
      setError('Google Maps API key is missing.');
      setLoading(false);
      toast.error('Google Maps configuration error.', { position: 'top-right', autoClose: 5000 });
      return;
    }

    const socket = socketIOClient(SOCKET_SERVER, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(socket);

    socket.on('connect', () => {
      console.log('Socket.IO connected:', socket.id);
      bookings.forEach((booking) => {
        if (booking.status === 'confirmed') {
          socket.emit('joinBooking', booking.id);
          fetchLocations(booking.id);
        }
      });
    });

    socket.on('reconnect', () => {
      console.log('Socket.IO reconnected');
      bookings.forEach((booking) => {
        if (booking.status === 'confirmed') {
          socket.emit('joinBooking', booking.id);
          fetchLocations(booking.id);
        }
      });
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
      toast.error('Failed to connect to real-time server.', { position: 'top-right', autoClose: 5000 });
    });

    socket.on('locationUpdate', ({ bookingId, role, latitude, longitude }) => {
      if (isValidLocation({ lat: latitude, lng: longitude })) {
        const updateKey = `${bookingId}-${role}`;
        const lastUpdate = lastUpdateRef.current[updateKey] || 0;
        if (Date.now() - lastUpdate < 1000) {
          console.log(`Skipping duplicate location update for ${role} in booking ${bookingId}`);
          return;
        }
        lastUpdateRef.current[updateKey] = Date.now();

        console.log(`Received location update for ${role} in booking ${bookingId}: ${latitude}, ${longitude}`);
        if (role === 'tourist') {
          setTouristLocations((prev) => ({
            ...prev,
            [bookingId]: { lat: latitude, lng: longitude },
          }));
        } else if (role === 'guide') {
          setGuideLocation({ lat: latitude, lng: longitude });
        }
        fetchLocations(bookingId); // Re-fetch to ensure consistency
      }
    });

    socket.on('bookingStatusUpdate', async ({ bookingId, status, locations }) => {
      if (status === 'confirmed') {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
        );
        if (locations && isValidLocation({ lat: locations.guide.latitude, lng: locations.guide.longitude }) &&
            isValidLocation({ lat: locations.tourist.latitude, lng: locations.tourist.longitude })) {
          setGuideLocation({ lat: locations.guide.latitude, lng: locations.guide.longitude });
          setTouristLocations((prev) => ({
            ...prev,
            [bookingId]: { lat: locations.tourist.latitude, lng: locations.tourist.longitude },
          }));
        }
        await fetchLocations(bookingId);
      }
    });

    return () => socket.disconnect();
  }, [bookings]);

  useEffect(() => {
    if (socket && bookings.some((booking) => booking.status === 'confirmed')) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (isValidLocation({ lat: latitude, lng: longitude })) {
            bookings.forEach((booking) => {
              if (booking.status === 'confirmed') {
                const updateKey = `${booking.id}-guide`;
                const lastUpdate = lastUpdateRef.current[updateKey] || 0;
                if (Date.now() - lastUpdate < 1000) {
                  console.log(`Skipping duplicate geolocation update for booking ${booking.id}`);
                  return;
                }
                lastUpdateRef.current[updateKey] = Date.now();

                socket.emit('updateLocation', {
                  bookingId: booking.id,
                  role: 'guide',
                  latitude,
                  longitude,
                });
                fetchLocations(booking.id); // Re-fetch to ensure server consistency
              }
            });
            setGuideLocation({ lat: latitude, lng: longitude });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to retrieve location. Using default coordinates.', {
            position: 'top-right',
            autoClose: 5000,
          });
          setGuideLocation({ lat: 7.8731, lng: 80.7718 });
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [socket, bookings]);

  const handleAccept = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
      });
      const { latitude, longitude } = position.coords;

      if (!isValidLocation({ lat: latitude, lng: longitude })) {
        toast.error('Invalid guide location.', { position: 'top-right', autoClose: 5000 });
        return;
      }

      await axios.patch(
        `http://localhost:5000/api/booking/update/${bookingId}`,
        { status: 'confirmed', guideLatitude: latitude, guideLongitude: longitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'confirmed' } : b))
      );
      fetchLocations(bookingId);
      toast.success('Booking accepted successfully!', { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      console.error('Error accepting booking:', error);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'completed' } : b))
      );
      toast.success('Booking marked as completed!', { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      console.error('Error completing booking:', error);
      toast.error(error.response?.data?.error || 'Failed to complete booking.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  const handleDecline = async () => {
    if (!declineReason.trim()) {
      toast.error('Please provide a reason for declining.', { position: 'top-right', autoClose: 3000 });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/booking/update/${selectedBookingId}`,
        { status: 'cancelled', decline_reason: declineReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings((prev) =>
        prev.map((b) => (b.id === selectedBookingId ? { ...b, status: 'cancelled', decline_reason: declineReason } : b))
      );
      setDeclineModalOpen(false);
      setDeclineReason('');
      toast.success('Booking declined successfully.', { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      console.error('Error declining booking:', error);
      toast.error(error.response?.data?.error || 'Failed to decline booking.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  const openDeclineModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setDeclineModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-100">
      <ToastContainer />
      <div className="p-6 mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-primary">Booking Requests</h1>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-travelBlue">Filter Bookings</h2>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-700 shadow-sm"
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
                    <div
                      className="px-3 py-1 rounded-full text-sm font-medium capitalize"
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
                      }}
                    >
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
                      <ErrorBoundary>
                        <div className="mt-4">
                          <h3 className="text-md font-semibold mb-2 text-slate-900">Live Locations & Directions</h3>
                          <BookingMap
                            booking={booking}
                            touristLocation={touristLocations[booking.id]}
                            guideLocation={guideLocation}
                          />
                        </div>
                      </ErrorBoundary>
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