import React, { useState, useEffect } from 'react';
import { View, Text, Alert,TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useApiUrl } from './ApiUrlContext';
import { useNavigation } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import PurgeOptionsScreen from './PurgeOptionsScreen';
import { Title } from 'react-native-paper';

const OptionSelector = () => {
  const { apiUrl } = useApiUrl();
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [tableData, setTableData] = useState([]);
  const navigation = useNavigation();
  const [showLoading, setShowLoading] = useState(false);
  const [selectedLog, setselectedLog] = useState(null);
  const [purgeOptionsModalVisible, setPurgeOptionsModalVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [flag, setFlag] = useState(false)
  const showPicker =
  tableData.length > 0 &&
  tableData.some((event) => event.haslogin === 1 || event.haslogout === 1);
  

  useEffect(() => {
  fetchOptions();
  }, []); 
  
  const check = [apiUrl];

  const formatData = (data) => {
    return data.map((item, index) => (
      <View key={index} style={styles.row}>
        <Text style={styles.label}>Created on:</Text>
        <Text style={styles.value}>{formatDateToGMT8(item.createdon)}</Text>
        <Text style={styles.label}>Created by:</Text>
        <Text style={styles.value}>{item.createdby}</Text>
        {item.loginstatus.toLowerCase() !== 'none' && (
        <>
        <Text style={styles.label}>Login Status:</Text>
        <Text style={[styles.value, item.loginstatus.toLowerCase() === 'ongoing' ? styles.ongoingText : styles.endedText]}>
          {item.loginstatus}
        </Text>
        </>
        )}
        {item.logoutstatus.toLowerCase() !== 'none' && (
        <>
        <Text style={styles.label}>Logout Status:</Text>
        <Text style={[styles.value, item.logoutstatus.toLowerCase() === 'ongoing' ? styles.ongoingText : styles.endedText]}>
          {item.logoutstatus}
        </Text>
        </>
        )}
        {item.status.toLowerCase() === 'ended' && (
          <>
            <Text style={styles.label}>Event Status:</Text>
            <Text style={[styles.value, item.status.toLowerCase() === 'ongoing' ? styles.ongoingText : styles.endedText]}>
              {item.status}
            </Text>
            <Text style={styles.label}>Ended on:</Text>
            <Text style={styles.endedText}>{formatDateToGMT8(item.endedby)}</Text>
          </>
        )}
        {item.status.toLowerCase() === 'none' && (
          <>
           </>
        )}
      </View>
    ));
  };

  const formatDateToGMT8 = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Singapore', 
    };
  
    const gmt8Date = new Date(dateString);
    gmt8Date.setHours(gmt8Date.getHours()); // Add 8 hours for GMT+8
  
    return gmt8Date.toLocaleString('en-US', options);
  };
  
  const fetchOptions = () => {
    return new Promise(async (resolve, reject) => {
      setShowLoading(true);
      
      try {
        const check = [apiUrl];
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

  useEffect(() => {
    console.log('Options:', options);
  }, [options]);
  
  useEffect(() => {
    console.log('TableData:', tableData);
  }, [tableData]);
  
  useEffect(() => {
    console.log('ShowPicker:', showPicker);
  }, [options, selectedOption, tableData]);
  

  const handleOptionChange = async (itemValue) => {
    setSelectedOption(itemValue);
  
    console.log('Selected option:', itemValue);
  
    try {
      if (itemValue) {
        const check = [apiUrl];
        const responselink = `${check}/attappthree/getOptionsInfo.php`;
  
        const response = await axios.get(responselink, { params: { value: itemValue } });
  
        if (response.data.error) {
          // error handling
          Alert.alert('Error fetching data for the selected table:', response.data.error);
          setTableData([]);
        } else {
          // Check if the data array is not empty before setting it
          if (Array.isArray(response.data) && response.data.length > 0) {
            setTableData(response.data);
            
          } else {
            setTableData([]);
          }
        }
  
        // log , tanggalon ni basta 
        console.log('Response data:', response.data);
      } else {
        setTableData([]); // clear table data
      }
    } catch (error) {
      Alert.alert('Error fetching data for the selected table:', error);
    }
    
  };

  const handlePurgeOptions = async (selectedMode) => {
    console.log("0;",selectedMode);
    try {
      const { clearEvent, clearLoginData, clearLogoutData, deleteEventEntry, endLogin, endLogout } = selectedMode;
      console.log("Selected Mode:", selectedMode);

      if (selectedMode === 'clearEvent') {
        respond = await axios.get(`${check}/attappthree/truncatetable.php`, { params: { table: selectedOption } });
        Alert.alert(
          "Cleared",
          "Table Data Cleared",
          [
            {
              text: "OK",
              onPress: () => {
                handleSave();
              },
            },
          ]
        );
        console.log(respond.data);
        console.log("1;",selectedOption);
        ToastAndroid.show('Table Data Cleared!', ToastAndroid.LONG);
      }
      
      if (selectedMode === 'clearLoginData') {
        if (tableData[0].loginstatus.trim().toLowerCase() === 'none'){
          Alert.alert('Error', 'This Event has no Login!')
          return;
        }
        respond = await axios.get(`${check}/attappthree/truncateevent.php`, { params: { table: selectedOption, column: 'login' } });
        Alert.alert(
          "Cleared",
          "Login Data Cleared",
          [
            {
              text: "OK",
              onPress: () => {
                handleSave();
              },
            },
          ]
        );
        console.log("clearlogin response: ", respond.data);
        console.log("1;",selectedOption);
        ToastAndroid.show('Login Data Cleared!', ToastAndroid.SHORT);
      }

      if (selectedMode === 'clearLogoutData') {
        if (tableData[0].logoutstatus.trim().toLowerCase() === 'none'){
          Alert.alert('Error', 'This Event has no Logout!')
          return;
        }
        respond = await axios.get(`${check}/attappthree/truncateevent.php`, { params: { table: selectedOption, column: 'logout' } });
        Alert.alert(
          "Cleared",
          "Logout Data Cleared",
          [
            {
              text: "OK",
              onPress: () => {
                handleSave();
              },
            },
          ]
        );
        console.log("clearlogin response: ", respond.data);
        console.log("1;",selectedOption);
        ToastAndroid.show('Logout Data Cleared!', ToastAndroid.SHORT);
      }

      if (selectedMode === 'deleteEventEntry') {
        respond = await axios.get(`${check}/attappthree/deleteevent.php`, { params: { table: selectedOption } });
        Alert.alert(
          "Deleted",
          "Event Entry Deleted",
          [
            {
              text: "OK",
              onPress: () => {
                handleSave();
              },
            },
          ]
        );
        console.log("clearlogin response: ", respond.data);
        console.log("1;",selectedOption);
        ToastAndroid.show(`Event Entry Deleted: ${selectedOption}!`, ToastAndroid.SHORT);
      }

      if (selectedMode === 'endLogin') {
        if (tableData[0].loginstatus.trim().toLowerCase() === 'none'){
          Alert.alert('Error', 'This Event has no Login!')
          return;
        }
        respond = await axios.get(`${check}/attappthree/evnt_end.php`, { params: { table: selectedOption, column: 'login' } });
        Alert.alert(
          "Ended",
          "Login Status Ended",
          [
            {
              text: "OK",
              onPress: () => {
                handleSave();
              },
            },
          ]
        );
        console.log("clearlogin response: ", respond.data);
        console.log("1;",selectedOption);
        ToastAndroid.show(`Login Ended: ${selectedOption}!`, ToastAndroid.SHORT);
      }

      if (selectedMode === 'endLogout') {
        if (tableData[0].logoutstatus.trim().toLowerCase() === 'none'){
          Alert.alert('Error', 'This Event has no Logout!')
          return;
        }
        respond = await axios.get(`${check}/attappthree/evnt_end.php`, { params: { table: selectedOption, column: 'logout' } });
        Alert.alert(
          "Ended",
          "Logout Status Ended",
          [
            {
              text: "OK",
              onPress: () => {
                handleSave();
              },
            },
          ]
        );
        console.log("clearlogin response: ", respond.data);
        console.log("1;",selectedOption);
        ToastAndroid.show(`Logout Ended: ${selectedOption}!`, ToastAndroid.SHORT);
      }

      // Close the modal after completing the purge actions
      setPurgeOptionsModalVisible(false);
    } catch (error) {
      console.error('Error purging options:', error);
      // Handle error
      Alert.alert('Error', 'Failed to purge options');
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

  useEffect(() => {
    if (tableData.length > 0) {
      setFlag(tableData[0]?.status === 'ongoing');
    }
  }, [tableData]);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>View Events</Title>
      <Picker
        selectedValue={selectedOption}
        onValueChange={handleOptionChange}
        style={styles.picker}
      >
        
        <Picker.Item label="Select an Event Option..." value={null} />
        {options && Array.isArray(options) && options.length > 0 && options.map((option, index) => (
          option !== '' && (
            <Picker.Item
              key={index}
              label={option}
              value={option}
            />
          )
        ))}
      </Picker>
      {tableData && Array.isArray(tableData) && tableData.length > 0 && (
        <Picker
          selectedValue={selectedLog}
          onValueChange={(itemValue) => setselectedLog(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select either Login or Logout" value={null} />

          {tableData[0].haslogin === 1 && (
            <Picker.Item label="Log Login" value="login" />
          )}

          {tableData[0].haslogout === 1 && (
            <Picker.Item label="Log Logout" value="logout" />
          )}
        </Picker>
      )}
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
                  if (selectedEvent.loginstatus.toLowerCase() === 'ended') {
                  isEnded = selectedEvent.loginstatus.toLowerCase() === 'ended';
                  }
                  if (selectedEvent.loginstatus.toLowerCase() === 'none') {
                  Alert.alert('Error', 'Where did you even go wring from here?');
                  return;
                  }
                } else if (selectedLog === 'logout') {
                  if (selectedEvent.loginstatus.toLowerCase() === 'ended') {
                  isEnded = selectedEvent.logoutstatus.toLowerCase() === 'ended';
                  } else if (selectedEvent.logoutstatus.toLowerCase() === 'ongoing' && selectedEvent.loginstatus.toLowerCase() === 'none') {
                    ToastAndroid.show(`${selectedOption} logout`, ToastAndroid.SHORT);
                  } else {
                    Alert.alert('Login not Done',`${selectedOption} login is still ongoing!`);
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
            setselectedLog(selectedLog);
          }}
        >
          <Text style={styles.buttonText}>Mount Event</Text>
          
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sbutton}
          title="Modify"
          onPress={() => {
            if (selectedOption && flag === true) {
              setPurgeOptionsModalVisible(true), { selectedMode };
            } else {
              // error handling
              Alert.alert('Invalid Option', 'Please pick a valid/non-ended Event.');
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
      
      <PurgeOptionsScreen
        visible={purgeOptionsModalVisible}
        onClose={() => setPurgeOptionsModalVisible(false)}
        onPurge={handlePurgeOptions}
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
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
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
