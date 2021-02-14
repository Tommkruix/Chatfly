import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  Entypo,
  Octicons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import Firebase from "firebase";
import { Image } from "react-native-expo-image-cache";

import ScreenHeader from "../components/ScreenHeader";
import firebase from "../config/init";
import routes from "../navigation/routes";
import Divider from "../components/lists/Divider";
import FeedComponent from "../components/FeedComponent";
import colors from "../constants/colors";

function UserViewProfileScreen({ navigation, route }) {
  const ref_uid = route.params.ref_uid;
  const [ref_pushToken, setRef_PushToken] = useState("");

  const uid = firebase.auth().currentUser.uid;

  const [userimage, setUserImage] = useState();
  const [username, setUserName] = useState();
  const [userstatus, setUserStatus] = useState();
  const [useremail, setUserEmail] = useState();
  const [userAccountType, setUserAccountType] = useState();
  const [showFollowStatus, setShowFollowStatus] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [posts, setPosts] = useState([]);

  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";

  useEffect(() => {
    userDetails();
  }, []);

  useEffect(() => {
    forumPosts();
  }, []);

  /*useEffect(() => {
    // adding event listeners on mount here
    DisplayFollowStatus();
    return () => {
      // cleaning up the listeners here
      DisplayFollowStatus();
    };
  }, []);*/
  useEffect(() => {
    DisplayFollowStatus();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    forumPosts();
  };

  const DisplayFollowStatus = () => {
    firebase
      .database()
      .ref(`Users/${uid}/Friend Requests/${ref_uid}`)
      .once("value", (snapshot) => {
        snapshot.forEach((child) => {
          if (
            snapshot.hasChild("status") &&
            (snapshot.child("status").val() == "1to0" ||
              snapshot.child("status").val() == "1to1")
          ) {
            setShowFollowStatus(true);
          }
        });
      });
  };

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
      .equalTo(ref_uid)
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

  const userDetails = () => {
    firebase
      .database()
      .ref(`/Users/${ref_uid}`)
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
          snapshot.hasChild("expoPushToken") &&
          snapshot.child("expoPushToken").exists
        ) {
          setRef_PushToken(snapshot.child("expoPushToken").val());
        } else {
          setRef_PushToken("");
        }
      });
  };

  const handleUnfollow = (to_uid) => {
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;
    firebase
      .database()
      .ref(`Users/${to_uid}/Friend Requests/${uid}`)
      .once("value", (snapshot) => {
        if (snapshot.hasChild("status") && snapshot.child("status").exists) {
          if (snapshot.child("status").val == "1to0") {
            // updating target user unfollow status
            firebase
              .database()
              .ref(`Users/${to_uid}/Friend Requests/${uid}`)
              .update({
                uid: uid,
                status: "1to0",
                timestamp: timestamp,
              });
            // /updating target user unfollow status
            // current user unfollowing the target user
            firebase
              .database()
              .ref(`Users/${uid}/Friend Requests/${to_uid}`)
              .update({
                uid: to_uid,
                status: "0to1",
                timestamp: timestamp,
              });
            // /current user unfollowing the target user
          } else {
            // updating target user unfollow status
            firebase
              .database()
              .ref(`Users/${to_uid}/Friend Requests/${uid}`)
              .once("value")
              .then(function (snapshot) {
                snapshot.forEach((child) => {
                  child.ref.set(null);
                });
              });
            // /updating target user unfollow status
            // current user unfollowing the target user
            firebase
              .database()
              .ref(`Users/${uid}/Friend Requests/${to_uid}`)
              .once("value")
              .then(function (snapshot) {
                snapshot.forEach((child) => {
                  child.ref.set(null);
                });
              });
            // /current user unfollowing the target user
            //setShowFollowStatus(false);
          }
        } else {
          // updating target user unfollow status
          firebase
            .database()
            .ref(`Users/${to_uid}/Friend Requests/${uid}`)
            .once("value")
            .then(function (snapshot) {
              snapshot.forEach((child) => {
                child.ref.set(null);
              });
            });
          // /updating target user unfollow status
          // current user unfollowing the target user
          firebase
            .database()
            .ref(`Users/${uid}/Friend Requests/${to_uid}`)
            .once("value")
            .then(function (snapshot) {
              snapshot.forEach((child) => {
                child.ref.set(null);
              });
            });
          // /current user unfollowing the target user
        }
        setShowFollowStatus(false);
        DisplayFollowStatus();
        return true;
      });
  };

  const handleFollowRequest = (to_uid, pushToken) => {
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;

    firebase
      .database()
      .ref(`Users/${to_uid}/Friend Requests/${uid}`)
      .once("value", (snapshot) => {
        if (snapshot.hasChild("status") && snapshot.child("status").exists) {
          if (snapshot.child("status").val == "1to0") {
            // updating target user follow status
            firebase
              .database()
              .ref(`Users/${to_uid}/Friend Requests/${uid}`)
              .update({
                uid: uid,
                status: "1to1",
                timestamp: timestamp,
              });
            // /updating target user follow status
            // current user following the target user
            firebase
              .database()
              .ref(`Users/${uid}/Friend Requests/${to_uid}`)
              .update({
                uid: to_uid,
                status: "1to1",
                timestamp: timestamp,
              });
            // /current user following the target user
          } else {
            // updating target user follow status
            firebase
              .database()
              .ref(`Users/${to_uid}/Friend Requests/${uid}`)
              .update({
                uid: uid,
                status: "0to1",
                timestamp: timestamp,
              });
            // /updating target user follow status
            // current user following the target user
            firebase
              .database()
              .ref(`Users/${uid}/Friend Requests/${to_uid}`)
              .update({
                uid: to_uid,
                status: "1to0",
                timestamp: timestamp,
              });
            // /current user following the target user
          }
        } else {
          // updating target user follow status
          firebase
            .database()
            .ref(`Users/${to_uid}/Friend Requests/${uid}`)
            .update({
              uid: uid,
              status: "0to1",
              timestamp: timestamp,
            });
          // /updating target user follow status
          // current user following the target user
          firebase
            .database()
            .ref(`Users/${uid}/Friend Requests/${to_uid}`)
            .update({
              uid: to_uid,
              status: "1to0",
              timestamp: timestamp,
            });
          // /current user following the target user
        }
        DisplayFollowStatus();
        return true;
      });
    SendUserNotification(ref_uid, ref_pushToken);
  };

  const SendUserNotification = (to_uid, pushToken) => {
    const nid = firebase.database().ref("/Notifications").push().key;
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;

    firebase
      .database()
      .ref("Notifications")
      .child(nid)
      .update({
        nid: nid,
        type: "friend request",
        type_id: to_uid,
        to: to_uid,
        from: uid,
        title: `${username}`,
        body: "just followed you",
        status: "1to0",
        timestamp: timestamp,
      });

    // sending remote notification
    if (Platform.OS === "android") {
      Notification.createChannelAndroidAsync("notification", {
        name: "Notification",
        sound: true,
      });
    }
    let response = fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: pushToken,
        sound: "default",
        title: `${username}`,
        body: "just followed you",
        data: { type: "friend request" },
      }),
      vibrate: true,
      android: {
        channelId: "friend request",
        sound: true,
      },
      ios: {
        sound: true,
      },
      priority: "max",
    });
    // /sending remote notification
  };

  function renderButtons() {
    if (
      showFollowStatus === false &&
      userAccountType != "vip" &&
      userAccountType != "vvip"
    ) {
      return (
        <TouchableOpacity
          onPress={() => handleFollowRequest(ref_uid, ref_pushToken)}
        >
          <View style={[styles.cardSmallBox, { marginTop: 10 }]}>
            <View style={styles.cardSmall}>
              <View style={[styles.row, { justifyContent: "center" }]}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.white,
                    fontWeight: "bold",
                  }}
                >
                  Follow{" "}
                </Text>
                <SimpleLineIcons
                  name="user-follow"
                  size={24}
                  color={colors.white}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else if (
      showFollowStatus === false &&
      (userAccountType == "vip" || userAccountType == "vvip")
    ) {
      return (
        <>
          <TouchableOpacity
            onPress={() => handleFollowRequest(ref_uid, ref_pushToken)}
          >
            <View style={[styles.cardSmallBox, { marginTop: 10 }]}>
              <View style={styles.cardSmall}>
                <View style={[styles.row, { justifyContent: "center" }]}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.white,
                      fontWeight: "bold",
                    }}
                  >
                    Follow{" "}
                  </Text>
                  <SimpleLineIcons
                    name="user-follow"
                    size={24}
                    color={colors.white}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(routes.ONETOONECHAT, {
                id: ref_uid,
              })
            }
          >
            <View style={[styles.cardSmallBox, { marginTop: 10 }]}>
              <View style={styles.cardSmall}>
                <View style={[styles.row, { justifyContent: "center" }]}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.white,
                      fontWeight: "bold",
                    }}
                  >
                    Message{" "}
                  </Text>
                  <Entypo name="chat" size={24} color={colors.white} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </>
      );
    } else if (
      showFollowStatus === true &&
      (userAccountType != "vip" || userAccountType != "vvip")
    ) {
      return (
        <>
          <TouchableOpacity onPress={() => handleUnfollow(ref_uid)}>
            <View style={[styles.cardSmallBox, { marginTop: 10 }]}>
              <View style={styles.cardSmall}>
                <View style={[styles.row, { justifyContent: "center" }]}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.white,
                      fontWeight: "bold",
                    }}
                  >
                    Unfollow{" "}
                  </Text>
                  <SimpleLineIcons
                    name="user-unfollow"
                    size={24}
                    color={colors.white}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(routes.ONETOONECHAT, {
                id: ref_uid,
              })
            }
          >
            <View style={[styles.cardSmallBox, { marginTop: 10 }]}>
              <View style={styles.cardSmall}>
                <View style={[styles.row, { justifyContent: "center" }]}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.white,
                      fontWeight: "bold",
                    }}
                  >
                    Message{" "}
                  </Text>
                  <Entypo name="chat" size={24} color={colors.white} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </>
      );
    } else {
      return null;
    }
  }

  return (
    <View style={styles.container}>
      <ScreenHeader navigation={navigation} headerName="User Profile" />
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.imageContainer}>
              <Image
                name="image"
                style={styles.imageStyle}
                uri={userimage != "" ? userimage : placeholderUserImage}
              />

              {userAccountType === "normal" ? (
                <View
                  style={{
                    position: "absolute",
                    alignSelf: "flex-end",
                    marginTop: 180,
                    height: 60,
                    width: 60,
                    borderRadius: 30,
                    backgroundColor: colors.primary,
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons
                    name="stars"
                    size={30}
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
                    marginTop: 180,
                    height: 60,
                    width: 60,
                    borderRadius: 30,
                    backgroundColor: colors.primary,
                    justifyContent: "center",
                  }}
                >
                  <Octicons
                    name="verified"
                    size={30}
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
                    marginTop: 180,
                    height: 60,
                    width: 60,
                    borderRadius: 30,
                    backgroundColor: colors.primary,
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons
                    name="verified-user"
                    size={30}
                    style={{ alignSelf: "center" }}
                    color={colors.white}
                  />
                </View>
              ) : null}
            </View>
            <View style={styles.usernameContainer}>
              <Text style={styles.usernameStyle}>
                {username != "" ? username : "No name"}
              </Text>
            </View>
            {renderButtons()}

            <Divider />
          </>
        }
        showsVerticalScrollIndicator={false}
        data={posts}
        keyExtractor={(post) => post.key.toString()}
        renderItem={({ item }) =>
          showFollowStatus === false ? null : (
            <View>
              {item.adsState === "true" ? (
                <View
                  style={{
                    backgroundColor: colors.white,
                    padding: 10,
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "flex-start",
                      color: colors.primary,
                      fontWeight: "bold",
                    }}
                  >
                    {item.adsDuration >= now ? (
                      <Text>Expired on: {TimeAgo(item.adsDuration)}</Text>
                    ) : (
                      <Text> Ending in: {TimeAgo(item.adsDuration)}</Text>
                    )}
                  </Text>
                </View>
              ) : null}
              <FeedComponent
                useraccounttype={PostUserAccountType(item.userid)}
                userimage={{
                  uri: PostUserImage(item.userid),
                }}
                username={PostUserName(item.userid)}
                postdate={TimeAgo(item.timestamp)}
                postlike={CalculateLikes(item.postid)}
                postimage={item.image && item.image}
                postimagePress={() =>
                  navigation.navigate(routes.FORUMPOSTVIEW, {
                    ref_postid: item.postid,
                    ref_postuid: item.userid,
                  })
                }
                postbodyPress={() =>
                  navigation.navigate(routes.FORUMPOSTVIEW, {
                    ref_postid: item.postid,
                    ref_postuid: item.userid,
                  })
                }
                likestatus={likeChecker(item.postid)}
                visible={item.image == null ? true : false}
                postbody={item.body}
                onLikePress={() => {
                  setSelectedId(item.postid);
                  //if (item.postid === selectedId && selectedId != null) {
                  ManageLikes(item.postid);
                  CalculateLikes(item.postid);
                  // }
                }}
                onCommentPress={() =>
                  navigation.navigate(routes.FORUMPOSTVIEW, {
                    ref_postid: item.postid,
                    ref_postuid: item.userid,
                  })
                }
              />
            </View>
          )
        }
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        extraData={posts}
      />
      {/* <ScrollView>
        
      </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardSmallBox: {
    flexDirection: "row",
    padding: 10,
  },
  cardSmall: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  row: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
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

export default UserViewProfileScreen;
