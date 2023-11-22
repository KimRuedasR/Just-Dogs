import React, { useState } from "react";
import { View, TextInput, Image, Button, Alert } from "react-native";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";

export default function Save(props) {
  const [caption, setCaption] = useState("");

  // Function to upload the image to Firebase Storage
  const uploadImage = async () => {
    const uri = props.route.params.image;
    const fileExtension = uri.split('.').pop();
    const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}.${fileExtension}`;

    const response = await fetch(uri);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    task.on(
      "state_changed",
      (snapshot) => {
        console.log(`transferred: ${snapshot.bytesTransferred}`);
      },
      (error) => {
        console.log(error);
      },
      () => {
        task.snapshot.ref.getDownloadURL().then((downloadURL) => {
          checkIfDogExists(downloadURL, childPath);
        });
      }
    );
  };

   // Verifies if the uploaded image is a dog
  const checkIfDogExists = (downloadURL, childPath) => {
    setTimeout(() => {
      firebase.storage().ref().child(childPath).getMetadata()
        .then(() => {
          savePostData(downloadURL);
        })
        .catch((error) => {
          alert("La imagen subida no es un perro. Por favor, intenta de nuevo.");
        });
    }, 3000);
  };

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
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: props.route.params.image }} />
      <TextInput
        placeholder="Añade una descripción. . ."
        onChangeText={(caption) => setCaption(caption)}
      />

      <Button title="Guardar" onPress={() => uploadImage()} />
    </View>
  );
}
