import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authstore';

export const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { settings } = useAppStore();
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const success = await register(formData.email, formData.password, formData.name, formData.phone);
    if (success) {
      navigate('/');
    } else {
      setError('Failed to create account. Please try again.');
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      settings.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-emerald-100'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${
          settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white'
        }`}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className={settings.darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Join us for personalized health meal plans
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              settings.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  settings.darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              settings.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  settings.darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              settings.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  settings.darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="+1234567890"
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              settings.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  settings.darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              settings.darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  settings.darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition disabled:opacity-50"
          >
            <UserPlus className="w-5 h-5" />
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={settings.darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Already have an account?{' '}
            <Link to="/signin" className="text-green-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
