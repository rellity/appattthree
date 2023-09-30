import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { Dialog } from '@rneui/themed';
import { useApiUrl } from './ApiUrlContext';

const BarcodeGenerator = () => {
  const [barcodeData, setBarcodeData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isBarcodeDialogVisible, setBarcodeDialogVisible] = useState(false);
  const { apiUrl } = useApiUrl();

  const generateBarcode = async () => {
    try {
        if (!apiUrl) {
          console.error('API URL is not set.');
          return;
        }
        
        var compurl = `http://${apiUrl}/attappthree/barcode.php`;

        const response = await axios.get(compurl, {
          params: { value: inputValue },
        });
      setBarcodeData(response.data);
    } catch (error) {
      console.error(compurl, error);
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

  useEffect(() => {
    const fetchApiUrl = async () => {
      try {
        const storedApiUrl = await AsyncStorage.getItem('apiUrl');
        if (storedApiUrl) {
          setApiUrl(storedApiUrl);
        }
      } catch (error) {
        console.error('Error fetching API URL:', error);
      }
    };

    fetchApiUrl();
  }, []); // Empty dependency array means this effect runs once on mount

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
      {barcodeData && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Text: {barcodeData.text}</Text>
          <Image
            source={{
              uri: `data:image/png;base64,${barcodeData.barcodeImage}`,
            }}
            style={styles.barcodeImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.showBarcodeButton}
            onPress={openBarcodeDialog}
          >
            <Text style={styles.buttonText}>Show Barcode</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.footerText}>ICTS 2023-2024</Text>

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
    borderRadius:20,
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
