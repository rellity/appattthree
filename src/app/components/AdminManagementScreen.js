import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { useApiUrl } from "../../utils/ApiUrlContext";

import { AntDesign } from "@expo/vector-icons";
import AwesomeAlert from "react-native-awesome-alerts";

const AdminManagementScreen = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");
  const [fname, setFname] = useState("");
  const { apiUrl } = useApiUrl();
  const [api, setApiUrl] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [maskModalPassword, setMaskModalPassword] = useState(false);

  const maskPassword1 = (password) => {
    if (maskModalPassword) {
      return password;
    } else {
      return "*".repeat(password.length);
    }
  };

  const check = [apiUrl];

  useEffect(() => {
    fetchAdmins();
    console.log(maskModalPassword);
  }, []);

  const fetchAdmins = async () => {
    setShowLoading(true);
    try {
      const response = await axios.get(`${check}/attappthree/admfetch.php`);
      setAdmins(response.data.admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
    setShowLoading(false);
  };

  const handleOpenModal = (admin) => {
    setSelectedAdmin(admin);
    setModalVisible(true);
    setUname(admin.uname);
    setPass(admin.pass);
    setFname(admin.fname);
    setMaskModalPassword(false);
  };

  const handleOpenModalAdd = () => {
    setModalVisible(true);
    clearInputs();
    setMaskModalPassword(false);
  };

  const handleCloseModal = () => {
    setSelectedAdmin(null);
    setModalVisible(false);
    clearInputs();
    setMaskModalPassword(false);
  };

  const handleSaveAdmin = async () => {
    try {
      const url = selectedAdmin
        ? `${check}/attappthree/editadm.php`
        : `${check}/attappthree/createadm.php`;

      await axios.get(url, {
        params: {
          id: selectedAdmin?.id,
          uname,
          pass,
          fname,
        },
      });

      Alert.alert(
        "Admin " + (selectedAdmin ? "updated" : "added") + " successfully",
        "",
        [
          {
            text: "OK",
            onPress: () => {
              fetchAdmins();
              handleCloseModal();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error saving admin:", error);
      Alert.alert("Error", "Failed to save admin");
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      Alert.alert(
        "Delete Admin",
        "Are you sure you want to delete this admin?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              await axios.get(
                `${check}/attappthree/deleteadm.php?id=${adminId}`
              );
              Alert.alert("Admin deleted successfully");
              fetchAdmins();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error deleting admin:", error);
      Alert.alert("Error", "Failed to delete admin");
    }
  };

  const AdminItem = ({ item }) => (
    <View style={styles.adminItemContainer}>
      <View style={styles.adminItemContent}>
        <View style={styles.adminItemRow}>
          <Text style={styles.adminItemLabel}>Username:</Text>
          <Text style={styles.adminItemValue}>{item.uname}</Text>
        </View>
        <View style={styles.adminItemRow}>
          <Text style={styles.adminItemLabel}>Password:</Text>
          <Text style={styles.adminItemValue}>
            {selectedAdmin && selectedAdmin.id === item.id && !maskModalPassword
              ? item.pass
              : "*".repeat(item.pass.length)}
          </Text>
        </View>
        <View style={styles.adminItemRow}>
          <Text style={styles.adminItemLabel}>Fullname:</Text>
          <Text style={styles.adminItemValue}>{item.fname}</Text>
        </View>
      </View>
      <View style={styles.adminItemActions}>
        <TouchableOpacity
          onPress={() => handleOpenModal(item)}
          style={styles.editButton}
        >
          <AntDesign name="edit" size={30} color="green" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteAdmin(item.id)}
          style={styles.deleteButton}
        >
          <AntDesign name="delete" size={30} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerCell}>Accounts List</Text>
    </View>
  );

  const clearInputs = () => {
    setUname("");
    setPass("");
    setFname("");
  };

  const handleUnameChange = (text) => {
    const formattedText = text.replace(/\s/g, "").toLowerCase();
    if (formattedText.length <= 10) {
      setUname(formattedText);
    }
  };

  const handlePassChange = (text) => {
    const formattedText = text.replace(/\s/g, "").toLowerCase();
    if (formattedText.length <= 10) {
      setPass(formattedText);
    }
  };

  const handleFnameChange = (text) => {
    if (text.length <= 30) {
      setFname(text);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.headerText}>
          Officer Accounts Management Screen
        </Text>
      </View>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={admins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <AdminItem item={item} />}
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text>{selectedAdmin ? "Edit Admin" : "Add Admin"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={uname}
              onChangeText={handleUnameChange}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={pass}
              onChangeText={handlePassChange}
            />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fname}
              onChangeText={handleFnameChange}
            />
          </View>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              onPress={handleSaveAdmin}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Close</Text>
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
      <TouchableOpacity style={styles.addButton} onPress={handleOpenModalAdd}>
        <Text style={styles.buttonText}>Add Admin</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  addButton: {
    width: "80%",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 4,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    width: "80%",
  },
  modalButtonsContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginLeft: 10,
  },
  modalButton: {
    width: "48%",
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 4,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: "100%",
  },
  headerCell: {
    width: "98%",
    textAlign: "center",
    borderWidth: 1,
    padding: 4,
    margin: 2,
    marginBottom: 5,
  },
  alertContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
  },
  adminItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Background color
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2, // Shadow for Android
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  adminItemContent: {
    flex: 1,
  },
  adminItemRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  adminItemLabel: {
    fontWeight: "bold",
    marginRight: 4,
  },
  adminItemValue: {
    flex: 1,
  },
  adminItemActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 10,
  },
});

export default AdminManagementScreen;
