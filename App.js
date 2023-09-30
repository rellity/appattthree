import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainPage from './MainPage';
import BarcodeGenerator from './BarcodeGenerator';
import OptionSelector from './OptionSelector';
import { ApiUrlProvider } from './ApiUrlContext';
import SettingsScreen from './SettingsScreen';
import BarCodeScanner from './BarcodeScanner';

const Stack = createStackNavigator();

function App() {
  return (
    <ApiUrlProvider> 
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={MainPage} options={{ title: 'Main Page' }} />
          <Stack.Screen name="BarcodeGenerator" component={BarcodeGenerator} options={{ title: 'Barcode Generator' }} />
          <Stack.Screen name="BarcodeScanner" component={BarCodeScanner} options={{ title: 'Barcode Scanner' }} />
          <Stack.Screen name="OptionSelector" component={OptionSelector} options={{ title: 'Events' }} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'API Settings' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApiUrlProvider>
  );
}

export default App;
