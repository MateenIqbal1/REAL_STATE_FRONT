import React, { useEffect, useState } from 'react';
import { ImSearch } from 'react-icons/im';
import { FiMenu } from 'react-icons/fi'; // Hamburger menu icon
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { currentUser , token} = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // Verify login status
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        // Retrieve token from Redux or localStorage/sessionStorage
  
        const res = await fetch('https://realstate4-q8lsvtei.b4a.run/api/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in Authorization header
          },
          credentials: 'include', // Include cookies in the request
        });
  
        const data = await res.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (err) {
        console.error('Error verifying login:', err);
      }
    };
  
    verifyLogin();
  }, [navigate]);
  
  console.log(isLoggedIn, 'is logged in');
  

  return (
    <header className="bg-[#2E8B57] shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {/* Logo */}
        <Link to="/" className="hidden lg:block">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-white">Real </span>
            <span className="text-gray-300">Estate</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-slate-100 p-2 rounded-lg sm:w-1/2 lg:max-w-md lg:w-full lg:border lg:border-black"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <ImSearch className="text-slate-500" />
          </button>
        </form>

        {/* Hamburger Menu Button (Visible only on small screens) */}
        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FiMenu />
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex gap-4 lg:gap-10">
          <Link to="/">
            <li className="text-white font-bold text-lg font-mono hover:underline">Home</li>
          </Link>
          <Link to="/about">
            <li className="text-white font-bold text-lg font-mono hover:underline">About</li>
          </Link>
          <Link to="/profile">
            {isLoggedIn && currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser?.avatar || '/default-avatar.png'}
                alt="profile"
              />
            ) : (
              <li className="text-slate-700 hover:underline font-bold text-white">Sign In</li>
            )}
          </Link>
        </ul>
      </div>

      {/* Mobile/Tablet Menu (Visible when menu is toggled) */}
      {isMenuOpen && (
        <ul className="lg:hidden bg-[#2E8B57] text-white flex flex-col gap-4 p-4">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <li className="font-bold text-lg hover:underline">Home</li>
          </Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>
            <li className="font-bold text-lg hover:underline">About</li>
          </Link>
          <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
            {isLoggedIn && currentUser? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser?.avatar || '/default-avatar.png'}
                alt="profile"
              />
            ) : (
              <li className="font-bold text-lg hover:underline">Sign In</li>
            )}
          </Link>
        </ul>
      )}
    </header>
  );
};

export default Header;
