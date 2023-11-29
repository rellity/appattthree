import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { useApiUrl } from './ApiUrlContext';
import * as SecureStore from 'expo-secure-store';
import { AntDesign } from '@expo/vector-icons';

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
    try {
      const response = await axios.get(`${check}/attappthree/admfetch.php`);
      // Extract the admins array from the response data
      const adminsArray = response.data.admins;

      // Set the admins state with the extracted array
      setAdmins(adminsArray);
    } catch (error) {
      console.error('Error fetching admins:', error);
      // Handle error
    }
  };

  const handleOpenModal = (admin) => {
    console.log(admin.id);
    setSelectedAdmin(admin);
    setModalVisible(true);
    setName(admin.uname);
    setPassword(admin.pass);
    setFname(admin.fname);
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

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Admin Management Screen</Text>

      <FlatList
        ListHeaderComponent={renderHeader}
        data={admins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal(null)}>
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
            <Button title="Save" onPress={handleSaveAdmin} />
            <Button title="Cancel" onPress={handleCloseModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addButton: {
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
    padding: 10,
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
  }
});

export default AdminManagementScreen;
