import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const SettingsScreen = () => {
  const [apiUrl, setApiUrl] = useState('');

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

  const handleSave = async () => {
    try {
      // Validate apiUrl here if needed
      if (!apiUrl) {
        alert('API URL cannot be empty');
        return;
      }

      // Save the API URL to AsyncStorage
      await AsyncStorage.setItem('apiUrl', apiUrl);
      alert('API URL saved successfully');
    } catch (error) {
      console.error('Error saving API URL:', error);
      alert('Error saving API URL');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Settings</Text>
      <TextInput
        placeholder="Enter API URL"
        value={apiUrl}
        onChangeText={(text) => setApiUrl(text)}
        style={styles.input}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default SettingsScreen;
