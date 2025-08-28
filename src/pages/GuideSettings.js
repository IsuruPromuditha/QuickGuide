import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const GuideSettings = () => {
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch initial geolocation setting from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to access settings.');
          toast.error('Please log in to access settings.', {
            position: 'top-right',
            autoClose: 5000,
          });
          return;
        }

        const response = await axios.get('http://localhost:5000/api/guide/settings', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsGeolocationEnabled(response.data.geolocation_enabled || false);
        if (response.data.latitude && response.data.longitude) {
          setLocation({ latitude: response.data.latitude, longitude: response.data.longitude });
        }
      } catch (err) {
        console.error('Error fetching settings:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to fetch settings.');
        toast.error(err.response?.data?.error || 'Failed to fetch settings.', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    };

    fetchSettings();
  }, []);

  // Handle geolocation updates
useEffect(() => {
  let watchId;
  if (isGeolocationEnabled) {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      toast.error('Geolocation is not supported by your browser.', {
        position: 'top-right',
        autoClose: 5000,
      });
      setIsGeolocationEnabled(false);
      return;
    }

    watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setError('');

        try {
          const token = localStorage.getItem('token');
          await axios.put(
            'http://localhost:5000/api/guide/location',
            { latitude, longitude, geolocation_enabled: true },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success('Location updated successfully!', {
            position: 'top-right',
            autoClose: 3000,
          });
        } catch (err) {
          console.error('Error updating location:', err.response?.data || err.message);
          toast.error(err.response?.data?.error || 'Failed to update location.', {
            position: 'top-right',
            autoClose: 5000,
          });
        }
      },
      (err) => {
        setError(`Geolocation error: ${err.message}`);
        toast.error(`Geolocation error: ${err.message}`, {
          position: 'top-right',
          autoClose: 5000,
        });
        setIsGeolocationEnabled(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  return () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  };
}, [isGeolocationEnabled]);

  const handleToggleGeolocation = async () => {
    const newValue = !isGeolocationEnabled;
    setIsGeolocationEnabled(newValue);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to update settings.');
        toast.error('Please log in to update settings.', {
          position: 'top-right',
          autoClose: 5000,
        });
        setIsGeolocationEnabled(false);
        setLoading(false);
        return;
      }

      if (!newValue) {
        // Clear location when disabling
        setLocation({ latitude: null, longitude: null });
        await axios.put(
          'http://localhost:5000/api/guide/location',
          { latitude: null, longitude: null, geolocation_enabled: false },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Geolocation disabled successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error('Error updating geolocation setting:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to update geolocation setting.');
      toast.error(err.response?.data?.error || 'Failed to update geolocation setting.', {
        position: 'top-right',
        autoClose: 5000,
      });
      setIsGeolocationEnabled(!newValue); // Revert toggle on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer autoClose={5000} hideProgressBar={false} closeOnClick pauseOnClick pauseOnHover />
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Guide Settings
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Manage your settings as a guide, including real-time geolocation sharing.
        </p>
        <div className="space-y-6">
          {/* Geolocation Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Real-Time Geolocation
            </label>
            <div className="mt-1 flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" />
              <div className="flex items-center justify-between w-full">
                <span className="text-gray-600">
                  {isGeolocationEnabled
                    ? 'Geolocation is enabled. Your location is being shared.'
                    : 'Geolocation is disabled.'}
                </span>
                <button
                  onClick={handleToggleGeolocation}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out ${
                    isGeolocationEnabled ? 'bg-primary' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                      isGeolocationEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            {isGeolocationEnabled && location.latitude && location.longitude && (
              <p className="mt-2 text-sm text-gray-500">
                Current Location: Latitude {location.latitude.toFixed(4)}, Longitude {location.longitude.toFixed(4)}
              </p>
            )}
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Cancel Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/guideprofileview')}
              className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={loading}
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideSettings;