import { Moon, Sun, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authstore';


export const Header = () => {
  const { settings, toggleDarkMode } = useAppStore();
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  return (
    <header className={`sticky top-0 z-50 ${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-md`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              NourishingLife
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-green-600 transition">Home</Link>
            {isAuthenticated && (
              <>
                <Link to="/faq" className="hover:text-green-600 transition">FAQ</Link>
                <Link to="/about" className="hover:text-green-600 transition">About</Link>
                <Link to="/rating" className="hover:text-green-600 transition">Rate Us</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="hover:text-green-600 transition">Dashboard</Link>
                )}
                <Link to="/settings" className="hover:text-green-600 transition">
                  <User className="w-5 h-5" />
                </Link>
              </>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {settings.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/signup"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Get Started
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden mt-4 space-y-2 pb-4">
            <Link to="/" className="block py-2 hover:text-green-600 transition">Home</Link>
            {isAuthenticated && (
              <>
                <Link to="/faq" className="block py-2 hover:text-green-600 transition">FAQ</Link>
                <Link to="/about" className="block py-2 hover:text-green-600 transition">About</Link>
                <Link to="/rating" className="block py-2 hover:text-green-600 transition">Rate Us</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block py-2 hover:text-green-600 transition">Dashboard</Link>
                )}
                <Link to="/settings" className="block py-2 hover:text-green-600 transition">Settings</Link>
              </>
            )}
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 py-2"
            >
              {settings.darkMode ? (
                <>
                  <Sun className="w-5 h-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 py-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/signup"
                className="block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-center"
              >
                Get Started
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
