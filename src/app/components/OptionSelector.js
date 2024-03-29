import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Card } from "react-native-elements";
import axios from "axios";
import { useApiUrl } from "../../utils/ApiUrlContext";

import { useNavigation } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";
import PurgeOptionsScreen from "./PurgeOptionsScreen";
import { Title } from "react-native-paper";
import moment from "moment";
import * as SecureStore from "expo-secure-store";
import { TimerPickerModal } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";

const OptionSelector = () => {
  const { apiUrl } = useApiUrl();
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [tableData, setTableData] = useState([]);
  const navigation = useNavigation();
  const [showLoading, setShowLoading] = useState(false);
  const [selectedLog, setselectedLog] = useState(null);
  const [purgeOptionsModalVisible, setPurgeOptionsModalVisible] =
    useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [flag, setFlag] = useState(false);
  const showPicker =
    tableData.length > 0 &&
    tableData.some((event) => event.haslogin === 1 || event.haslogout === 1);
  const [Endtimeone, setEndtimeone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [istimended, setistimended] = useState(false);
  const [role, setrole] = useState("");
  const [showPickerOne, setShowPickerOne] = useState(false);
  const [alarmString, setAlarmString] = useState(null);
  const cdate = moment().utcOffset("+08:00");
  const [currentDate, setcurrentDate] = useState(cdate.format("YYYY-MM-DD"));
  const [endDate, setendDate] = useState(null);
  const [currentD] = useState(cdate.format("YYYY-MM-DD"));

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const storedRole = await SecureStore.getItemAsync("accprev");
        setrole(storedRole);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);
  const check = [apiUrl];

  const formatData = (data) => {
    return data.map((item, index) => (
      <View key={index} style={styles.row}>
        <Text style={styles.label}>Created on:</Text>
        <Text style={styles.value}>{formatDateToGMT8(item.createdon)}</Text>
        {item.status.toLowerCase() === "ended" ? (
          <>
            <Text style={styles.label}>Ended on:</Text>
            <Text style={styles.endedText}>
              {formatDateToGMT8(item.endedby)}
            </Text>
            <Text style={styles.label}>Event Status:</Text>
            <Text
              style={[
                styles.value,
                item.status.toLowerCase() === "ongoing"
                  ? styles.ongoingText
                  : styles.endedText,
              ]}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </>
        ) : (
          <>
            <Text>Logging End:</Text>
            <Text
              style={[
                styles.value,
                item.status.toLowerCase() === "ongoing"
                  ? styles.ongoingText
                  : styles.endedText,
              ]}
            >
              {moment(item.eventdate).format("MMMM D YYYY, hh:mm A")}
            </Text>
          </>
        )}
        <Text style={styles.label}>Created by:</Text>
        <Text style={styles.value}>{item.createdby}</Text>
        {item.loginstatus.toLowerCase() !== "none" && (
          <>
            <Text style={styles.label}>Login Status:</Text>
            <Text
              style={[
                styles.value,
                item.loginstatus.toLowerCase() === "ongoing"
                  ? styles.ongoingText
                  : styles.endedText,
              ]}
            >
              {item.loginstatus.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </>
        )}
        {item.logoutstatus.toLowerCase() !== "none" && (
          <>
            <Text style={styles.label}>Logout Status:</Text>
            <Text
              style={[
                styles.value,
                item.logoutstatus.toLowerCase() === "ongoing"
                  ? styles.ongoingText
                  : styles.endedText,
              ]}
            >
              {item.logoutstatus.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </>
        )}
      </View>
    ));
  };

  const formatDateToGMT8 = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Singapore",
    };

    const gmt8Date = new Date(dateString);
    gmt8Date.setHours(gmt8Date.getHours()); // Add 8 hours for GMT+8

    return gmt8Date.toLocaleString("en-US", options);
  };

  const fetchOptions = () => {
    return new Promise(async (resolve, reject) => {
      setShowLoading(true);

      try {
        const check = [apiUrl];
        const response = await axios.get(`${check}/attappthree/getOptions.php`);
        const optionsArray = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setOptions(response.data);
        setShowLoading(false);
        resolve(optionsArray); // make this promise come true
        ToastAndroid.show("done!", ToastAndroid.SHORT);
      } catch (error) {
        setShowLoading(false);
        const errorMessage = `error fetching options: network error`;
        console.error(errorMessage);
        ToastAndroid.showWithGravityAndOffset(
          errorMessage,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        reject(error); //reject promise
      }
    });
    // mannnnnnnn, promise2 atay alas 11:44 sa gabii wa koy gibuthat kundi mag program ani
  };

  useEffect(() => {
    console.log("Options:", options);
  }, [options]);

  useEffect(() => {
    console.log("TableData:", tableData);
  }, [tableData]);

  useEffect(() => {
    console.log("ShowPicker:", showPicker);
  }, [options, selectedOption, tableData]);

  const handleOptionChange = async (itemValue) => {
    setSelectedOption(itemValue);
    setLoading(true);

    try {
      if (itemValue) {
        const check = [apiUrl];
        const responselink = `${check}/attappthree/getOptionsInfo.php`;

        const response = await axios.get(responselink, {
          params: { value: itemValue },
        });

        if (Array.isArray(response.data) && response.data.length > 0) {
          setTableData(response.data);
          setLoading(false);
        } else {
          setTableData([]);
        }

        const endtimer = response.data.map((response) => response.eventdate);
        const endtt = moment(endtimer[0]);
        console.log("Selected option:", endtt.format("YYYY-MM-DD hh:mm:ss A"));

        const currentDateTime = moment().utcOffset("+08:00");
        console.log(
          "current time: ",
          currentDateTime.format("YYYY-MM-DD hh:mm:ss A")
        );

        setistimended(endtt.isBefore(currentDateTime));

        function checklogs() {
          const haslogin = response.data[0].haslogin;
          const haslogout = response.data[0].haslogout;
          const logoutstatus = response.data[0].logoutstatus;
          const loginstatus = response.data[0].loginstatus;

          if (haslogin === 1) {
            console.log("1");
            if (haslogout === 1) {
              console.log("2");
              if (loginstatus === "ongoing" && logoutstatus === "ongoing") {
                console.log("starting", itemValue);

                (async () => {
                  try {
                    const responseLogin = await axios.get(
                      `${check}/attappthree/evnt_end.php`,
                      { params: { table: itemValue, column: "login" } }
                    );
                    const responseLogout = await axios.get(
                      `${check}/attappthree/evnt_end.php`,
                      { params: { table: itemValue, column: "logout" } }
                    );

                    // Process the results if needed
                    console.log("Data for login:", responseLogin.data);
                    console.log("Data for logout:", responseLogout.data);
                  } catch (error) {
                    console.error("Error:", error);
                  }
                })();
              }
            } else if (haslogout === 0) {
              (async () => {
                try {
                  const responseLogin = await axios.get(
                    `${check}/attappthree/evnt_end.php`,
                    { params: { table: itemValue, column: "login" } }
                  );

                  console.log("Data for login:", responseLogin.data);
                } catch (error) {
                  console.error("Error:", error);
                }
              })();
            }
          } else if (haslogin === 0 && haslogout === 1) {
            (async () => {
              try {
                const responseLogout = await axios.get(
                  `${check}/attappthree/evnt_end.php`,
                  { params: { table: itemValue, column: "logout" } }
                );
                console.log("Data for login:", responseLogout.data);
              } catch (error) {
                console.error("Error:", error);
              }
            })();
          }
        }

        if (
          endtt.isBefore(currentDateTime) &&
          response.data[0].status === "ongoing"
        ) {
          Alert.alert("Event Ended", "Event Logging Expired", [
            {
              text: "OK",
              onPress: () => {
                checklogs();
                handleSave();
              },
            },
          ]);
          return;
        }
      } else if (itemValue === null) {
        setTableData([]);
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Error fetching data for the selected table:", error);
    }
  };

  const handlePurgeOptions = async (selectedMode) => {
    console.log("0;", selectedMode);
    try {
      const {
        clearEvent,
        clearLoginData,
        clearLogoutData,
        deleteEventEntry,
        endLogin,
        endLogout,
      } = selectedMode;
      console.log("Selected Mode:", selectedMode);

      if (selectedMode === "clearEvent") {
        respond = await axios.get(`${check}/attappthree/truncatetable.php`, {
          params: { table: selectedOption },
        });
        Alert.alert("Cleared", "Table Data Cleared", [
          {
            text: "OK",
            onPress: () => {
              handleSave();
            },
          },
        ]);
        console.log(respond.data);
        console.log("1;", selectedOption);
        ToastAndroid.show("Table Data Cleared!", ToastAndroid.LONG);
      }

      if (selectedMode === "clearLoginData") {
        if (tableData[0].loginstatus.trim().toLowerCase() === "none") {
          Alert.alert("Error", "This Event has no Login!");
          return;
        }
        respond = await axios.get(`${check}/attappthree/truncateevent.php`, {
          params: { table: selectedOption, column: "login" },
        });
        Alert.alert("Cleared", "Login Data Cleared", [
          {
            text: "OK",
            onPress: () => {
              handleSave();
            },
          },
        ]);
        console.log("clearlogin response: ", respond.data);
        console.log("1;", selectedOption);
        ToastAndroid.show("Login Data Cleared!", ToastAndroid.SHORT);
      }

      if (selectedMode === "clearLogoutData") {
        if (tableData[0].logoutstatus.trim().toLowerCase() === "none") {
          Alert.alert("Error", "This Event has no Logout!");
          return;
        }
        respond = await axios.get(`${check}/attappthree/truncateevent.php`, {
          params: { table: selectedOption, column: "logout" },
        });
        Alert.alert("Cleared", "Logout Data Cleared", [
          {
            text: "OK",
            onPress: () => {
              handleSave();
            },
          },
        ]);
        console.log("clearlogin response: ", respond.data);
        console.log("1;", selectedOption);
        ToastAndroid.show("Logout Data Cleared!", ToastAndroid.SHORT);
      }

      if (selectedMode === "deleteEventEntry") {
        respond = await axios.get(`${check}/attappthree/deleteevent.php`, {
          params: { table: selectedOption },
        });
        Alert.alert("Deleted", "Event Entry Deleted", [
          {
            text: "OK",
            onPress: () => {
              handleSave();
            },
          },
        ]);
        console.log("clearlogin response: ", respond.data);
        console.log("1;", selectedOption);
        ToastAndroid.show(
          `Event Entry Deleted: ${selectedOption}!`,
          ToastAndroid.SHORT
        );
      }

      if (selectedMode === "endLogin") {
        if (tableData[0].loginstatus.trim().toLowerCase() === "none") {
          Alert.alert("Error", "This Event has no Login!");
          return;
        }
        respond = await axios.get(`${check}/attappthree/evnt_end.php`, {
          params: { table: selectedOption, column: "login" },
        });
        Alert.alert("Ended", "Login Status Ended", [
          {
            text: "OK",
            onPress: () => {
              handleSave();
            },
          },
        ]);
        console.log("clearlogin response: ", respond.data);
        console.log("1;", selectedOption);
        ToastAndroid.show(
          `Login Ended: ${selectedOption}!`,
          ToastAndroid.SHORT
        );
      }

      if (selectedMode === "endLogout") {
        if (tableData[0].logoutstatus.trim().toLowerCase() === "none") {
          Alert.alert("Error", "This Event has no Logout!");
          return;
        }
        respond = await axios.get(`${check}/attappthree/evnt_end.php`, {
          params: { table: selectedOption, column: "logout" },
        });
        Alert.alert("Ended", "Logout Status Ended", [
          {
            text: "OK",
            onPress: () => {
              handleSave();
            },
          },
        ]);
        console.log("clearlogin response: ", respond.data);
        console.log("1;", selectedOption);
        ToastAndroid.show(
          `Logout Ended: ${selectedOption}!`,
          ToastAndroid.SHORT
        );
      }

      if (selectedMode === "EditEventTime") {
        setShowPickerOne(true);
      }

      // Close the modal after completing the purge actions
      setPurgeOptionsModalVisible(false);
    } catch (error) {
      console.error("Error purging options:", error);
      // Handle error
      Alert.alert("Error", "Failed to purge options");
    }
  };

  const checkvalid = (endDate) => {
    const date = moment(endDate, "YYYY-MM-DD HH:mm:ss A");
    const isValid = date.isBefore(moment());
    console.log(moment());
    console.log(date);
    return isValid;
  };

  const handleSave = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainPage" }, { name: "OptionSelector" }],
    });
  };

  useEffect(() => {
    if (tableData.length > 0) {
      setFlag(tableData[0]?.status === "ongoing");
    }
  }, [tableData]);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>View Events</Title>
      <View style={styles.picker}>
        <Picker
          selectedValue={selectedOption}
          onValueChange={handleOptionChange}
        >
          <Picker.Item label="Select an Event Option..." value={null} />
          {options &&
            Array.isArray(options) &&
            options.length > 0 &&
            options.map(
              (option, index) =>
                option !== "" && (
                  <Picker.Item key={index} label={option} value={option} />
                )
            )}
        </Picker>
      </View>
      {tableData && Array.isArray(tableData) && tableData.length > 0 && (
        <View style={styles.picker2}>
          <Picker
            selectedValue={selectedLog}
            onValueChange={(itemValue) => setselectedLog(itemValue)}
          >
            <Picker.Item label="Select either Login or Logout" value={null} />

            {tableData[0].haslogin === 1 && (
              <Picker.Item label="Log Login" value="login" />
            )}

            {tableData[0].haslogout === 1 && (
              <Picker.Item label="Log Logout" value="logout" />
            )}
          </Picker>
        </View>
      )}
      <View style={styles.scontainer}>
        <TouchableOpacity
          style={styles.sbutton}
          title="Mount"
          onPress={() => {
            if (tableData.length > 0) {
              const selectedEvent = tableData[0];
              console.log("option", selectedOption);

              if (selectedEvent) {
                let isEnded = false;

                if (selectedLog === "login") {
                  if (selectedEvent.loginstatus.toLowerCase() === "ended") {
                    isEnded =
                      selectedEvent.loginstatus.toLowerCase() === "ended";
                  }
                  if (selectedEvent.loginstatus.toLowerCase() === "none") {
                    Alert.alert(
                      "Error",
                      "Where did you even go wring from here?"
                    );
                    return;
                  }
                } else if (selectedLog === "logout") {
                  if (selectedEvent.loginstatus.toLowerCase() === "ended") {
                    isEnded =
                      selectedEvent.logoutstatus.toLowerCase() === "ended";
                  } else if (
                    selectedEvent.logoutstatus.toLowerCase() === "ongoing" &&
                    selectedEvent.loginstatus.toLowerCase() === "none"
                  ) {
                    ToastAndroid.show(
                      `${selectedOption} logout`,
                      ToastAndroid.SHORT
                    );
                  } else {
                    Alert.alert(
                      "Login not Done",
                      `${selectedOption} login is still ongoing!`
                    );
                    return;
                  }
                } else {
                  Alert.alert("Error", "Please select a Log Operation.");
                  return;
                }

                if (isEnded) {
                  Alert.alert(`Cannot mount an ended ${selectedLog} event.`);
                } else {
                  navigation.navigate("BarcodeScanner", {
                    selectedTable: selectedOption,
                    selectedLogging: selectedLog,
                  });
                }
              } else {
                Alert.alert("Please select a valid table before mounting.");
              }
            } else {
              Alert.alert("Please select a valid table before mounting.");
            }
            setselectedLog(selectedLog);
          }}
        >
          <Text style={styles.buttonText}>Mount Event</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sbutton}
          title="Modify"
          onPress={() => {
            if (selectedOption && flag === true) {
              setPurgeOptionsModalVisible(true), { selectedMode };
            } else {
              // error handling
              Alert.alert(
                "Invalid Option",
                "Please pick a valid/non-ended Event."
              );
            }
          }}
        >
          <Text style={styles.buttonText}>Modify Event</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("EventCreationScreen")}
        >
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containering}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{ marginTop: "25%" }}
          />
        ) : tableData.length > 0 ? (
          <React.Fragment>
            <View style={styles.cardContainer}>
              <Card style={styles.card}>
                <Text>{formatData(tableData)}</Text>
              </Card>
            </View>
          </React.Fragment>
        ) : (
          ""
        )}
      </View>

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
        progressColor="#007AFF" // Customize the progress bar color
      />

      <PurgeOptionsScreen
        visible={purgeOptionsModalVisible}
        onClose={() => setPurgeOptionsModalVisible(false)}
        onPurge={handlePurgeOptions}
      />

      <TimerPickerModal
        hideSeconds
        visible={showPickerOne}
        setIsVisible={setShowPickerOne}
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
            const send = moment(
              newDate + " " + moment(pickedDuration).format("hh:mm:ss A"),
              "YYYY-MM-DD hh:mm:ss A"
            ).format("YYYY-MM-DD HH:mm:ss");
            if (
              moment(
                newDate + " " + moment(pickedDuration).format("hh:mm:ss A"),
                "YYYY-MM-DD hh:mm:ss A"
              ).isAfter(moment())
            ) {
              Alert.alert(
                "Tip!",
                `Setting time that has already passed, will instead set it to tommorow's time`
              );
            }

            (async () => {
              try {
                await axios.get(`${check}/attappthree/timeedit.php`, {
                  params: { table: selectedOption, time: send },
                });
              } catch (error) {
                console.error("Error fetching data:", error);
              }
            })();
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
            const send = moment(
              moment().format("YYYY-MM-DD") +
                " " +
                moment(pickedDuration).format("hh:mm:ss A"),
              "YYYY-MM-DD hh:mm:ss A"
            );

            (async () => {
              try {
                await axios.get(`${check}/attappthree/timeedit.php`, {
                  params: { table: selectedOption, time: send },
                });
              } catch (error) {
                console.error("Error fetching data:", error);
              }
            })();
          }
          setShowPickerOne(false);
          ToastAndroid.show("End Time Modified!", ToastAndroid.LONG);
          handleSave();
        }}
        modalTitle="Modify Event End Time"
        onCancel={() => setShowPickerOne(false)}
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
    flexDirection: "collumn",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  containering: {
    flex: 0,
    flexDirection: "collumn",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    width: 290,
    height: 60,
    backgroundColor: "#007bff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  sbutton: {
    width: 120,
    height: 50,
    margin: 10,
    marginTop: 3,
    backgroundColor: "#007bff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 300,
    marginBottom: 15,
    color: "black",
    justifyContent: "center",
    borderColor: "gray",
    borderWidth: 0,
    borderRadius: 1,
    borderBottomWidth: 1,
  },
  picker2: {
    height: 50,
    width: 300,
    marginBottom: 5,
    color: "black",
    justifyContent: "center",
    borderColor: "gray",
    borderWidth: 0,
    borderRadius: 1,
    borderBottomWidth: 1,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
  scontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  label: {
    flex: 1,
    color: "#000000",
    marginRight: 8,
  },
  value: {
    flex: 1,
    color: "#61DAFB",
  },
  endedText: {
    color: "red",
  },
  loadingContainer: {
    marginTop: 250,
    position: "absolute",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  top: {
    flex: 0.3,
    backgroundColor: "white",
    borderWidth: 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "80%",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default OptionSelector;
