import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { diseases } from '../data/diseases';
import { cancerMeals } from '../data/meals';
import { DidYouKnowCard } from '../components/DidYouKnowCard';
import { MealCard } from '../components/MealCard';

import { Coffee, Sun, Moon as MoonIcon, Apple, Droplets, Pill } from 'lucide-react';
import { MealDetailModal } from '../components/MealDetailModel';
import { useAppStore } from '../store/appStore';
import type { MealCategory, Meal } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoryIcons: Record<MealCategory, any> = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: MoonIcon,
  snacks: Apple,
  drinks: Droplets,
  vitamins: Pill,
};

const categoryLabels: Record<MealCategory, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
  drinks: 'Drinks',
  vitamins: 'Vitamins & Supplements',
};

export const DiseaseLanding = () => {
  const { diseaseId } = useParams();
  const navigate = useNavigate();
  const { settings } = useAppStore();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MealCategory | null>(null);

  const disease = diseases.find((d) => d.id === diseaseId);

  if (!disease) {
    navigate('/');
    return null;
  }

  // Filter meals by disease and category
  const getMealsByCategory = (category: MealCategory) => {
    return cancerMeals.filter((meal) => meal.category === category);
  };

  const categories: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snacks', 'drinks', 'vitamins'];

  return (
    <div className={`min-h-screen ${
      settings.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-emerald-100'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className={`p-8 rounded-3xl bg-gradient-to-br ${disease.color} text-white shadow-2xl`}>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl">{disease.icon}</span>
              <div>
                <h1 className="text-4xl font-bold">{disease.name}</h1>
                <p className="text-white/90 text-lg">{disease.description}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Did You Know Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <DidYouKnowCard facts={disease.didYouKnow} />
        </motion.div>

        {/* Category Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className={`text-3xl font-bold mb-6 ${
            settings.darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            What would you like to eat?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category];
              const isSelected = selectedCategory === category;
              return (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(isSelected ? null : category)}
                  className={`p-6 rounded-2xl shadow-lg transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                      : settings.darkMode
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-white hover:shadow-xl'
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold text-sm">{categoryLabels[category]}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Meals Grid */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h3 className={`text-2xl font-bold mb-6 ${
              settings.darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {categoryLabels[selectedCategory]} Recommendations
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getMealsByCategory(selectedCategory).map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onClick={() => setSelectedMeal(meal)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Show message if no category selected */}
        {!selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-center py-12 px-4 rounded-3xl ${
              settings.darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className={`text-2xl font-bold mb-2 ${
              settings.darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Select a meal category above
            </h3>
            <p className={settings.darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Choose from breakfast, lunch, dinner, snacks, drinks, or vitamins to see our recommendations
            </p>
          </motion.div>
        )}
      </div>

      {/* Meal Detail Modal */}
      <MealDetailModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
    </div>
  );
};
