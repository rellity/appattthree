import React, { useState, useEffect } from 'react';
import { View, Text, Alert,TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useApiUrl } from './ApiUrlContext';
import { useNavigation } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as SecureStore from 'expo-secure-store'

const OptionSelector = () => {
  const { apiUrl } = useApiUrl();
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [tableData, setTableData] = useState([]);
  const navigation = useNavigation();
  const [showLoading, setShowLoading] = useState(false);
  const [api, setApiUrl] = useState(null);
  const [selectedLog, setselectedLog] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        ToastAndroid.show('Fetching API URL...', ToastAndroid.SHORT);
        const storedApiUrl = await SecureStore.getItemAsync('apiUrl');
        if (storedApiUrl) {
          setApiUrl(storedApiUrl);
          console.log('Stored API:', storedApiUrl);
        }
      } catch (error) {
        console.error('Error fetching API URL:', error);
      }
    };
  
    fetchData();
  }, []); 
  
  useEffect(() => {
    if (api) {
      console.log('api:', api);
      fetchOptions();
    }
  }, [api]); 
  
  useEffect(() => {
    if (api) {
      console.log('api:', api);
      fetchOptions();
    }
  }, [apiUrl]); 
  
  const check = [api || apiUrl];

  const formatData = (data) => {
    return data.map((item, index) => (
      <View key={index} style={styles.row}>
        <Text style={styles.label}>Created on:</Text>
        <Text style={styles.value}>{formatDate(item.createdon)}</Text>
        <Text style={styles.label}>Created by:</Text>
        <Text style={styles.value}>{item.createdby}</Text>
        <Text style={styles.label}>Login Status:</Text>
        <Text style={[styles.value, item.loginstatus.toLowerCase() === 'ongoing' ? styles.ongoingText : styles.endedText]}>
          {item.loginstatus}
        </Text>
        <Text style={styles.label}>Logout Status:</Text>
        <Text style={[styles.value, item.logoutstatus.toLowerCase() === 'ongoing' ? styles.ongoingText : styles.endedText]}>
          {item.logoutstatus}
        </Text>
        {item.status.toLowerCase() === 'ended' && (
          <>
            <Text style={styles.label}>Event Status:</Text>
            <Text style={[styles.value, item.status.toLowerCase() === 'ongoing' ? styles.ongoingText : styles.endedText]}>
              {item.status}
            </Text>
            <Text style={styles.label}>Ended on:</Text>
            <Text style={styles.endedText}>{formatDate(item.endedby)}</Text>
          </>
        )}
      </View>
    ));
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };
  
  const fetchOptions = () => {
    return new Promise(async (resolve, reject) => {
      setShowLoading(true);
      
      try {
        const check = [api || apiUrl];
        const response = await axios.get(`${check}/attappthree/getOptions.php`);
        const optionsArray = Array.isArray(response.data) ? response.data : [response.data];
        setOptions(response.data);
        setShowLoading(false); 
        resolve(optionsArray); // make this promise come true
        ToastAndroid.show('done!', ToastAndroid.SHORT)
      } catch (error) {
        setShowLoading(false);
        const errorMessage = `error fetching options: network error`;
        console.error(errorMessage);
        ToastAndroid.showWithGravityAndOffset(
          errorMessage,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        reject(error); //reject promise
      }
    });
    // mannnnnnnn, promise2 atay alas 11:44 sa gabii wa koy gibuthat kundi mag program ani
  };

  const handleOptionChange = async (itemValue) => {

    setSelectedOption(itemValue);

    console.log('Selected option:', itemValue);
    
  
    try {
      if (itemValue) {
        const check = api || apiUrl;
        const responselink = `${check}/attappthree/getOptionsInfo.php`;

        const response = await axios.get(responselink,{ params: {value: itemValue},});
  
        if (response.data.error) {
          // error handling
          Alert.alert('Error fetching data for the selected table:', response.data.error);
          setTableData([]); 
        } else {
          // output data
          setTableData(response.data);
        }
  
        // log , tanggalon ni basta 
        console.log('Response data:', response.data);
      } else {
        setTableData([]); // clear table data????u  
      }
    } catch (error) {
      Alert.alert('Error fetching data for the selected table:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text>Select an option:</Text>
      <Picker
        selectedValue={selectedOption}
        onValueChange={handleOptionChange}
        style={styles.picker}
      >
        
        <Picker.Item label="Select an Event Option..." value={null} />
        {options.map((option, index) => (
          <Picker.Item
            key={index}
            label={option}
            value={option}
          />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedLog}
        onValueChange={(itemValue) => setselectedLog(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select either Login or Logout" value={null} />
        <Picker.Item label="Log Login" value="login" />
        <Picker.Item label="Log Logout" value="logout" />
      </Picker>
      <View style={styles.scontainer}>
        <TouchableOpacity
          style={styles.sbutton}
          title="Mount"
          onPress={() => {
            if (tableData.length > 0) {
              const selectedEvent = tableData[0]; 
              console.log("option", selectedOption);
              
              if (selectedEvent) {
                let isEnded = false;
                
                if (selectedLog === 'login') {
                  isEnded = selectedEvent.loginstatus.toLowerCase() === 'ended';
                } else if (selectedLog === 'logout') {
                  if (selectedEvent.loginstatus.toLowerCase() === 'ended') {
                  isEnded = selectedEvent.logoutstatus.toLowerCase() === 'ended';
                  } else {
                    Alert.alert("Error", `Login in ${selectedOption} is still ongoing`);
                  return;
                  }
                } else {
                  Alert.alert("Error", "Please select a Log Operation.");
                  return;
                }
              
                if (isEnded) {
                  Alert.alert(`Cannot mount an ended ${selectedLog} event.`);
                } else {
                  
                  navigation.navigate('BarcodeScanner', { selectedTable: selectedOption, selectedLogging: selectedLog });
                }
              } else {
                
                Alert.alert('Please select a valid table before mounting.');
              }
            } else {
              
              Alert.alert('Please select a valid table before mounting.');
            }
          }}
        >
          <Text style={styles.buttonText}>Mount Event</Text>
          
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sbutton}
          title="Modify"
          onPress={() => {
            if (selectedOption) {
              // go to scanner
              navigation.navigate('BarcodeScanner', { selectedTable: selectedOption });
            } else {
              // error handling
              Alert.alert('Please select a table to modify.');
            }
          }}
        >
          <Text style={styles.buttonText}>Modify Event</Text>
          
        </TouchableOpacity>
      </View>
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EventCreationScreen')}
        >
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </View>
      

      {tableData.length > 0 && (
          <Text>{formatData(tableData)}</Text>
      )}

      <AwesomeAlert
        show={showLoading}
        showProgress
        title="Loading..."
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={false}
        contentContainerStyle={styles.alertContainer}
        titleStyle={styles.alertTitle}
        progressColor="#007AFF" // Customize the progress bar color
      />
      
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'collumn',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    width: 290,
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
  },
  sbutton: {
    width: 140,
    height: 60,
    margin: 5,
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
  },
  picker: {
    width: 300, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  scontainer: {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  label: {
    flex: 1,
    color: '#000000',
    marginRight: 8,
  },
  value: {
    flex: 1,
    color: '#61DAFB',
  },
  endedText: {
    color: 'red', 
  },
  loadingContainer: {
    marginTop: 250,
    position: 'absolute',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  top: {
    flex: 0.3,
    backgroundColor: 'white',
    borderWidth: 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 20,
    width: '50%',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF', 
    marginBottom: 10,
  },
});

export default OptionSelector;
