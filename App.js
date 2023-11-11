import React, { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { AppRegistry, View, Text } from "react-native";
AppRegistry.registerComponent("main", () => App);

// Modules
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// Firebase configuration
const firebaseConfig = {
  apiKey: "******",
  authDomain: "******",
  projectId: "******",
  storageBucket: "******",
  messagingSenderId: "******",
  appId: "******",
  measurementId: "******",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

// Components
import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";

// Main App component
const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({ loggedIn: false, loaded: true });
      } else {
        this.setState({ loggedIn: true, loaded: true });
      }
    });
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Cargando...</Text>
        </View>
      );
    }

    if (!loggedIn) {
      return (
        // Navigation container
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Sesión Iniciada...</Text>
      </View>
    );
  }
}

export default App;
