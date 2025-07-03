import React, { useState } from 'react';
import { GiSriLanka } from 'react-icons/gi';
import backgroundImage from '../assets/TouristSignUpBG.jpg'; // Use your correct path

const TouristSignup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    passport: '',
    contact: '',
    country: '',
    language: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative pt-24 px-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow-2xl w-full max-w-5xl z-10">
        {/* Logo */}
        <div className="text-3xl flex items-center justify-center gap-2 font-bold mb-6">
          <GiSriLanka className="text-primary" />
          <p>Quick</p>
          <p className="text-secondary">Guide</p>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Tourist Signup
        </h2>

        {/* Form: 2-column grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Enter full name' },
            { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter email' },
            { label: 'Passport Number', name: 'passport', type: 'text', placeholder: 'Enter passport number' },
            { label: 'Contact Number', name: 'contact', type: 'tel', placeholder: 'Enter contact number' },
            { label: 'Country', name: 'country', type: 'text', placeholder: 'Enter your country' },
            { label: 'Preferred Language', name: 'language', type: 'text', placeholder: 'Enter your language' },
            { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter password' },
            { label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: 'Confirm password' },
          ].map((input, index) => (
            <div key={index}>
              <label className="block text-gray-700 font-medium mb-2">{input.label}</label>
              <input
                type={input.type}
                name={input.name}
                value={form[input.name]}
                onChange={handleChange}
                placeholder={input.placeholder}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}

          {/* Submit button spans full width */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-primary text-white font-semibold py-2 rounded-md hover:bg-secondary transition duration-200"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Login link */}
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

export default TouristSignup;
