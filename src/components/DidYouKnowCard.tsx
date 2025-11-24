import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';

interface DidYouKnowCardProps {
  facts: string[];
}

export const DidYouKnowCard = ({ facts }: DidYouKnowCardProps) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const { settings } = useAppStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [facts.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-3xl p-8 ${
        settings.darkMode
          ? 'bg-gradient-to-br from-purple-900 to-indigo-900'
          : 'bg-gradient-to-br from-purple-500 to-indigo-600'
      } text-white shadow-2xl`}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="p-3 bg-white/20 rounded-full">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">Did You Know?</h2>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.p
            key={currentFactIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-lg leading-relaxed"
          >
            {facts[currentFactIndex]}
          </motion.p>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex gap-2 mt-6">
          {facts.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                scale: index === currentFactIndex ? 1.2 : 1,
                opacity: index === currentFactIndex ? 1 : 0.5,
              }}
              className={`h-2 rounded-full transition-all ${
                index === currentFactIndex ? 'w-8 bg-white' : 'w-2 bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
