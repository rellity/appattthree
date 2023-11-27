import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useApiUrl } from './ApiUrlContext';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

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
    console.log({api});
  }, []);

  const createEvent = async () => {
    try {
      const compurl = `${check}/attappthree/create_event.php`;
      const response = await axios.post(compurl, {
        name: eventName,
        createdby: fname,
        price: eventPrice },{
          headers: {
            'Content-Type': 'application/json',
          },
        }
    );
    
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
        ],);
      } else {
        Alert.alert('Error','Event not Added');
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
      <Text>Enter Event Name:</Text>
      <TextInput
        style={styles.input}
        value={eventName}
        onChangeText={(text) => setEventName(text)}
        placeholder="Event Name"
      />
      <TextInput
        style={styles.input}
        value={eventPrice}
        onChangeText={(text) => setEventPrice(text)}
        placeholder="Fine Price (per entry)"
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


// import * as React from 'react';
// import { WebView } from 'react-native-webview';
// import { StyleSheet } from 'react-native';
// import Constants from 'expo-constants';

// const EventCreationScreen= () => {
//   return (
//     <WebView
//       style={styles.container}
//       source={{ uri: 'http://192.168.1.101/attappthree/bar.php' }}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: Constants.statusBarHeight,
//   },
// });
export default EventCreationScreen;