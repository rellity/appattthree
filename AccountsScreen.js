import React, { useState, useEffect, } from 'react';
import { Image, View, Text, Modal, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert, BackHandler, ToastAndroid } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';
import { Checkbox, Card } from 'react-native-paper';
import { useApiUrl } from './ApiUrlContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import AwesomeAlert from 'react-native-awesome-alerts';

const AccountsScreen = ({navigation}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { apiUrl } = useApiUrl();
  const [userRole, setUserRole] = useState('');
  const [api, setApiUrl] = useState('')
  const [funame, setFname] = useState('')
  const [showLoading, setShowLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [data, setData] = useState([]);
  const [isAlertVisible, setAlertVisible] = useState(false);
  let content;

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
    console.log({api});
  }, []);

  const check = [ api || apiUrl ];

  useEffect(() => {
    // Fetch options from PHP API
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${check}/attappthree/getclasses.php`);
        setOptions(response.data);
      } catch (error) {
        console.error('Error fetching options:', error);
        // Handle error (e.g., show an error message)
      }
    };

    fetchOptions();
  }, []);

  
  console.log(check);

  const handleOpenAlert = () => {
    console.log('Opening alert');
    setAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const onBackPress = () => {
    if (isLoggedIn) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    const addBackPressListener = () => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    };

    addBackPressListener();

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [onBackPress, isLoggedIn]);


  // focused idk
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  switch (userRole) {
    case 'superadm':
      content = (
        <View style={styles.loginContainer2}>
          <Card.Title title="Super Administrator" />
          <Card.Content>
              <Text>You are a superadmin,{'\n'}{funame}</Text>

              <Text> • You have the same previleges as an offier</Text>
              <Text> • You have an extended access to the data directly</Text>
              <Text> • You can manage officer accounts</Text>
              <Card.Actions>
                <View style={styles.centeredActions}>
                  <TouchableOpacity onPress={() => navigation.navigate('DataSyncScreen')}>
                    <Text style={styles.underline}>DB Operations</Text>
                  </TouchableOpacity>
                  <Text> | </Text>
                  <TouchableOpacity onPress={handleOpenAlert}>
                    <Text style={styles.underline}>Class List</Text>
                  </TouchableOpacity>
                  <Text> | </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('AdminManagementScreen')}>
                    <Text style={styles.underline}>Accounts</Text>
                  </TouchableOpacity>
                </View>
              </Card.Actions>
          </Card.Content>
        </View>
      );
      break;

    case 'officer':
      content = (
        <View style={styles.loginContainer1}>
          <Card.Title title="Officer" />
          <Card.Content>
            <Text>You are an officer, {funame}</Text>
            <Text> • You are tasked with as the record keeper.</Text>
            <Card.Actions>
              <TouchableOpacity onPress={handleOpenAlert}>
                <Text style={styles.underline}>Class List</Text>
              </TouchableOpacity>
            </Card.Actions>
          </Card.Content>
        </View>
      );
      break;

    default:
      content = (
        <Card style={styles.card}>
          <Card.Title title="Unknown Role" />
          <Card.Content>
            <Text>Begone, you do not belong here</Text>
          </Card.Content>
        </Card>
      );
      break;
  }

  useEffect(() => {
    SecureStore.getItemAsync('isLoggedIn')
    .then((storedIsLoggedIn) => {
      const isLoggedIn = storedIsLoggedIn === 'true' || storedIsLoggedIn === true;
      setIsLoggedIn(isLoggedIn);

      if (isLoggedIn) {
        SecureStore.getItemAsync('accountName').then((storedAccountName) => {
          setAccountName(storedAccountName);
        });

        SecureStore.getItemAsync('accprev').then((storedAccprev) => {
          setUserRole(storedAccprev);
        });

        SecureStore.getItemAsync('fname').then((storedfname) => {
          setFname(storedfname);
        });

        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }
    })
    .catch((error) => console.error('Error reading from SecureStore:', error));

    // check stored password
    SecureStore.getItemAsync('password')
      .then((storedPassword) => {
        if (storedPassword) {
          setRememberPassword(true);
          setPassword(storedPassword);
        }
      })
      .catch((error) => console.error('Error reading from SecureStore:', error));
  }, []);

  const handleLogin = async () => {
    setShowLoading(true);
    try {
      
  
      const compurl = `${check}/attappthree/admlogin.php`;
  
      const loginPromise = new Promise(async (resolve, reject) => {
        try {
          const response = await axios.get(compurl, {
            params: { username, password },
          });
  
          if (!compurl) {
            reject(new Error('Network error.'));
            return;
          }
  
          const data = response.data;
  
          if (data.success) {
            // store login state, account name, password, and accprev idk for later use???
            setIsLoggedIn(true);
            setAccountName(username);
            console.log(response.data);
  
            if (rememberPassword) {
              SecureStore.setItemAsync('password', password);
            }
            SecureStore.setItemAsync('isLoggedIn', 'true');
            SecureStore.setItemAsync('accountName', username);
            SecureStore.setItemAsync('accprev', data.user.accprev);
            SecureStore.setItemAsync('fname', data.user.fname);
            // set user role duiplay
            const storedAccprev = await SecureStore.getItemAsync('accprev');
            const userRole = storedAccprev || data.user.accprev;
            setUserRole(userRole);

            storedfname = await SecureStore.getItemAsync('fname');
            const fname = storedfname ||data.user.fname;
            setFname(fname);

            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  
            resolve(data);
          } else {
            reject(new Error(`Login failed: connection timed out`));
          }
        } catch (error) {
          reject(error);
        } finally {
          setShowLoading(false);
        }
      });
  
      await loginPromise;
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Login failed:', error.message);
    }
  };  

  const handleLogout = async () => {
    setShowLoading(true);
  
    try {
      const accountName = await SecureStore.getItemAsync('accountName');
      const compurl = `${check}/attappthree/admlogout.php`;
  
      // Check if compurl exists
      if (!compurl) {
        Alert.alert("Logout Failed", "No Internet Connection");
        setShowLoading(false);
        return;
      }
  
      const logoutResponse = await axios.get(compurl, {
        params: { username: accountName },
      });
  
      const logoutData = logoutResponse.data;
  
      if (logoutData.success) {
        console.log(logoutData.message);
  
        setIsLoggedIn(false);
        setAccountName('');
        setUsername('');
  
        // Wipe stored login state, account name, password, and accprev
        await SecureStore.deleteItemAsync('isLoggedIn');
        await SecureStore.deleteItemAsync('accountName');
        await SecureStore.deleteItemAsync('accprev');
        setUserRole('');
      } else {
        throw new Error(`Logout failed: ${logoutData.message}`);
      }
  
      setShowLoading(false);
    } catch (error) {
      setShowLoading(false);
      console.error('Error during logout:', error);
  
      // Display an error toast message for network errors
      ToastAndroid.showWithGravityAndOffset(
        'Network error: Logout restricted',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  
    console.log(showLoading);
  };

  const handlePickerChange = async (value) => {
    setShowLoading(true);
    setSelectedOption(value);

    // Fetch data based on the selected option
    if (value) {
      try {
        const response = await axios.get(`${check}/attappthree/getclasslist.php?value=${value}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error (e.g., show an error message)
      }
    }
    setShowLoading(false);
  };

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.text]}>{item.name}</Text>
      <Text style={[styles.cell, styles.text]}>{item.stuid}</Text>
      <Text style={[styles.cell, styles.text]}>{item.yearsec}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {!userRole && (
      <Text style={{ textAlign: 'center', textAlignVertical: 'center' }}>API URL: { check }</Text>)}
      {userRole && (
          <Image
          source={require('./assets/CCSIT.png')} 
          style={styles.logo}
          resizeMode="contain" 
          />
      )}
      {isLoggedIn ? (
        <View style={styles.loggedInContainer}>
          <Text style={styles.welcomeText}>Welcome, {accountName}!</Text>
          <TouchableOpacity style={styles.loginButton2} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
      
          {userRole && (
            <View style={styles.loginContainer3}>
              {/* switch-case napod arun dli kapoy tan awon puro if-else */}
              {content}
            </View>
          )}
        </View>
        
        ) : (
        
          
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Log In</Text>

          <TextInput
            style={[styles.input, isUsernameFocused && styles.focusedInput]}
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
            onFocus={() => setIsUsernameFocused(true)}
            onBlur={() => setIsUsernameFocused(false)}
          />

          <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, isPasswordFocused && styles.focusedInput]}
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!showPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />

              <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {/* icon sa remember password */}
                <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#3498db" />
              </TouchableOpacity>
            </View>

          <View style={styles.rememberContainer}>
            <Checkbox.Android
              status={rememberPassword ? 'checked' : 'unchecked'}
              onPress={() => setRememberPassword(!rememberPassword)}
            />
            <Text>Remember Password</Text>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={() => {
              handleLogin();
            }}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.loginButton1} onPress={() => {
          navigation.navigate('SettingsScreen');}}>
            <Text style={styles.buttonText}>Api Settings</Text>
      </TouchableOpacity>
      
      {userRole && (
      <TouchableOpacity style={styles.loginButton55} onPress={() => {
          navigation.navigate('MainPage');}}>
            <Text style={styles.buttonText}>Home Screen</Text>
      </TouchableOpacity>)}
      <Modal visible={isAlertVisible} transparent animationType="slide">
        
        <View style={styles.modal}>
        
          <View style={styles.modalContent}>
            {/* Picker for selecting an option */}
            <Picker
              selectedValue={selectedOption}
              onValueChange={handlePickerChange}
              style={styles.picker}
            >
              <Picker.Item label="Select an Option..." value={null} />
              {options && Array.isArray(options) && options.length > 0 && options.map((option, index) => (
                option !== '' && (
                  <Picker.Item
                    key={index}
                    label={option}
                    value={option}
                  />
                )
              ))}
            </Picker>

            {/* Close button in the alert */}
            
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderRow}
              ListHeaderComponent={() => (
                <View style={[styles.row, styles.header]}>
                  <Text style={[styles.cell, styles.text]}>Name</Text>
                  <Text style={[styles.cell, styles.text]}>Student ID</Text>
                  <Text style={[styles.cell, styles.text]}>Year Section</Text>
                </View>
              )}
            />
          </View>
          
          <TouchableOpacity onPress={handleCloseAlert} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        
        </View>
        
      </Modal>

      {/* Awesome Alert for loading state */}
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
    paddingHorizontal: 20,
    backgroundColor: '#ecf0f1',
  },
  loggedInContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 10,
  },
  loginContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0, 
  },
  loginContainer3: {
    backgroundColor: '#ffffff',
    padding: 60,
    paddingBottom: 20,
    paddingTop: 20,
  },
  loginText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 25,
  },
  logo: {
    position: 'absolute',
    top: 50,
    width: 150,
    height: 150, 
    marginBottom: 30,
    alignSelf: 'center'
  },
  focusedInput: {
    borderColor: '#3498db', 
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  showPasswordButton: {
    marginLeft: 5,
    paddingVertical: 8,
  },
  showPasswordButtonText: {
    color: '#3498db',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  
  loginButton1: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    alignItems: 'center',
  },
  loginButton2: {
    width: '100%',
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: 'center',
  },
  loginContainer1: {
    backgroundColor: '#ffffff',
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
    elevation: 5,
  },
  loginContainer2: {
    backgroundColor: '#ffffff',
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
    elevation: 5,
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
    height: 'auto',
    maxHeight: '80%'
  },
  picker: {
    width: '100%', 
  },
  closeButton: {
    width: '80%',
    marginTop: 10,
    padding: 10,
    backgroundColor: 'blue', // Adjust the color as needed
    borderRadius: 4,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '83%'
  },
  header: {
    fontWeight: 'bold',
    flex: 2,
    width: '83%',
    textAlign: 'center',
    borderWidth: 1,
    padding: 5,
  },
  cell: {
    flex: 2,
    width: '30%',
    textAlign: 'center',
    margin: 1,
    borderWidth: 1,
    padding: 5,
  },
  underline: {
    textDecorationLine: 'underline',
    fontSize: 11,
  },
  centeredActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginButton55: {
    position: 'absolute',
    backgroundColor: '#3498db',
    width: '99%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    bottom: 2,
    margin: 20
  },
});

export default AccountsScreen;
