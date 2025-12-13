/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, X, Send, Shield, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authstore';
import { useAppStore } from '../store/appStore';
import { forgotPasswordSchema, otpVerificationSchema, resetPasswordSchema, type ForgotPasswordFormData, type OtpVerificationFormData, type ResetPasswordFormData } from '../lib/validations';

interface ForgotPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPassword = ({ isOpen, onClose }: ForgotPasswordProps) => {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [loading, setLoading] = useState(false);
  const [emailData, setEmailData] = useState({ email: '' });
  const [otpData, setOtpData] = useState({ otp: '' });
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState<any>({});
  
  const { sendOTP, verifyOTP, resetPassword } = useAuthStore();
  const { settings } = useAppStore();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    console.log('🚀 ForgotPassword: Starting OTP send process');
    console.log('📧 Email data:', emailData);
    
    try {
      const validatedData = forgotPasswordSchema.parse(emailData);
      console.log('✅ Email validation passed:', validatedData);
      
      const success = await sendOTP(validatedData.email);
      console.log('📝 OTP send result:', success);
      
      if (success) {
        toast.success(`OTP sent to ${validatedData.email}`);
        setStep('otp');
      } else {
        toast.error('Failed to send OTP. Please check your email and try again.');
      }
    } catch (error: any) {
      console.error('❌ ForgotPassword error:', error);
      if (error.errors) {
        const fieldErrors: any = {};
        error.errors.forEach((err: any) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error('Please fix the form errors');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    try {
      const validatedData = otpVerificationSchema.parse(otpData);
      const success = await verifyOTP(emailData.email, validatedData.otp);
      
      if (success) {
        toast.success('OTP verified successfully!');
        setStep('password');
      } else {
        toast.error('Invalid or expired OTP. Please try again.');
      }
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: any = {};
        error.errors.forEach((err: any) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error('Please fix the form errors');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    try {
      const validatedData = resetPasswordSchema.parse(passwordData);
      const success = await resetPassword(emailData.email, validatedData.newPassword);
      
      if (success) {
        toast.success('Password reset successfully! You can now sign in with your new password.');
        handleClose();
      } else {
        toast.error('Failed to reset password. Please try again.');
      }
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: any = {};
        error.errors.forEach((err: any) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error('Please fix the form errors');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmailData({ email: '' });
    setOtpData({ otp: '' });
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setErrors({});
    onClose();
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const success = await sendOTP(emailData.email);
      if (success) {
        toast.success('OTP resent successfully!');
      } else {
        toast.error('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${
          settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Reset Password</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'email' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="text-center">
              <Mail className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <p className={`mb-4 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                settings.darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={emailData.email}
                  onChange={(e) => setEmailData({ email: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    errors.email ? 'border-red-500' :
                    settings.darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="your@email.com"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className={`mb-4 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Enter the 6-digit OTP sent to
              </p>
              <p className="font-semibold text-green-600 mb-4">{emailData.email}</p>
            </div>
            <div>
              <input
                type="text"
                value={otpData.otp}
                onChange={(e) => setOtpData({ otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                className={`w-full px-4 py-3 rounded-xl border text-center text-2xl font-mono tracking-widest ${
                  errors.otp ? 'border-red-500' :
                  settings.darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="000000"
                maxLength={6}
                required
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
              )}
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-blue-600 hover:underline disabled:opacity-50"
              >
                Didn't receive OTP? Resend
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="flex-1 py-3 bg-gray-300 dark:bg-gray-700 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="submit"
                disabled={loading || otpData.otp.length !== 6}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className={`mb-4 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Create a new password for your account
              </p>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                settings.darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.newPassword ? 'border-red-500' :
                  settings.darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="••••••••"
                required
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                settings.darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.confirmPassword ? 'border-red-500' :
                  settings.darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="••••••••"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('otp')}
                className="flex-1 py-3 bg-gray-300 dark:bg-gray-700 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};