import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { DiseaseLanding } from './pages/DiseaseLanding';
import { Settings } from './pages/Settings';
import { FAQ } from './pages/FAQ';
import { Rating } from './pages/Rating';
import { AdminDashboard } from './pages/AdminDashboard';
import {useAuthStore} from './store/authstore'
import { useAppStore } from './store/appStore';
import { useEffect } from 'react';
import { About } from './pages/about';

function App() {
  const { isAuthenticated, loading, initializeAuth } = useAuthStore();
  const { settings } = useAppStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className={settings.darkMode ? 'dark' : ''}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: settings.darkMode ? '#1F2937' : '#FFFFFF',
              color: settings.darkMode ? '#FFFFFF' : '#000000',
              border: settings.darkMode ? '1px solid #374151' : '1px solid #E5E7EB',
            },
          }}
        />
        <Header />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/disease/:diseaseId"
            element={
              <ProtectedRoute>
                <DiseaseLanding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <FAQ />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rating"
            element={
              <ProtectedRoute>
                <Rating />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
