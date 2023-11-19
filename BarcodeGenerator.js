import React, { useState, useEffect } from 'react';
import { View,Image,Text,TextInput,StyleSheet,TouchableOpacity,Alert } from 'react-native';
import axios from 'axios';
import { Dialog } from '@rneui/themed';
import { useApiUrl } from './ApiUrlContext';

const BarcodeGenerator = () => {
  const [barcodeData, setBarcodeData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isBarcodeDialogVisible, setBarcodeDialogVisible] = useState(false);
  const { apiUrl } = useApiUrl();
  const [error, setError] = useState(null); // New error state

  const generateBarcode = async () => {
    try {
      if (!inputValue) {
        Alert.alert('Error', 'Input value cannot be blank.');
        return;
      }

      
  
      const compurl = `${apiUrl}/attappthree/barcode.php`;
  
      const response = await axios.get(compurl, {
        params: { value: inputValue },
      });

      if (!compurl) {
        Alert.alert('Error', 'server error');
        return;
      }
  
      setBarcodeData(response.data);
      setError(null);
  
      openBarcodeDialog();
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError('Server error. Please try again later.');
        console.error(compurl, error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        setError('Network error. Please check your internet connection.');
        console.error(compurl, 'No response received');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An unexpected error occurred.');
        console.error(compurl, error.message);
      }
    }
  };

  const handleInputChange = (text) => {
    if (/^\d{0,7}-?\d{0,1}$/.test(text)) {
      setInputValue(text);
    }
  };

  const openBarcodeDialog = () => {
    setBarcodeDialogVisible(true);
  };

  const closeBarcodeDialog = () => {
    setBarcodeDialogVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barcode Generator</Text>
      <TextInput
        placeholder="Enter barcode value (xxxxxxx-x)"
        value={inputValue}
        onChangeText={handleInputChange}
        maxLength={9}
        style={styles.input}
      />
      <TouchableOpacity
        style={styles.generateButton}
        onPress={generateBarcode}
      >
        <Text style={styles.buttonText}>Generate Barcode</Text>
      </TouchableOpacity>

      {/* Barcode Dialog */}
      <Dialog
        isVisible={isBarcodeDialogVisible}
        onBackdropPress={closeBarcodeDialog}
      >
        <Dialog.Title title="Barcode Dialog" />
        {barcodeData && (
          <View style={styles.barcodeContainer}>
            <Image
              source={{
                uri: `data:image/png;base64,${barcodeData.barcodeImage}`,
              }}
              style={styles.barcodeImage}
              resizeMode="contain"
            />

            <Text style={styles.footerText}>ICTS 2023-2024</Text>
            
          </View>
        )}
        <Dialog.Actions>
          <Dialog.Button title="Close" onPress={closeBarcodeDialog} />
        </Dialog.Actions>
      </Dialog>
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
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
  },
  barcodeImage: {
    width: 200,
    height: 100,
  },
  showBarcodeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  footerText: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },

  barcodeContainer: {
    alignItems: 'center',
    padding: 20,
  },

  barcodeImage: {
    width: 200,
    height: 100,
  },
});

export default BarcodeGenerator;
