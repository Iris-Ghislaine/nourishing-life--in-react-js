import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import type { Meal } from '../types';
import { useAppStore } from '../store/appStore';

interface MealDetailModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MealDetailModal = ({ meal, isOpen, onClose }: MealDetailModalProps) => {
  const { settings } = useAppStore();

  if (!meal) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${
              settings.darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 transition"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-3xl font-bold text-white mb-2">{meal.name}</h2>
                <p className="text-white/90">{meal.description}</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Nutritional Info */}
              <div>
                <h3 className="text-xl font-bold mb-3">Nutritional Information</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className={`p-4 rounded-xl ${settings.darkMode ? 'bg-gray-800' : 'bg-green-50'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Calories</p>
                    <p className="text-lg font-bold text-green-600">{meal.nutrients.calories}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${settings.darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Protein</p>
                    <p className="text-lg font-bold text-blue-600">{meal.nutrients.protein}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${settings.darkMode ? 'bg-gray-800' : 'bg-yellow-50'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Carbs</p>
                    <p className="text-lg font-bold text-yellow-600">{meal.nutrients.carbs}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${settings.darkMode ? 'bg-gray-800' : 'bg-red-50'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fats</p>
                    <p className="text-lg font-bold text-red-600">{meal.nutrients.fats}</p>
                  </div>
                </div>
              </div>

              {/* Preparation Steps */}
              <div>
                <h3 className="text-xl font-bold mb-3">How to Prepare</h3>
                <div className="space-y-3">
                  {meal.preparationSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex gap-3 p-4 rounded-xl ${
                        settings.darkMode ? 'bg-gray-800' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <p className="flex-1">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Health Benefits */}
              <div>
                <h3 className="text-xl font-bold mb-3">Health Benefits</h3>
                <div className="space-y-2">
                  {meal.benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p>{benefit}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
