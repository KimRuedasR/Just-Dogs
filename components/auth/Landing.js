import React from "react";
import { Text, View, Button, TouchableOpacity } from "react-native";
import { utils, text, container } from '../styles';


// Landing screen component
export default function Landing({ navigation }) {
  return (
    // View container
    <View style={container.center}>
      <View style={container.formCenter}>
        <TouchableOpacity
          style={utils.buttonLanding}
          title="Registrarse"
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={[text.bold, text.center, text.medium]}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={utils.buttonLanding}
          title="Iniciar sesión"
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={[text.bold, text.center, text.medium]}>Iniciar sesion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
