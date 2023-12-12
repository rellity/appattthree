import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, ToastAndroid} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useApiUrl } from './ApiUrlContext';
import { Camera } from 'expo-camera';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView } from 'react-native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import AwesomeAlert from 'react-native-awesome-alerts';

export default function App() {
  const { apiUrl } = useApiUrl();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [showLoading, setLoading] = useState(false); //loading animation flag
  const [isAlertVisible, setAlertVisible] = useState(false); //alert flag
  const route = useRoute();
  const selectedTable = route.params.selectedTable;
  const selectedLogging = route.params.selectedLogging;
  const navigation = useNavigation();
  const [api, setApiUrl] = useState('');
  const [flashMode, setFlashMode] = useState(false);


  useEffect(() => {
    
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      navigation.setOptions({
        title: `mounted: ${selectedTable} : ${selectedLogging}`,
      });
    })();
  }, []);

  

  const handleData = async (data) => {
    if (showLoading) {[[[]]]
      return;
    }
    setLoading(true);
  
    try {
      const check = [apiUrl];
      const userResponse = await axios.get(`${check}/attappthree/stuidcheck.php`, {
        params: {
          stuid: data,
        },
      });
  
      if (userResponse.data.valid) {
        // If 'stuid' is valid in the 'user' table, proceed with the API call
        const response = await axios.get(`${check}/attappthree/scanres.php`, {
          params: {
            scannedData: data,
            selectedTable: selectedTable,
            selectedLog: selectedLogging,
          },
        });
  
        // response here
  
        setLoading(false); // Hide loading animation
  
        const responseData = response.data;
        console.log(responseData);

        if (responseData && responseData.success) {
          ToastAndroid.showWithGravityAndOffset(
            `success: data inserted successfully`,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        } else {
          ToastAndroid.showWithGravityAndOffset(
            `error: data already exists`,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        }
      } else {
        setLoading(false); // hide loading animation
        alert('Invalid stuid.');
      }
    } catch (error) {
      setLoading(false); // hide loading animation
      alert('Error occurred: ' + error.message);
    }


  };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (!showManualInput) {
      if (type === BarCodeScanner.Constants.BarCodeType.code128) {
        if (isAlertVisible) {
          return;
        }
        setScanned(true);
        setLoading(true);
  
        
        try {
          const result = await fetchStudentDetails(data);
          if (result && result.studentInfo) {
            Alert.alert('Student Found', `Student Id: ${data}\nStudent Name: ${result.studentInfo.name}`, [
              {
                text: 'Cancel',
                onPress: () => {
                  console.log('Cancel Pressed'),
                  setScanned(false);
                },
                style: 'cancel',
              },
              
              {
                text: 'OK',
                onPress: () => {
                  setScanned(false);
                  handleData(data); //pass to handle data
                },
              },
            ]);
          } else {
            Alert.alert('Student Not Found', `No data found for ID: ${data}`);
          }
        } catch (error) {
          setAlertVisible(true);
          Alert.alert('Error', 'Student ID not Registered.', [
            {
              text: 'OK',
              onPress: () => {
                setScanned(false);
                setAlertVisible(false);
              },
            },
          ]
          );
        }
        
        setLoading(false);
      } else {
        // eror toat
        setScanned(false);
        ToastAndroid.showWithGravityAndOffset(
          `Error: wrong format`,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    }
  };
  
  const fetchStudentDetails = async (barcodeData) => {
    const check = [apiUrl];
    return new Promise((resolve, reject) => {
      axios.get(`${check}/attappthree/namecheck.php?studentId=${barcodeData}`)
        .then(response => {
          if (response && response.data && response.data.studentInfo) {
            resolve(response.data);
          } else {
            reject('No student details found.');
          }
        })
        .catch(error => {
          reject('Error fetching student details.');
        });
    });
  };
  

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          onBarCodeScanned={scanned && !showManualInput ? undefined : handleBarCodeScanned}
          ref={(ref) => { this.camera = ref }}
          flashMode={flashMode ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        />
      </View>
    );
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
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.cameraContainer}>
        {renderCamera()}
        <View style={styles.highlightContainer}>
          <View style={styles.highlight} />
        </View>
        <View style={styles.manualInputContainer}>
          <TouchableOpacity onPress={() => setFlashMode(!flashMode)}>
          <Entypo
            name="flashlight"
            size={50}
            color={flashMode ? "#ffff00" : "#fff"} 
            style={{ marginBottom: 50, marginRight: 50 }}
          />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setShowManualInput(true);
          }}>
            <MaterialIcons name="input" size={50} color="white" style={{ marginBottom: 50, marginLeft: 50 }}/>
          </TouchableOpacity>
          
          <Modal
          isVisible={showManualInput}
          onBackdropPress={() => setShowManualInput(false)}
          style={styles.modal}
          >
          <View style={styles.modalContent}>
            <TextInput
              style={styles.manualInput}
              placeholder="Enter barcode manually (e.g., 1234567-8)"
              value={manualInput}
              onChangeText={text => setManualInput(text)}
            />
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  if (manualInput.trim() && /^\d{0,7}-?\d{0,1}$/.test(manualInput)) {
                    // Make the API call
                    try {
                      const check = [apiUrl];
                      const response = await axios.get(`${check}/attappthree/namecheck.php`, {
                        params: {
                          studentId: manualInput,
                        },
                      });

                      if (response.data && response.data.success) {
                        // Assuming response contains the desired student info, update state or show data
                        console.log(response.data.studentInfo);
                        // Set your state to handle the student information
                        const studentName = response.data.studentInfo.name;
                        Alert.alert(
                          'Student Data',
                          `Student ID: ${manualInput}\nStudent Name: ${studentName}`,
                          [
                            {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                            {
                              text: 'OK',
                              onPress: () => {
                                handleData(manualInput);
                              },
                            },
                          ],
                        );
                      } else {
                        Alert.alert( 
                          'Student Data', 
                          `${manualInput} is not registered.`);
                      }
                    } catch (error) {
                      alert('Error retrieving student data.');
                    }
                  } else {
                    if (manualInput.trim()) {
                      alert('Invalid id format. Please enter in the correct format "xxxxxxx-x".');
                    } else {
                      alert('Please enter a valid SLSU id number.');
                    }
                  }
                  setShowManualInput(false);
                }}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
          </View>
      </Modal>
      </View>
  
      {/* Loading Modal */}
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
        progressColor="#007AFF" 
      />
    </View>
    </KeyboardAvoidingView>
  );
  
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
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
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    position: 'absolute',
  },
  camera: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  highlightContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlight: {
    width: 260,
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    position: 'absolute'
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
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
  buttonTextex: {
    backgroundColor: 'blue', // Adjust the background color
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    elevation: 5,
  },
  manualInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
  },
  manualInput: {
    width: 300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
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
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  manualInput: {
    width: 300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

});
