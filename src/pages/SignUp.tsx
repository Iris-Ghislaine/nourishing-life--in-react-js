/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authstore';
import { signUpSchema, type SignUpFormData } from '../lib/validations';

export const SignUp = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});
  const [loading, setLoading] = useState(false);
  const { settings } = useAppStore();
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const validatedData = signUpSchema.parse(formData);
      
      const success = await register(
        validatedData.email, 
        validatedData.password, 
        validatedData.name, 
        validatedData.phone
      );
      
      if (success) {
        toast.success('🎉 Account created successfully! Welcome to HealthEats!');
        navigate('/');
      } else {
        toast.error('Failed to create account. Email may already be in use.');
      }
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Partial<SignUpFormData> = {};
        error.errors.forEach((err: any) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof SignUpFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error('Please fix the form errors');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
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
                  errors.name ? 'border-red-500' : 
                  settings.darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="John Doe"
                required
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
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
                  errors.email ? 'border-red-500' :
                  settings.darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="your@email.com"
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
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
                  errors.phone ? 'border-red-500' :
                  settings.darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="+1234567890"
                required
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
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
                  errors.password ? 'border-red-500' :
                  settings.darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="••••••••"
                required
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
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
                  errors.confirmPassword ? 'border-red-500' :
                  settings.darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="••••••••"
                required
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
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
