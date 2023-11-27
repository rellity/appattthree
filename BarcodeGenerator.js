import React, { useState, useEffect } from 'react';
import { View,Image,Text,TextInput,StyleSheet,TouchableOpacity,Alert,Platform } from 'react-native';
import axios from 'axios';
import { Dialog } from '@rneui/themed';
import { useApiUrl } from './ApiUrlContext';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as SecureStore from 'expo-secure-store'

function BarcodeGenerator() {
  const [barcodeData, setBarcodeData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [fullname, setname] = useState('');
  const [yearsec, setys] = useState('');
  const [isBarcodeDialogVisible, setBarcodeDialogVisible] = useState(false);
  const { apiUrl } = useApiUrl();
  const [error, setError] = useState(null); 
  const [imageUri, setImageUri] = useState(null);
  const [api, setApiUrl] = useState('')
  const [showLoading, setShowLoading] = useState(false);


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

  const registerStudent = async () => {
    try {
      const registerUrl = [api || apiUrl];
      const registerCompUrl = `${registerUrl}/attappthree/student_register.php`;
  
      const registerResponse = await axios.get(registerCompUrl, {
        params: {
          name: fullname,
          value: inputValue,
          yearsec: yearsec,
        },
      });
  
      console.log(registerResponse.data); // debug dance
  
      return registerResponse.data; // Return the response data for further handling
    } catch (error) {
      console.log(error);
      return { success: false, message: 'An unexpected error occurred during registration.' };
    }
  };
  
  const generateBarcodeImage = async () => {
    try {
      const check = [api || apiUrl];
      const compurl = `${check}/attappthree/barcode.php`;
  
      const response = await axios.get(compurl, {
        params: {
          value: inputValue,
          name: fullname,
        },
      });
  
      if (!compurl) {
        Alert.alert('Error', 'Server error');
        return;
      }
  
      setBarcodeData(response.data);
  
      const folderName = 'barcodes';
      const folderUri = `${FileSystem.documentDirectory}${folderName}/`;
  
      await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
  
      const localUri = `${folderUri}barcode.png`;
      await FileSystem.writeAsStringAsync(localUri, response.data.barcodeImage, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
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
    }
  };
  
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
  
      setShowLoading(true);
  
      // Trigger student registration
      const registrationResult = await registerStudent();
  
      if (registrationResult.success) {
        // Registration successful, proceed with barcode generation
        await generateBarcodeImage();
      } else {
        // Registration failed, show an alert
        Alert.alert('Student Registration Failed', registrationResult.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoading(false);
    }
  };
  
  

  const handleInputChange = (text) => {
    if (/^\d{0,7}-?\d{0,1}$/.test(text)) {
      setInputValue(text);
    }
  };
  const handlenamechange = (text) => {
    setname(text);
  };
  const handleyschange = (text) => {
    setys(text);
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
  
      const barcodeFolder = `${FileSystem.documentDirectory}barcode/`;
  
      // Check if the barcode folder exists, create it if not
      const folderInfo = await FileSystem.getInfoAsync(barcodeFolder);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(barcodeFolder, { intermediates: true });
      }
  
      const barcodePath = `${barcodeFolder}barcode.png`;
  
      // Check if the file already exists
      const assetInfo = await MediaLibrary.getAssetInfoAsync(barcodePath);
      if (assetInfo) {
        // File exists, delete it before creating a new one
        await MediaLibrary.deleteAsync(assetInfo);
      }
  
      // Save the image to the specified location
      await FileSystem.copyAsync({
        from: imageUri,
        to: barcodePath,
      });
  
      // Share the saved image
      await Sharing.shareAsync(barcodePath);
  
      
    } catch (error) {
      console.error('Error sharing:', error.message);
      Alert.alert(error);
    } 
    
  };
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register and Generate Student Barcode</Text>
      <TextInput
        placeholder="Enter Student ID number (xxxxxxx-x)"
        value={inputValue}
        onChangeText={handleInputChange}
        maxLength={9}
        style={styles.input} />
      <TextInput
        placeholder="Enter Fullname"
        value={fullname}
        onChangeText={handlenamechange}
        maxLength={50}
        style={styles.input} />
      <TextInput
        placeholder="Enter Year and Section (ex:4A..eg)"
        value={yearsec}
        onChangeText={handleyschange}
        maxLength={2}
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
        <Dialog.Title title="Successfuly Registered" />
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

      {/* Awesome Alert for loading state */}
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
    color: '#007AFF', // Customize the title color
    marginBottom: 10,
  },
});

export default BarcodeGenerator;
