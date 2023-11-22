import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { container, utils, text } from "../../styles";
import { AntDesign, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import firebase from "firebase/compat/app";
require("firebase/firestore");
import { connect } from "react-redux";

function Feed(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (
      props.usersFollowingLoaded === props.following.length &&
      props.following.length !== 0
    ) {
      props.feed.sort((x, y) => x.creation - y.creation);
      setPosts(props.feed);
    }
  }, [props.usersFollowingLoaded, props.feed]);

  // Like and dislike post functions
  const onLikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .set({});
  };

  const onDislikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .delete();
  };

  return (
    <View style={[container.container, utils.backgroundWhite]}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <FontAwesome
                name="user-circle"
                size={30}
                color="#0cc0df"
                style={styles.profileIcon}
              />
              <Text style={styles.userName}>{item.user.name}</Text>
            </View>
            <Image
              style={styles.postImage}
              source={{ uri: item.downloadURL }}
            />
            <Text style={styles.caption}>{item.caption}</Text>
            <View style={styles.postFooter}>
              <TouchableOpacity
                style={[
                  styles.likeButton,
                  item.currentUserLike ? styles.liked : null,
                ]}
                onPress={() =>
                  item.currentUserLike
                    ? onDislikePress(item.user.uid, item.id)
                    : onLikePress(item.user.uid, item.id)
                }
              >
                <AntDesign name="like2" size={24} color="black" />
                <Text style={styles.buttonText}>
                  {item.currentUserLike ? "Dislike" : "Like"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.commentsButton}
                onPress={() =>
                  props.navigation.navigate("Comment", {
                    postId: item.id,
                    uid: item.user.uid,
                  })
                }
              >
                <FontAwesome5 name="comments" size={24} color="black" />
                <Text style={styles.commentsText}>Ver comentarios</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#0cc0df", // Border for the whole post
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profileIcon: {
    marginRight: 10,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
  },
  caption: {
    padding: 10,
    fontStyle: "italic",
    fontSize: 16,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#0cc0df", // Blue background for like button
    flex: 0.3,
  },
  liked: {
    backgroundColor: "#0cc0df",
  },
  commentsButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    flex: 0.7,
  },
  buttonText: {
    color: "#000",
    marginLeft: 5,
  },
  commentsText: {
    color: "#007bff",
    marginLeft: 5,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});

export default connect(mapStateToProps, null)(Feed);
