import React, { useState } from "react";
import { container, utils, text } from '../../styles';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
require("firebase/firestore");

export default function Search(props) {
  const [users, setUsers] = useState([]);

  // Function to fetch users based on search input
  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(users);
      });
  };

  // Render search input and results
  return (
    <View style={[utils.backgroundWhite, container.container]}>
      <View style={{ marginVertical: 30, paddingHorizontal: 20 }}>
        <TextInput
          style={utils.searchBar}
          placeholder="Escribe aquí..."
          onChangeText={(search) => fetchUsers(search)}
        />
      </View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              container.horizontal,
              utils.padding10Sides,
              utils.padding10Top,
            ]}
            onPress={() =>
              props.navigation.navigate("Profile", { uid: item.id })
            }
          >
            {item.image == "default" ? (
              <FontAwesome5
                style={[utils.profileImage, utils.marginBottomSmall]}
                name="user-circle"
                size={50}
                color="black"
              />
            ) : (
              <Image
                style={[utils.profileImage, utils.marginBottomSmall]}
                source={{
                  uri: item.image,
                }}
              />
            )}
            <View style={utils.justifyCenter}>
              <Text style={text.username}>{item.username}</Text>
              <Text style={text.name}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
