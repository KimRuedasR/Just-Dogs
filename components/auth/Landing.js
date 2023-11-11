import React from "react";
import { Text, View, Button } from "react-native";

// Landing screen component
export default function Landing({ navigation }) {
  return (
    // View container
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Button
        title="Registrarse"
        onPress={() => navigation.navigate("Register")}
      />
      <Button
        title="Iniciar sesión"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}
