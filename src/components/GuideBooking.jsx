import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LocationInput = ({ label, value, onChange, onRemove, canRemove }) => (
  <div className="flex items-center gap-2 mb-4">
    <input
      type="text"
      placeholder={label}
      value={value}
      onChange={onChange}
      className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {canRemove && (
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 font-bold text-lg"
        aria-label="Remove destination"
      >
        &times;
      </button>
    )}
  </div>
);

const VehicleSelector = ({ selected, onSelect }) => {
  const vehicles = ['Car', 'Van', 'Bike', 'Tuk Tuk'];
  return (
    <div className="mb-6">
      <label className="block font-semibold mb-2">Choose Vehicle</label>
      <div className="flex gap-4">
        {vehicles.map((v) => (
          <button
            key={v}
            onClick={() => onSelect(v)}
            className={`px-4 py-2 rounded border ${
              selected === v
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
};

const GuideCategorySelect = ({ selected, onChange }) => {
  const categories = ['Standard', 'Premium', 'Luxury'];
  return (
    <div className="mb-6">
      <label className="block font-semibold mb-2" htmlFor="guide-category">
        Guide Category
      </label>
      <select
        id="guide-category"
        value={selected}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default function GuideBooking({ guideId, onClose }) {
  const [locations, setLocations] = useState(['', '']);
  const [vehicle, setVehicle] = useState('');
  const [category, setCategory] = useState('');
  const [passengerCount, setPassengerCount] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLocationChange = (index, e) => {
    const newLocs = [...locations];
    newLocs[index] = e.target.value;
    setLocations(newLocs);
  };

  const addDestination = () => {
    setLocations([...locations, '']);
  };

  const removeDestination = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const validDestinations = locations.slice(1).filter(loc => loc.trim() !== '');
    if (!locations[0] || validDestinations.length === 0 || !vehicle || !category || passengerCount < 1) {
      setError('All fields are required, including at least one valid destination, and passenger count must be at least 1.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to book a guide.');
        navigate('/login');
        return;
      }

      const bookingData = {
        guide_id: guideId,
        start_location: locations[0],
        destinations: validDestinations,
        vehicle,
        category,
        passenger_count: passengerCount,
      };

      console.log('Sending booking data:', bookingData); // Debug log
      const response = await axios.post('http://localhost:5000/api/booking/create', bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onClose();
      alert(`Booking submitted successfully! Booking ID: ${response.data.bookingId}`);
    } catch (err) {
      console.error('Client error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to submit booking. Please try again.');
    }
  };

  return (
    <div className="p-6">
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}
      <div className="mb-6">
        <label className="block font-semibold mb-2" htmlFor="passenger-count">
          Number of Passengers
        </label>
        <input
          id="passenger-count"
          type="number"
          min="1"
          value={passengerCount}
          onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {locations.map((loc, i) => (
        <LocationInput
          key={i}
          label={i === 0 ? 'Add Starting Location' : `Add Destination ${i}`}
          value={loc}
          onChange={(e) => handleLocationChange(i, e)}
          onRemove={() => removeDestination(i)}
          canRemove={i !== 0}
        />
      ))}
      <button
        onClick={addDestination}
        className="mb-6 text-blue-600 hover:underline block mx-auto"
        type="button"
      >
        + Add More Destinations
      </button>
      <VehicleSelector selected={vehicle} onSelect={setVehicle} />
      <GuideCategorySelect
        selected={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button
        className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-secondary transition"
        type="button"
        onClick={handleSubmit}
      >
        Book Now
      </button>
    </div>
  );
}