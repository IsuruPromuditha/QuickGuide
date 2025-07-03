import React, { useState } from 'react';
import { GiSriLanka } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for login logic (e.g., API call)
    console.log('Login submitted:', { email, password });
    navigate('/');
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

        {/* Form Section */}
        <h2 className="text-2xl font-semibold text-gray-600 text-center mb-6">Login to QuickGuide</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-2 rounded-md hover:bg-secondary transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Additional Links */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="/tourist-registeration" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;