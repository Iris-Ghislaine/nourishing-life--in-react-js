import { motion } from 'framer-motion';
import type { Meal } from '../types';
import { useAppStore } from '../store/appStore';

interface MealCardProps {
  meal: Meal;
  onClick: () => void;
}

export const MealCard = ({ meal, onClick }: MealCardProps) => {
  const { settings } = useAppStore();

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer rounded-2xl overflow-hidden shadow-lg ${
        settings.darkMode ? 'bg-gray-800' : 'bg-white'
      } transition-all duration-300`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-xl font-bold">{meal.name}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className={`text-sm ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-2`}>
          {meal.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            {meal.nutrients.calories}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {meal.nutrients.protein}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
