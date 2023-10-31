import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Modal from 'react-native-modal'; // Import the library

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [isLoading, setLoading] = useState(false); // State for loading animation
  const [isAlertVisible, setAlertVisible] = useState(false); //alert flag


  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (isAlertVisible) {
      return;
    }
    setScanned(true);
    setLoading(true); // loading here

    // async operations
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false); // hide loading animation

    alert(`barcode type: ${type}  \nid number: ${data}`);

    // To continue scanning, reset the 'scanned' state after a short delay.
    setTimeout(() => {
      setScanned(false);
    }, 2000); // Adjust the delay as needed (e.g., 2000 milliseconds or 2 seconds)
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
                alert('Invalid barcode format. Please enter in the format "xxxxxx-x".');
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
      <Text style={styles.title}>Welcome to the Barcode Scanner App!</Text>
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
        <Text style={styles.buttonText}>Scan QR to Start your job</Text>
      </TouchableOpacity>
      {renderManualInput()}

      {/* Loading Modal */}
      <Modal isVisible={isLoading} backdropOpacity={0.6}>
        <View style={styles.loadingModal}>
          <ActivityIndicator size="large" color="blue" />
          <Text>Loading...</Text>
        </View>
      </Modal>
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
  loadingModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
