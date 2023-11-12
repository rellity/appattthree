import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useApiUrl } from './ApiUrlContext';
import { useNavigation } from '@react-navigation/native';

const EventCreationScreen = () => {
  const { apiUrl } = useApiUrl();
  const [eventName, setEventName] = useState('');

  const createEvent = async () => {
    try {
      if (eventName.trim() === '') {
        Alert.alert('Please enter an event name.');
        return;
      }

      const response = await axios.post(apiUrl, { event_name: eventName });
      
      if (response.data.error) {
        Alert.alert('Error creating event:', response.data.error);
      } else {
        Alert.alert('Event created successfully!');
      }
    } catch (error) {
      Alert.alert('Error creating event:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Enter Event Name:</Text>
      <TextInput
        style={styles.input}
        value={eventName}
        onChangeText={(text) => setEventName(text)}
        placeholder="Event Name"
      />
      <TouchableOpacity style={styles.button} onPress={createEvent}>
        <Text style={styles.buttonText}>Create Event</Text>
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
  input: {
    width: 300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EventCreationScreen;
