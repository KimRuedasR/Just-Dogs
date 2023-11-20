import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, FlatList, Button, TouchableOpacity } from "react-native";

import { connect } from "react-redux";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { container, text, utils } from '../styles'
import { ScrollView } from 'react-native-gesture-handler';
require("firebase/compat/firestore");
require("firebase/firestore");
import CachedImage from '../random/CachedImage';

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    // Fetch user and posts data based on the provided user ID
    const { currentUser, posts } = props;
    console.log({ currentUser, posts });
    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      // Fetch data for a different user
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("No existe");
          }
        });
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUserPosts(posts);
        });
    }
    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following]);

  // Follow and unfollow functions
  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});
  };

  const onUnfollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();
  };

  const onLogout = () => {
    firebase.auth().signOut();
  };

  if (user === null) {
    return <View />;
  }

  // Render user profile and posts
  return (
    // <View style={styles.container}>
    //   {/* User data */}
    //   <View style={styles.containerInfo}>
    //     <Text>{user.name}</Text>
    //     <Text>{user.email}</Text>

    //     {/* Follow button */}
    //     {props.route.params.uid !== firebase.auth().currentUser.uid ? (
    //       <View>
    //         {following ? (
    //           <Button title="Siguiendo" onPress={() => onUnfollow()} />
    //         ) : (
    //           <Button title="Seguir" onPress={() => onFollow()} />
    //         )}
    //       </View>
    //     ) : (
    //       <Button title="Cerrar sesión" onPress={() => onLogout()} />
    //     )}
    //   </View>

    //   {/* Image data */}
    //   <View style={styles.containerGallery}>
    //     <FlatList
    //       numColumns={3}
    //       horizontal={false}
    //       data={userPosts}
    //       renderItem={({ item }) => (
    //         <View style={styles.containerImage}>
    //           <Image style={styles.image} source={{ uri: item.downloadURL }} />
    //         </View>
    //       )}
    //     />
    //   </View>
    // </View>
    <ScrollView style={[container.container, utils.backgroundWhite]}>

            <View style={[container.profileInfo]}>

                <View style={[utils.noPadding, container.row]}>

                    {user.image == 'default' ?
                        (
                            <FontAwesome5
                                style={[utils.profileImageBig, utils.marginBottomSmall]}
                                name="user-circle" size={80} color="black" />
                        )
                        :
                        (
                            <Image
                                style={[utils.profileImageBig, utils.marginBottomSmall]}
                                source={{
                                    uri: user.image
                                }}
                            />
                        )
                    }

                    <View style={[container.container, container.horizontal, utils.justifyCenter, utils.padding10Sides]}>

                        <View style={[utils.justifyCenter, text.center, container.containerImage]}>
                            <Text style={[text.bold, text.large, text.center]}>{userPosts.length}</Text>
                            <Text style={[text.center]}>Posts</Text>
                        </View>
                        <View style={[utils.justifyCenter, text.center, container.containerImage]}>
                            <Text style={[text.bold, text.large, text.center]}>{user.followersCount}</Text>
                            <Text style={[text.center]}>Followers</Text>
                        </View>
                        <View style={[utils.justifyCenter, text.center, container.containerImage]}>
                            <Text style={[text.bold, text.large, text.center]}>{user.followingCount}</Text>
                            <Text style={[text.center]}>Following</Text>
                        </View>
                    </View>

                </View>


                <View>
                    <Text style={text.bold}>{user.name}</Text>
                    <Text>{user.email}</Text>
                    <Text style={[text.profileDescription, utils.marginBottom]}>{user.description}</Text>

                    {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                        <View style={[container.horizontal]}>
                            {following ? (
                                <TouchableOpacity
                                    style={[utils.buttonOutlined, container.container, utils.margin15Right]}
                                    title="Following"
                                    onPress={() => onUnfollow()}>
                                    <Text style={[text.bold, text.center, text.green]}>Following</Text>
                                </TouchableOpacity>
                            )
                                :
                                (
                                    <TouchableOpacity
                                        style={[utils.buttonOutlined, container.container, utils.margin15Right]}
                                        title="Follow"
                                        onPress={() => onFollow()}>
                                        <Text style={[text.bold, text.center, { color: '#2196F3' }]}>Follow</Text>
                                    </TouchableOpacity>

                                )}

                            <TouchableOpacity
                                style={[utils.buttonOutlined, container.container]}
                                title="Follow"
                                onPress={() => props.navigation.navigate('Chat', { user })}>
                                <Text style={[text.bold, text.center]}>Message</Text>
                            </TouchableOpacity>
                        </View>
                    ) : 
                        <TouchableOpacity
                            style={[utils.buttonOutlined, utils.margin5Bottom]}
                            onPress={() => props.navigation.navigate('Edit')}>
                            <Text style={[text.bold, text.center]}>Edit Profile</Text>
                        </TouchableOpacity>
                        
                        }
                        <TouchableOpacity
                            style={utils.buttonOutlined}
                            onPress={() => onLogout()}>
                            <Text style={[text.bold, text.center]}>Cerrar sesion</Text>
                        </TouchableOpacity>
                
                
                </View>
            </View>

            <View style={[utils.borderTopGray]}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    style={{}}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[container.containerImage, utils.borderWhite]}
                            onPress={() => props.navigation.navigate("Post", { item, user })}>

                            {item.type == 0 ?

                                <CachedImage
                                    cacheKey={item.id}
                                    style={container.image}
                                    source={{ uri: item.downloadURLStill }}
                                />

                                :

                                <CachedImage
                                    cacheKey={item.id}
                                    style={container.image}
                                    source={{ uri: item.downloadURL }}
                                />
                            }
                        </TouchableOpacity>
                    )}
                />
            </View>
        </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1 / 3,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(Profile);
