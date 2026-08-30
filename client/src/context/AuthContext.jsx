import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, donorApi, hospitalApi } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('bloodbridge_token'));
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchCurrentUser = useCallback(async () => {
    const storedToken = localStorage.getItem('bloodbridge_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res.success) {
        setUser(res.user);
        setProfile(res.profile);
      }
    } catch (err) {
      console.warn('Session expired or invalid:', err.message);
      localStorage.removeItem('bloodbridge_token');
      setUser(null);
      setProfile(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const sendOtp = async (mobileNumber) => {
    try {
      const res = await authApi.sendOtp(mobileNumber);
      toast.success(res.message || 'OTP dispatched to your phone');
      return res;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const verifyOtp = async (mobileNumber, otp) => {
    try {
      const res = await authApi.verifyOtp(mobileNumber, otp);
      if (res.success && res.token) {
        localStorage.setItem('bloodbridge_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setProfile(res.profile);
        toast.success(`Welcome to BloodBridge, ${res.profile?.fullName || res.profile?.hospitalName || res.user.role}!`);
      }
      return res;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const res = await authApi.register(formData);
      if (res.success && res.token) {
        localStorage.setItem('bloodbridge_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setProfile(res.profile);
        toast.success(`Account registered successfully as ${formData.role}!`);
      }
      return res;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('bloodbridge_token');
      setUser(null);
      setProfile(null);
      setToken(null);
      toast.info('Logged out from BloodBridge.');
    }
  };

  // Quick switch for reviewers/demonstrations
  const quickLogin = async (role = 'donor') => {
    try {
      const mobile = role === 'hospital' ? '+911234567890' : '+919876543210';
      await sendOtp(mobile);
      await verifyOtp(mobile, '123456');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateAvailability = async (isAvailable) => {
    if (!profile || user?.role !== 'donor') return;
    try {
      const res = await donorApi.updateAvailability(profile.id, isAvailable);
      if (res.success) {
        setProfile((prev) => ({ ...prev, isAvailable: Boolean(isAvailable) }));
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateProfile = async (updates) => {
    if (!profile) return;
    try {
      let res;
      if (user?.role === 'donor') {
        res = await donorApi.update(profile.id, updates);
      } else {
        res = await hospitalApi.update(profile.id, updates);
      }

      if (res.success) {
        setProfile(res.donor || res.hospital);
        toast.success('Profile updated successfully.');
      }
      return res;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        isAuthenticated: !!user,
        role: user?.role || 'guest',
        sendOtp,
        verifyOtp,
        register,
        logout,
        quickLogin,
        updateAvailability,
        updateProfile,
        refreshUser: fetchCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
