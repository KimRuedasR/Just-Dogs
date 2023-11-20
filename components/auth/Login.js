import React, { Component } from "react";
import { View, Button, TextInput, Text } from "react-native";
import { container, form } from '../styles';

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

  // Method for login
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
  // Login form
  render() {
    return (
      <View style={container.center}>
      <View style={container.formCenter}>
          <TextInput
              style={form.textInput}
              placeholder="Correo electronico"
              onChangeText={(email) => this.setState({ email })}
          />
          <TextInput
              style={form.textInput}
              placeholder="Contrasenia"
              secureTextEntry={true}
              onChangeText={(password) => this.setState({ password })}
          />

          <Button
              style={form.button}
              onPress={() => this.onSignUp()}
              title="Iniciar sesion"
          />
      </View>
  </View>

    );
  }
}
export default Login;
