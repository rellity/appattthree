import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainPage from "./app/components/MainPage";
import BarcodeGenerator from "./app/components/BarcodeGenerator";
import OptionSelector from "./app/components/OptionSelector";
import { ApiUrlProvider } from "./utils/ApiUrlContext";
import SettingsScreen from "./app/components/SettingsScreen";
import BarCodeScanner from "./app/components/BarcodeScanner";
import AppHeader from "./app/components/AppHeader";
import EventCreationScreen from "./app/components/EventCreationScreen";
import StudentLookupScreen from "./app/components/StudentLookupScreen";
import DataSyncScreen from "./app/components/DataSyncScreen";
import AccountsScreen from "./app/(tabs)";
import AdminManagementScreen from "./app/components/AdminManagementScreen";

const Stack = createStackNavigator();

function App() {
  const [apiUrlProviderKey, setApiUrlProviderKey] = useState(0);

  const resetNavigationStack = () => {
    setApiUrlProviderKey((prevKey) => prevKey + 1);
  };

  return (
    <ApiUrlProvider key={apiUrlProviderKey}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="MainPage"
            component={MainPage}
            options={{
              title: "ICTS Logger",
              headerRight: () => <AppHeader />,
            }}
          />
          <Stack.Screen
            name="AccountsScreen"
            component={AccountsScreen}
            options={{ title: " ", headerRight: () => <AppHeader /> }}
          />
          <Stack.Screen
            name="BarcodeGenerator"
            component={BarcodeGenerator}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="BarcodeScanner"
            component={BarCodeScanner}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="OptionSelector"
            component={OptionSelector}
            options={{
              title: " ",
            }}
          />
          <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="EventCreationScreen"
            component={EventCreationScreen}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="StudentLookupScreen"
            component={StudentLookupScreen}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="DataSyncScreen"
            component={DataSyncScreen}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="AdminManagementScreen"
            component={AdminManagementScreen}
            options={{ title: " " }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApiUrlProvider>
  );
}

export default App;
