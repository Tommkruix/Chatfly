import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  Icon,
  Container,
  Content,
  Text,
  Header,
  Left,
  Right,
  Body,
  Button,
} from "native-base";
import { Image } from "react-native-expo-image-cache";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import firebase from "../config/init";
import ScreenHeader from "../components/ScreenHeader";
import defaultStyles from "../constants/theme";
import routes from "../navigation/routes";
import colors from "../constants/colors";
import FeedComponent from "../components/FeedComponent";
import Screen from "../components/Screen";
import Divider from "../components/lists/Divider";

function ProfileScreen({ navigation }) {
  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";

  const uid = firebase.auth().currentUser.uid;

  const [imageUri, setImageUri] = useState();
  const [userimage, setUserImage] = useState();
  const [username, setUserName] = useState();
  const [userstatus, setUserStatus] = useState();
  const [useremail, setUserEmail] = useState();
  const [userAccountType, setUserAccountType] = useState();
  const [userPaymentAddress, setUserPaymentAddress] = useState();
  const [userFollowingLists, setUserFollowingLists] = useState(0);
  const [userFollowedLists, setUserFollowedLists] = useState(0);

  const [txtUsername, setTxtUsername] = useState("No name");
  const [txtUserstatus, setTxtUserstatus] = useState("No status");
  const [txtUserpaymentaddress, setTxtUserpaymentaddress] = useState(
    "No address"
  );

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (!granted) alert("You need to enable permission to access your photos");
  };

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    userDetails();
  }, []);

  useEffect(() => {
    userFollowing();
  }, []);
  useEffect(() => {
    userFollowed();
  }, []);

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.65,
      });
      if (!result.cancelled) {
        handleImageUpdate(result.uri)
          .then(() => {
            // success
          })
          .catch((error) => {
            Alert.alert(error);
          });
      }
    } catch (error) {
      Alert.alert("Error reading image");
    }
  };

  const userFollowing = () => {
    firebase
      .database()
      .ref(`Users/${uid}/Friend Requests/`)
      .once("value", (snapshot) => {
        snapshot.forEach((child) => {
          //console.log(snapshot);
          if (
            child.hasChild("status") &&
            (child.child("status").val() == "1to0" ||
              child.child("status").val() == "1to1")
          ) {
            setUserFollowingLists(snapshot.numChildren());
          }
        });
      });
  };
  const userFollowed = () => {
    firebase
      .database()
      .ref(`Users/${uid}/Friend Requests/`)
      .once("value", (snapshot) => {
        snapshot.forEach((child) => {
          if (
            child.hasChild("status") &&
            (child.child("status").val() == "0to1" ||
              child.child("status").val() == "1to1")
          ) {
            setUserFollowedLists(snapshot.numChildren());
          }
        });
      });
  };

  const userDetails = () => {
    firebase
      .database()
      .ref(`/Users/${uid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("image") && snapshot.child("image").exists) {
          setUserImage(snapshot.child("image").val());
        } else {
          setUserImage("");
        }

        if (snapshot.hasChild("name") && snapshot.child("name").exists) {
          setUserName(snapshot.child("name").val());
        } else {
          setUserName("");
        }

        if (snapshot.hasChild("status") && snapshot.child("status").exists) {
          setUserStatus(snapshot.child("status").val());
        } else {
          setUserStatus("");
        }

        if (snapshot.hasChild("email") && snapshot.child("email").exists) {
          setUserEmail(snapshot.child("email").val());
        } else {
          setUserEmail("");
        }

        if (
          snapshot.hasChild("account_type") &&
          snapshot.child("account_type").exists
        ) {
          setUserAccountType(snapshot.child("account_type").val());
        } else {
          setUserAccountType("");
        }
        if (
          snapshot.hasChild("payment_address") &&
          snapshot.child("payment_address").exists
        ) {
          setUserPaymentAddress(snapshot.child("payment_address").val());
        } else {
          setUserPaymentAddress("");
        }
      });
  };

  const handleNameUpdate = () => {
    firebase.database().ref(`/Users/${uid}`).update({
      name: txtUsername,
    });
    //.then(() => console.log("Data updated."));
  };

  const handleStatusUpdate = () => {
    firebase.database().ref(`/Users/${uid}`).update({
      status: txtUserstatus,
    });
    // .then(() => console.log("Data updated."));
  };
  const handlePaymentAddressUpdate = () => {
    firebase.database().ref(`/Users/${uid}`).update({
      payment_address: txtUserpaymentaddress,
    });
    // .then(() => console.log("Data updated."));
  };

  const handleImageUpdate = async (uri) => {
    const uniqid = () => Math.random().toString(36).substr(2, 9);
    const ext = uri.split(".").pop(); // Extract image extension
    const filename = `${uniqid()}.${ext}`; // Generate unique name
    const ref = firebase
      .storage()
      .ref()
      .child("User Images/" + filename);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const snapshot = await ref.put(blob);

    blob.close();
    const imgUrl = await snapshot.ref.getDownloadURL();

    // save to user details
    firebase.database().ref(`/Users/${uid}`).update({
      image: imgUrl,
    });
    // /save to user details

    //console.log(imgUrl);
    return imgUrl;
  };

  /* Forum Posts */
  const now = new Date().getTime();

  const [selectedId, setSelectedId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    forumPosts();
  }, []);

  function PostUserName(uid) {
    var name;
    firebase
      .database()
      .ref(`/Users/${uid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("name") && snapshot.child("name").exists) {
          name = snapshot.child("name").val();
        } else {
          name = "";
        }
      });

    return name;
  }

  function PostUserAccountType(uid) {
    var type;
    firebase
      .database()
      .ref(`/Users/${uid}`)
      .on("value", (snapshot) => {
        if (
          snapshot.hasChild("account_type") &&
          snapshot.child("account_type").exists
        ) {
          type = snapshot.child("account_type").val();
        } else {
          type = "";
        }
      });

    return type;
  }

  function PostUserImage(uid) {
    var image;
    firebase
      .database()
      .ref(`/Users/${uid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("image") && snapshot.child("image").exists) {
          image = snapshot.child("image").val();
        } else {
          image = placeholderUserImage;
        }
      });

    return image;
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    forumPosts();
  };

  const ManageLikes = (POSTID) => {
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;
    firebase
      .database()
      .ref("Forum Post Likes")
      .orderByChild("userid_postid")
      .equalTo(uid + POSTID)
      .once("value")
      .then(function (snapshot) {
        if (snapshot.exists()) {
          DeletePostLike(POSTID);
          CalculateLikes(POSTID);
        } else {
          AddPostLike(POSTID);
          CalculateLikes(POSTID);
        }
      });
    forumPosts();
  };

  const AddPostLike = (POSTID) => {
    const likeid = firebase.database().ref("/Forum Post Likes").push().key;
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;

    firebase
      .database()
      .ref("Forum Post Likes")
      .child(likeid)
      .update({
        likeid: likeid,
        postid: POSTID,
        userid_likeid: uid + likeid,
        userid_postid: uid + POSTID,
        timestamp: timestamp,
      });

    AddPostEarning(POSTID);
  };

  const AddPostEarning = (POSTID) => {
    const earningid = firebase.database().ref("/Forum Post Earnings").push()
      .key;
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;

    firebase
      .database()
      .ref("Forum Post Earnings")
      .child(earningid)
      .update({
        earningid: earningid,
        userid: uid,
        postid: POSTID,
        userid_earningid: uid + earningid,
        userid_postid: uid + POSTID,
        timestamp: timestamp,
      });
  };

  const DeletePostLike = (POSTID) => {
    firebase
      .database()
      .ref("Forum Post Likes")
      .orderByChild("userid_postid")
      .equalTo(uid + POSTID)
      .once("value")
      .then(function (snapshot) {
        snapshot.forEach((child) => {
          child.ref.set(null);
        });
      });
    DeletePostEarning(POSTID);
  };
  const DeletePostEarning = (POSTID) => {
    firebase
      .database()
      .ref("Forum Post Earnings")
      .orderByChild("userid_postid")
      .equalTo(uid + POSTID)
      .once("value")
      .then(function (snapshot) {
        snapshot.forEach((child) => {
          child.ref.set(null);
        });
      });
  };

  function TimeAgo(time) {
    return (
      new Date(time).toDateString() + ", " + new Date(time).toLocaleTimeString()
    );
  }

  function CalculateLikes(POSTID) {
    var count;
    firebase
      .database()
      .ref(`Forum Post Likes/`)
      .orderByChild("postid")
      .equalTo(POSTID)
      .on("value", (snapshot) => {
        count = snapshot.numChildren().toString();
      });

    if (count == 1) {
      count = count + " like";
    } else if (count > 1) {
      count = count + " likes";
    } else {
      count = "No likes";
    }

    return count;
  }

  function likeChecker(POSTID) {
    //console.log(POSTID);

    var status;
    firebase
      .database()
      .ref(`Forum Post Likes/`)
      .orderByChild("userid_postid")
      .equalTo(uid + POSTID)
      .on("value", (snapshot) => {
        if (snapshot.exists()) {
          status = "true";
        } else {
          status = "false";
        }
      });

    return status;
  }

  const forumPosts = () => {
    firebase
      .database()
      .ref(`/Forum Posts/`)
      .orderByChild("userid")
      .equalTo(uid)
      .on("value", (snapshot) => {
        var li = [];
        var adsState;

        snapshot.forEach((child) => {
          const adsDuration = child.child("adsDuration").val();
          if (child.child("adsState").val() === "true") {
            adsState = "true";
          } else {
            adsState = "false";
          }

          li.push({
            key: child.key,
            body: child.val().body,
            image: child.val().image,
            ads: adsState,
            adsDuration: adsDuration,
            postid: child.val().postid,
            status: child.val().status,
            timestamp: child.val().timestamp,
            userid: child.val().userid,
            userid_postid: child.val().userid_postid,
          });
        });
        setPosts(li.reverse());
      });
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  return (
    <Screen>
      <ScreenHeader headerName="My Profile" navigation={navigation} />
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={
            <View style={styles.container}>
              <Content>
                <View style={{ paddingTop: 10 }}>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, alignItems: "center" }}>
                      <Image
                        uri={userimage != "" ? userimage : placeholderUserImage}
                        style={{ width: 75, height: 75, borderRadius: 37.5 }}
                      />
                      {userAccountType === "normal" ? (
                        <View
                          style={{
                            position: "absolute",
                            alignSelf: "flex-end",
                            right: 20,
                            marginTop: 60,
                            height: 20,
                            width: 20,
                            borderRadius: 10,
                            backgroundColor: colors.primary,
                            justifyContent: "center",
                          }}
                        >
                          <MaterialIcons
                            name="stars"
                            size={15}
                            style={{ alignSelf: "center" }}
                            color={colors.white}
                          />
                        </View>
                      ) : null}
                      {userAccountType === "vip" ? (
                        <View
                          style={{
                            position: "absolute",
                            alignSelf: "flex-end",
                            right: 20,
                            marginTop: 60,
                            height: 20,
                            width: 20,
                            borderRadius: 10,
                            backgroundColor: colors.primary,
                            justifyContent: "center",
                          }}
                        >
                          <Octicons
                            name="verified"
                            size={15}
                            style={{ alignSelf: "center" }}
                            color={colors.white}
                          />
                        </View>
                      ) : null}
                      {userAccountType === "vvip" ? (
                        <View
                          style={{
                            position: "absolute",
                            alignSelf: "flex-end",
                            right: 20,
                            marginTop: 60,
                            height: 20,
                            width: 20,
                            borderRadius: 10,
                            backgroundColor: colors.primary,
                            justifyContent: "center",
                          }}
                        >
                          <MaterialIcons
                            name="verified-user"
                            size={15}
                            style={{ alignSelf: "center" }}
                            color={colors.white}
                          />
                        </View>
                      ) : null}
                    </View>
                    <View style={{ flex: 3 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around",
                        }}
                      >
                        <View style={{ alignItems: "center" }}>
                          <Text
                            style={{ fontSize: defaultStyles.text.fontSize }}
                          >
                            {posts.length}
                          </Text>
                          <Text
                            style={{
                              fontSize: defaultStyles.text.fontSize,
                              color: "grey",
                            }}
                          >
                            posts
                          </Text>
                        </View>
                        <View style={{ alignItems: "center" }}>
                          <TouchableOpacity
                            style={{ alignItems: "center" }}
                            onPress={() =>
                              navigation.navigate(routes.FOLLOWEDLISTS)
                            }
                          >
                            <Text
                              style={{ fontSize: defaultStyles.text.fontSize }}
                            >
                              {userFollowedLists}
                            </Text>
                            <Text
                              style={{
                                fontSize: defaultStyles.text.fontSize,
                                color: "grey",
                              }}
                            >
                              followers
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: "center" }}>
                          <TouchableOpacity
                            style={{ alignItems: "center" }}
                            onPress={() =>
                              navigation.navigate(routes.FOLLOWINGLISTS)
                            }
                          >
                            <Text
                              style={{ fontSize: defaultStyles.text.fontSize }}
                            >
                              {userFollowingLists}
                            </Text>
                            <Text
                              style={{
                                fontSize: defaultStyles.text.fontSize,
                                color: "grey",
                              }}
                            >
                              following
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{ flexDirection: "row", padding: 10 }}>
                        <Button
                          bordered
                          dark
                          style={{
                            flex: 3,
                            marginLeft: 10,
                            justifyContent: "center",
                            height: 30,
                          }}
                          onPress={() =>
                            navigation.navigate(routes.EDITPROFILE)
                          }
                        >
                          <Text>Edit Profile</Text>
                        </Button>
                      </View>
                    </View>
                  </View>
                  <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: defaultStyles.text.fontSize,
                      }}
                    >
                      {username}
                    </Text>
                    <Text
                      style={{
                        fontSize: defaultStyles.text.fontSize,
                      }}
                    >
                      {userstatus}
                    </Text>
                    <Text
                      style={{
                        color: colors.secondary,
                        fontSize: defaultStyles.text.fontSize,
                      }}
                    >
                      {useremail}
                    </Text>
                  </View>
                </View>
                {/*<View>
        <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              borderTopWidth: 1,
              borderTopColor: "#eae5e5",
            }}
          >
            <Button
              transparent
              onPress={() => this.segmentClicked(0)}
              active={this.state.activeIndex == 0}
            >
              <Icon
                name="ios-apps"
                style={[this.state.activeIndex == 0 ? {} : { color: "grey" }]}
              />
            </Button>
            <Button
              transparent
              onPress={() => this.segmentClicked(1)}
              active={this.state.activeIndex == 1}
            >
              <Icon
                name="ios-list"
                style={[this.state.activeIndex == 1 ? {} : { color: "grey" }]}
              />
            </Button>
            <Button
              transparent
              onPress={() => this.segmentClicked(2)}
              active={this.state.activeIndex == 2}
            >
              <Icon
                name="ios-people"
                style={[this.state.activeIndex == 2 ? {} : { color: "grey" }]}
              />
            </Button>
            <Button
              transparent
              onPress={() => this.segmentClicked(3)}
              active={this.state.activeIndex == 3}
            >
              <Icon
                name="ios-bookmark"
                style={[this.state.activeIndex == 3 ? {} : { color: "grey" }]}
              />
            </Button>
          </View>
          {this.renderSection()}
        </View>*/}
              </Content>
              <Divider />
              <Divider />
              <Divider />
            </View>
          }
          data={posts}
          keyExtractor={(post) => post.postid.toString()}
          renderItem={({ item }) => (
            <FeedComponent
              useraccounttype={PostUserAccountType(item.userid)}
              userimage={{
                uri: item.userimage,
              }}
              username={PostUserName(item.userid)}
              postdate={TimeAgo(item.timestamp)}
              postlike={item.likecount}
              postimage={item.image && item.image}
              postimagePress={() =>
                navigation.navigate(routes.FORUMPOSTVIEW, {
                  ref_postid: item.postid,
                  ref_postuid: item.userid,
                })
              }
              postbodyPress={() => handleNavigation(item.postid, item.userid)}
              likestatus={item.likestatus}
              visible={item.image == null ? true : false}
              navigation={navigation}
              postbody={item.body}
              onLikePress={() => {
                //setSelectedId(item.postid);
                //if (item.postid === selectedId && selectedId != null) {
                ManageLikes(item.postid, item.userid);
                //CalculateLikes(item.postid);
                // }
              }}
              onCommentPress={() =>
                navigation.navigate(routes.FORUMPOSTVIEW, {
                  ref_postid: item.postid,
                  ref_postuid: item.userid,
                })
              }
              onProfilePress={() => {
                navigation.navigate(routes.USERVIEWPROFILE, {
                  ref_uid: item.userid,
                });
              }}
            />
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    backgroundColor: colors.primary,
  },
  imageContainer: {
    marginTop: 45,
    alignItems: "center",
    marginHorizontal: 80,
    borderRadius: 125,
    marginBottom: 10,
  },
  imageStyle: {
    width: 250,
    height: 250,
    borderRadius: 250 / 2,
    borderWidth: 10,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  usernameContainer: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  usernameStyle: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
