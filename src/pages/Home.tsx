import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useEffect } from 'react';
import { diseases } from '../data/diseases';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authstore';

export const Home = () => {
  const navigate = useNavigate();
  const { setSelectedDisease, settings } = useAppStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  const handleDiseaseClick = (disease: typeof diseases[0]) => {
    setSelectedDisease(disease);
    navigate(`/disease/${disease.id}`);
  };

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-emerald-100'}`}>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-5xl font-bold mb-4 ${
            settings.darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome to{' '}
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              HealthEats
            </span>
          </h1>
          <p className={`text-xl ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Personalized meal recommendations for your health journey
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className={`text-3xl font-bold text-center mb-8 ${
            settings.darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Select Your Condition
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {diseases.map((disease, index) => (
              <motion.div
                key={disease.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDiseaseClick(disease)}
                className={`cursor-pointer p-8 rounded-3xl shadow-xl bg-gradient-to-br ${disease.color} text-white transition-all`}
              >
                <div className="text-6xl mb-4">{disease.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{disease.name}</h3>
                <p className="text-white/90">{disease.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`max-w-3xl mx-auto p-8 rounded-3xl ${
            settings.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
        >
          <h2 className={`text-2xl font-bold mb-4 ${
            settings.darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Why Choose HealthEats?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">✓</div>
              <div>
                <h3 className={`font-semibold ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
                  African-Focused Nutrition
                </h3>
                <p className={settings.darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  All meals feature ingredients readily available in African markets
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">✓</div>
              <div>
                <h3 className={`font-semibold ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Evidence-Based Recommendations
                </h3>
                <p className={settings.darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Meals designed with nutritional science for chronic disease management
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">✓</div>
              <div>
                <h3 className={`font-semibold ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Easy to Follow
                </h3>
                <p className={settings.darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Simple preparation steps and clear nutritional information
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
