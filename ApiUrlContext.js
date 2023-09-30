import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ApiUrlContext = createContext();

const ApiUrlProvider = ({ children }) => {
  const [apiUrl, setApiUrl] = useState(''); // Initialize apiUrl state

  // Function to set the apiUrl
  const setUrl = async (url) => {
    try {
      await AsyncStorage.setItem('apiUrl', url); // Save to AsyncStorage
      setApiUrl(url);
    } catch (error) {
      console.error('Error saving API URL:', error);
    }
  };

  // Fetch the stored API URL when the screen is mounted
  useEffect(() => {
    const fetchApiUrl = async () => {
      try {
        const storedApiUrl = await AsyncStorage.getItem('apiUrl');
        if (storedApiUrl) {
          setApiUrl(storedApiUrl);
        }
      } catch (error) {
        console.error('Error fetching API URL:', error);
      }
    };

    fetchApiUrl();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <ApiUrlContext.Provider value={{ apiUrl, setUrl }}>
      {children}
    </ApiUrlContext.Provider>
  );
};

const useApiUrl = () => {
  const context = useContext(ApiUrlContext);
  if (!context) {
    throw new Error('useApiUrl must be used within an ApiUrlProvider');
  }
  return context;
};

export { ApiUrlProvider, useApiUrl };