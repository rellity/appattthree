import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import LoaderView from './LoaderView';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [isLoading, setLoading] = useState(false); // State for loading animation
  const [isAlertVisible, setAlertVisible] = useState(false); //alert flag
  const route = useRoute();
  const selectedTable = route.params.selectedTable;


  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // const handleData = async (data) => {
  //   if (isLoading) {
  //     return;
  //   }
  //   setLoading(true);

  //   try {
  //     const response = await axios.get(
  //       `${apiUrl}/attappthree/scanres.php`,
  //       {
  //         params: {
  //           data: data,
  //         },
  //       }
  //     );

  //     // Handle the response here

  //     setLoading(false); // Hide loading animation

  //     alert(`Response from API: ${JSON.stringify(response.data)}`);
  //   } catch (error) {
  //     setLoading(false); // Hide loading animation
  //     alert('Error occurred: ' + error.message);
  //   }
  // };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (isAlertVisible) {
      return;
    }
    setScanned(true);
    setLoading(true); // loading animation enacle
    

    // async operations
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false); // hide loading animation

    Alert.alert(
      `scanned data`, 
      `id number: ${data} \nformat: ${type}` ,
      [
        {
          text: 'OK',
          onPress: () => {
            setScanned(false); //continur
          }
        }
      ]);
      

    
    
    // To continue scanning, reset the 'scanned' state after a short delay.
    // setTimeout(() => {
    //   setScanned(false);
    // }, 2000); // Adjust the delay as needed (e.g., 2000 milliseconds or 2 seconds)
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
      </View>
    );
  };

  const renderManualInput = () => {
    if (showManualInput) {
      return (
        <View style={styles.manualInputContainer}>
          <TextInput
            style={styles.manualInput}
            placeholder="Enter barcode manually (e.g., 123456-7)"
            value={manualInput}
            onChangeText={text => handleManualInput(text)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (/^\d{6}-\d$/.test(manualInput)) {
                // Handle valid manual input here
                alert(`Manually entered barcode: ${manualInput}`);
                setManualInput('');
              } else {
                alert('Invalid barcode format. Please enter in the correct format "xxxxxx-x".');
              }
              setShowManualInput(false); // Close the manual input section
            }}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission not granted</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>Scan a barcode to start your job.</Text>
      {renderCamera()}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setScanned(false);
          setShowManualInput(prevState => !prevState);
          setManualInput('');
        }}
        disabled={scanned}
      >
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>


      {renderManualInput()}

      {/* Loading Modal */}
      {isLoading && (
      <View style={styles.loadingContainer}>
        <View style={styles.top}>
        
        <LoaderView isActive={isLoading} />
        
        </View>
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 40,
  },
  cameraContainer: {
    width: '80%',
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 40,
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  manualInputContainer: {
    marginBottom: 20,
  },
  manualInput: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
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
});
