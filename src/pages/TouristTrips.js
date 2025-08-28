// TouristTrips.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRoute, FaMapMarkerAlt } from 'react-icons/fa';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SOCKET_SERVER = 'http://localhost:5000';

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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found. Please log in.');
          toast.error('Please log in to view trips.', {
            position: 'top-right',
            autoClose: 5000,
          });
          return;
        }

        const response = await axios.get('http://localhost:5000/api/booking/tourist', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const bookings = response.data;
        const confirmedBooking = bookings.find(
          (booking) => booking.status === 'confirmed'
        );
        setCurrentTrip(confirmedBooking || null);

        const completedBookings = bookings.filter(
          (booking) => booking.status === 'completed'
        );
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
    const apiKey = 'AIzaSyCTkmhSytYSA7BKiczUFWeFIULe-onuHn0'; // Hardcoded API key
    if (!apiKey) {
      console.error('Google Maps API key is missing.');
      toast.error('Google Maps API key is missing.', {
        position: 'top-right',
        autoClose: 5000,
      });
      return;
    }

    const newSocket = socketIOClient(SOCKET_SERVER, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket.IO connected:', newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
      toast.error('Failed to connect to real-time server. Location updates may not work.', {
        position: 'top-right',
        autoClose: 5000,
      });
    });

    newSocket.on('locationUpdate', ({ bookingId, role, latitude, longitude }) => {
      if (currentTrip && bookingId === currentTrip.id) {
        if (role === 'guide') {
          setGuideLocation({ lat: latitude, lng: longitude });
        } else if (role === 'tourist') {
          setTouristLocation({ lat: latitude, lng: longitude });
        }
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && currentTrip && currentTrip.status === 'confirmed') {
      socket.emit('joinBooking', currentTrip.id);
    }
  }, [socket, currentTrip]);

  useEffect(() => {
    if (socket && currentTrip && currentTrip.status === 'confirmed') {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          socket.emit('updateLocation', {
            bookingId: currentTrip.id,
            role: 'tourist',
            latitude,
            longitude,
          });
          setTouristLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to retrieve location. Please ensure location services are enabled.', {
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
    if (mapRef.current && touristLocation && guideLocation) {
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
          }
        }
      );
    }

    return () => {
      if (directionsRenderer.current) {
        directionsRenderer.current.setMap(null);
      }
    };
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
                activeTab === 'current'
                  ? 'bg-travelBlue text-white'
                  : 'bg-white text-gray-600 hover:bg-accent'
              }`}
              onClick={() => setActiveTab('current')}
            >
              Current Trip
            </button>
            <button
              className={`flex-1 py-3 px-4 text-lg font-semibold text-center transition-colors duration-300 ${
                activeTab === 'history'
                  ? 'bg-travelBlue text-white'
                  : 'bg-white text-gray-600 hover:bg-accent'
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
                    <div className="mt-4">
                      <h3 className="text-md font-medium mb-2">Live Locations & Directions</h3>
                      <Map
                        style={{ width: '100%', height: '400px' }}
                        defaultZoom={12}
                        defaultCenter={
                          touristLocation || guideLocation || { lat: 7.8731, lng: 80.7718 }
                        }
                        mapId="bea008e60f890fd9160a10a0" // Replace with your actual Map ID
                        ref={mapRef}
                      >
                        {touristLocation && (
                          <AdvancedMarker position={touristLocation}>
                            <div style={{ background: 'blue', color: 'white', padding: '5px' }}>
                              You (Tourist)
                            </div>
                          </AdvancedMarker>
                        )}
                        {guideLocation && (
                          <AdvancedMarker position={guideLocation}>
                            <div style={{ background: 'green', color: 'white', padding: '5px' }}>
                              Guide: {currentTrip.guide_name || 'Guide'}
                            </div>
                          </AdvancedMarker>
                        )}
                      </Map>
                    </div>
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