import React, { useState, useEffect } from 'react';
import { FacebookFilled, TwitterOutlined, InstagramOutlined, WhatsAppOutlined, PushpinFilled } from '@ant-design/icons';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = 'http://localhost:5000';

const SocialGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedGroups = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/api/socialmedia/approved-social-groups`);
        const formattedGroups = res.data.map(group => ({
          id: group.id,
          place: group.title,
          image: group.image || 'https://placehold.co/600x400?text=Group+Image',
          groups: group.socialMedias.map(platform => ({
            type: platform.name,
            link: platform.link,
            icon: getSocialIcon(platform.name)
          }))
        }));
        setGroups(formattedGroups);
      } catch (error) {
        console.error('Error fetching approved social groups:', error);
        toast.error(error.response?.data?.error || 'Failed to fetch social groups');
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedGroups();
  }, []);

  const getSocialIcon = (name) => {
    switch (name) {
      case 'Facebook':
        return <FacebookFilled className="text-[#1877F2] text-xl transition-colors duration-300 group-hover:text-white" aria-hidden="true" />;
      case 'Twitter':
        return <TwitterOutlined className="text-[#1DA1F2] text-xl transition-colors duration-300 group-hover:text-white" aria-hidden="true" />;
      case 'Instagram':
        return <InstagramOutlined className="text-[#E1306C] text-xl transition-colors duration-300 group-hover:text-white" aria-hidden="true" />;
      case 'WhatsApp':
        return <WhatsAppOutlined className="text-[#25D366] text-xl transition-colors duration-300 group-hover:text-white" aria-hidden="true" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-10 h-10 border-4 rounded-full border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-600 text-lg font-medium">Loading travel communities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-8 transition-all duration-300 ">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">
            Connect with Local Travel Communities
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Join vibrant communities on WhatsApp, Facebook, and more to explore Sri Lanka’s top destinations with like-minded travelers.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {groups.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500 text-lg font-medium">No travel communities found at the moment.</p>
            </div>
          ) : (
            groups.map((spot) => (
              <div
                key={spot.id}
                className="bg-white shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md border-primary border-2 rounded-lg p-4"
              >
                {/* Image Section */}
                <div className="relative h-48">
                  <img
                    src={spot.image}
                    alt={spot.place}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h2 className="absolute bottom-4 left-4 text-xl font-semibold text-white flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F97316] text-white text-sm">
                      <PushpinFilled className="text-white text-base" />
                    </span>
                    {spot.place}
                  </h2>
                </div>
                {/* Content Section */}
                <div className="p-6 ">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-wrap gap-3 justify-center">
                      {spot.groups.map((group, idx) => (
                        <a
                          key={idx}
                          href={group.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Join ${group.type} community for ${spot.place}`}
                          className={`group flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${group.type === 'WhatsApp'
                            ? 'border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:border-[#25D366]'
                            : group.type === 'Facebook'
                              ? 'border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2] hover:border-[#1877F2]'
                              : group.type === 'Twitter'
                                ? 'border-[#1DA1F2] text-[#1DA1F2] hover:bg-[#1DA1F2] hover:border-[#1DA1F2]'
                                : 'border-[#E1306C] text-[#E1306C] hover:bg-[#E1306C] hover:border-[#E1306C]'
                            }`}
                        >
                          {group.icon}
                        </a>
                      ))}
                    </div>
                    <span className="text-base font-medium text-gray-600">Join Here</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default SocialGroups;