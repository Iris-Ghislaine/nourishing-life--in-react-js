import { motion } from 'framer-motion';
import { Moon, Sun, Bell, Lock, User, LogOut, Camera, Phone } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authstore';


export const Settings = () => {
  const { settings, toggleDarkMode, updateSettings } = useAppStore();
  const { user, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const handleNotificationToggle = () => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        enabled: !settings.notifications.enabled,
      },
    });
  };

  const handleMedicineReminderToggle = () => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        medicineReminder: !settings.notifications.medicineReminder,
      },
    });
  };

  const handleTimeChange = (time: string) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        time,
      },
    });
  };

  const handleProfileUpdate = () => {
    updateProfile(profileData);
    setIsEditingProfile(false);
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleChangePassword = () => {
    alert('Password change via OTP will be implemented with backend integration');
  };

  return (
    <div className={`min-h-screen ${
      settings.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-emerald-100'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-4xl font-bold mb-8 ${
            settings.darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Settings
          </h1>

          {/* Profile Section */}
          <div className={`mb-6 p-6 rounded-2xl ${
            settings.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h2 className={`text-2xl font-bold mb-4 ${
              settings.darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Profile
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                  <Camera className="w-4 h-4" />
                  Change Photo
                </button>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  settings.darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!isEditingProfile}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    settings.darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  settings.darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email (cannot be changed)
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className={`w-full px-4 py-3 rounded-xl border ${
                    settings.darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-200 border-gray-300'
                  } opacity-50 cursor-not-allowed`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  settings.darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditingProfile}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                      settings.darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50`}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {isEditingProfile ? (
                  <>
                    <button
                      onClick={handleProfileUpdate}
                      className="flex-1 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 py-2 bg-gray-300 dark:bg-gray-700 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="w-full py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className={`mb-6 p-6 rounded-2xl ${
            settings.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h2 className={`text-2xl font-bold mb-4 ${
              settings.darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Appearance
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.darkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                <div>
                  <p className={`font-semibold ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {settings.darkMode ? 'Dark Mode' : 'Light Mode'}
                  </p>
                  <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Toggle between light and dark themes
                  </p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-14 h-8 rounded-full transition-colors ${
                  settings.darkMode ? 'bg-green-600' : 'bg-gray-300'
                } relative`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                    settings.darkMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className={`mb-6 p-6 rounded-2xl ${
            settings.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h2 className={`text-2xl font-bold mb-4 ${
              settings.darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Notifications
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6" />
                  <div>
                    <p className={`font-semibold ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Enable Notifications
                    </p>
                    <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Receive app notifications
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleNotificationToggle}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    settings.notifications.enabled ? 'bg-green-600' : 'bg-gray-300'
                  } relative`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                      settings.notifications.enabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {settings.notifications.enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pl-9"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Medicine Reminder
                      </p>
                      <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Daily medication reminders
                      </p>
                    </div>
                    <button
                      onClick={handleMedicineReminderToggle}
                      className={`w-14 h-8 rounded-full transition-colors ${
                        settings.notifications.medicineReminder ? 'bg-green-600' : 'bg-gray-300'
                      } relative`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                          settings.notifications.medicineReminder ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {settings.notifications.medicineReminder && (
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        settings.darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Reminder Time
                      </label>
                      <input
                        type="time"
                        value={settings.notifications.time}
                        onChange={(e) => handleTimeChange(e.target.value)}
                        className={`px-4 py-2 rounded-xl border ${
                          settings.darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300'
                        } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div className={`mb-6 p-6 rounded-2xl ${
            settings.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h2 className={`text-2xl font-bold mb-4 ${
              settings.darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Security
            </h2>
            <button
              onClick={handleChangePassword}
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              Change Password (via OTP)
            </button>
          </div>

          {/* Sign Out Section */}
          <div className={`mb-6 p-6 rounded-2xl ${
            settings.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
