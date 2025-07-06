import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GiSriLanka } from 'react-icons/gi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast.success(data.message);
        if (data.role === 'guide') {
          navigate('/guideprofileview');
        } else {
          navigate('/tourist-dashboard');
        }
      } else {
        setError(data.error || 'Failed to login');
        toast.error(data.error || 'Failed to login');
      }
    } catch (error) {
      setError('Error connecting to the server');
      toast.error('Error connecting to the server');
    }
  };

  const handleSignupClick = () => {
    navigate('/register');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative pt-24 px-4 sm:px-6 lg:px-8"

    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-0" />
      <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-md z-10">
        <div className="text-2xl sm:text-3xl flex items-center justify-center gap-2 font-bold mb-6">
          <GiSriLanka className="text-primary" />
          <p>Quick</p>
          <p className="text-secondary">Guide</p>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 text-center mb-6">
          Login to QuickGuide
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4 text-sm sm:text-base">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-2 rounded-md hover:bg-secondary transition duration-200 text-sm sm:text-base"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-700 mt-4 text-sm sm:text-base">
          Don't have an account?{' '}
          <span
            onClick={handleSignupClick}
            className="text-primary hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;