import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainPage from './MainPage';
import BarcodeGenerator from './BarcodeGenerator';
import OptionSelector from './OptionSelector';
import { ApiUrlProvider } from './ApiUrlContext';
import SettingsScreen from './SettingsScreen';
import BarCodeScanner from './BarcodeScanner';
import AppHeader from './AppHeader'; // Import the custom header component
import EventCreationScreen from './EventCreationScreen';
import StudentLookupScreen from './StudentLookupScreen';
import DataSyncScreen from './DataSyncScreen';
import AccountsScreen from './AccountsScreen';
import AdminManagementScreen from './AdminManagementScreen';


const Stack = createStackNavigator();

function App() {
  return (
    <ApiUrlProvider> 
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="MainPage"
            component={MainPage}
            options={{
              title: 'ICTS Logger',
              headerRight: () => <AppHeader />, // Add the custom header to the headerRight
            }}
          />
          <Stack.Screen name="AccountsScreen" component={AccountsScreen} options={{ title: ' ', headerShown: false }} />
          <Stack.Screen name="BarcodeGenerator" component={BarcodeGenerator} options={{ title: ' ' }} />
          <Stack.Screen name="BarcodeScanner" component={BarCodeScanner} options={{ title: ' ' }} />
          <Stack.Screen name="OptionSelector" component={OptionSelector} options={{ title: ' ' }} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: ' ' }} />
          <Stack.Screen name="EventCreationScreen" component={EventCreationScreen} options={{ title: ' ' }} />
          <Stack.Screen name="StudentLookupScreen" component={StudentLookupScreen} options={{ title: ' ' }} />
          <Stack.Screen name="DataSyncScreen" component={DataSyncScreen} options={{ title: ' ' }} />
          <Stack.Screen name="AdminManagementScreen" component={AdminManagementScreen} options={{ title: ' ' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApiUrlProvider>
  );
}

export default App;
