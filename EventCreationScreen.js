import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useApiUrl } from './ApiUrlContext';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Card, Title } from 'react-native-paper';

const EventCreationScreen = () => {
  const { apiUrl } = useApiUrl();
  const [eventName, setEventName] = useState('');
  const [eventPrice, setEventPrice] = useState('');
  const [api, setApiUrl] = useState("");
  const [fname, setfname] = useState("");
  const check = api || apiUrl;
  const navigation = useNavigation();
  console.log("logs", check);

  useEffect(() => {
    const fetchApiUrl = async () => {
      try {
        const storedApiUrl = await SecureStore.getItemAsync('apiUrl');
        if (storedApiUrl) {
          setApiUrl(storedApiUrl);
        }

        const storedfname = await SecureStore.getItemAsync('fname');
        if (storedfname) {
          setfname(storedfname);
        }
      } catch (error) {
        console.error('Error fetching API URL:', error);
      }
    };

    fetchApiUrl();
    console.log({ api });
  }, []);

  const handleOnChange = (newText) => {
    const sanitizedText = newText.replace(/[\s~`!@#\$%\^&\*\(\)\-+=\[\]\{\}\|\\\'\/\?\:"<>,\.]/g, '');
    setEventName(sanitizedText);
  };

  function sanitizeText(text) {
    const sanitizedText = text.replace(/[^0-9]+/g, ''); 
    return sanitizedText;
  }

  const createEvent = async () => {
    try {
      const compurl = `${check}/attappthree/create_event.php`;
      const response = await axios.post(compurl, {
        name: eventName,
        createdby: fname,
        price: eventPrice
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle the response here
      console.log(response.data);
      if (response.data) {
        Alert.alert(
          'Success',
          'Event Added',
          [
            {
              text: 'OK',
              onPress: () => {
                handleSave();
              },
            },
          ],
        );
      } else {
        Alert.alert('Error', 'Event not Added');
      }
    } catch (error) {
      // Handle errors here
      console.error('Error creating event:', error.message);
    }
  };

  const handleSave = () => {
    navigation.reset({
      index: 0,
      routes: [
        { name: 'MainPage' },
        { name: 'OptionSelector' },
      ],
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/CCSIT.png')} 
        style={styles.logo}
        resizeMode="contain" 
      />
      <Title title="Event Creation" style={styles.title}>Create New Event</Title>
      <Card style={styles.card}>
      
        <Card.Content>
          <TextInput
            style={styles.input}
            value={eventName}
            onChangeText={handleOnChange}
            placeholder="Event Name"
          />
          <TextInput
            style={styles.input}
            value={eventPrice}
            onChangeText={(text) => setEventPrice(sanitizeText(text))}
            placeholder="Fine Price (per entry)"
          />
          
        </Card.Content>
      </Card>
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
    padding: 20,
  },
  card: {
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10,
    elevation: 3,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    color: 'black',
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    width: '80%',
  },
  logo: {
    width: 200,
    height: 200, 
    marginBottom: 30,
  },
});

export default EventCreationScreen;
