import React, { useState, useEffect, } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, BackHandler, ToastAndroid } from 'react-native';
import * as SecureStore from 'expo-secure-store';
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
  console.log(check);

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
        <View style={styles.loginContainer1}>
          <Card.Title title="Super Administrator" />
          <Card.Content>
            <Text>You are a superadm, {funame}</Text>
          </Card.Content>
          <Card.Actions>
            <TouchableOpacity onPress={() => navigation.navigate('DataSyncScreen')}>
              <Text>DB Operations</Text>
            </TouchableOpacity>
            <Text> | </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SuperadmScreen2')}>
              <Text>Screen 2</Text>
            </TouchableOpacity>
          </Card.Actions>
        </View>
      );
      break;

    case 'officer':
      content = (
        <View style={styles.loginContainer1}>
          <Card.Title title="Officer" />
          <Card.Content>
            <Text>You are an officer, {funame}</Text>
            <Text>Job Description: description of officer's job</Text>
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
            reject(new Error(`Login failed: ${data.message}`));
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
  
      const logoutPromise = new Promise(async (resolve, reject) => {
        try {
          const logoutResponse = await axios.get(compurl, {
            params: { username: accountName },
          });
  
          const logoutData = logoutResponse.data;
  
          if (logoutData.success) {
            console.log(logoutData.message);
            resolve(logoutData);
          } else {
            reject(new Error(`Logout failed: ${logoutData.message}`));
          }
        } catch (error) {
          reject(error);
        } finally {
          setShowLoading(false);
        }
      });
  
      await logoutPromise;
    } catch (error) {
      console.error('Error during logout:', error);
  
      // Display an error toast message for network errors
      ToastAndroid.showWithGravityAndOffset(
        'Network error: Logout restricted',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
  
      return;
    } finally {
      setIsLoggedIn(false);
      setAccountName('');
      setUsername('');
  
      // Wipe stored login state, account name, password, and accprev
      await SecureStore.deleteItemAsync('isLoggedIn');
      await SecureStore.deleteItemAsync('accountName');
      await SecureStore.deleteItemAsync('accprev');
      setUserRole('');
    }
    console.log(showLoading)
  };
  

  return (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center', textAlignVertical: 'center' }}>API URL: { check }</Text>
      {isLoggedIn ? (
        <View style={styles.loggedInContainer}>
          <Text style={styles.welcomeText}>Welcome, {accountName}!</Text>
          <TouchableOpacity style={styles.loginButton2} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
      
          {userRole && (
            <View>
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
        progressColor="#007AFF" // Customize the progress bar color
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
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0, 
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});

export default AccountsScreen;
