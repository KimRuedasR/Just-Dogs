import React, { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { AppRegistry, View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Font from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
AppRegistry.registerComponent("main", () => App);

// Modules
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_API_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_API_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_API_FIREBASE_STORAGE_BUCKE,
  messagingSenderId: process.env.EXPO_PUBLIC_API_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_API_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_API_FIREBASE_MEASUREMENT_ID,
};
// Initialize firebase
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

// Components
import MainScreen from "./components/Main.js";
import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";
import LoginScreen from "./components/auth/Login";
import AddScreen from "./components/main/Add";

const store = createStore(rootReducer, applyMiddleware(thunk));
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main App component
export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      loaded: false,
    };
  }
  // Authentication state changes
  async componentDidMount() {
    await this.loadFonts();
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({ loggedIn: false, loaded: true });
      } else {
        this.setState({ loggedIn: true, loaded: true });
      }
    });
  }
  // Icon and font loading
  async loadFonts() {
    await Font.loadAsync({
      //MaterialCommunityIcons.font,
      MaterialCommunityIcons: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf"),
    });

    this.setState({ fontsLoaded: true });
  }

  render() {
    const { loggedIn, loaded, fontsLoaded } = this.state;
    // Loading screen
    if (!loaded || !fontsLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Cargando...</Text>
        </View>
      );
    }
    // Navigation container
    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    // Main screen
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Add" component={AddScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
