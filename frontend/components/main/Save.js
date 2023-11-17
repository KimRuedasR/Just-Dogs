import React, { useState } from "react";
import { View, TextInput, Image, Button } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";

export default function Save(props) {
  const [caption, setCaption] = useState("");

  // Function to upload the image to Firebase Storage
  const uploadImage = async () => {
    const uri = props.route.params.image;

    // Unique random path for each image
    const childPath = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(uri);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    // Handle progress, succes and errors of image uploading
    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };
    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        console.log(snapshot);
      });
    };
    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
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
      .then(function () {
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
