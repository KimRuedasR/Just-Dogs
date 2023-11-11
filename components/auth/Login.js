import React, { Component } from "react";
import { View, Button, TextInput } from "react-native";

// Modules
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Register component class
export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };

    this.onSignUp = this.onSignUp.bind(this);
  }

  // Method for sign up
  onSignUp() {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      // User created successfully, update the display name
      .then((result) => {
        console.log(result);
      })
      // Error log
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    return (
      <View>
        <TextInput
          placeholder="Correo"
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
          placeholder="Contraseña"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />
        <Button onPress={() => this.onSignUp()} title="Iniciar sesión" />
      </View>
    );
  }
}
export default Login;
