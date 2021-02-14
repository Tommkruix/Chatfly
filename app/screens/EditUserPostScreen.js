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
import { Button, Icon } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Firebase from "firebase";

import colors from "../constants/colors";
import firebase from "../config/init";
import ScreenHeader from "../components/ScreenHeader";

function EditUserPostScreen({ navigation, route }) {
  const ref_postid = route.params.ref_postid;

  const uid = firebase.auth().currentUser.uid;

  const [imageUri, setImageUri] = useState();
  const [imageRetUri, setImageRetUri] = useState();
  const [txtPost, setTxtPost] = useState();
  const [txtRetPost, setTxtRetPost] = useState();

  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabledRet, setIsEnabledRet] = useState(null);
  const toggleSwitch = () => {
    setIsEnabledRet(null);
    setIsEnabled((previousState) => !previousState);
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      if (!result.cancelled) {
        setImageRetUri(null);
        setImageUri(result.uri);
      }
    } catch (error) {
      Alert.alert("Error reading image");
    }
  };

  const postDetails = () => {
    firebase
      .database()
      .ref(`/Forum Posts/${ref_postid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("image") && snapshot.child("image").exists) {
          setImageRetUri(snapshot.child("image").val());
        } else {
          setImageRetUri();
        }

        if (snapshot.hasChild("body") && snapshot.child("body").exists) {
          setTxtRetPost(snapshot.child("body").val());
        } else {
          setTxtRetPost("");
        }

        if (snapshot.hasChild("status") && snapshot.child("status").exists) {
          var s = snapshot.child("status").val();
          if ((s = "private")) {
            setIsEnabledRet(true);
            setIsEnabled(true);
          } else {
            setIsEnabledRet(false);
          }
        } else {
          setIsEnabledRet(null);
        }
      });
  };

  useEffect(() => {
    postDetails();
  }, []);

  const UpdatePost = async () => {
    const uri = imageUri;
    if (uri != null && imageRetUri == null) {
      if (txtPost != null) {
        setTxtPost(txtPost);
      } else {
        setTxtPost(txtRetPost);
      }
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

      const status = isEnabled ? "private" : "public";

      firebase
        .database()
        .ref("/Forum Posts")
        .child(ref_postid)
        .update({
          body: txtPost,
          image: imgUrl,
          status: status,
        })
        .catch((error) => {
          Platform.OS === "android"
            ? ToastAndroid.show("Error occured", ToastAndroid.SHORT)
            : Alert.alert("Error occured");
        });
      // /save to forum posts
      //setPostButton(false);
      //console.log(imgUrl);
      navigation.goBack();
      return imgUrl;
    } else if (uri == null && imageRetUri != null) {
      // save to forum posts
      if (txtPost != null) {
        setTxtPost(txtPost);
      } else {
        setTxtPost(txtRetPost);
      }
      const status = isEnabled ? "private" : "public";

      firebase
        .database()
        .ref("/Forum Posts")
        .child(ref_postid)
        .update({
          body: txtPost,
          status: status,
          image: imageRetUri,
        })
        .then(() =>
          Platform.OS === "android"
            ? ToastAndroid.show("Post updated", ToastAndroid.SHORT)
            : Alert.alert("Post updated")
        )
        .catch((error) => {
          Platform.OS === "android"
            ? ToastAndroid.show("Error occured", ToastAndroid.SHORT)
            : Alert.alert("Error occured");
        });

      navigation.goBack();
      return true;
    } else if (uri == null && imageRetUri == null) {
      // save to forum posts

      const status = isEnabled ? "private" : "public";

      firebase
        .database()
        .ref("/Forum Posts")
        .child(ref_postid)
        .update({
          body: txtPost,
          status: status,
        })
        .then(() =>
          Platform.OS === "android"
            ? ToastAndroid.show("Post updated", ToastAndroid.SHORT)
            : Alert.alert("Post updated")
        )
        .catch((error) => {
          Platform.OS === "android"
            ? ToastAndroid.show("Error occured", ToastAndroid.SHORT)
            : Alert.alert("Error occured");
        });

      navigation.goBack();
      return true;
    } else {
      Platform.OS === "android"
        ? ToastAndroid.show("Error occured.", ToastAndroid.SHORT)
        : Alert.alert("Error occured.");
      //setPostButton(false);
      navigation.goBack();
    }
  };

  const handleDelete = () => {
    firebase.database().ref(`/Forum Posts/${ref_postid}`).remove();
    Platform.OS === "android"
      ? ToastAndroid.show("Post Deleted", ToastAndroid.SHORT)
      : Alert.alert("Post Deleted");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        headerName="Edit Post"
        navigation={navigation}
        rightHandTitle="Update"
        rightHandPress={() => UpdatePost()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          autoFocus={true}
          multiline={true}
          numberOfLines={4}
          style={{ flex: 1 }}
          defaultValue={txtRetPost}
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
            source={{
              uri: imageRetUri != null ? imageRetUri : imageUri,
            }}
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
          marginBottom: 50,
        }}
      >
        <Button danger onPress={handleDelete}>
          <Text
            style={{ color: colors.white, paddingLeft: 10, fontWeight: "bold" }}
          >
            Delete Post{" "}
          </Text>
          <Icon name="trash" color={colors.white} />
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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

export default EditUserPostScreen;
