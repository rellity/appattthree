import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { useApiUrl } from './ApiUrlContext';
import * as SecureStore from 'expo-secure-store';
import { AntDesign } from '@expo/vector-icons';
import AwesomeAlert from 'react-native-awesome-alerts';

const AdminItem = ({ item, onEdit, onDelete }) => (
  <View style={styles.tableHeader}>
    <Text style={styles.headerCell}>{item.uname}</Text>
    <Text style={styles.headerCell}>{item.pass}</Text>
    <Text style={styles.headerCell}>{item.fname}</Text>
    <View style={styles.actionButtons}>
      <TouchableOpacity onPress={() => onEdit(item)}>
      <AntDesign name="edit" size={32} color="green" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item.id)}>
      <AntDesign name="delete" size={32} color="red" />
      </TouchableOpacity>
    </View>
  </View>
);

const AdminManagementScreen = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uname, setName] = useState('');
  const [pass, setPassword] = useState('');
  const [fname, setFname] = useState('');
  const { apiUrl } = useApiUrl();
  const [api, setApiUrl] = useState('');
  const [showLoading, setLoading] = useState(false); //loading animation flag

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
    console.log({ api });
  }, []);

  const check = [api || apiUrl];

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${check}/attappthree/admfetch.php`);
      const adminsArray = response.data.admins;

      setAdmins(adminsArray);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
    setLoading(false);
  };

  const handleOpenModal = (admin) => {
    console.log(admin.id);
    setSelectedAdmin(admin);
    setModalVisible(true);
    setName(admin.uname);
    setPassword(admin.pass);
    setFname(admin.fname);
  };

  const handleOpenModalAdd = () => {
    setModalVisible(true);
    clearInputs();
  };

  const handleCloseModal = () => {
    setSelectedAdmin(null);
    setModalVisible(false);
  };

  const handleSaveAdmin = async () => {
    try {
      if (selectedAdmin) {
        console.log(selectedAdmin.id)
        await axios.get(`${check}/attappthree/editadm.php`, {
          params: {
            id: selectedAdmin.id,
            uname,
            pass,
            fname,
          },
        });
        Alert.alert('Admin updated successfully');
        fetchAdmins();
      } else {
        // Add new admin
        await axios.get(`${check}/attappthree/createadm.php`, {
          params: {
            uname,
            pass,
            fname,
          },
        });
        Alert.alert('Admin added successfully');
      }

      fetchAdmins();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving admin:', error);
      // Handle error
      Alert.alert('Error', 'Failed to save admin');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      Alert.alert(
        'Delete Admin',
        'Are you sure you want to delete this admin?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              await axios.get(`${check}/attappthree/deleteadm.php?id=${adminId}`);
              Alert.alert('Admin deleted successfully');
              fetchAdmins();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error deleting admin:', error);
      // Handle error
      Alert.alert('Error', 'Failed to delete admin');
    }
  };

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerCell}>Username</Text>
      <Text style={styles.headerCell}>Password</Text>
      <Text style={styles.headerCell}>Full Name</Text>
      <Text style={styles.headerCell}>Actions</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <AdminItem
      item={item}
      onEdit={handleOpenModal}
      onDelete={handleDeleteAdmin}
    />
  );

  const clearInputs = () => {
    setName('');
    setPassword('');
    setFname('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Officer Accounts Management Screen</Text>

      <FlatList
        ListHeaderComponent={renderHeader}
        data={admins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleOpenModalAdd}>
        <Text style={styles.buttonText}>Add Admin</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text>{selectedAdmin ? 'Edit Admin' : 'Add Admin'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={uname}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={pass}
              onChangeText={(text) => setPassword(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fname}
              onChangeText={(text) => setFname(text)}
            />
          </View>
          <View style={{ width: '80%', flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity 
            title="Save"
            onPress={handleSaveAdmin}
            style={styles.btnT1}>
            
            <Text style={styles.btnT1Text}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            title="Cancel"
            onPress={handleCloseModal}
            style={styles.btnT1}>
               <Text style={styles.btnT1Text}>Close</Text>
          </TouchableOpacity>
        </View>
        </View>
      </Modal>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addButton: {
    width: "80%",
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 4,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '100%',
  },
  headerCell: {
    width: 100,
    textAlign: 'center',
    borderWidth: 1,
    padding: 2,
    marginBottom: 5,
  },
  
  editButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 4,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    marginLeft: 10,
  },
  tableHeader: {
    flexDirection: 'row',
  },
  btnT1: {
    width: '48%',
    marginTop: 10,
    padding: 10,
    backgroundColor: 'blue', // Adjust the color as needed
    borderRadius: 4,
  },
  btnT1Text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AdminManagementScreen;
