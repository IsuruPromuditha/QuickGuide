import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import { GiSriLanka } from 'react-icons/gi';
import { CiMenuBurger } from 'react-icons/ci';
import { SiOpenstreetmap } from 'react-icons/si';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import ResponsiveMenu from './ResponsiveMenu';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const NavbarMenu = [
    { id: 1, title: 'Home', link: '/' },
    { id: 2, title: 'About', link: '/about' },
    { id: 3, title: 'Contact', link: '/contact' },
    { id: 4, title: 'Guides', link: '/guides' },
    { id: 5, title: 'Social', link: '/socialgroup' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is not expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <>
      <nav>
        <div className="container flex justify-between items-center py-8">
          <div className="text-2xl flex items-center gap-2 font-bold">
            <GiSriLanka className="text-primary" />
            <p>Quick</p>
            <p className="text-secondary">Guide</p>
          </div>
          <div className="hidden md:block">
            <ul className="flex items-center gap-6 text-gray-600">
              {NavbarMenu.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.link}
                    className="inline-block py-1 px-3 hover:text-primary font-semibold"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-2xl hover:bg-primary hover:text-white rounded-full p-2 duration-200">
              <CiSearch />
            </button>
            <Link to="/mapView">
              <button className="text-2xl hover:bg-primary hover:text-white rounded-full p-2 duration-200">
                <SiOpenstreetmap />
              </button>
            </Link>
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-primary font-semibold border-2 border-primary px-4 py-2 rounded-md hover:bg-primary hover:text-white duration-200"
                >
                  <FaUser />
                  Profile
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  className="hover:bg-primary text-primary font-semibold hover:text-white rounded-md border-2 border-primary px-6 py-2 duration-200 hidden md:block"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="hover:bg-primary text-primary font-semibold hover:text-white rounded-md border-2 border-primary px-6 py-2 duration-200 hidden md:block"
                >
                  Login
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden" onClick={() => setOpen(!open)}>
            <CiMenuBurger className="text-4xl" />
          </div>
        </div>
      </nav>
      <ResponsiveMenu open={open} />
    </>
  );
};

export default Navbar;