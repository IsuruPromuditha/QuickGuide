import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRoute, FaMapMarkerAlt } from 'react-icons/fa';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const TouristTrips = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [currentTrip, setCurrentTrip] = useState(null);
  const [tripHistory, setTripHistory] = useState([]);
  const [guideLocation, setGuideLocation] = useState(null);
  const [touristLocation, setTouristLocation] = useState(null);
  const [socket, setSocket] = useState(null);
  const mapRef = useRef(null);
  const directionsRenderer = useRef(null);
  const navigate = useNavigate();
  const lastUpdateRef = useRef({});

  const isValidLocation = (loc) => loc && Number.isFinite(loc.lat) && Number.isFinite(loc.lng);

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
        setTouristLocation({ lat: tourist.latitude, lng: tourist.longitude });
      } else {
        console.warn(`Invalid location data for booking ${bookingId}:`, response.data);
        setGuideLocation({ lat: 7.8731, lng: 80.7718 });
        setTouristLocation({ lat: 7.8731, lng: 80.7718 });
      }
    } catch (error) {
      console.error(`Error fetching locations for booking ${bookingId}:`, error.message);
      toast.error('Failed to fetch locations.', { position: 'top-right', autoClose: 5000 });
      setGuideLocation({ lat: 7.8731, lng: 80.7718 });
      setTouristLocation({ lat: 7.8731, lng: 80.7718 });
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please log in to view trips.', { position: 'top-right', autoClose: 5000 });
          return;
        }

        const response = await axios.get('http://localhost:5000/api/booking/tourist', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const bookings = response.data;
        const confirmedBooking = bookings.find((booking) => booking.status === 'confirmed');
        setCurrentTrip(confirmedBooking || null);

        if (confirmedBooking) {
          await fetchLocations(confirmedBooking.id);
        }

        const completedBookings = bookings.filter((booking) => booking.status === 'completed');
        setTripHistory(completedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error.response?.data || error.message);
        toast.error(error.response?.data?.error || 'Failed to fetch trips.', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const apiKey = 'AIzaSyCTkmhSytYSA7BKiczUFWeFIULe-onuHn0';
    if (!apiKey) {
      toast.error('Google Maps API key is missing.', { position: 'top-right', autoClose: 5000 });
      return;
    }

    const newSocket = socketIOClient(SOCKET_SERVER, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket.IO connected:', newSocket.id);
      if (currentTrip?.status === 'confirmed') {
        newSocket.emit('joinBooking', currentTrip.id);
        fetchLocations(currentTrip.id);
      }
    });

    newSocket.on('reconnect', () => {
      console.log('Socket.IO reconnected');
      if (currentTrip?.status === 'confirmed') {
        newSocket.emit('joinBooking', currentTrip.id);
        fetchLocations(currentTrip.id);
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
      toast.error('Failed to connect to real-time server.', { position: 'top-right', autoClose: 5000 });
    });

    newSocket.on('locationUpdate', ({ bookingId, role, latitude, longitude }) => {
      if (currentTrip && bookingId === currentTrip.id && isValidLocation({ lat: latitude, lng: longitude })) {
        const updateKey = `${bookingId}-${role}`;
        const lastUpdate = lastUpdateRef.current[updateKey] || 0;
        if (Date.now() - lastUpdate < 1000) {
          console.log(`Skipping duplicate location update for ${role} in booking ${bookingId}`);
          return;
        }
        lastUpdateRef.current[updateKey] = Date.now();

        console.log(`Received location update for ${role} in booking ${bookingId}: ${latitude}, ${longitude}`);
        if (role === 'guide') {
          setGuideLocation({ lat: latitude, lng: longitude });
        } else if (role === 'tourist') {
          setTouristLocation({ lat: latitude, lng: longitude });
        }
        fetchLocations(bookingId); // Re-fetch to ensure consistency
      }
    });

    newSocket.on('bookingStatusUpdate', async ({ bookingId, status, locations }) => {
      if (status === 'confirmed' && currentTrip?.id === bookingId) {
        setCurrentTrip((prev) => ({ ...prev, status }));
        if (locations && isValidLocation({ lat: locations.guide.latitude, lng: locations.guide.longitude }) &&
            isValidLocation({ lat: locations.tourist.latitude, lng: locations.tourist.longitude })) {
          setGuideLocation({ lat: locations.guide.latitude, lng: locations.guide.longitude });
          setTouristLocation({ lat: locations.tourist.latitude, lng: locations.tourist.longitude });
        }
        await fetchLocations(bookingId);
        toast.success(`Booking ${bookingId} has been confirmed!`, { position: 'top-right', autoClose: 3000 });
      }
    });

    newSocket.on('requestTouristLocation', ({ bookingId }) => {
      if (currentTrip && bookingId === currentTrip.id) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            if (isValidLocation({ lat: latitude, lng: longitude })) {
              const updateKey = `${bookingId}-tourist`;
              const lastUpdate = lastUpdateRef.current[updateKey] || 0;
              if (Date.now() - lastUpdate < 1000) {
                console.log(`Skipping duplicate tourist location request for booking ${bookingId}`);
                return;
              }
              lastUpdateRef.current[updateKey] = Date.now();

              newSocket.emit('updateLocation', { bookingId, role: 'tourist', latitude, longitude });
              setTouristLocation({ lat: latitude, lng: longitude });
              fetchLocations(bookingId); // Re-fetch to ensure server consistency
            }
          },
          (error) => {
            console.error('Geolocation error:', error);
            toast.error('Unable to retrieve location. Using default coordinates.', {
              position: 'top-right',
              autoClose: 5000,
            });
            setTouristLocation({ lat: 7.8731, lng: 80.7718 });
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentTrip]);

  useEffect(() => {
    if (socket && currentTrip?.status === 'confirmed') {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (isValidLocation({ lat: latitude, lng: longitude })) {
            const updateKey = `${currentTrip.id}-tourist`;
            const lastUpdate = lastUpdateRef.current[updateKey] || 0;
            if (Date.now() - lastUpdate < 1000) {
              console.log(`Skipping duplicate geolocation update for booking ${currentTrip.id}`);
              return;
            }
            lastUpdateRef.current[updateKey] = Date.now();

            socket.emit('updateLocation', { bookingId: currentTrip.id, role: 'tourist', latitude, longitude });
            setTouristLocation({ lat: latitude, lng: longitude });
            fetchLocations(currentTrip.id); // Re-fetch to ensure server consistency
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to retrieve location. Using default coordinates.', {
            position: 'top-right',
            autoClose: 5000,
          });
          setTouristLocation({ lat: 7.8731, lng: 80.7718 });
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [socket, currentTrip]);

  useEffect(() => {
    if (mapRef.current && isValidLocation(touristLocation) && isValidLocation(guideLocation)) {
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
          origin: touristLocation,
          destination: guideLocation,
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
      bounds.extend(touristLocation);
      bounds.extend(guideLocation);
      mapRef.current.fitBounds(bounds);
    }
  }, [touristLocation, guideLocation]);

  return (
    <div className="min-h-screen bg-neutralBg">
      <ToastContainer />
      <div className="p-6 mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-primary">My Trips</h1>
        <div className="mb-6">
          <div className="flex border-b border-accent">
            <button
              className={`flex-1 py-3 px-4 text-lg font-semibold text-center transition-colors duration-300 ${
                activeTab === 'current' ? 'bg-travelBlue text-white' : 'bg-white text-gray-600 hover:bg-accent'
              }`}
              onClick={() => setActiveTab('current')}
            >
              Current Trip
            </button>
            <button
              className={`flex-1 py-3 px-4 text-lg font-semibold text-center transition-colors duration-300 ${
                activeTab === 'history' ? 'bg-travelBlue text-white' : 'bg-white text-gray-600 hover:bg-accent'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Trip History
            </button>
          </div>
        </div>

        {activeTab === 'current' && (
          <div className="bg-white p-6 rounded-lg shadow-travel-shadow">
            {currentTrip ? (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FaRoute className="text-primary text-xl" />
                  <h2 className="text-lg font-semibold text-gray-800">{currentTrip.category}</h2>
                </div>
                <p className="text-sm text-secondary">
                  <FaMapMarkerAlt className="inline mr-1 text-travelBlue" /> {currentTrip.start_location}
                </p>
                <p className="text-sm text-gray-600">Destinations: {currentTrip.destinations?.join(', ') || 'Not specified'}</p>
                <p className="text-sm text-gray-600">Vehicle: {currentTrip.vehicle || 'Not specified'}</p>
                <p className="text-sm text-gray-600">Passengers: {currentTrip.passenger_count || 'Not specified'}</p>
                <p className="text-sm text-gray-600">Guide: {currentTrip.guide_name || 'Not specified'}</p>
                <p className="text-sm text-gray-600">Date: {new Date(currentTrip.created_at).toLocaleDateString()}</p>
                <p className="text-sm">
                  <span className="text-travelGreen">{currentTrip.status}</span>
                </p>
                {currentTrip.status === 'confirmed' && (
                  <APIProvider apiKey="AIzaSyCTkmhSytYSA7BKiczUFWeFIULe-onuHn0" libraries={['places']}>
                    <ErrorBoundary>
                      <div className="mt-4">
                        <h3 className="text-md font-medium mb-2">Live Locations & Directions</h3>
                        {isValidLocation(touristLocation) && isValidLocation(guideLocation) ? (
                          <Map
                            style={{ width: '100%', height: '400px' }}
                            defaultZoom={12}
                            defaultCenter={touristLocation}
                            mapId="bea008e60f890fd9160a10a0"
                            ref={mapRef}
                          >
                            <AdvancedMarker position={touristLocation}>
                              <div style={{ background: 'blue', color: 'white', padding: '5px' }}>
                                You (Tourist)
                              </div>
                            </AdvancedMarker>
                            <AdvancedMarker position={guideLocation}>
                              <div style={{ background: 'green', color: 'white', padding: '5px' }}>
                                Guide: {currentTrip.guide_name || 'Guide'}
                              </div>
                            </AdvancedMarker>
                          </Map>
                        ) : (
                          <div className="text-gray-500 text-center p-4">Waiting for location data...</div>
                        )}
                      </div>
                    </ErrorBoundary>
                  </APIProvider>
                )}
              </div>
            ) : (
              <p className="text-gray-600">No current trip scheduled.</p>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white p-6 rounded-lg shadow-travel-shadow">
            <h2 className="text-lg font-semibold mb-4 text-travelBlue">Trip History</h2>
            {tripHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tripHistory.map((trip) => (
                  <div
                    key={trip.id}
                    className="border border-accent p-4 rounded-lg hover:bg-accent transition-colors duration-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaRoute className="text-primary text-xl" />
                      <h3 className="text-lg font-medium text-gray-800">{trip.category}</h3>
                    </div>
                    <p className="text-sm text-secondary">
                      <FaMapMarkerAlt className="inline mr-1 text-travelBlue" /> {trip.start_location}
                    </p>
                    <p className="text-sm text-gray-600">Destinations: {trip.destinations?.join(', ') || 'Not specified'}</p>
                    <p className="text-sm text-gray-600">Vehicle: {trip.vehicle || 'Not specified'}</p>
                    <p className="text-sm text-gray-600">Passengers: {trip.passenger_count || 'Not specified'}</p>
                    <p className="text-sm text-gray-600">Guide: {trip.guide_name || 'Not specified'}</p>
                    <p className="text-sm text-gray-600">Date: {new Date(trip.created_at).toLocaleDateString()}</p>
                    <p className="text-sm">
                      <span className="text-travelGreen">{trip.status}</span>
                    </p>
                    <button
                      className="mt-2 text-travelBlue hover:text-primary font-medium transition-colors"
                      onClick={() => navigate(`/tourist-trip-details/${trip.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No trip history available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristTrips;