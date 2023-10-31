import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const ApiUrlContext = createContext();

const ApiUrlProvider = ({ children }) => {
  const [apiUrl, setApiUrl] = useState('');

  const setUrl = async (url) => {
    try {
      await SecureStore.setItemAsync('apiUrl', url);
      setApiUrl(url);
    } catch (error) {
      Alert.alert('Error saving API URL:', error);
    }
  };

  useEffect(() => {
    const fetchApiUrl = async () => {
      try {
        const storedApiUrl = await SecureStore.getItemAsync('apiUrl');
        if (storedApiUrl) {
          setApiUrl(storedApiUrl);
        }
      } catch (error) {
        Alert.alert('Error fetching API URL:', error);
        // error handling idk
      }
    };

    fetchApiUrl();
  }, []);

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
