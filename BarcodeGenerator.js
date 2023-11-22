import React, { useState, useEffect } from 'react';
import { View,Image,Text,TextInput,StyleSheet,TouchableOpacity,Alert,Platform } from 'react-native';
import axios from 'axios';
import { Dialog } from '@rneui/themed';
import { useApiUrl } from './ApiUrlContext';
import LoaderView from './LoaderView';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as SecureStore from 'expo-secure-store'

function BarcodeGenerator() {
  const [barcodeData, setBarcodeData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isBarcodeDialogVisible, setBarcodeDialogVisible] = useState(false);
  const { apiUrl } = useApiUrl();
  const [error, setError] = useState(null); 
  const [isLoading, setLoading] = useState(false); //loading animation flag
  const [imageUri, setImageUri] = useState(null);
  const [api, setApiUrl] = useState('')


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
    console.log({api});
  }, []);

  const check = [ api || apiUrl ];
  console.log(check);

  useEffect(() => {
    (async () => {
      // Request permission to access media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access media library is required.');
      }
    })();
  }, []);

  const generateBarcode = async () => {
    try {
      if (!inputValue) {
        Alert.alert('Error', 'Input value cannot be blank.');
        return;
      }

      if (inputValue.length !== 9) {
        Alert.alert('Error', 'Input value (xxxxxxx-x) should have exactly 9 characters.');
        return;
      }

      setLoading(true);
      const check = [ api || apiUrl ];

      const compurl = `${check}/attappthree/barcode.php`;

      const response = await axios.get(compurl, {
        params: { value: inputValue },
      });

      

      if (!compurl) {
        Alert.alert('Error', 'Server error');
        return;
      }

      setBarcodeData(response.data);
      // Save the image to a local file with a proper extension
      const localUri = `${FileSystem.documentDirectory}barcode.png`;
      await FileSystem.writeAsStringAsync(localUri, response.data.barcodeImage, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Set the image URI for sharing
      setImageUri(localUri);
      console.log(localUri);
      setError(null);
      openBarcodeDialog();

    } catch (error) {
      if (error.response) {
        Alert.alert('Server error. Please try again later.');
        console.error(error.response.data);
      } else if (error.request) {

        Alert.alert('No response received', 'Please check your internet/api connection');
      } else {
        Alert.alert('An unexpected error occurred.');
        console.error(error.message);
      }
    } finally {
      setLoading(false);
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

  const handleShare = async () => {
    try {
      if (!imageUri) {
        console.error('Image URI is missing.');
        return;
      }
  
      // Request permission to access media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access media library is required.');
        return;
      }
  
      // Save the image to the app's document directory
      const asset = await MediaLibrary.createAssetAsync(imageUri);
  
      // Share the saved image
      await Sharing.shareAsync(asset.uri);
  
      setImageUri(null);
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barcode Generator</Text>
      <TextInput
        placeholder="Enter barcode value (xxxxxxx-x)"
        value={inputValue}
        onChangeText={handleInputChange}
        maxLength={9}
        style={styles.input} />
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
              resizeMode="contain" />

            

            <Text style={styles.footerText}>ICTS 2023-2024</Text>

            {/* Add a button for downloading the image */}
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleShare}
            >
              <Text style={styles.downloadButtonText}>Share Barcode</Text>
            </TouchableOpacity>

          </View>
        )}
        <Dialog.Actions>
          <Dialog.Button title="Close" onPress={closeBarcodeDialog} />
        </Dialog.Actions>
      </Dialog>

      {/* loading animal */}
      {isLoading && (
        <View style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <View style={styles.top}>
              <LoaderView isActive={isLoading} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

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

  loadingContainer: {
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
});

export default BarcodeGenerator;
