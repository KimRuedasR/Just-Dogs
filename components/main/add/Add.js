import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { container, utils } from '../../styles';

export default function Add({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

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
      setImage(data.uri);
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
      setImage(result.assets[0].uri);
    }
  };

  // Handling permission states
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No hay acceso a la cámara o galería</Text>;
  }

  return (
    <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={"1:1"}
        />
      </View>
      {/* // Buttons for image upload */}
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
        onPress={() => navigation.navigate("Save", { image })}
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
