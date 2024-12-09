import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { recycle_backend } from "../../../declarations/recycle_backend";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);
  const [userName, setUserName] = useState('');
  const [authClient, setAuthClient] = useState(null);

  useEffect(() => {
    const initAuthClient = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();
        const userPrincipal = identity.getPrincipal();
        setPrincipal(userPrincipal);
        setIsAuthenticated(true);
      }
    };

    initAuthClient();
  }, []);

  const login = async () => {
    if (!authClient) return;

    await new Promise((resolve) => {
      authClient.login({
        identityProvider: "https://identity.ic0.app/",
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const userPrincipal = identity.getPrincipal();
          setPrincipal(userPrincipal);
          setIsAuthenticated(true);
          resolve();
        },
      });
    });
  };

  const logout = async () => {
    if (authClient) {
      await authClient.logout();
      setIsAuthenticated(false);
      setPrincipal(null);
      setUserName('');
      // Reset backend data if possible
      // You might need to implement a backend method to reset user data
    }
  };

  const updateUserName = async (name) => {
    setUserName(name);
    // Optional: Save username to backend
    await recycle_backend.updateUserProfile(name);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      principal, 
      userName, 
      login, 
      logout, 
      updateUserName 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);