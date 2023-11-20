import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Button,
  RefreshControl,
  BottomSheet,
} from "react-native";
import { container, utils } from "../../styles";
import firebase from "firebase/compat/app";
require("firebase/firestore");

import { connect } from "react-redux";

function Feed(props) {
  const [posts, setPosts] = useState([]);
  const [sheetRef, setSheetRef] = useState(useRef(null));
  const [modalShow, setModalShow] = useState({ visible: false, item: null });
  const [refreshing, setRefreshing] = useState(false);
  const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
    if (changed && changed.length > 0) {
      setInViewPort(changed[0].index);
    }
  });

  useEffect(() => {
    // Check if all users are loaded and find users by ID
    if (
      props.usersFollowingLoaded == props.following.length &&
      props.following.length !== 0
    ) {
      props.feed.sort(function (x, y) {
        return x.creation - y.creation;
      });
      setPosts(props.feed);
    }
    console.log(posts);
  }, [props.usersFollowingLoaded, props.feed]);

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
    // Render feed posts
    <View style={styles.container}>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            // Image posts
            <View style={styles.containerImage}>
              <Text style={styles.container}>{item.user.name}</Text>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
              {item.currentUserLike ? (
                <Button
                  title="Dislike"
                  onPress={() => onDislikePress(item.user.uid, item.id)}
                />
              ) : (
                <Button
                  title="Like"
                  onPress={() => onLikePress(item.user.uid, item.id)}
                />
              )}
              <Text
                onPress={() =>
                  props.navigation.navigate("Comment", {
                    postId: item.id,
                    uid: item.user.uid,
                  })
                }
              >
                Ver comentarios...
              </Text>
            </View>
          )}
        />
      </View>
    </View>
    // <View style={[container.container, utils.backgroundWhite]}>

    //         <FlatList
    //             refreshControl={
    //                 <RefreshControl
    //                     refreshing={refreshing}
    //                     onRefresh={() => {
    //                         setRefreshing(true);
    //                         props.reload()
    //                     }}
    //                 />
    //             }
    //             onViewableItemsChanged={onViewableItemsChanged.current}
    //             viewabilityConfig={{
    //                 waitForInteraction: false,
    //                 viewAreaCoveragePercentThreshold: 70
    //             }}
    //             numColumns={1}
    //             horizontal={false}
    //             data={posts}
    //             keyExtractor={(item, index) => index.toString()}

    //             renderItem={({ item, index }) => (
    //                 <View key={index}>
    //                     <Post route={{ params: { user: item.user, item, index, unmutted, inViewPort, setUnmuttedMain: setUnmutted, setModalShow, feed: true } }} navigation={props.navigation} />
    //                 </View>
    //             )}
    //         />

    //         <BottomSheet
    //             bottomSheerColor="#FFFFFF"
    //             ref={setSheetRef}
    //             initialPosition={0} //200, 300
    //             snapPoints={[300, 0]}
    //             isBackDrop={true}
    //             isBackDropDismissByPress={true}
    //             isRoundBorderWithTipHeader={true}
    //             backDropColor="black"
    //             isModal
    //             containerStyle={{ backgroundColor: "white" }}
    //             tipStyle={{ backgroundColor: "white" }}
    //             headerStyle={{ backgroundColor: "white", flex: 1 }}
    //             bodyStyle={{ backgroundColor: "white", flex: 1, borderRadius: 20 }}
    //             body={

    //                 <View>

    //                     {modalShow.item != null ?
    //                         <View>
    //                             <TouchableOpacity style={{ padding: 20 }}
    //                                 onPress={() => {
    //                                     props.navigation.navigate("ProfileOther", { uid: modalShow.item.user.uid, username: undefined });
    //                                     setModalShow({ visible: false, item: null });
    //                                 }}>
    //                                 <Text >Profile</Text>
    //                             </TouchableOpacity>
    //                             <Divider />
    //                             {modalShow.item.creator == firebase.auth().currentUser.uid ?
    //                                 <TouchableOpacity style={{ padding: 20 }}
    //                                     onPress={() => {
    //                                         props.deletePost(modalShow.item).then(() => {
    //                                             setRefreshing(true);
    //                                             props.reload()
    //                                         })
    //                                         setModalShow({ visible: false, item: null });
    //                                     }}>
    //                                     <Text >Delete</Text>
    //                                 </TouchableOpacity>
    //                                 : null}

    //                             <Divider />
    //                             <TouchableOpacity style={{ padding: 20 }} onPress={() => setModalShow({ visible: false, item: null })}>
    //                                 <Text >Cancel</Text>
    //                             </TouchableOpacity>
    //                         </View>
    //                         : null}

    //                 </View>
    //             }
    //         />
    //     </View>
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
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});

export default connect(mapStateToProps, null)(Feed);
