import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authstore';
import { db } from '../config/firebase';

export const Rating = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { settings } = useAppStore();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        rating,
        message: message.trim() || 'No additional comments',
        status: 'pending',
        createdAt: new Date(),
      });

      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setRating(0);
        setMessage('');
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${
      settings.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-emerald-100'
    }`}>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-5xl font-bold mb-4 ${
            settings.darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Rate Your Experience
          </h1>
          <p className={`text-xl ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            We'd love to hear your feedback!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-8 rounded-3xl ${
            settings.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-2xl`}
        >
          {submitted ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h2 className={`text-2xl font-bold mb-2 ${
                settings.darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Thank You!
              </h2>
              <p className={settings.darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Your feedback has been submitted successfully.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <label className={`block text-lg font-semibold mb-4 text-center ${
                  settings.darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  How would you rate Nourisning Life?
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-12 h-12 ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : settings.darkMode
                            ? 'text-gray-600'
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </motion.button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center mt-2 text-green-600 font-medium">
                    {rating} star{rating !== 1 && 's'} - {
                      rating === 5 ? 'Excellent!' :
                      rating === 4 ? 'Great!' :
                      rating === 3 ? 'Good!' :
                      rating === 2 ? 'Fair' :
                      'Needs Improvement'
                    }
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className={`block text-lg font-semibold mb-3 ${
                  settings.darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Additional Comments (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    settings.darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none`}
                  placeholder="Tell us what you think... suggestions, concerns, or what you love about Nourisning Life!"
                />
              </div>

              <button
                type="submit"
                disabled={rating === 0 || loading}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>

              <p className={`text-sm text-center mt-4 ${
                settings.darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Your feedback will be sent to our team and help us improve Nourisning Life.
              </p>
            </form>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mt-8 p-6 rounded-2xl ${
            settings.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
        >
          <h2 className={`text-xl font-bold mb-3 ${
            settings.darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Why Your Feedback Matters
          </h2>
          <ul className={`space-y-2 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <li>• Helps us improve meal recommendations</li>
            <li>• Guides new feature development</li>
            <li>• Ensures we meet your health needs</li>
            <li>• Creates a better experience for everyone</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};
