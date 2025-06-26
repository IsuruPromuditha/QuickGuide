import React, { useState } from 'react';
import { GiSriLanka } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

const TouristSignup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    country: '',
    language: '',
    contact: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Handle signup logic (e.g., API call)
    console.log('Tourist Signup Data:', form);
    navigate('/login'); // Redirect to login after signup
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Logo Section */}
        <div className="text-3xl flex items-center justify-center gap-2 font-bold mb-6">
          <GiSriLanka className="text-primary" />
          <p>Quick</p>
          <p className="text-secondary">Guide</p>
        </div>

        {/* Form Title */}
        <h2 className="text-2xl font-semibold text-gray-600 text-center mb-6">
          Tourist Signup
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your full name"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Country */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Country"
              required
            />
          </div>

          {/* Language */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Preferred Language</label>
            <input
              type="text"
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Language (e.g., English)"
              required
            />
          </div>

          {/* Contact */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Contact Number</label>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Mobile number"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Create a password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Re-type your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-2 rounded-md hover:bg-secondary transition duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Link to login */}
        <p className="text-center text-gray-600 mt-4">
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
