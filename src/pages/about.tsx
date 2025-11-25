import { motion } from 'framer-motion';
import { Heart, Users, Target, Award } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export const About = () => {
  const { settings } = useAppStore();

  const features = [
    {
      icon: Heart,
      title: 'Health-Focused',
      description: 'Every meal recommendation is designed with your health in mind, focusing on nutrition that supports chronic disease management.',
    },
    {
      icon: Users,
      title: 'Community-Driven',
      description: 'Built for African communities, using locally available ingredients and traditional cooking methods adapted for modern health needs.',
    },
    {
      icon: Target,
      title: 'Evidence-Based',
      description: 'All recommendations are backed by nutritional science and research on chronic disease management.',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'We ensure accuracy in nutritional information and practical preparation methods that work in real kitchens.',
    },
  ];

  return (
    <div className={`min-h-screen ${
      settings.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-emerald-100'
    }`}>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <h1 className={`text-5xl font-bold mb-6 ${
            settings.darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            About{' '}
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              NourishingLife
            </span>
          </h1>
          <p className={`text-xl leading-relaxed ${
            settings.darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            NourishingLife is your companion in managing chronic diseases through proper nutrition. We believe that food is medicine, and we're here to make healthy eating accessible, practical, and delicious for everyone.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`p-8 rounded-3xl ${
                  settings.darkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${
                  settings.darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={settings.darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`max-w-4xl mx-auto p-8 rounded-3xl ${
            settings.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
        >
          <h2 className={`text-3xl font-bold mb-6 ${
            settings.darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Why Choose NourishingLife?
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className={`text-xl font-semibold mb-2 ${
                settings.darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                🌍 Locally Sourced Ingredients
              </h3>
              <p className={settings.darkMode ? 'text-gray-300' : 'text-gray-600'}>
                We focus on ingredients that are readily available in African markets, making it easy and affordable to follow our meal recommendations.
              </p>
            </div>

            <div>
              <h3 className={`text-xl font-semibold mb-2 ${
                settings.darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                🥗 Culturally Relevant
              </h3>
              <p className={settings.darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Our meals are based on traditional African foods adapted with modern nutritional knowledge for chronic disease management.
              </p>
            </div>

            <div>
              <h3 className={`text-xl font-semibold mb-2 ${
                settings.darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                📱 Easy to Use
              </h3>
              <p className={settings.darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Simple interface, clear instructions, and organized meal categories make healthy eating straightforward and stress-free.
              </p>
            </div>

            <div>
              <h3 className={`text-xl font-semibold mb-2 ${
                settings.darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                💚 Support Your Journey
              </h3>
              <p className={settings.darkMode ? 'text-gray-300' : 'text-gray-600'}>
                We provide comprehensive support including medication reminders, nutritional information, and health benefits for each meal.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
