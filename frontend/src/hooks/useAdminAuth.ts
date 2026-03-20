import { useEffect, useState } from 'react';
import { AdminUser } from '../types';

export const useAdminAuth = () => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem('admin-user');
    return stored ? JSON.parse(stored) as AdminUser : null;
  });

  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem('admin-user');
      setAdmin(stored ? JSON.parse(stored) as AdminUser : null);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const logout = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
    setAdmin(null);
  };

  return { admin, logout, isAuthenticated: Boolean(admin) };
};
