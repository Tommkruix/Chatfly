import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  ScrollView,
  Platform,
  Alert,
  ToastAndroid,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Firebase from "firebase";
import LottieView from "lottie-react-native";

import Screen from "../components/Screen";
import colors from "../constants/colors";
import firebase from "../config/init";
import routes from "../navigation/routes";

function ForumAddPost({ navigation }) {
  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";

  const uid = firebase.auth().currentUser.uid;
  const [userimage, setUserImage] = useState();
  const [postButton, setPostButton] = useState(false);

  const [imageUri, setImageUri] = useState();
  const [txtPost, setTxtPost] = useState();

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      if (!result.cancelled) {
        setImageUri(result.uri);
      }
    } catch (error) {
      Alert.alert("Error reading image");
    }
  };

  useEffect(() => {
    userDetails();
  });

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
      });
  };

  const handlePost = async () => {
    setPostButton(true);
    const uri = imageUri;
    if (uri != null && txtPost != null) {
      const uniqid = () => Math.random().toString(36).substr(2, 9);
      const ext = uri.split(".").pop(); // Extract image extension
      const filename = `${uniqid()}.${ext}`; // Generate unique name
      const ref = firebase
        .storage()
        .ref()
        .child("Post Images/" + filename);
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

      // save to forum posts
      const postid = firebase.database().ref("/Forum Posts").push().key;
      /*firebase.database().ref(`/Forum Posts/${postId}`).update({
        image: imgUrl,
      });*/

      const status = isEnabled ? "private" : "public";
      const timestamp = Firebase.database.ServerValue.TIMESTAMP;

      firebase
        .database()
        .ref("/Forum Posts")
        .child(postid)
        .update({
          body: txtPost,
          image: imgUrl,
          status: status,
          userid: uid,
          postid: postid,
          userid_postid: uid + postid,
          timestamp: timestamp,
        })
        .then(() =>
          Alert.alert(
            "Post",
            "Success",
            [{ text: "Ok", onPress: () => navigation.goBack() }],
            { cancelable: false }
          )
        )
        .catch((error) => {
          Alert.alert("Error occured");
        });
      // /save to forum posts
      setPostButton(false);
      //console.log(imgUrl);
      return imgUrl;
    } /*else if (txtPost != null) {
      // save to forum posts
      const postid = firebase.database().ref("/Forum Posts").push().key;
      

      const status = isEnabled ? "private" : "public";
      const timestamp = Firebase.database.ServerValue.TIMESTAMP;

      firebase
        .database()
        .ref("/Forum Posts")
        .child(postid)
        .update({
          body: txtPost,
          status: status,
          userid: uid,
          postid: postid,
          userid_postid: uid + postid,
          timestamp: timestamp,
        })
        .then(() =>
          Alert.alert(
            "Post",
            "Success",
            [{ text: "Ok", onPress: () => navigation.goBack() }],
            { cancelable: false }
          )
        )
        .catch((error) => {
          Alert.alert("Error occured");
        });

      setPostButton(false);
    }*/ else {
      Platform.OS === "android"
        ? ToastAndroid.show(
            "You need to write something and include an image.",
            ToastAndroid.SHORT
          )
        : Alert.alert("You need to write something and include an image.");
      //Alert.alert("You need to write something and include an image.");
      setPostButton(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              color={colors.white}
              name="keyboard-backspace"
              size={24}
            />
          </TouchableWithoutFeedback>
          <TouchableOpacity disabled={postButton} onPress={handlePost}>
            <Text
              style={{ fontWeight: "500", color: colors.white, fontSize: 18 }}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Image
            source={
              userimage != ""
                ? {
                    uri: userimage,
                  }
                : { uri: placeholderUserImage }
            }
            style={styles.avatar}
          />
          <TextInput
            autoFocus={true}
            multiline={true}
            numberOfLines={4}
            style={{ flex: 1 }}
            placeholder="Want to share something?"
            onChangeText={(text) => setTxtPost(text)}
          />
        </View>
        <TouchableOpacity style={styles.photo} onPress={selectImage}>
          {!imageUri && (
            <MaterialCommunityIcons
              size={40}
              name="camera"
              colors={colors.medium}
              style={{
                alignSelf: "center",
                marginTop: 130,
                position: "absolute",
              }}
            />
          )}
          {imageUri && (
            <Image
              name="image"
              style={styles.imageStyle}
              source={{ uri: imageUri }}
            />
          )}
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            marginTop: 20,
            marginBottom: 5,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.primary,
              marginTop: Platform.OS === "android" ? 2 : 5,
              marginRight: 5,
            }}
          >
            Make post private?
          </Text>

          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? colors.primary : "#f4f3f4"}
            ios_backgroundColor={colors.light}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            marginBottom: 50,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: colors.dark,
            }}
          >
            Note: Private posts does not earn points
          </Text>
        </View>
      </View>
    </ScrollView>
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
  },
  imageStyle: {
    width: 310,
    height: 310,
    borderRadius: 20,
  },
  inputContainer: {
    margin: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    marginRight: 16,
  },
  photo: {
    alignSelf: "center",
    width: 310,
    height: 310,
    backgroundColor: colors.light,
    borderRadius: 20,
  },
});

export default ForumAddPost;
