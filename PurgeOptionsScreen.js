import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';

const PurgeOptionsScreen = ({ visible, onClose, onPurge }) => {
  const [selectedOption, setSelectedOption] = useState('clearEvent');
  const [role, setrole] = useState('');
  
  useEffect(() => {
    (async () => {
      try {
        const storedRole = await SecureStore.getItemAsync('accprev');
        setrole(storedRole);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, []);

  const handlePurge = () => {
    onPurge(selectedOption);
  };

  const getDescription = () => {
    switch (selectedOption) {
      case 'clearEvent':
        return 'Clears all event entries in the selected table.';
      case 'clearLoginData':
        return 'Clears login data related to the selected table.';
      case 'clearLogoutData':
        return 'Clears logout data related to the selected table.';
      case 'deleteEventEntry':
        return 'Deletes the selected event entry.';
      case 'endLogin':
        return 'Ends Log in period, Allows Logout';
      case 'endLogout':
        return 'Ends Logout Period, also ends the Event itself';
      case 'EditEventTime':
        return 'Modify the End time for the Selected Event';
      default:
        return '';
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modal}>
        <View style={styles.modalContent}>
        <Text style={styles.selectedTableText}>Event Options</Text>

          <Picker
            selectedValue={selectedOption}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedOption(itemValue)}
          >
            <Picker.Item label="End Login Period" value="endLogin" />
            <Picker.Item label="End Logout Period" value="endLogout" />
            <Picker.Item label="Clear Event Entries" value="clearEvent" />
            <Picker.Item label="Clear Login Data" value="clearLoginData" />
            <Picker.Item label="Clear Logout Data" value="clearLogoutData" />
            <Picker.Item label="Delete Event Entry" value="deleteEventEntry" />
            {role === 'superadm' && (
              <Picker.Item label="Edit Event End Time" value="EditEventTime" />
            )}
          </Picker>

          <Text>{getDescription()}</Text>
        </View>
        <View style={{ width: '80%', flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={handlePurge} style={styles.vtn}>
                <Text style={styles.vtnText}>Go</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.vtn}>
              <Text style={styles.vtnText}>Close</Text>
        </TouchableOpacity>
        </View>
      </View>
      
        
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    width: '80%',
  },
  picker: {
    width: '100%',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  vtn: {
    width: '48%',
    marginTop: 10,
    padding: 10,
    backgroundColor: 'blue', // Adjust the color as needed
    borderRadius: 4,
  },
  vtnText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default PurgeOptionsScreen;
