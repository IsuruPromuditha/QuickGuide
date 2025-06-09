import React, { useState } from 'react';
import { GiSriLanka } from 'react-icons/gi';
import backgroundImage from '../assets/TouristSignUpBG.jpg'; // Ensure the path is correct

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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative pt-24"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* Form Container */}
      {/* Form Container */}
<div className="bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-4xl z-10 opacity-80">
  {/* Logo */}
  <div className="text-3xl flex items-center justify-center gap-2 font-bold mb-6">
    <GiSriLanka className="text-primary" />
    <p>SignUp</p>
    <p className="text-secondary">Here</p>
  </div>


  {/* Form */}
  <form onSubmit={handleSubmit}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <label className="block text-gray-700 font-medium mb-1">{input.label}</label>
          <input
            type={input.type}
            name={input.name}
            value={form[input.name]}
            onChange={handleChange}
            placeholder={input.placeholder}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      ))}
    </div>

    <button
      type="submit"
      className="w-full mt-6 bg-primary text-white font-semibold py-2 rounded-md hover:bg-secondary transition duration-200"
    >
      Sign Up
    </button>
  </form>

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
