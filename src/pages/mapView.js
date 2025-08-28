import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaStar } from 'react-icons/fa';

// Fix Leaflet icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const guides = [
  {
    id: 1,
    name: 'Saman Perera',
    rating: 4.7,
    lat: 6.9271,
    lng: 79.8612,
    category: 'Historical Tours',
    image: 'https://via.placeholder.com/80',
  },
  {
    id: 2,
    name: 'Nimali Silva',
    rating: 5.0,
    lat: 6.935,
    lng: 79.848,
    category: 'Wildlife Safaris',
    image: 'https://via.placeholder.com/80',
  },
];

const categories = [
  'All',
  'Historical Tours',
  'Adventure Tours',
  'Wildlife Safaris',
  'Cultural Experiences',
];

const MapView = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredGuides = selectedCategory === 'All'
    ? guides
    : guides.filter(g => g.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Category Filter Bar */}
      <div className="bg-white p-4 shadow-md overflow-x-auto whitespace-nowrap flex gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Map */}
      <MapContainer
        center={[6.9271, 79.8612]}
        zoom={13}
        scrollWheelZoom={true}
        className="flex-grow w-full z-0"
        style={{ height: 'calc(100vh - 80px)' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredGuides.map(guide => (
          <Marker key={guide.id} position={[guide.lat, guide.lng]}>
            <Popup>
              <div className="text-center">
                <img src={guide.image} alt={guide.name} className="w-16 h-16 rounded-full mx-auto mb-2" />
                <h3 className="font-bold text-lg">{guide.name}</h3>
                <p className="text-sm text-gray-600">{guide.category}</p>
                <div className="flex justify-center text-yellow-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(guide.rating) ? '' : 'text-gray-300'} />
                  ))}
                </div>
                <a href={`/guides/${guide.id}`} className="text-blue-500 text-sm underline">
                  View Profile
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
