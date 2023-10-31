import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useApiUrl } from './ApiUrlContext';

const OptionSelector = () => {
  const { apiUrl } = useApiUrl();
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
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
