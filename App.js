import { StatusBar } from "expo-status-bar";
import React from "react";

// Modules
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Components
import { LandingScreen } from "./components/auth/Landing";

// Main App component
const Stack = createStackNavigator();
export default function App() {
  return (
    // Navigation container
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
