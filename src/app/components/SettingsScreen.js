import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ToastAndroid,
  TouchableHighlight,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CheckBox, Card } from "react-native-elements";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import AwesomeAlert from "react-native-awesome-alerts";
import { useApiUrl } from "../../utils/ApiUrlContext";

const SettingsScreen = () => {
  const [apiUrl, setApiUrl] = useState("");
  const [useHttps, setUseHttps] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const { resetNavigationStack } = useApiUrl();

  useEffect(() => {
    const fetchApiUrl = async () => {
      try {
        const storedApiUrl = await SecureStore.getItemAsync("apiUrl");
        if (storedApiUrl) {
          setApiUrl(storedApiUrl);
          setUseHttps(storedApiUrl.startsWith("https://"));
        }
      } catch (error) {
        console.error("Error fetching API URL:", error);
      }
    };

    fetchApiUrl();
  }, []);

  const navigation = useNavigation();

  const handleSave = async () => {
    try {
      console.log("useHttps:", useHttps);

      if (!apiUrl) {
        Alert.alert("API URL cannot be empty", "null", [
          { text: "Ok", style: "default" },
        ]);
        return;
      }

      const protocol = useHttps ? "https://" : "http://";
      const fullapiUrl = /^(https?|ftp):\/\//i.test(apiUrl)
        ? apiUrl
        : `${protocol}${apiUrl}`;

      Alert.alert("Confirm Save", `Save API URL: ${fullapiUrl}?`, [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save",
          onPress: async () => {
            try {
              await SecureStore.setItemAsync("apiUrl", fullapiUrl);

              handleResetStack();

              ToastAndroid.showWithGravityAndOffset(
                `API URL saved: ${fullapiUrl}`,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
            } catch (error) {
              console.error("Error saving API URL:", error);
              Alert.alert("Error saving API URL", error, [
                { text: "Ok", style: "default" },
              ]);
            }
          },
        },
      ]);
    } catch (error) {
      console.error("Error saving API URL:", error);
      Alert.alert("Error saving API URL", error, [
        { text: "Ok", style: "default" },
      ]);
    }
  };

  const handleResetStack = () => {
    resetNavigationStack();

    navigation.reset({
      index: 0,
      routes: [{ name: "MainPage" }],
    });
  };

  // const handleTestApi = async () => {
  //   setShowLoading(true);
  //   try {
  //     const response = await axios.get(`${apiUrl}/test_api.php`);

  //     if (response.data) {
  //       setApiResponse('api call success');
  //       setShowLoading(false);
  //       ToastAndroid.showWithGravityAndOffset(`api call success`, ToastAndroid.BOTTOM, ToastAndroid.LONG, 25, 50);
  //     } else if (response.data == null) {
  //         setShowLoading(false);
  //         ToastAndroid.showWithGravityAndOffset(`press again`, ToastAndroid.BOTTOM, ToastAndroid.LONG, 25, 50);
  //     } else {
  //       setApiResponse('server call failed');
  //       setShowLoading(false);
  //     }

  //   } catch (error) {
  //     console.error('error:', error);
  //     ToastAndroid.showWithGravityAndOffset(`server call failed`, ToastAndroid.BOTTOM, ToastAndroid.LONG, 25, 50);
  //     setShowLoading(false);
  //   }
  // };

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.cardContainer}>
        <Card.Title style={styles.title}>Server Settings</Card.Title>
        <TextInput
          placeholder="Enter API URL"
          value={apiUrl.replace(/^(https?|ftp):\/\//, "")}
          onChangeText={(text) => setApiUrl(text)}
          style={[styles.input, styles.focusedInput]}
        />

        <View style={styles.checkboxContainer}>
          <CheckBox
            title="Use HTTPS"
            checked={useHttps}
            onPress={() => setUseHttps(!useHttps)}
            containerStyle={styles.checkboxInnerContainer}
            textStyle={styles.checkboxText}
          />
        </View>
        {/* <TouchableHighlight
          style={styles.saveButton}
          underlayColor="#2980b9"
          onPress={handleTestApi}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>Test Server</Text>
        </TouchableHighlight> */}

        <TouchableHighlight
          style={styles.saveButton}
          underlayColor="#2980b9"
          onPress={handleSave}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Save</Text>
        </TouchableHighlight>
      </Card>

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
    justifyContent: "flex-start", // Adjusted to place the card higher
    alignItems: "center",
    padding: 20,
  },
  cardContainer: {
    width: "100%",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20, // Added margin to the bottom
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5, // Add border radius
    backgroundColor: "white", // Add background color
    elevation: 2, // Add elevation for a subtle shadow
  },
  focusedInput: {
    borderColor: "#3498db",
  },
  checkboxContainer: {
    flexDirection: "row", // Align checkboxes horizontally
    alignItems: "center",
    marginTop: 10, // Added margin to the top
  },
  checkboxInnerContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    margin: 0,
    padding: 0,
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 10, // Added spacing to the left of the checkbox text
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 20,
    marginTop: 20, // Added margin to the top
    width: "100%",
    alignItems: "center",
  },
});

export default SettingsScreen;
