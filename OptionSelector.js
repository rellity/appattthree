import React, { useState, useEffect } from 'react';
import { View, Text, Alert,TouchableOpacity, StyleSheet, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useApiUrl } from './ApiUrlContext';
import { useNavigation } from '@react-navigation/native';

const OptionSelector = () => {
  const { apiUrl } = useApiUrl();
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [tableData, setTableData] = useState([]);
  const navigation = useNavigation();


  const formatData = (data) => {
    return data.map((item) => ` created on: ${item.logtime} \n created by: ${item.createdby}`).join('\n');
  };

  useEffect(() => {
    // Fetch options initially
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/attappthree/getOptions.php`);
      setOptions(response.data);
    } catch (error) {
      Alert.alert('Error fetching options:', error);
    }
  };

  

  const handleOptionChange = async (itemValue) => {

    setSelectedOption(itemValue);

    console.log('Selected option:', itemValue);
  
    try {
      if (itemValue) {

        const responselink = `${apiUrl}/attappthree/getOptionsInfo.php`;

        const response = await axios.get(responselink,{ params: {value: itemValue},});
  
        if (response.data.error) {
          // error handling
          Alert.alert('Error fetching data for the selected table:', response.data.error);
          setTableData([]); 
        } else {
          // output data
          setTableData(response.data);
        }
  
        // log
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
        <Picker.Item label="Select an option" value={null} />
        {options.map((option, index) => (
          <Picker.Item
            key={index}
            label={option.Tables_in_appattthree}
            value={option.Tables_in_appattthree}
          />
        ))}
      </Picker>
      
      <TouchableOpacity
        style={styles.button}
        title="Mount"
        onPress={() => {
          if (selectedOption) {
            // go to scanner
            navigation.navigate('BarcodeScanner', { selectedTable: selectedOption });
          } else {
            // error handling
            Alert.alert('Please select a table before mounting.');
          }
        }}
      >
        <Text style={styles.buttonText}>Mount Event</Text>
        
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => null}
      >
        <Text style={styles.buttonText}>Create Event</Text>
      </TouchableOpacity>

      {tableData.length > 0 && (
          <Text>{formatData(tableData)}</Text>
      )}

      
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'collumn',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Background color for the container
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  picker: {
    width: 300, // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OptionSelector;
