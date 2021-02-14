import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Switch,
  Text,
  Keyboard,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import Firebase from "firebase";
import RNUrlPreview from "react-native-url-preview";
import Editor from "react-native-mentions-editor";

import colors from "../constants/colors";
import firebase from "../config/init";

function StoriesAddTextScreen({ navigation }) {
  const uid = firebase.auth().currentUser.uid;

  const [show, setShow] = useState(false);
  const [txtPost, setTxtPost] = useState("");
  const [txtLinkPreviewPost, setTxtLinkPreviewPost] = useState("");
  const [userLists, setUserLists] = useState([]);
  const [postButton, setPostButton] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [showEditor, setShowEditor] = useState(true);
  const [showMentions, setShowMentions] = useState(false);
  const [clearInput, setClearInput] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const handleEmojiKeyboard = () => {
    if (show === false) {
      setShow(true);
      Keyboard.dismiss();
    } else {
      setShow(false);
    }
  };

  /*useEffect(() => {
    loadUserLists();
  }, []);

  const loadUserLists = () => {
    var query = firebase.database().ref(`/Users`).orderByKey();
    query.once("value").then(function (snapshot) {
      var li = [];
      snapshot.forEach(function (childSnapshot) {
        li.push({
          key: childSnapshot.key,
          uid: childSnapshot.val().uid,
          name: childSnapshot.val().name,
          username: childSnapshot.val().name,
        });
        // Cancel enumeration
      });
      setUserLists(li.reverse());
    });
    return true;
  };*/

  //var final = JSON.stringify(txtPost);
  //console.log(txtPost.);
  /*const formatMentionNode = (txt, key) => {
    console.log(txt.text);
  };
  formatMentionNode(txtPost);*/
  //console.log(final.);
  /*var json = [
    { id: 0, date: "05-11-2018", total: 0 },
    { id: 1, date: "06-11-2018", total: 0 },
    { id: 2, date: "07-11-2018", total: 0 },
    { id: 3, date: "08-11-2018", total: 0 },
    { id: 4, date: "09-11-2018", total: 0 },
    { id: 5, date: "10-11-2018", total: 0 },
    { id: 6, date: "11-11-2018", total: 0 },
  ];
  for (var i = 0; i < json.length; i++) {
    var obj = json[i];
    console.log(obj.date);
  }*/
  const handleAddMore = (name) => {
    //setTxtLinkPreviewPost(txt);
    //var final = JSON.stringify(txtPost);
    //console.log(JSON.stringify(txtPost));

    //setClearInput(false);
    setTxtPost(name);
    return (text) => {
      setTxtPost(text + name);
    };
  };
  const handlePost = async () => {
    setPostButton(true);
    if (txtPost != null) {
      // save to forum posts
      const postid = firebase.database().ref("/Forum Posts").push().key;
      const status = isEnabled ? "private" : "public";
      const timestamp = Firebase.database.ServerValue.TIMESTAMP;

      setPostButton(false);
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
        .catch((error) => {
          Platform.OS === "android"
            ? ToastAndroid.show("Error occured", ToastAndroid.SHORT)
            : Alert.alert("Error occured");
        });
    } else {
      Platform.OS === "android"
        ? ToastAndroid.show(
            "You need to write something and include an image.",
            ToastAndroid.SHORT
          )
        : Alert.alert("You need to write something and include an image.");
      //Alert.alert("You need to write something and include an image.");
      setPostButton(false);
      setClearInput(true);
    }
  };

  const toggleEditor = () => {
    /**
     * This callback will be called
     * once user left the input field.
     * This will handle blur event.
     */
    // this.setState({
    //   showEditor: false,
    // })
  };

  const onHideMentions = () => {
    /**
     * This callback will be called
     * When MentionsList hide due to any user change
     */

    setShowMentions(false);
  };

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
        {/* <View>
          <Editor
            list={userLists}
            initialValue={txtPost}
            clearInput={clearInput}
            onChange={handleAddMore}
            showEditor={showEditor}
            toggleEditor={toggleEditor}
            showMentions={showMentions}
            onHideMentions={onHideMentions}
            placeholder="What's on your mind?"
            style={styles.textInput}
            placeholderTextColor={colors.white}
          />
        </View>*/}
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
          maxLength={100}
          //clearTextOnFocus={true}
          selectionColor={colors.white}
          dataDetectorTypes="all"
          placeholder="What's on your mind?"
          placeholderTextColor={colors.white}
          //forceStrutHeight={true}
        />
        <RNUrlPreview
          imageStyle={{ height: 60, width: 40, borderRadius: 10 }}
          containerStyle={{ height: 50 }}
          text={txtPost.text}
          onError={() => null}
        />
      </View>

      {show === true ? (
        <EmojiSelector
          onEmojiSelected={(emoji) =>
            emoji != null ? setTxtPost(txtPost + emoji) : setTxtPost(txtPost)
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  textInput: {
    paddingLeft: 6,
    paddingRight: 6,
    height: "40%",
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
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    backgroundColor: colors.primary,
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

export default StoriesAddTextScreen;
