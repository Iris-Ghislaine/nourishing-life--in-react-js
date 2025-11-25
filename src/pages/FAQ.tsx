import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { faqs as staticFaqs } from '../data/faqs';
import { useAppStore } from '../store/appStore';
import { db } from '../config/firebase';
import type { FAQ as FAQType } from '../types';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQType[]>(staticFaqs);
  const [loading, setLoading] = useState(true);
  const { settings } = useAppStore();

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const faqsQuery = query(collection(db, 'faqs'), orderBy('createdAt', 'desc'));
        const faqsSnapshot = await getDocs(faqsQuery);
        const dynamicFaqs = faqsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as FAQType[];
        
        // Combine static FAQs with dynamic ones from admin replies
        setFaqs([...dynamicFaqs, ...staticFaqs]);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        // Keep static FAQs if Firebase fails
        setFaqs(staticFaqs);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <div className={`min-h-screen ${
      settings.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-emerald-100'
    }`}>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-5xl font-bold mb-4 ${
            settings.darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Frequently Asked Questions
          </h1>
          <p className={`text-xl ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Find answers to common questions about Nourishing Life
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className={`mt-2 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading FAQs...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl overflow-hidden ${
                settings.darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <span className={`font-semibold text-lg ${
                  settings.darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6" />
                </motion.div>
              </button>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: openIndex === index ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className={`p-6 pt-0 ${
                  settings.darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};
