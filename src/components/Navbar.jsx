import React from 'react';
import { Link } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import { GiSriLanka } from 'react-icons/gi';
import { CiMenuBurger } from 'react-icons/ci';
import { SiOpenstreetmap } from 'react-icons/si';
import ResponsiveMenu from './ResponsiveMenu';

const Navbar = () => {
  const [open, setOpen] = React.useState(false);

  // Define NavbarMenu directly
  const NavbarMenu = [
    { id: 1, title: 'Home', link: '/' },
    { id: 2, title: 'About', link: '/about' },
    { id: 3, title: 'Contact', link: '/contact' },
    { id: 4, title: 'Guides', link: '/guides' },
  ];

  return (
    <>
      <nav>
        <div className="container flex justify-between items-center py-8">
          {/* Logo section */}
          <div className="text-2xl flex items-center gap-2 font-bold">
            <GiSriLanka />
            <p>Quick</p>
            <p className="text-secondary">Guide</p>
          </div>
          {/* Menu section */}
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
          {/* Icons section */}
          <div className="flex items-center gap-4">
            <button className="text-2xl hover:bg-primary hover:text-white rounded-full p-2 duration-200">
              <CiSearch />
            </button>
            <Link to="/mapView">
            <button className="text-2xl hover:bg-primary hover:text-white rounded-full p-2 duration-200">
              <SiOpenstreetmap />
            </button>
            </Link>
            
            <Link
              to="/login"
              className="hover:bg-primary text-primary font-semibold hover:text-white rounded-md border-2 border-primary px-6 py-2 duration-200 hidden md:block"
            >
              Login
            </Link>
          </div>
          {/* Mobile hamburger menu section */}
          <div className="md:hidden" onClick={() => setOpen(!open)}>
            <CiMenuBurger className="text-4xl" />
          </div>
        </div>
      </nav>
      {/* Mobile sidebar section */}
      <ResponsiveMenu open={open} />
    </>
  );
};

export default Navbar;