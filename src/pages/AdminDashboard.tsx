import { motion } from 'framer-motion';
import { Users, Activity, Heart, Plus, MessageSquare, Reply } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { useAuthStore } from '../store/authstore';
import { useAppStore } from '../store/appStore';
import { db } from '../config/firebase';
import { diseases } from '../data/diseases';
import { allMeals } from '../data/meals';
import type { Feedback } from '../types';

export const AdminDashboard = () => {
  const { user } = useAuthStore();
  const { settings } = useAppStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalDiseases: diseases.length,
    totalMeals: allMeals.length,
  });
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const feedbackSnapshot = await getDocs(collection(db, 'feedback'));
      
      setStats({
        totalUsers: usersSnapshot.size,
        activeUsers: usersSnapshot.size, // For now, consider all users as active
        totalDiseases: diseases.length,
        totalMeals: allMeals.length,
      });
      
      const feedbackData = feedbackSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        repliedAt: doc.data().repliedAt?.toDate(),
      })) as Feedback[];
      
      setFeedbacks(feedbackData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyToFeedback = async (feedbackId: string) => {
    const reply = replyText[feedbackId];
    if (!reply?.trim()) return;

    try {
      await updateDoc(doc(db, 'feedback', feedbackId), {
        adminReply: reply,
        status: 'replied',
        repliedAt: new Date(),
      });

      // Add to FAQs
      const feedback = feedbacks.find(f => f.id === feedbackId);
      if (feedback) {
        await addDoc(collection(db, 'faqs'), {
          question: feedback.message,
          answer: reply,
          createdAt: new Date(),
        });
      }

      // Refresh data
      fetchStats();
      setReplyText({ ...replyText, [feedbackId]: '' });
    } catch (error) {
      console.error('Error replying to feedback:', error);
    }
  };

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
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

        {/* Feedback Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`mb-8 p-8 rounded-2xl ${
            settings.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${
              settings.darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              User Feedback Management
            </h2>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              <span className={`font-semibold ${
                settings.darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {feedbacks.filter(f => f.status === 'pending').length} Pending
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
              <p className={`mt-2 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Loading feedback...
              </p>
            </div>
          ) : feedbacks.length === 0 ? (
            <p className={`text-center py-8 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No feedback received yet.
            </p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className={`p-4 rounded-xl border ${
                    settings.darkMode
                      ? 'border-gray-700 bg-gray-700'
                      : 'border-gray-200 bg-gray-50'
                  } ${feedback.status === 'pending' ? 'border-l-4 border-l-yellow-500' : 'border-l-4 border-l-green-500'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className={`font-semibold ${
                        settings.darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {feedback.userName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className={`text-xs ${
                          settings.darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {feedback.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      feedback.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {feedback.status}
                    </span>
                  </div>
                  
                  <p className={`mb-3 ${
                    settings.darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {feedback.message}
                  </p>

                  {feedback.status === 'replied' && feedback.adminReply && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      settings.darkMode ? 'bg-gray-600' : 'bg-blue-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Reply className="w-4 h-4 text-blue-500" />
                        <span className={`text-sm font-medium ${
                          settings.darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          Admin Reply:
                        </span>
                      </div>
                      <p className={`text-sm ${
                        settings.darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {feedback.adminReply}
                      </p>
                    </div>
                  )}

                  {feedback.status === 'pending' && (
                    <div className="mt-3">
                      <textarea
                        value={replyText[feedback.id] || ''}
                        onChange={(e) => setReplyText({
                          ...replyText,
                          [feedback.id]: e.target.value
                        })}
                        placeholder="Write your reply here..."
                        className={`w-full p-3 rounded-lg border text-sm ${
                          settings.darkMode
                            ? 'bg-gray-600 border-gray-500 text-white'
                            : 'bg-white border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        rows={3}
                      />
                      <button
                        onClick={() => handleReplyToFeedback(feedback.id)}
                        disabled={!replyText[feedback.id]?.trim()}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        Reply & Add to FAQ
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
