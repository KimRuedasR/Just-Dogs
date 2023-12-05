import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { container, utils, text } from "../../styles";
import { FontAwesome } from "@expo/vector-icons";

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
      <View style={styles.centeredView}>
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
    <View style={styles.mainContainer}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={"1:1"}
        />
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={() =>
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            )
          }
        >
          <FontAwesome name="refresh" size={24} color="white" />
          <Text style={styles.buttonText}>Girar cámara</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <FontAwesome name="camera" size={24} color="white" />
          <Text style={styles.buttonText}>Tomar Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <FontAwesome name="image" size={24} color="white" />
          <Text style={styles.buttonText}>Elegir de Galería</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.useImageButton}
          onPress={() => image && handleImageSelection(image)}
        >
          <FontAwesome name="check" size={24} color="white" />
          <Text style={styles.buttonText}>Utilizar imagen</Text>
        </TouchableOpacity>
      </View>
      {image && <Image source={{ uri: image }} style={styles.previewImage} />}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#0cc0df", // Blue border for camera
    borderWidth: 2, // Border width
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0cc0df",
    padding: 10,
    borderRadius: 5,
  },
  flipButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0ad4e", // Different color for flip button
    padding: 10,
    borderRadius: 5,
  },
  useImageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5cb85c", // Different color for use image button
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
  },
  previewImage: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
