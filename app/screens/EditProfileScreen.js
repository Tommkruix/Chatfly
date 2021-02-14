import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { StatusBar } from "expo-status-bar";
import {
  MaterialCommunityIcons,
  Octicons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as Yup from "yup";

import Form from "../components/forms/Form";
import firebase from "../config/init";
import Screen from "../components/Screen";
import colors from "../constants/colors";
import ListItemComponent from "../components/lists/ListItemComponent";
import TextInputComponent from "../components/TextInputComponent";
import * as ImagePicker from "expo-image-picker";
import IconComponent from "../components/IconComponent";
import FeedComponent from "../components/FeedComponent";
import Divider from "../components/lists/Divider";
import routes from "../navigation/routes";
import Button from "../components/Button";

function EditProfileScreen({ navigation }) {
  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";

  const uid = firebase.auth().currentUser.uid;

  const [imageUri, setImageUri] = useState();
  const [userimage, setUserImage] = useState();
  const [username, setUserName] = useState();
  const [userstatus, setUserStatus] = useState();
  const [useremail, setUserEmail] = useState();
  const [userAccountType, setUserAccountType] = useState();
  const [userPaymentAddress, setUserPaymentAddress] = useState();

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
  });

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

  const handleInfoUpdate = () => {
    firebase.database().ref(`/Users/${uid}`).update({
      name: txtUsername,
      status: txtUserstatus,
      payment_address: txtUserpaymentaddress,
    });
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

  /* /Forum Posts */

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            color={colors.white}
            name="keyboard-backspace"
            size={24}
          />
        </TouchableOpacity>
        <Text
          style={{
            alignSelf: "flex-end",
            fontWeight: "500",
            color: colors.white,
            fontSize: 18,
          }}
        >
          Edit Profile
        </Text>
        <TouchableOpacity></TouchableOpacity>
      </View>
      <ScrollView>
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
                alignSelf: "flex-start",
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
                alignSelf: "flex-start",
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
                alignSelf: "flex-start",
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
            <TouchableOpacity onPress={selectImage}>
              <MaterialCommunityIcons
                size={30}
                name="camera"
                color={colors.white}
                style={{ alignSelf: "center" }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.usernameContainer}>
          <Text style={styles.usernameStyle}>
            {username != "" ? username : "No name"}
          </Text>
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernameStyle}>
            {useremail != "" ? useremail : "No email"}
          </Text>
        </View>
        <View style={styles.usernameContainer}>
          <Text
            style={[styles.usernameStyle, { fontSize: 14, fontWeight: "400" }]}
          >
            {"Payment Address: "}
            {userPaymentAddress != "" ? userPaymentAddress : "No address"}
          </Text>
        </View>

        <View
          style={{
            marginTop: 45,
            marginBottom: 15,
            backgroundColor: colors.light,
          }}
        >
          <TextInputComponent
            iconName="user"
            maxLength={40}
            onChangeText={(text) => setTxtUsername(text)}
            defaultValue={username != "" ? username : "No name"}
            autoCompleteType="off"
            placeholderTextColor={colors.primary}
          />
        </View>

        <View style={{ marginBottom: 15, backgroundColor: colors.light }}>
          <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 500}
          >
            <TextInputComponent
              iconName="commenting-o"
              maxLength={40}
              onChangeText={(text) => setTxtUserstatus(text)}
              defaultValue={userstatus != "" ? userstatus : "No status"}
              autoCompleteType="off"
              placeholderTextColor={colors.primary}
            />
          </KeyboardAvoidingView>
        </View>
        <View style={{ marginBottom: 15, backgroundColor: colors.light }}>
          <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 700}
          >
            <TextInputComponent
              iconName="money"
              maxLength={40}
              onChangeText={(text) => setTxtUserpaymentaddress(text)}
              defaultValue={
                userPaymentAddress != "" ? userPaymentAddress : "No address"
              }
              autoCompleteType="off"
              placeholderTextColor={colors.primary}
            />
          </KeyboardAvoidingView>
        </View>
        <View
          style={{
            width: "100%",
            padding: 10,
            alignSelf: "center",
            paddingBottom: 100,
          }}
        >
          <Button title="Update" color="primary" onPress={handleInfoUpdate} />
        </View>
        <Divider />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
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

export default EditProfileScreen;

{
  /*<FlatList
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
                    alignSelf: "flex-start",
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
                    alignSelf: "flex-start",
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
                    alignSelf: "flex-start",
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
                <TouchableOpacity onPress={selectImage}>
                  <MaterialCommunityIcons
                    size={30}
                    name="camera"
                    color={colors.white}
                    style={{ alignSelf: "center" }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.usernameContainer}>
              <Text style={styles.usernameStyle}>
                {username != "" ? username : "No name"}
              </Text>
            </View>
            <View style={styles.usernameContainer}>
              <Text style={styles.usernameStyle}>
                {useremail != "" ? useremail : "No email"}
              </Text>
            </View>
            <View style={styles.usernameContainer}>
              <Text
                style={[
                  styles.usernameStyle,
                  { fontSize: 14, fontWeight: "400" },
                ]}
              >
                {"Payment Address: "}
                {userPaymentAddress != "" ? userPaymentAddress : "No address"}
              </Text>
            </View>

            <View
              style={{
                marginTop: 45,
                marginBottom: 15,
                backgroundColor: colors.light,
              }}
            >
              <TextInputComponent
                iconName="user"
                title="Username: "
                maxLength={40}
                onChangeText={(text) => setTxtUsername(text)}
                onPress={handleNameUpdate}
                defaultValue={username != "" ? username : "No name"}
                autoCompleteType="off"
                placeholderTextColor={colors.primary}
              />
            </View>

            <View style={{ marginBottom: 15, backgroundColor: colors.light }}>
              <KeyboardAvoidingView
                behavior="position"
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 500}
              >
                <TextInputComponent
                  iconName="commenting-o"
                  title="Status: "
                  maxLength={40}
                  onChangeText={(text) => setTxtUserstatus(text)}
                  onPress={handleStatusUpdate}
                  defaultValue={userstatus != "" ? userstatus : "No status"}
                  autoCompleteType="off"
                  placeholderTextColor={colors.primary}
                />
              </KeyboardAvoidingView>
            </View>
            <View style={{ marginBottom: 15, backgroundColor: colors.light }}>
              <KeyboardAvoidingView
                behavior="position"
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 700}
              >
                <TextInputComponent
                  iconName="money"
                  title="Payment Ad.: "
                  maxLength={40}
                  onChangeText={(text) => setTxtUserpaymentaddress(text)}
                  onPress={handlePaymentAddressUpdate}
                  defaultValue={
                    userPaymentAddress != "" ? userPaymentAddress : "No address"
                  }
                  autoCompleteType="off"
                  placeholderTextColor={colors.primary}
                />
              </KeyboardAvoidingView>
            </View>
            <View
              style={{
                width: "100%",
                padding: 10,
                alignSelf: "center",
              }}
            >
              <Button title="Logout" color="primary" onPress={handleLogout} />
            </View>
            <Divider />
          </>
        }
        showsVerticalScrollIndicator={false}
        data={posts}
        keyExtractor={(post) => post.key.toString()}
        renderItem={({ item }) => (
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
              editStatus={true}
              onEditPress={() =>
                navigation.navigate(routes.EDITUSERPOST, {
                  ref_postid: item.postid,
                })
              }
            />
          </View>
        )}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        extraData={posts}
            />*/
}
