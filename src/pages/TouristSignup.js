import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GiSriLanka } from 'react-icons/gi';
import backgroundImage from '../assets/TouristSignUpBG.jpg';  

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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match!');
      toast.error('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/tourist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          passport: form.passport,
          contact: form.contact,
          country: form.country,
          language: form.language,
          password: form.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        navigate('/login');
      } else {
        setError(data.error || 'Failed to register tourist');
        toast.error(data.error || 'Failed to register tourist');
      }
    } catch (error) {
      setError('Error connecting to the server');
      toast.error('Error connecting to the server');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative pt-24 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />
      <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-4xl z-10">
        <div className="text-2xl sm:text-3xl flex items-center justify-center gap-2 font-bold mb-6">
          <GiSriLanka className="text-primary" />
          <p>Quick</p>
          <p className="text-secondary">Guide</p>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 text-center mb-6">
          Tourist Signup
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4 text-sm sm:text-base">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
            <div key={index} className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                {input.label}
              </label>
              <input
                type={input.type}
                name={input.name}
                value={form[input.name]}
                onChange={handleChange}
                placeholder={input.placeholder}
                required
                className="w-full px-3 sm:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
              />
            </div>
          ))}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              className="w-full bg-primary text-white font-semibold py-2 rounded-md hover:bg-secondary transition duration-200 text-sm sm:text-base"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-center text-gray-700 mt-4 text-sm sm:text-base">
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