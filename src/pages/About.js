import React from 'react';
import { GiSriLanka } from 'react-icons/gi';

const About = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-600 mb-4">About QuickGuide Sri Lanka</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connecting travelers with trusted local tour guides for authentic, seamless, and memorable experiences in Sri Lanka.
        </p>
      </div>

      {/* Mission Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold text-primary mb-4">Our Mission</h2>
          <p className="text-gray-600">
            At QuickGuide Sri Lanka, we aim to revolutionize the way tourists explore Sri Lanka by bridging the gap between travelers and verified local tour guides. Our platform leverages cutting-edge technology, including real-time geo-tracking, multilingual communication, and a gamified ranking system, to ensure transparency, trust, and exceptional experiences.
          </p>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1519606428-d3c4c3a47c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
            alt="Sri Lankan culture"
            className="rounded-lg shadow-lg w-full h-64 object-cover"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-primary text-center mb-6">Why Choose QuickGuide?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <GiSriLanka className="text-4xl text-secondary mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2 text-center">Verified Guides</h3>
            <p className="text-gray-600 text-center">
              Connect with certified local guides who are vetted for authenticity and expertise.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <GiSriLanka className="text-4xl text-secondary mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2 text-center">Real-Time Tracking</h3>
            <p className="text-gray-600 text-center">
              Find guides near you with real-time geo-tracking for a seamless experience.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <GiSriLanka className="text-4xl text-secondary mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2 text-center">Multilingual Support</h3>
            <p className="text-gray-600 text-center">
              Communicate effortlessly with integrated Google Translate features.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-primary mb-6">Our Team</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          QuickGuide Sri Lanka was developed by a passionate team of innovators at the University of Bedfordshire, led by A.I.P. Jayasooriya under the supervision of Dr. Nipunika Vithana. We are committed to enhancing Sri Lanka’s tourism industry through technology and cultural appreciation.
        </p>
      </div>
    </div>
  );
};

export default About;