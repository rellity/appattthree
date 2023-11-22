import React, { useState, useEffect, } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, BackHandler, ToastAndroid } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Checkbox, Card } from 'react-native-paper';
import { useApiUrl } from './ApiUrlContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const AccountsScreen = ({navigation}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { apiUrl } = useApiUrl();
  const [userRole, setUserRole] = useState('');
  let content;

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
        <Card style={styles.card}>
          <Card.Title title="Super Administrator" />
          <Card.Content>
            <Text>You are a superadm</Text>
          </Card.Content>
          <Card.Actions>
            <TouchableOpacity onPress={() => navigation.navigate('SuperadmScreen1')}>
              <Text>Screen 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SuperadmScreen2')}>
              <Text>Screen 2</Text>
            </TouchableOpacity>
          </Card.Actions>
        </Card>
      );
      break;

    case 'officer':
      content = (
        <View style={styles.loginContainer1}>
          <Card.Title title="Officer" />
          <Card.Content>
            <Text>You are an officer</Text>
            <Text>Job Description: Summarized description of officer's job</Text>
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
    try {
      const compurl = `${apiUrl}/attappthree/admlogin.php`;

      const response = await axios.get(compurl, {
        params: { username, password },
      });

      if (!compurl) {
        Alert.alert('Error', 'network error.');
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
        // set user role duiplay
        const storedAccprev = await SecureStore.getItemAsync('accprev');
        const userRole = storedAccprev || data.user.accprev;
        setUserRole(userRole);

        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      } else {
        Alert.alert('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const accountName = await SecureStore.getItemAsync('accountName');

      const compurl = `${apiUrl}/attappthree/admlogout.php`;

      const logoutResponse = await axios.get(compurl, {
        params: { username: accountName },
      });
  
      
      const logoutData = logoutResponse.data;
      if (logoutData.success) {
        console.log(logoutData.message); 
      } else {
        console.error('Logout failed:', logoutData.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);

      // Display an error toast message
      ToastAndroid.showWithGravityAndOffset(
        'network error:  log out not recorded',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  
    setIsLoggedIn(false);
    setAccountName('');
    setUsername('');
  
    // wipe stored login state, account name, password, and accprev
    await SecureStore.deleteItemAsync('isLoggedIn');
    await SecureStore.deleteItemAsync('accountName');
    await SecureStore.deleteItemAsync('accprev');
    setUserRole('');
  };

  return (
    <View style={styles.container}>
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
