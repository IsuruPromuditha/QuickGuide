import React from 'react';
import { FaFacebook, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';

const socialGroups = [
  {
    id: 1,
    place: 'Ella Rock',
    image: 'https://source.unsplash.com/400x300/?ella,srilanka',
    groups: [
      {
        type: 'WhatsApp',
        icon: <FaWhatsapp />,
        link: 'https://chat.whatsapp.com/example1',
      },
      {
        type: 'Facebook',
        icon: <FaFacebook />,
        link: 'https://facebook.com/groups/ella',
      },
    ],
  },
  {
    id: 2,
    place: 'Sigiriya Fortress',
    image: 'https://source.unsplash.com/400x300/?sigiriya,srilanka',
    groups: [
      {
        type: 'WhatsApp',
        icon: <FaWhatsapp />,
        link: 'https://chat.whatsapp.com/example2',
      },
    ],
  },
  {
    id: 3,
    place: 'Mirissa Beach',
    image: 'https://source.unsplash.com/400x300/?mirissa,beach',
    groups: [
      {
        type: 'Facebook',
        icon: <FaFacebook />,
        link: 'https://facebook.com/groups/mirissa',
      },
    ],
  },
];

const SocialGroups = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Title Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Join Local Travel Groups</h1>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          Discover and connect with WhatsApp or Facebook communities related to the most visited tourist spots in Sri Lanka.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {socialGroups.map((spot) => (
          <div key={spot.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
              src={spot.image}
              alt={spot.place}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary" /> {spot.place}
              </h2>
              <div className="mt-4 flex flex-col gap-2">
                {spot.groups.map((group, idx) => (
                  <a
                    key={idx}
                    href={group.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 px-4 py-2 rounded-md text-white font-medium ${
                      group.type === 'WhatsApp'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {group.icon} Join {group.type} Group
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialGroups;
