import React, { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { AppRegistry, View, Text } from "react-native";

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
  storageBucket: process.env.EXPO_PUBLIC_API_FIREBASE_STORAGE_BUCKET,
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
import SaveScreen from "./components/main/Save";

const store = createStore(rootReducer, applyMiddleware(thunk));
const Stack = createStackNavigator();

// Main App component
export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }
  // Authentication state changes
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
    // Loading screen
    if (!loaded) {
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
    // Main navigation container
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            {/*  Main screen */}
            <Stack.Screen name="Main" component={MainScreen} />
            {/* Add/camera screen */}
            <Stack.Screen
              name="Add"
              component={AddScreen}
              navigation={this.props.navigation}
            />
            {/*  Save/post screen */}
            <Stack.Screen
              name="Save"
              component={SaveScreen}
              navigation={this.props.navigation}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
