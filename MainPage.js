import React,{ useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useApiUrl } from './ApiUrlContext';
import * as SecureStore from 'expo-secure-store';

const MainPage = ({ route,navigation }) => {
  const { apiUrl } = useApiUrl();
  const updatedApiUrl = route.params ? route.params.updatedApiUrl : null;

  useEffect(() => {
    SecureStore.getItemAsync('isLoggedIn')
      .then((storedIsLoggedIn) => {
        if (storedIsLoggedIn !== 'true') {
          navigation.navigate('AccountsScreen');
        }
      })
      .catch((error) => console.error('Error reading from SecureStore:', error));

  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/CCSIT.png')} 
        style={styles.logo}
        resizeMode="contain" 
      />
      
      <Text style={styles.watermark}>
        API URL: {updatedApiUrl || apiUrl}
      </Text>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BarcodeGenerator')}
      >
        <Text style={styles.buttonText}>Student Registration</Text>
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
        <Text style={styles.buttonText}>Server Settings</Text>
      </TouchableOpacity>
      
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', 
  },
  logo: {
    width: 200,
    height: 200, 
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
  watermark: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    textAlign: 'center',
    fontSize: 12,
  },
});

export default MainPage;
