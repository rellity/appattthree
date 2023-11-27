import React,{ useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useApiUrl } from './ApiUrlContext';
import * as SecureStore from 'expo-secure-store';

const MainPage = ({ route,navigation }) => {
  const { apiUrl } = useApiUrl();
  const updatedApiUrl = route.params ? route.params.updatedApiUrl : null;

  useEffect(() => {
    // Check if the user is logged in
    SecureStore.getItemAsync('isLoggedIn')
      .then((storedIsLoggedIn) => {
        if (storedIsLoggedIn !== 'true') {
          // If not logged in, navigate to the login screen
          navigation.navigate('AccountsScreen');
        }
      })
      .catch((error) => console.error('Error reading from SecureStore:', error));

  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('./assets/CCSIT.png')} // logo
        style={styles.logo}
        resizeMode="contain" // Preserve aspect ratio
      />
      
      <Text>API URL: { updatedApiUrl || apiUrl }</Text>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BarcodeGenerator')}
      >
        <Text style={styles.buttonText}>Generate Student 2d Code</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('OptionSelector')}
      >
        <Text style={styles.buttonText}>View Events</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('StudentLookupScreen');
        }}
      >
        <Text style={styles.buttonText}>Student Lookup</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('SettingsScreen');
        }}
      >
        <Text style={styles.buttonText}>API Settings</Text>
      </TouchableOpacity>
      
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Background color for the container
  },
  logo: {
    width: 200,
    height: 200, // Adjust the height according to your logo's aspect ratio
    marginBottom: 30,
  },
  button: {
    width: 300,
    height: 60,
    backgroundColor: '#007bff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MainPage;
