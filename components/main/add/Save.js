import React, { useState } from "react";
import { View, TextInput, Image, Button, Alert } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";

export default function Save(props) {
  const [caption, setCaption] = useState("");
  const { image, imagePath } = props.route.params;

  // Function to save post data to Firestore
  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
        downloadURL,
        caption,
        likesCount: 0,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        alert("¡Imagen confirmada como perro y publicada!");
        props.navigation.popToTop();
      })
      .catch((error) => {
        console.log(error);
        // Delete the image if there's an error saving the post
        firebase.storage().ref().child(imagePath).delete();
        Alert.alert(
          "Error",
          "No se pudo publicar la imagen. Intente de nuevo."
        );
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: image }} />
      <TextInput
        placeholder="Añade una descripción..."
        onChangeText={(caption) => setCaption(caption)}
        style={{ margin: 10, padding: 5, borderWidth: 1, borderColor: "gray" }}
      />
      <Button title="Publicar" onPress={() => savePostData(image)} />
    </View>
  );
}
