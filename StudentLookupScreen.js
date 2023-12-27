import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, Button } from 'react-native';
import axios from 'axios'; 
import { useApiUrl } from './ApiUrlContext';
import AwesomeAlert from 'react-native-awesome-alerts';
import CameraModal from './CameraModal';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Entypo } from '@expo/vector-icons';

const StudentLookupScreen = () => {
  const [idNumber, setIdNumber] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [fineData, setFineData] = useState(null);
  const { apiUrl } = useApiUrl();
  const [showLoading, setShowLoading] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  const check = [apiUrl];


  const handleBarCodeScanned = ({ type, data }) => {
    if (type === BarCodeScanner.Constants.BarCodeType.code128) {
     setIdNumber(data);
    } else {
      return;
    }
    setIsCameraVisible(false);
  };

  useEffect(() => {
    if (idNumber && idNumber.length === 9 && isCameraVisible === true) {
      setTimeout(() => {
        handleLookup();
        setIsCameraVisible(false);
      }, 100);
    }
  }, [idNumber]);

  const handleLookup = async () => {

    if (idNumber.trim() === '') {
      Alert.alert('Please enter an ID number.');
      return;
    }
    
    try {
      setShowLoading(true);
      const compurl = `${check}/attappthree/student_lookup.php`;
  
      const response = await axios.get(compurl, {
        params: {
          id: idNumber,
        },
      });
  
      if (response.data && response.data.error) {
        Alert.alert('Student not found.');
      } else if (response.data) {
        setStudentData(response.data);
        console.log(response.data);
  
        try {
          const eventUrl = `${check}/attappthree/event_lookup.php`;
          const secondResponse = await axios.get(eventUrl, {
            params: {
              id: idNumber,
            },
          });
          console.log("sc",secondResponse.data);
  
          if (secondResponse.data) {
            setEventData(secondResponse.data);
            console.log('Second Response:', secondResponse.data);
  
            try {
              const fineUrl = `${check}/attappthree/calculate_fine.php`;
              const fineResponse = await axios.get(fineUrl, {
                params: {
                  id: idNumber,
                },
              });
  
              if (fineResponse.data) {
                setFineData(fineResponse.data.total_fine);
                console.log('Fine Response:', fineResponse.data.total_fine);
              } else {
                Alert.alert('No fine data found.');
              }
            } catch (error) {
              Alert.alert('Error calculating fine:', error.message);
            }
          } else {
            Alert.alert('No event data found.');
          }
        } catch (error) {
          Alert.alert('Error fetching event data:', error.message);
        }
      } else {
        Alert.alert('Student not found.');
      }
    } catch (error) {
      Alert.alert('Error:', error.message);
    }
    setShowLoading(false);
  };

  const handleInputChange = (text) => {
    if (/^\d{0,7}-?\d{0,1}$/.test(text)) {
      setIdNumber(text);
    }
  };


  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
      <TextInput
        style={styles.input}
        value={idNumber}
        onChangeText={handleInputChange}
        placeholder="ID Number"
      />
      <TouchableOpacity style={styles.button2} onPress={() => setIsCameraVisible(true)}>
      <Entypo
        name="camera"
        size={30}
        color="white" />
      </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLookup}>
        <Text style={styles.buttonText}>Lookup Student</Text>
      </TouchableOpacity>

      

      {studentData || eventData || fineData ? (
        <View style={styles.scrollableCard}>
            
              
            {!studentData && !eventData && !fineData && (
              <View style={styles.invalidIdContainer}>
                <Text>Enter a valid ID number</Text>
              </View>
            )}

              {studentData && (
                <View style={styles.studentInfoContainer}>
                  <Text>Name  : {studentData.name}</Text>
                  <Text>ID No.: {studentData.stuid}</Text>
                  <View style={styles.divider} />
                </View>
              )}

              {fineData !== null && fineData !== undefined ? (
                  <View style={styles.studentInfoContainer}>
                      <Text>Total Fine: ₱{fineData}</Text>
                  </View>
              ) : (
                  <View style={styles.studentInfoContainer}>
                      <Text>Total Fine: ₱0</Text>
                  </View>
              )}
              
              <ScrollView style={{ flexGrow: 1 }}>
              {eventData && (
                    <View style={styles.eventDataContainer}>
                        {eventData.error ? (
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.errorText}>{eventData.error}</Text>
                            </View>
                        ) : (
                            Object.keys(eventData).map((eventKey) => {
                                const eventDataValue = eventData[eventKey];
                                return (
                                    <View key={eventKey} style={{ alignItems: 'center' }}>
                                        <Text style={styles.eventKey}>{eventKey} : </Text>
                                        {Object.keys(eventDataValue).map((key) => (
                                            <Text key={`${eventKey}-${key}`}>
                                                {key}: {eventDataValue[key] ? 'Present' : 'Absent'}
                                            </Text>
                                        ))}
                                        <View style={styles.divider} />
                                    </View>
                                );
                            })
                        )}
                    </View>
                )}
            </ScrollView>
          </View>
          ) : null}

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

      <CameraModal
        isVisible={isCameraVisible}
        onClose={() => setIsCameraVisible(false)}
        handleBarCodeScanned={handleBarCodeScanned}
      />

    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    input: {
      width: 250,
      height: 50,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      padding: 10,
      marginRight: 10
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    button: {
      width: 200,
      height: 50,
      backgroundColor: '#007bff',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10
    },
    button2: {
      width: 50,
      height: 50,
      backgroundColor: '#007bff',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollableCard: {
      padding: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      maxHeight: 580,
      width: 300,
    },
    studentInfoContainer: {
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#f5f5f5',
    },
    eventDataContainer: {
      padding: 10,
      backgroundColor: '#f5f5f5',
    },
    eventKey: {
      fontWeight: 'bold',
      padding: 5,
    },
    divider: {
      height: 1,
      backgroundColor: '#ccc',
      margin: 10,
    },
  });
  

export default StudentLookupScreen;
