import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useApiUrl } from './ApiUrlContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { Card, Title } from 'react-native-paper';
import Checkbox from 'expo-checkbox';

const EventCreationScreen = () => {
  const { apiUrl } = useApiUrl();
  const [eventName, setEventName] = useState('');
  const [eventPrice, setEventPrice] = useState('');
  const [fname, setfname] = useState('');
  const check = apiUrl;
  const navigation = useNavigation();
  console.log("logs", check);
  const [isCheckedIN, setCheckedIN] = useState(true);
  const [isCheckedOUT, setCheckedOUT] = useState(true);


  useEffect(() => {
    const fetchstoredName = async () => {
      try {
        const storedfname = await SecureStore.getItemAsync('fname');
        if (storedfname) {
          setfname(storedfname);
        }
      } catch (error) {
        console.error('Error fetching API URL:', error);
      }
    };

    fetchstoredName();
  }, []); 
  
  useEffect(() => {
    console.log(fname);
  }, [fname]); //

  console.log(isCheckedIN);
  console.log(isCheckedOUT);

  const handleOnChange = (newText) => {
    const sanitizedText = newText.replace(/[\s~`!@#\$%\^&\*\(\)\-+=\[\]\{\}\|\\\'\/\?\:"<>,\.]/g, '');
    setEventName(sanitizedText);
  };

  function sanitizeText(text) {
    const sanitizedText = text.replace(/[^0-9]+/g, ''); 
    return sanitizedText;
  }

  const createEvent = async () => {
    if (eventPrice === "0") {
      Alert.alert('Error', 'Fine value cannot be 0.');
      return;
    }

    if (!eventPrice) {
      Alert.alert('Error', 'Fine value cannot be blank.');
      return;
    }

    if (!eventName) {
      Alert.alert('Error', 'Event Name cannot be blank.');
      return;
    }

    if(!isCheckedIN && !isCheckedOUT){
      Alert.alert('Error', 'Select at least 1 log method.');
      return;
    }
    
    try {
      const checkDuplicateUrl = `${check}/attappthree/event_check_name.php?eventName=${eventName}`;
      const duplicateCheckResponse = await axios.get(checkDuplicateUrl);

      if (duplicateCheckResponse.data.duplicate) {
        Alert.alert('Error', `${eventName} already exists.\nPlease choose a different name.`);
        return;
      }

      const compurl = `${check}/attappthree/create_event.php`;
      const response = await axios.post(compurl, {
        name: eventName,
        createdby: fname,
        price: eventPrice, 
        haslogin: +isCheckedIN,
        haslogout: +isCheckedOUT,
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
      Alert.alert('Error', error.message);
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
          
          <View style={styles.section}>  
          <Checkbox
            style={styles.checkbox}
            value={isCheckedIN}
            onValueChange={setCheckedIN}
            color={isCheckedIN ? '#4630EB' : undefined}
          />
          <Text style={styles.paragraph}>Login   </Text>
          
          <Checkbox
            style={styles.checkbox}
            value={isCheckedOUT}
            onValueChange={setCheckedOUT}
            color={isCheckedOUT ? '#4630EB' : undefined}
          />
          <Text style={styles.paragraph}>Logout</Text>
          </View>
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
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});

export default EventCreationScreen;
