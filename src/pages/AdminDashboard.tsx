import { motion } from 'framer-motion';
import { Users, Activity, Heart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { diseases } from '../data/diseases';

export const AdminDashboard = () => {
  const { user } = useAuthStore();
  const { settings } = useAppStore();
  const navigate = useNavigate();
  const [stats] = useState({
    totalUsers: 127,
    activeUsers: 89,
    totalDiseases: diseases.length,
    totalMeals: 54,
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className={`min-h-screen ${
      settings.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-emerald-100'
    }`}>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className={`text-5xl font-bold mb-4 ${
            settings.darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Admin Dashboard
          </h1>
          <p className={`text-xl ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage users, diseases, and meal recommendations
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-2xl ${
              settings.darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-500">{stats.totalUsers}</span>
            </div>
            <h3 className={`font-semibold ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
              Total Users
            </h3>
            <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Registered accounts
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-2xl ${
              settings.darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-500">{stats.activeUsers}</span>
            </div>
            <h3 className={`font-semibold ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
              Active Users
            </h3>
            <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Last 30 days
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-6 rounded-2xl ${
              settings.darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-pink-500">{stats.totalDiseases}</span>
            </div>
            <h3 className={`font-semibold ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
              Diseases
            </h3>
            <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Supported conditions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`p-6 rounded-2xl ${
              settings.darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
                <span className="text-white text-xl">🍽️</span>
              </div>
              <span className="text-2xl font-bold text-orange-500">{stats.totalMeals}</span>
            </div>
            <h3 className={`font-semibold ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
              Total Meals
            </h3>
            <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              All recommendations
            </p>
          </motion.div>
        </div>

        {/* Disease Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`mb-8 p-8 rounded-2xl ${
            settings.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${
              settings.darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Disease Management
            </h2>
            <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Disease
            </button>
          </div>

          <div className="space-y-4">
            {diseases.map((disease) => (
              <div
                key={disease.id}
                className={`p-4 rounded-xl border ${
                  settings.darkMode
                    ? 'border-gray-700 hover:bg-gray-700'
                    : 'border-gray-200 hover:bg-gray-50'
                } transition`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{disease.icon}</span>
                    <div>
                      <h3 className={`font-bold text-lg ${
                        settings.darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {disease.name}
                      </h3>
                      <p className={`text-sm ${
                        settings.darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {disease.description}
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Manage Meals
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Add Meal Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`p-8 rounded-2xl ${
            settings.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
        >
          <h2 className={`text-2xl font-bold mb-6 ${
            settings.darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Add New Meal Recommendation
          </h2>

          <p className={settings.darkMode ? 'text-gray-300' : 'text-gray-600'}>
            This feature will allow you to add illness meal recommendations and they will be directly added to the list of conditions.
          </p>

          <div className="mt-6">
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition font-semibold">
              Coming Soon: Add Meal Form
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
