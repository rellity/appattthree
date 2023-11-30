import React, { useState } from 'react';
import { View, Text, Modal, Button, StyleSheet, } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PurgeOptionsScreen = ({ visible, onClose, onPurge }) => {
  const [selectedOption, setSelectedOption] = useState('clearEvent');
  

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
          </Picker>

          <Text>{getDescription()}</Text>

          <View style={styles.buttonContainer}>
            <Button style={styles.vtn} title="GO" onPress={handlePurge} />
            <Button style={styles.vtn} title="Cancel" onPress={onClose} />
          </View>
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
    color: 'white',
    padding: 10,
    margin: 5,
  }
});

export default PurgeOptionsScreen;
