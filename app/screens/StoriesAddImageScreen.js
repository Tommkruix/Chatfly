import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Button,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Switch,
  Text,
  Keyboard,
  ImageBackground,
  Alert,
  StatusBar,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import Firebase from "firebase";

import colors from "../constants/colors";
import firebase from "../config/init";

function StoriesAddImageScreen({ navigation, route }) {
  const [photos, setPhotos] = useState([]);

  const uid = firebase.auth().currentUser.uid;

  const [show, setShow] = useState(false);
  const [txtPost, setTxtPost] = useState();
  const [imageUri, setImageUri] = useState();
  const [postButton, setPostButton] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentImage, setCurrentImage] = useState();
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  /*const mounted = useRef(false);
  const didMountRef = useRef(false)
  useEffect(() => {
    if (didMountRef.current) {
      doStuff()
    } else didMountRef.current = true
  });*/
  /*useEffect(() => {
    if (route) {
      const rPhotos = route.params.photos;
      if (rPhotos) setPhotos(rPhotos);
      delete rPhotos;
    }
  }, []);*/

  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      doStuff();
    } else didMountRef.current = true;
  });

  useEffect(() => {
    photos.length == 0 ? navigation.navigate("ImageBrowser") : "";
  }, []);

  function doStuff() {
    if (route) {
      const rPhotos = route.params.photos;
      if (rPhotos) {
        setPhotos(rPhotos);
      }
      //delete rPhotos;
    }
  }

  /*useEffect(() => {
    if (!mounted.current) {
      // do componentDidMount logic

      mounted.current = true;
    } else {
      // do componentDidUpdate logic
      if (route) {
        const rPhotos = route.params.photos;
        if (rPhotos) setPhotos(rPhotos);
        //delete rPhotos;
      }
    }
  });*/

  const handleEmojiKeyboard = () => {
    if (show === false) {
      setShow(true);
      Keyboard.dismiss();
    } else {
      setShow(false);
    }
  };

  const handleAddMore = (name) => {
    setTxtPost(name);
    return (text) => {
      setTxtPost(text + name);
    };
  };

  const selectImage = async () => {
    /*try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 0.5,
      });
      if (!result.cancelled) {
        setImageUri(result.uri);
      } else {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Error reading image");
    }*/
  };

  /*useEffect(() => {
    selectImage();
  }, []);*/

  const handlePost = async () => {
    setPostButton(true);

    navigation.goBack();

    const uri = imageUri;
    if (uri != null && txtPost == null) {
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
          image: imgUrl,
          status: status,
          userid: uid,
          postid: postid,
          userid_postid: uid + postid,
          timestamp: timestamp,
        })
        .catch((error) => {
          Platform.OS === "android"
            ? ToastAndroid.show("Error occured", ToastAndroid.SHORT)
            : Alert.alert("Error occured");
        });
      // /save to forum posts
      //setPostButton(false);
      //console.log(imgUrl);

      return imgUrl;
    } else if (txtPost != null && uri == null) {
      // save to forum posts
      const postid = firebase.database().ref("/Forum Posts").push().key;

      const status = isEnabled ? "private" : "public";
      const timestamp = Firebase.database.ServerValue.TIMESTAMP;

      navigation.goBack();

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
          Platform.OS === "android"
            ? ToastAndroid.show("Error occured", ToastAndroid.SHORT)
            : Alert.alert("Error occured");
        });

      //setPostButton(false);
    } else {
      Platform.OS === "android"
        ? ToastAndroid.show(
            "You need to write something or post an image.",
            ToastAndroid.SHORT
          )
        : Alert.alert("You need to write something or post an image.");
      //setPostButton(false);
      navigation.goBack();
    }

    setPostButton(false);
  };

  function renderImage(item, i) {
    return (
      <TouchableOpacity onPress={() => setCurrentImage(item.uri)}>
        <Image
          style={{ height: 100, width: 50 }}
          source={{ uri: item.uri }}
          key={i}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <ImageBackground
          resizeMode="contain"
          style={styles.background}
          source={{
            uri:
              currentImage == null && photos.length > 0
                ? photos[0].uri
                : currentImage,
          }}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                color={colors.white}
                name="keyboard-backspace"
                size={24}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? colors.primary : "#f4f3f4"}
                ios_backgroundColor={colors.light}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignSelf: "center",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <TextInput
              value={txtPost}
              //onChange={handleAddMore}
              style={styles.textInput}
              selectionColor={colors.primary}
              editable
              //blurOnSubmit={false}
              //onSubmitEditing={Keyboard.dismiss()}
              onChangeText={handleAddMore}
              multiline={true}
              autoFocus={true}
              maxLength={70}
              //clearTextOnFocus={true}
              selectionColor={colors.white}
              dataDetectorTypes="all"
              placeholder="What's on your mind?"
              placeholderTextColor={colors.white}
              //forceStrutHeight={true}
            />
          </View>

          {show === true ? (
            <EmojiSelector
              onEmojiSelected={(emoji) =>
                emoji != null
                  ? setTxtPost(txtPost + emoji)
                  : setTxtPost(txtPost)
              }
              placeholder="What are you looking for?"
              showHistory={true}
              showSectionTitles={false}
              showSearchBar={false}
              showTabs={true}
              theme={colors.secondary}
              //shouldInclude={ManageEmojiInputs()}
            />
          ) : null}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleEmojiKeyboard}>
              <MaterialCommunityIcons
                color={colors.white}
                name="sticker-emoji"
                size={24}
                style={{ bottom: 10 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={postButton}
              onPress={handlePost}
              style={styles.fabStyle}
            >
              <Feather name="send" size={30} color={colors.white} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View
          style={{
            height: 50,
            justifyContent: "flex-end",
            position: "relative",
          }}
        >
          <ScrollView horizontal>
            {photos.map((item, i) => renderImage(item, i))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  background: {
    flex: 1,
  },
  textInput: {
    paddingLeft: 6,
    paddingRight: 6,
    height: "-10%",
    fontSize: 18,
    color: colors.white,
    width: 300,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  fabStyle: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: colors.primary,
    borderRadius: 100,
    elevation: 5,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default StoriesAddImageScreen;
