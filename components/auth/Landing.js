import React from "react";
import { Text, View, Button, TouchableOpacity, Image } from "react-native";
import { utils, text, container } from '../styles';


// Landing screen component
export default function Landing({ navigation }) {
  return (
    // View container
    <View style={[container.center, {backgroundColor: '#0cc0df'}]}>     
      <View style={[container.formCenter]}>
      <View style={[container.formCenter, utils.logo]}>
        <Image 
        source={require('../../assets/logo.png')} 
        style={{width: 250, height: 260}}
        />
      </View>

        <TouchableOpacity
          style={utils.buttonLanding}
          title="Registrarse"
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={[text.bold, text.center, text.large, text.aquamarine]}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[utils.buttonLanding, {backgroundColor: '#0cc0df'}]}
          title="Iniciar sesión"
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={[text.bold, text.center, text.large, text.white]}>Iniciar sesion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
