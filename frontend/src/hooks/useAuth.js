import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('hospitalApiKey') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('hospitalApiKey', apiKey);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('hospitalApiKey');
      setIsAuthenticated(false);
    }
  }, [apiKey]);

  const login = (key) => {
    setApiKey(key);
  };

  const logout = () => {
    setApiKey('');
    setIsAuthenticated(false);
  };

  return { apiKey, isAuthenticated, login, logout };
};
