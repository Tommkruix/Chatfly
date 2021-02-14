import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Platform,
  ToastAndroid,
  Alert,
  Keyboard,
} from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome,
  Octicons,
  MaterialIcons,
} from "@expo/vector-icons";
import Firebase from "firebase";
import Hyperlink from "react-native-hyperlink";
import { Notifications } from "expo";

import colors from "../constants/colors";
import firebase from "../config/init";
import { Image } from "react-native-expo-image-cache";
import Divider from "../components/lists/Divider";
import routes from "../navigation/routes";
import RNUrlPreview from "react-native-url-preview";
import ScreenHeader from "../components/ScreenHeader";

function ForumPostViewScreen({ navigation, route }) {
  const uid = firebase.auth().currentUser.uid;
  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";

  const [commentsList, setCommentsList] = useState([]);

  const ref_postid = route.params.ref_postid;
  const ref_postuid = route.params.ref_postuid;

  const [txtComment, setTxtComment] = useState(null);
  const [commentButton, setCommentButton] = useState(false);

  const [currentUsername, setCurrentUsername] = useState();

  const [refPostBody, setRefPostBody] = useState();
  const [refPostImage, setRefPostImage] = useState(null);
  const [refPostLikes, setRefPostLikes] = useState();
  const [refPostComments, setRefPostComments] = useState();
  const [refPostUserName, setRefPostUserName] = useState();
  const [refPostUserImage, setRefPostUserImage] = useState();
  const [refPostUserAccountType, setRefPostUserAccountType] = useState();
  const [refPostUserStatus, setRefPostUserStatus] = useState();
  const [refPostDate, setRefPostDate] = useState();
  const [refPostExpoPushToken, setRefPostExpoPushToken] = useState();

  const [dailyLimitEarningPoint, setDailyLimitEarningPoint] = useState(0);
  const [
    dailyNormalLimitEarningPoint,
    setDailyNormalLimitEarningPoint,
  ] = useState(0);
  const [dailyVIPLimitEarningPoint, setDailyVIPLimitEarningPoint] = useState(0);
  const [dailyVVIPLimitEarningPoint, setDailyVVIPLimitEarningPoint] = useState(
    0
  );
  const [earningPerPostOwner, setEarningPerPostOwner] = useState(0);
  const [earningPerPostViewer, setEarningPerPostViewer] = useState(0);

  const last24hour = new Date().getTime() - 24 * 3600 * 1000;

  useEffect(() => {
    RetrieveComments();
  }, []);

  useEffect(() => {
    RetrieveRefPostDetails();
  });

  useEffect(() => {
    RetrieveCurrentUserDetails();
  }, []);

  const RetrieveCurrentUserDetails = () => {
    firebase
      .database()
      .ref(`Users/${uid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("name") && snapshot.child("name").exists) {
          setCurrentUsername(snapshot.child("name").val());
        } else {
          setCurrentUsername("");
        }
      });
  };

  const RetrieveRefPostDetails = () => {
    // user details
    firebase
      .database()
      .ref(`/Users/${ref_postuid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("image") && snapshot.child("image").exists) {
          setRefPostUserImage(snapshot.child("image").val());
        } else {
          setRefPostUserImage(placeholderUserImage);
        }

        if (snapshot.hasChild("name") && snapshot.child("name").exists) {
          setRefPostUserName(snapshot.child("name").val());
        } else {
          setRefPostUserName("No name");
        }

        if (snapshot.hasChild("status") && snapshot.child("status").exists) {
          setRefPostUserStatus(snapshot.child("status").val());
        } else {
          setRefPostUserStatus("No status");
        }

        if (
          snapshot.hasChild("account_type") &&
          snapshot.child("account_type").exists
        ) {
          setRefPostUserAccountType(snapshot.child("account_type").val());
        } else {
          setRefPostUserAccountType(null);
        }

        if (
          snapshot.hasChild("expoPushToken") &&
          snapshot.child("expoPushToken").exists
        ) {
          setRefPostExpoPushToken(snapshot.child("expoPushToken").val());
        } else {
          setRefPostExpoPushToken("");
        }
      });

    // post details
    firebase
      .database()
      .ref(`/Forum Posts/${ref_postid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("image") && snapshot.child("image").exists) {
          setRefPostImage(snapshot.child("image").val());
        } else {
          setRefPostImage(null);
        }

        if (snapshot.hasChild("body") && snapshot.child("body").exists) {
          setRefPostBody(snapshot.child("body").val());
        } else {
          setRefPostBody("");
        }

        if (
          snapshot.hasChild("timestamp") &&
          snapshot.child("timestamp").exists
        ) {
          setRefPostDate(snapshot.child("timestamp").val());
        } else {
          setRefPostDate("");
        }
      });

    // likes details
    firebase
      .database()
      .ref("Forum Post Likes")
      .orderByChild("postid")
      .equalTo(ref_postid)
      .on("value", (snapshot) => {
        if (
          snapshot.exists() &&
          snapshot != null &&
          snapshot.numChildren() >= 1
        ) {
          setRefPostLikes(snapshot.numChildren() + " likes");
        } else {
          setRefPostLikes("0 likes");
        }
      });

    // comments details
    firebase
      .database()
      .ref("Forum Post Comments")
      .orderByChild("postid")
      .equalTo(ref_postid)
      .on("value", (snapshot) => {
        if (
          snapshot.exists() &&
          snapshot != null &&
          snapshot.numChildren() >= 1
        ) {
          setRefPostComments(snapshot.numChildren() + " comments");
        } else {
          setRefPostComments("0 comments");
        }
      });
  };

  useEffect(() => {
    handleDefaultSettings();
  }, []);

  const handleDefaultSettings = () => {
    firebase
      .database()
      .ref(`/Administration/`)
      .on("value", (snapshot) => {
        if (
          snapshot.hasChild("daily_limit_earning_point") &&
          snapshot.child("daily_limit_earning_point").exists
        ) {
          setDailyLimitEarningPoint(
            snapshot.child("daily_limit_earning_point").val()
          );
        } else {
          setDailyLimitEarningPoint(0);
        }
        if (
          snapshot.hasChild("daily_normallimit_earning_point") &&
          snapshot.child("daily_normallimit_earning_point").exists
        ) {
          setDailyNormalLimitEarningPoint(
            snapshot.child("daily_normallimit_earning_point").val()
          );
        } else {
          setDailyNormalLimitEarningPoint(0);
        }
        if (
          snapshot.hasChild("daily_viplimit_earning_point") &&
          snapshot.child("daily_viplimit_earning_point").exists
        ) {
          setDailyVIPLimitEarningPoint(
            snapshot.child("daily_viplimit_earning_point").val()
          );
        } else {
          setDailyVIPLimitEarningPoint(0);
        }
        if (
          snapshot.hasChild("daily_vviplimit_earning_point") &&
          snapshot.child("daily_vviplimit_earning_point").exists
        ) {
          setDailyVVIPLimitEarningPoint(
            snapshot.child("daily_vviplimit_earning_point").val()
          );
        } else {
          setDailyVVIPLimitEarningPoint(0);
        }

        if (
          snapshot.hasChild("earning_per_postcomment_owner") &&
          snapshot.child("earning_per_postcomment_owner").exists
        ) {
          setEarningPerPostOwner(
            snapshot.child("earning_per_postcomment_owner").val()
          );
        } else {
          setEarningPerPostOwner(0);
        }
        if (
          snapshot.hasChild("earning_per_postcomment_viewer") &&
          snapshot.child("earning_per_postcomment_viewer").exists
        ) {
          setEarningPerPostViewer(
            snapshot.child("earning_per_postcomment_viewer").val()
          );
        } else {
          setEarningPerPostViewer(0);
        }
      });
  };

  const RetrieveComments = () => {
    firebase
      .database()
      .ref(`/Forum Post Comments/`)
      .orderByChild("postid")
      .equalTo(ref_postid)
      .on("value", (snapshot) => {
        var li = [];
        snapshot.forEach((child) => {
          li.push({
            key: child.key,
            body: child.val().body,
            postid: child.val().postid,
            timestamp: child.val().timestamp,
            userid: child.val().userid,
            commentid: child.val().commentid,
          });
        });
        setCommentsList(li.reverse());
      });
  };

  const [textInput, setTextInput] = useState("");

  const handleCommentButton = () => {
    setCommentButton(true);
    const commentid = firebase.database().ref("/Forum Post Comments").push()
      .key;
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;

    if (txtComment != null && txtComment != "") {
      firebase
        .database()
        .ref("/Forum Post Comments")
        .child(commentid)
        .update({
          body: txtComment,
          userid: uid,
          postid: ref_postid,
          commentid: commentid,
          userid_commentid: uid + commentid,
          userid_postid: uid + ref_postid,
          timestamp: timestamp,
        })
        .then(() => RetrieveRefPostDetails(), RetrieveComments())
        .catch((error) => {
          Platform.OS === "android"
            ? ToastAndroid.show("Error occured.", ToastAndroid.SHORT)
            : Alert.alert("Error Occured");
        });
      SendUserNotification();
      //AddPostOwnerEarning(ref_postid, ref_postuid);
      AddPostEarning(ref_postid, uid);
      setCommentButton(false);
    } else {
      Platform.OS === "android"
        ? ToastAndroid.show("You need to type something...", ToastAndroid.SHORT)
        : Alert.alert("You need to type something...");
      setCommentButton(false);
    }

    textInput.clear();
    setCommentButton(false);
  };

  const AddPostEarning = (POSTID, USERID) => {
    const earningid = firebase.database().ref("/Forum Post Earnings").push()
      .key;
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;
    // check user account type
    firebase
      .database()
      .ref(`Users/${USERID}`)
      .once("value")
      .then(function (usnapshot) {
        //console.log(usnapshot);
        //console.log("userid: ",USERID, " account type: ",uat)
        var uat = usnapshot.child("account_type").val();

        firebase
          .database()
          .ref("/Forum Post Earnings")
          .orderByChild("userid")
          .equalTo(uid)
          .once("value")
          .then(function (snapshot) {
            if (snapshot.exists()) {
              var total = 0;
              snapshot.forEach((child) => {
                if (child.val().timestamp >= last24hour) {
                  total++;
                }
              });
              if (total <= dailyNormalLimitEarningPoint && uat == "normal") {
                // Add Earning
                var i = 1;
                while (i <= earningPerPostViewer) {
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
                  i++;
                }
                // /Add Earning
              }
              if (total <= dailyVIPLimitEarningPoint && uat == "vip") {
                // Add Earning
                var i = 1;
                while (i <= earningPerPostViewer) {
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
                  i++;
                }
                // /Add Earning
              }
              if (total <= dailyVVIPLimitEarningPoint && uat == "vvip") {
                // Add Earning
                var i = 1;
                while (i <= earningPerPostViewer) {
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
                  i++;
                }
                // /Add Earning
              }
              if (
                total <= dailyLimitEarningPoint &&
                uat != "normal" &&
                uat != "vip" &&
                uat != "vvip"
              ) {
                // Add Earning
                var i = 1;
                while (i <= earningPerPostViewer) {
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
                  i++;
                }
                // /Add Earning
              }
            } else {
              // add earning
              var i = 1;
              while (i <= earningPerPostViewer) {
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
                i++;
              }
            }
          });
      });
  };
  const AddPostOwnerEarning = (POSTID, USERID) => {
    const earningid = firebase.database().ref("/Forum Post Earnings").push()
      .key;
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;
    // check user account type
    firebase
      .database()
      .ref(`Users/${USERID}`)
      .once("value")
      .then(function (usnapshot) {
        //console.log(usnapshot);
        //console.log("userid: ",USERID, " account type: ",uat)
        var uat = usnapshot.child("account_type").val();

        firebase
          .database()
          .ref("/Forum Post Earnings")
          .orderByChild("userid")
          .equalTo(USERID)
          .once("value")
          .then(function (snapshot) {
            if (snapshot.exists()) {
              var total = 0;
              snapshot.forEach((child) => {
                if (child.val().timestamp >= last24hour) {
                  total++;
                }
              });
              if (total <= dailyNormalLimitEarningPoint && uat == "normal") {
                // Add Earning
                var i = 1;
                while (i <= earningPerPostOwner) {
                  firebase
                    .database()
                    .ref("Forum Post Earnings")
                    .child(earningid)
                    .update({
                      earningid: earningid,
                      userid: USERID,
                      postid: POSTID,
                      userid_earningid: USERID + earningid,
                      userid_postid: USERID + POSTID,
                      timestamp: timestamp,
                    });
                  i++;
                }
                // /Add Earning
              }
              if (total <= dailyVIPLimitEarningPoint && uat == "vip") {
                // Add Earning
                var i = 1;
                while (i <= earningPerPostOwner) {
                  firebase
                    .database()
                    .ref("Forum Post Earnings")
                    .child(earningid)
                    .update({
                      earningid: earningid,
                      userid: USERID,
                      postid: POSTID,
                      userid_earningid: USERID + earningid,
                      userid_postid: USERID + POSTID,
                      timestamp: timestamp,
                    });
                  i++;
                }
                // /Add Earning
              }
              if (total <= dailyVVIPLimitEarningPoint && uat == "vvip") {
                // Add Earning
                var i = 1;
                while (i <= earningPerPostOwner) {
                  firebase
                    .database()
                    .ref("Forum Post Earnings")
                    .child(earningid)
                    .update({
                      earningid: earningid,
                      userid: USERID,
                      postid: POSTID,
                      userid_earningid: USERID + earningid,
                      userid_postid: USERID + POSTID,
                      timestamp: timestamp,
                    });
                  i++;
                }
                // /Add Earning
              }
              if (
                (total <= dailyLimitEarningPoint && uat != "normal") ||
                uat != "vip" ||
                uat != "vvip"
              ) {
                // Add Earning
                var i = 1;
                while (i <= earningPerPostOwner) {
                  firebase
                    .database()
                    .ref("Forum Post Earnings")
                    .child(earningid)
                    .update({
                      earningid: earningid,
                      userid: USERID,
                      postid: POSTID,
                      userid_earningid: USERID + earningid,
                      userid_postid: USERID + POSTID,
                      timestamp: timestamp,
                    });
                  i++;
                }
                // /Add Earning
              }
            } else {
              // add earning
              var i = 1;
              while (i <= earningPerPostOwner) {
                firebase
                  .database()
                  .ref("Forum Post Earnings")
                  .child(earningid)
                  .update({
                    earningid: earningid,
                    userid: USERID,
                    postid: POSTID,
                    userid_earningid: USERID + earningid,
                    userid_postid: USERID + POSTID,
                    timestamp: timestamp,
                  });
                i++;
              }
            }
          });
      });
  };

  const handleCommentDelete = (comment_id) => {
    firebase
      .database()
      .ref("Forum Post Comments")
      .orderByChild("userid_commentid")
      .equalTo(uid + comment_id)
      .once("value")
      .then(function (snapshot) {
        snapshot.forEach((child) => {
          child.ref.set(null);
        });
        DeletePostOwnerEarning(ref_postuid);
        DeletePostEarning(ref_postid);
      });
  };

  const DeletePostEarning = (POSTID) => {
    var i = 1;
    while (i <= earningPerPostViewer) {
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
          RetrieveRefPostDetails();
          RetrieveComments();
        });
      i++;
    }
  };

  const DeletePostOwnerEarning = (POSTID) => {
    var i = 1;
    while (i <= earningPerPostOwner) {
      firebase
        .database()
        .ref("Forum Post Earnings")
        .orderByChild("userid_postid")
        .equalTo(ref_postuid + POSTID)
        .once("value")
        .then(function (snapshot) {
          snapshot.forEach((child) => {
            child.ref.set(null);
          });
          //RetrieveRefPostDetails();
          //RetrieveComments();
        });
      i++;
    }
  };

  function CommentUserName(uid) {
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

  const SendUserNotification = () => {
    const nid = firebase.database().ref("/Notifications").push().key;
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;

    firebase
      .database()
      .ref("Notifications")
      .child(nid)
      .update({
        nid: nid,
        type: "comments",
        type_id: ref_postid,
        to: ref_postuid,
        from: uid,
        title: `New comment from ${currentUsername}`,
        body: refPostBody,
        status: "unread",
        timestamp: timestamp,
      });

    // sending remote notification
    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("notification", {
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
        to: refPostExpoPushToken,
        sound: "default",
        title: `New comment from ${currentUsername}`,
        body: refPostBody.substring(0, 27),
        data: { type: "notifications" },
      }),
      vibrate: true,
      android: {
        channelId: "transfers",
        sound: true,
      },
      ios: {
        sound: true,
      },
      priority: "max",
    });
    // /sending remote notification
  };

  function CommentUserImage(uid) {
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

  function CommentUserAccountType(uid) {
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

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.9 }}>
        <ScreenHeader headerName="Post View" navigation={navigation} />
        <FlatList
          ListHeaderComponent={
            <View style={styles.container}>
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(routes.USERVIEWPROFILE, {
                      ref_uid: ref_postuid,
                    });
                  }}
                >
                  <Image uri={refPostUserImage} style={styles.pic} />
                </TouchableOpacity>
                <View>
                  <View style={styles.nameContainer}>
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                        }}
                        onPress={() => {
                          navigation.navigate(routes.USERVIEWPROFILE, {
                            ref_uid: ref_postuid,
                          });
                        }}
                      >
                        <Text
                          style={styles.nameTxt}
                          numberOfLines={1}
                          ellipsizeMode="clip"
                        >
                          {refPostUserName}{" "}
                        </Text>
                      </TouchableOpacity>

                      {refPostUserAccountType === "normal" ? (
                        <MaterialIcons
                          name="stars"
                          size={20}
                          color={colors.primary}
                        />
                      ) : null}
                      {refPostUserAccountType === "vip" ? (
                        <Octicons
                          name="verified"
                          size={20}
                          color={colors.primary}
                        />
                      ) : null}
                      {refPostUserAccountType === "vvip" ? (
                        <MaterialIcons
                          name="verified-user"
                          size={20}
                          color={colors.primary}
                        />
                      ) : null}
                    </View>
                  </View>
                  <View style={styles.msgContainer}>
                    <Text style={styles.msgTxt}>{refPostUserStatus}</Text>
                  </View>
                </View>
              </View>
              {refPostImage && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(routes.VIEWIMAGE, {
                      image: refPostImage,
                    })
                  }
                >
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      uri={refPostImage}
                      resizeMode={"contain"}
                      style={{
                        borderColor: "#fff",
                        height: 550,
                        width: "100%",
                      }}
                    />
                  </View>
                </TouchableOpacity>
              )}

              <View
                style={{ flexDirection: "row", padding: 25, paddingTop: -25 }}
              >
                <Hyperlink
                  linkStyle={{ color: "#2980b9" }}
                  onLongPress={(url, text) =>
                    navigation.navigate(routes.LOCALBROWSER, {
                      url: url,
                      text: text,
                    })
                  }
                  linkDefault={true}
                >
                  <Text style={{ fontSize: 18 }}>{refPostBody}</Text>
                </Hyperlink>
              </View>
              <RNUrlPreview
                imageStyle={{ height: 100, width: 120, borderRadius: 10 }}
                containerStyle={{
                  height: 100,
                  width: 400,
                  backgroundColor: colors.light,
                }}
                text={refPostBody}
                onError={() => null}
              />
              <Divider />

              <View
                style={{
                  flexDirection: "row",
                  padding: 25,
                  justifyContent: "space-between",
                  paddingTop: 25,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: colors.primary }}>
                    {new Date(refPostDate).toDateString()}
                    {", "}
                    {new Date(refPostDate).toLocaleTimeString()}{" "}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: colors.primary }}>{refPostLikes} </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: colors.primary }}>
                    {refPostComments}
                  </Text>
                </View>
              </View>
            </View>
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          data={commentsList}
          keyExtractor={(comment) => comment.key.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(routes.USERVIEWPROFILE, {
                  ref_uid: item.userid,
                });
              }}
            >
              <View style={styles.row}>
                <TouchableOpacity>
                  <Image
                    uri={CommentUserImage(item.userid)}
                    style={styles.pic}
                  />
                </TouchableOpacity>
                <View>
                  <View style={styles.nameContainer}>
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <TouchableOpacity>
                        <Text
                          style={[
                            styles.nameTxt,
                            { fontSize: 14, fontWeight: "500" },
                          ]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {CommentUserName(item.userid)}
                        </Text>
                      </TouchableOpacity>
                      {CommentUserAccountType(item.userid) === "normal" ? (
                        <MaterialIcons
                          name="stars"
                          size={22}
                          color={colors.primary}
                        />
                      ) : null}
                      {CommentUserAccountType(item.userid) === "vip" ? (
                        <Octicons
                          name="verified"
                          size={22}
                          color={colors.primary}
                        />
                      ) : null}
                      {CommentUserAccountType(item.userid) === "vvip" ? (
                        <MaterialIcons
                          name="verified-user"
                          size={22}
                          color={colors.primary}
                        />
                      ) : null}
                    </View>
                  </View>
                </View>
              </View>
              <View style={[styles.msgContainer, { paddingBottom: 10 }]}>
                <Text
                  style={[
                    styles.msgTxt,
                    {
                      color: colors.dark,
                      fontSize: 14,
                      flexWrap: "wrap",
                      flex: 1,
                      paddingRight: 10,
                    },
                  ]}
                >
                  {item.body}
                </Text>

                {item.userid == uid ? (
                  <TouchableOpacity
                    onPress={() => handleCommentDelete(item.commentid)}
                  >
                    <MaterialCommunityIcons
                      name="delete-forever-outline"
                      size={22}
                      color={colors.primary}
                      style={{
                        justifyContent: "flex-end",
                        marginHorizontal: 15,
                      }}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              <Divider />
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={{ flex: 0.1 }}>
        <View style={styles.chatboxcontainer}>
          <View style={styles.chatboxinnerContainer}>
            <View style={styles.chatboxinputAndMicrophoneStyle}>
              <TextInput
                multiline
                placeholder="Type something..."
                style={styles.chatboxinputStyle}
                ref={(input) => {
                  setTextInput(input);
                }}
                onChangeText={(text) => setTxtComment(text)}
              />
              <TouchableOpacity
                disabled={commentButton}
                onPress={handleCommentButton}
                style={styles.chatboxmicrophoneButtonStyle}
              >
                <FontAwesome name="send-o" size={25} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    backgroundColor: colors.primary,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#DCDCDC",
    backgroundColor: "#fff",
    padding: 10,
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 280,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: "600",
    color: "#222",
    fontSize: 18,
    marginTop: -3,
  },
  mblTxt: {
    fontWeight: "200",
    color: "#777",
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  msgTxt: {
    fontWeight: "400",
    color: colors.primary,
    fontSize: 12,
    marginLeft: 15,
  },
  chatboxcontainer: {
    justifyContent: "center",
    backgroundColor: colors.light,
    width: "95%",
    alignSelf: "center",
    borderRadius: 10,
  },
  chatboxinnerContainer: {
    marginHorizontal: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  chatboxinputAndMicrophoneStyle: {
    flexDirection: "row",
    backgroundColor: colors.light,
    flex: 3,
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatboxinputStyle: {
    backgroundColor: "transparent",
    paddingLeft: 20,
    color: colors.dark,
    flex: 3,
    fontSize: 15,
    maxHeight: 100,
    alignSelf: "center",
  },
  chatboxmicrophoneButtonStyle: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 15,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "white",
  },
  chatboxsendButtonStyle: {
    backgroundColor: colors.sendBackground,
    borderRadius: 50,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    // elevation: 3
  },
});

export default ForumPostViewScreen;
