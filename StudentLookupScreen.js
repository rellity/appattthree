import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios'; 
import { useApiUrl } from './ApiUrlContext';

const StudentLookupScreen = () => {
  const [idNumber, setIdNumber] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [fineData, setFineData] = useState(null);
  const { apiUrl } = useApiUrl();
  

  const handleLookup = async () => {
    if (idNumber.trim() === '') {
      Alert.alert('Please enter an ID number.');
      return;
    }
    
    try {
      const compurl = `${apiUrl}/attappthree/student_lookup.php`;
  
      const response = await axios.get(compurl, {
        params: {
          id: idNumber,
        },
      });
  
      if (response.data && response.data.error) {
        // Check if the response contains an error property
        Alert.alert('Student not found.');
      } else if (response.data) {
        setStudentData(response.data);
        console.log(response.data);
  
        try {
          const eventUrl = `${apiUrl}/attappthree/event_lookup.php`;
          const secondResponse = await axios.get(eventUrl, {
            params: {
              id: idNumber,
            },
          });
  
          if (secondResponse.data) {
            setEventData(secondResponse.data);
            console.log('Second Response:', secondResponse.data);
  
            try {
              const fineUrl = `${apiUrl}/attappthree/calculate_fine.php`;
              const fineResponse = await axios.get(fineUrl, {
                params: {
                  id: idNumber,
                },
              });
  
              if (fineResponse.data) {
                setFineData(fineResponse.data);
                console.log('Fine Response:', fineResponse.data);
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
  };


  return (
    <View style={styles.container}>
      <Text>Enter ID Number:</Text>
      <TextInput
        style={styles.input}
        value={idNumber}
        onChangeText={(text) => setIdNumber(text)}
        placeholder="ID Number"
      />
      <TouchableOpacity style={styles.button} onPress={handleLookup}>
        <Text style={styles.buttonText}>Lookup Student</Text>
      </TouchableOpacity>

      {studentData && ( 
        <View style={styles.studentInfoContainer}>
          <Text>Name  : {studentData.name}</Text>
          <Text>ID No.: {studentData.stuid}</Text>
          <View style={styles.divider} />
        </View>
      )}

      {eventData && (
        <View style={styles.eventDataContainer}>
          {Object.keys(eventData).map((eventKey) => (
            <Text key={eventKey}>
              {eventKey}: {eventData[eventKey] ? 'present' : 'absent'}
            </Text>
          ))}
          <View style={styles.divider} />
        </View>

      )}

      {fineData && ( 
        <View style={styles.studentInfoContainer}>
          <Text>Total Fines  :  ₱{fineData.total_fine}</Text>
          <View style={styles.divider} />
        </View>
      )}



    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'collumn',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    input: {
      width: 300,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      padding: 10,
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
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    studentInfoContainer: {
      marginTop: 20,
    },
    divider: {
    borderBottomColor: 'black', // Adjust color as needed
    borderBottomWidth: 1,
    marginVertical: 10, // Add space above and below the line
    },
  });
  

export default StudentLookupScreen;
