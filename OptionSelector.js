import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const OptionSelector = () => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get('http://192.168.1.101/attappthree/getOptions.php'); // Replace with your PHP API URL
      setOptions(response.data);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  return (
    <View>
      <Text>Select an option:</Text>
      <Picker
        selectedValue={selectedOption}
        onValueChange={(itemValue) => setSelectedOption(itemValue)}
      >
        <Picker.Item label="Select an option" value={null} />
        {options.map((option, index) => (
          <Picker.Item key={index} label={option.Tables_in_activity} value={option.Tables_in_activity} />
        ))}
      </Picker>
    </View>
  );
};

export default OptionSelector;
