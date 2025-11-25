import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
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
        {isAuthenticated && <Header />}
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/signin" />}
          />
          <Route
            path="/disease/:diseaseId"
            element={isAuthenticated ? <DiseaseLanding /> : <Navigate to="/signin" />}
          />
          <Route
            path="/settings"
            element={isAuthenticated ? <Settings /> : <Navigate to="/signin" />}
          />
          <Route
            path="/faq"
            element={isAuthenticated ? <FAQ /> : <Navigate to="/signin" />}
          />
          <Route
            path="/about"
            element={isAuthenticated ? <About /> : <Navigate to="/signin" />}
          />
          <Route
            path="/rating"
            element={isAuthenticated ? <Rating /> : <Navigate to="/signin" />}
          />
          <Route
            path="/admin"
            element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/signin" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
