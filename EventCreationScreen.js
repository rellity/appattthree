import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useApiUrl } from './ApiUrlContext';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-paper';

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
      <Card style={styles.card}>
        <Card.Content>
          <Card.Title title="Event Creation" style={styles.plainText} />
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
          <TouchableOpacity style={styles.button} onPress={createEvent}>
            <Text style={styles.buttonText}>Create Event</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  card: {
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 230,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  plainText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    width: '60%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '50%',
  },
});

export default EventCreationScreen;
