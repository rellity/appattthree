import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const PrivacyDisclaimer = ({ isVisible, onClose }) => {
  return (
    <View>
    <Modal isVisible={isVisible} animationIn="slideInUp" animationOut="slideOutDown">
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Privacy Disclaimer</Text>
        <Text style={styles.content}>
          Republic Act 10173 - Data Privacy Act of 2012
          {'\n\n'}
          General Data Privacy Principles. The processing of personal information shall be allowed, subject to compliance with the requirements of this Act and other laws allowing disclosure of information to the public and adherence to the principles of transparency, legitimate purpose, and proportionality.
        </Text>
        
      </View>
      <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonContainer} onPress={onClose}>
            <Text> I Agree </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer} onPress={onClose}>
            <Text> No </Text>
          </TouchableOpacity>
      </View>
    </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '80%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
    marginRight: 10,
  },
});

export default PrivacyDisclaimer;