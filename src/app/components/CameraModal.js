import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Camera } from 'expo-camera';

const CameraModal = ({ isVisible, onClose, handleBarCodeScanned }) => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          onBarCodeScanned={handleBarCodeScanned}
        />
        <View style={styles.highlightView} />
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {hasPermission ? (
          renderCamera()
        ) : (
          <Text>No access to camera</Text>
        )}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}> x </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  cameraContainer: {
    flex: 0,
    flexDirection: 'row',
    width: '80%',
    height: '40%',
    borderRadius: 10,
  },
  highlightView: {
    position: 'absolute',
    alignSelf: 'center', 
    marginTop: '10%',
    left: '10%', 
    width: '80%',
    height: '50%', 
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'grey', 
  },
  camera: {
    flex: 1,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    left: 330,
    bottom: 545,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 4,
    margin: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CameraModal;
