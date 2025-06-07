import React, { useState } from 'react';

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

export default function GuideBooking() {
  const [locations, setLocations] = useState(['', '']); // starting + one destination
  const [vehicle, setVehicle] = useState('');
  const [category, setCategory] = useState('');

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

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Book Your Guide</h2>

      {/* Locations */}
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

      {/* Vehicle Selection */}
      <VehicleSelector selected={vehicle} onSelect={setVehicle} />

      {/* Guide Category */}
      <GuideCategorySelect
        selected={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <button
        className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
        type="button"
        onClick={() => alert('Booking submitted (UI only)')}
      >
        Book Now
      </button>
    </div>
  );
}
