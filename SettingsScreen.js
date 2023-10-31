import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ToastAndroid } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';


const SettingsScreen = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [useHttps, setUseHttps] = useState(false);


  useEffect(() => {
    const fetchApiUrl = async () => {
      try {
        const storedApiUrl = await SecureStore.getItemAsync('apiUrl');
        if (storedApiUrl) {
          setApiUrl(storedApiUrl);
        }
      } catch (error) {
        console.error('Error fetching API URL:', error);
      }
    };

    fetchApiUrl();
  }, []);

  const navigation = useNavigation();

  const handleSave = async () => {
    try {
      if (!apiUrl) {
        Alert.alert('api url cannot be empty', 'null', [{text: 'Ok', style: 'default'}]);
        return;
      }

      const protocol = useHttps ? 'https://' : 'http://';
      const fullapiUrl = `${protocol}${apiUrl}`;

  
      Alert.alert(
        'Confirm Save',
        `Save API URL: ${apiUrl}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Save',
            onPress: async () => {
              try {
                await SecureStore.setItemAsync('apiUrl', fullapiUrl);
                navigation.navigate('MainPage', { updatedApiUrl: apiUrl });
                ToastAndroid.showWithGravityAndOffset(
                  `API URL saved: ${fullapiUrl}`,
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50
                );
                
              } catch (error) {
                console.error('Error saving API URL:', error);
                Alert.alert('Error saving API URL', error, [{text: 'Ok', style: 'default'}]);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error saving API URL:', error);
      Alert.alert('Error saving API URL', error, [{text: 'Ok', style: 'default'}]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Settings</Text>
      <TextInput
        placeholder="Enter API URL"
        value={apiUrl.replace(/^(https?|ftp):\/\//, '')}
        onChangeText={(text) => setApiUrl(text)}
        style={styles.input}
      />

      <CheckBox
        title="Use HTTPS"
        checked={useHttps}
        onPress={() => setUseHttps(!useHttps)}
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