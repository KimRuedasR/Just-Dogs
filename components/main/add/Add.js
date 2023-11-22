import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { container, utils } from "../../styles";

export default function Add({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Request permissions for camera and gallery
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(
        cameraStatus.status === "granted" && galleryStatus.status === "granted"
      );
    })();
  }, []);

  // Function to take a picture
  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      handleImageSelection(data.uri);
    }
  };

  // Function to pick an image from the gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleImageSelection(result.assets[0].uri);
    }
  };

  // Function to handle image selection, upload and validation
  const handleImageSelection = (uri) => {
    setImage(uri);
    setIsAnalyzing(true);
    uploadAndValidateImage(uri);
  };

  // Uploads the image and validates if it's a dog
  const uploadAndValidateImage = async (imageUri) => {
    const fileExtension = imageUri.split(".").pop();
    const childPath = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}.${fileExtension}`;

    const response = await fetch(imageUri);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    task.on(
      "state_changed",
      (snapshot) => {
        console.log(`transferred: ${snapshot.bytesTransferred}`);
      },
      (error) => {
        console.log(error);
        setIsAnalyzing(false);
      },
      () => {
        task.snapshot.ref.getDownloadURL().then((downloadURL) => {
          setTimeout(() => {
            // Wait for Firebase function to execute
            firebase
              .storage()
              .ref()
              .child(childPath)
              .getMetadata()
              .then(() => {
                setIsAnalyzing(false);
                navigation.navigate("Save", {
                  image: downloadURL,
                  imagePath: childPath,
                });
              })
              .catch((error) => {
                alert(
                  "La imagen subida no es un perro. Por favor, intenta de nuevo."
                );
                setIsAnalyzing(false);
                setImage(null); // Clear the image selection
              });
          }, 3000); // 3 second timer to wait for Firebase function
        });
      }
    );
  };

  // Rendering the loading screen while analyzing the image
  if (isAnalyzing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Analizando imagen...</Text>
      </View>
    );
  }

  // Rendering the main screen
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No hay acceso a la cámara o galería</Text>;
  }

  return (
    <View
      style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}
    >
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={"1:1"}
        />
      </View>
      <Button
        title="Girar Imagen"
        onPress={() =>
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          )
        }
      />
      <Button title="Tomar Foto" onPress={takePicture} />
      <Button title="Elegir Imagen de Galería" onPress={pickImage} />
      <Button
        title="Utilizar imagen"
        onPress={() => image && handleImageSelection(image)}
      />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
});
