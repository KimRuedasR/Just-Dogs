import React, { Component } from "react";
import { View, Button, TextInput, Text } from "react-native";
import { container, form } from '../styles';

// Modules
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Register component class
export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
    };

    this.onSignUp = this.onSignUp.bind(this);
  }

  // Method for sign up
  onSignUp() {
    const { name, email, password } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      // User created successfully
      .then((result) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            name,
            email,
          });
        console.log(result);
      })
      // Error log
      .catch((error) => {
        console.log(error);
      });
  }
  // Registration form
  render() {
    return (
      // <View>
      //   <TextInput
      //     placeholder="Nombre"
      //     onChangeText={(name) => this.setState({ name })}
      //   />
      //   <TextInput
      //     placeholder="Correo"
      //     onChangeText={(email) => this.setState({ email })}
      //   />
      //   <TextInput
      //     placeholder="Contraseña"
      //     secureTextEntry={true}
      //     onChangeText={(password) => this.setState({ password })}
      //   />
      //   <Button onPress={() => this.onSignUp()} title="Registrarse" />
      // </View>
      <View style={container.center}>
            <View style={container.formCenter}>
                <TextInput
                    style={form.textInput}
                    placeholder="Correo"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput
                    style={form.textInput}
                    placeholder="Correo"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput
                    style={form.textInput}
                    placeholder="Contraseña"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />

                <Button
                    style={form.button}
                    onPress={() => onRegister()}
                    title="Registrarse"
                />
            </View>
        </View>

    );
  }
}
export default Register;
