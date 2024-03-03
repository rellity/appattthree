import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useApiUrl } from "../../utils/ApiUrlContext";

import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Card, Title } from "react-native-paper";
import Checkbox from "expo-checkbox";
import { TimerPickerModal } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";

const EventCreationScreen = () => {
  const { apiUrl } = useApiUrl();
  const [eventName, setEventName] = useState("");
  const [eventPrice, setEventPrice] = useState("");
  const [fname, setfname] = useState("");
  const check = apiUrl;
  const navigation = useNavigation();
  console.log("logs", check);
  const [isCheckedIN, setCheckedIN] = useState(true);
  const [isCheckedOUT, setCheckedOUT] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [alarmString, setAlarmString] = useState(null);
  const cdate = moment().utcOffset("+08:00");
  const [currentDate, setcurrentDate] = useState(cdate.format("YYYY-MM-DD"));
  const [endDate, setendDate] = useState(null);
  const [currentD] = useState(cdate.format("YYYY-MM-DD"));

  console.log("currentdate: ", currentDate);
  console.log("alarm time: ", alarmString);

  console.log("end date: ", endDate);
  useEffect(() => {
    const fetchstoredName = async () => {
      try {
        const storedfname = await SecureStore.getItemAsync("fname");
        if (storedfname) {
          setfname(storedfname);
        }
      } catch (error) {
        console.error("Error fetching API URL:", error);
      }
    };

    fetchstoredName();
  }, []);

  useEffect(() => {
    console.log(fname);
  }, [fname]); //

  console.log(isCheckedIN);
  console.log(isCheckedOUT);

  const handleOnChange = (newText) => {
    const sanitizedText = newText.replace(
      /[\s~`!@#\$%\^&\*\(\)\-+=\[\]\{\}\|\\\'\/\?\:"<>,\.]/g,
      ""
    );
    setEventName(sanitizedText);
  };

  function sanitizeText(text) {
    const sanitizedText = text.replace(/[^0-9]+/g, "");
    return sanitizedText;
  }

  const createEvent = async () => {
    if (eventPrice === "0") {
      Alert.alert("Error", "Fine value cannot be 0.");
      return;
    }

    if (!eventPrice) {
      Alert.alert("Error", "Fine value cannot be blank.");
      return;
    }

    if (!eventName) {
      Alert.alert("Error", "Event Name cannot be blank.");
      return;
    }

    if (!isCheckedIN && !isCheckedOUT) {
      Alert.alert("Error", "Select at least 1 log method.");
      return;
    }

    if (alarmString === null) {
      Alert.alert("Error", "Please set a valid end time");
      return;
    }

    try {
      const checkDuplicateUrl = `${check}/attappthree/event_check_name.php?eventName=${eventName}`;
      const duplicateCheckResponse = await axios.get(checkDuplicateUrl);

      if (duplicateCheckResponse.data.duplicate) {
        Alert.alert(
          "Error",
          `${eventName} already exists.\nPlease choose a different name.`
        );
        return;
      }

      const compurl = `${check}/attappthree/create_event.php`;
      const response = await axios.post(
        compurl,
        {
          name: eventName,
          createdby: fname,
          price: eventPrice,
          haslogin: +isCheckedIN,
          haslogout: +isCheckedOUT,
          endtime: moment(endDate, "YYYY-MM-DD HH:mm:ss A").format(
            "YYYY-MM-DDTHH:mm:ss.SSSZ"
          ),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the response here
      console.log(response.data);
      if (response.data) {
        Alert.alert("Success", "Event Added", [
          {
            text: "OK",
            onPress: () => {
              handleSave();
            },
          },
        ]);
      } else {
        Alert.alert("Error", "Event not Added");
      }
    } catch (error) {
      // Handle errors here
      Alert.alert("Error", error.message);
    }
  };

  const handleSave = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainPage" }, { name: "OptionSelector" }],
    });
  };

  const checkvalid = (endDate) => {
    const date = moment(endDate, "YYYY-MM-DD HH:mm:ss A");
    const isValid = date.isBefore(moment());
    console.log(moment());
    console.log(date);
    return isValid;
  };

  const isToday = () => {
    const today = moment().utcOffset("+08:00");
    const endDateString = moment(endDate, "YYYY-MM-DD hh:mm:ss A");

    if (endDateString.isSame(today, "day")) {
      return `Today, ${moment(endDate, "YYYY-MM-DD hh:mm:ss A").format(
        "hh:mm A"
      )}`;
    } else if (!endDateString.isSame(today, "day")) {
      return `Tomorrow, ${moment(endDate, "YYYY-MM-DD hh:mm:ss A").format(
        "hh:mm A"
      )}`;
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/CCSIT.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Title title="Event Creation" style={styles.title}>
        Create New Event
      </Title>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            style={styles.input}
            value={eventName}
            onChangeText={handleOnChange}
            placeholder="Event Name"
          />
          <TextInput
            style={styles.input}
            value={eventPrice}
            onChangeText={(text) => setEventPrice(sanitizeText(text))}
            placeholder="Fine Price (per entry)"
          />

          <View style={styles.section}>
            <Checkbox
              style={styles.checkbox}
              value={isCheckedIN}
              onValueChange={setCheckedIN}
              color={isCheckedIN ? "#4630EB" : undefined}
            />
            <Text style={styles.paragraph}>Login </Text>

            <Checkbox
              style={styles.checkbox}
              value={isCheckedOUT}
              onValueChange={setCheckedOUT}
              color={isCheckedOUT ? "#4630EB" : undefined}
            />
            <Text style={styles.paragraph}>Logout</Text>
          </View>

          <View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowPicker(true)}
            >
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowPicker(true)}
                >
                  <View style={{ marginTop: 10 }}>
                    <Text
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 18,
                        borderWidth: 1,
                        borderRadius: 10,
                        fontSize: 16,
                        overflow: "hidden",
                        borderColor: "#8C8C8C",
                        color: "#8C8C8C",
                      }}
                    >
                      {alarmString !== null ? (
                        <Text style={{ color: "#000000", fontSize: 16 }}>
                          {isToday(endDate)}
                        </Text>
                      ) : (
                        "Set Event End Time"
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
      <TouchableOpacity style={styles.button} onPress={createEvent}>
        <Text style={styles.buttonText}>Create Event</Text>
      </TouchableOpacity>

      <TimerPickerModal
        hideSeconds
        visible={showPicker}
        setIsVisible={setShowPicker}
        onConfirm={(pickedDuration) => {
          setAlarmString(moment(pickedDuration).format("hh:mm:ss A"));

          if (
            pickedDuration &&
            checkvalid(
              moment(
                currentD + " " + moment(pickedDuration).format("hh:mm:ss A"),
                "YYYY-MM-DD hh:mm:ss A"
              )
            )
          ) {
            const newDate = cdate.clone().add(1, "day").format("YYYY-MM-DD");
            setcurrentDate(newDate);
            setendDate(
              newDate + " " + moment(pickedDuration).format("hh:mm:ss A"),
              "YYYY-MM-DD hh:mm:ss A"
            );
            console.log(
              "stupid",
              checkvalid(
                moment(
                  currentDate +
                    " " +
                    moment(pickedDuration).format("hh:mm:ss A"),
                  "YYYY-MM-DD hh:mm:ss A"
                )
              )
            );
          }

          if (
            pickedDuration &&
            !checkvalid(
              moment(
                currentD + " " + moment(pickedDuration).format("hh:mm:ss A"),
                "YYYY-MM-DD hh:mm:ss A"
              )
            )
          ) {
            setcurrentDate(moment().format("YYYY-MM-DD"));
            setendDate(
              moment().format("YYYY-MM-DD") +
                " " +
                moment(pickedDuration).format("hh:mm:ss A"),
              "YYYY-MM-DD hh:mm:ss A"
            );
            console.log("stupid");
          }
          setShowPicker(false);
          console.log("not", currentDate);
        }}
        modalTitle="Set Event End Time"
        onCancel={() => setShowPicker(false)}
        LinearGradient={LinearGradient}
        styles={{
          theme: "light",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "80%",
    alignSelf: "center",
    borderRadius: 10,
    elevation: 3,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    alignSelf: "center",
  },
  title: {
    color: "black",
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007AFF",
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    width: "80%",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});

export default EventCreationScreen;
