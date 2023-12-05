import React, { Component } from "react";
import { View, Button, TextInput, Text, KeyboardAvoidingView, TouchableOpacity, ImageBackground } from "react-native";
import { container, form, text, utils } from '../styles';

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
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={container.container}>
    
    <View style={[container.center]}>     
    <ImageBackground source={require('../../assets/Landing_BG.png')} resizeMode="cover" style={utils.img}>
    <View style={[container.formCenter, container.landingcontainer]}>
    <View style={[container.formCenter, container.landingcontainer]}>
        <Text style={[text.center, text.xl, text.bold, text.white]}>¡Bienvenido!</Text>
    </View>
          <TextInput
              style={[form.textInput, text.medium]}
              placeholder="Correo electronico"
              onChangeText={(email) => this.setState({ email })}
          />
          <TextInput
              style={[form.textInput, text.medium]}
              placeholder="Contraseña"
              secureTextEntry={true}
              onChangeText={(password) => this.setState({ password })}
          />
        <TouchableOpacity
          
          style={utils.buttonLanding}
          title="Iniciar sesión"
          onPress={() => this.onSignUp()}
        >
          <Text style={[text.bold, text.center, text.large, text.aquamarine]}>Iniciar sesion</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>

  </View>
  </KeyboardAvoidingView>

    );
  }
}
export default Login;
