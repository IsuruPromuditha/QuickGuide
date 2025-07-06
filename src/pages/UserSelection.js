import React from 'react';
import { GiSriLanka } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/TouristSignUpBG.jpg';  

const UserSelection = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow-2xl w-full max-w-md z-10">
        <div className="text-3xl flex items-center justify-center gap-2 font-bold mb-6">
          <GiSriLanka className="text-primary" />
          <p>Quick</p>
          <p className="text-secondary">Guide</p>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Sign Up As
        </h2>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/tourist-registeration')}
            className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-secondary transition duration-200"
          >
            Tourist
          </button>
          <button
            onClick={() => navigate('/guide-registeration')}
            className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-secondary transition duration-200"
          >
            Guide
          </button>
        </div>
        <p className="text-center text-gray-700 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-primary hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default UserSelection;