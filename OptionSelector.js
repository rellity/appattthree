import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FlatList } from 'react-native';
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
    <View>
      <Text>Select an option:</Text>
      <Picker
        selectedValue={selectedOption}
        onValueChange={handleOptionChange}
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
      
      <Button
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
      />

      {tableData.length > 0 && (
          <Text>{formatData(tableData)}</Text>
      )}

      
    </View>
  );
};

export default OptionSelector;
