import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import EmojiSelector from "react-native-emoji-selector";
import {
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import Firebase from "firebase";
import { Notifications } from "expo";

import ChatCard from "../components/chatComponents/ChatCard";
import Screen from "../components/Screen";
import Header from "../components/common/Header";
import colors from "../constants/colors";
import MiniProfile from "../components/common/MiniProfile";
import ChatHeader from "../components/chatComponents/ChatHeader";
import firebase from "../config/init";
import MessagesView from "../components/chatComponents/MessagesView";
import ChatInput from "../components/chatComponents/ChatInput";
import routes from "../navigation/routes";

function OneToOneChatScreen({ navigation, route }) {
  const receiver_id = route.params.id;

  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";

  const uid = firebase.auth().currentUser.uid;
  const [userimage, setUserImage] = useState();
  const [username, setUserName] = useState();
  const [currentUsername, setCurrentUserName] = useState();
  const [userstate, setUserState] = useState();
  const [userPushToken, setUserPushToken] = useState();
  const [userAccountType, setUserAccountType] = useState();
  const [show, setShow] = useState(false);
  const [txtPost, setTxtPost] = useState();
  const [postButton, setPostButton] = useState(false);
  const [messageFlatlist, setMessageFlatlist] = useState();
  const [textInput, setTextInput] = useState("");
  const [chatsList, setChatsList] = useState([]);

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

  useEffect(() => {
    userDetails();
  }, []);

  useEffect(() => {
    DisplayChats();
  }, []);

  useEffect(() => {
    currentUserDetails();
  }, []);

  const currentUserDetails = () => {
    firebase
      .database()
      .ref(`/Users/${uid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("name") && snapshot.child("name").exists) {
          setCurrentUserName(snapshot.child("name").val());
        } else {
          setCurrentUserName("");
        }
      });
  };
  const userDetails = () => {
    firebase
      .database()
      .ref(`/Users/${receiver_id}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("image") && snapshot.child("image").exists) {
          setUserImage(snapshot.child("image").val());
        } else {
          setUserImage(placeholderUserImage);
        }

        if (snapshot.hasChild("name") && snapshot.child("name").exists) {
          setUserName(snapshot.child("name").val());
        } else {
          setUserName("");
        }

        if (snapshot.hasChild("state") && snapshot.child("state").exists) {
          setUserState(snapshot.child("state").val());
        } else {
          setUserState("offline");
        }

        if (
          snapshot.hasChild("expoPushToken") &&
          snapshot.child("expoPushToken").exists
        ) {
          setUserPushToken(snapshot.child("expoPushToken").val());
        } else {
          setUserPushToken("");
        }

        if (
          snapshot.hasChild("account_type") &&
          snapshot.child("account_type").exists
        ) {
          setUserAccountType(snapshot.child("account_type").val());
        } else {
          setUserAccountType("");
        }
      });
  };

  const DisplayChats = () => {
    firebase
      .database()
      .ref(`/Chat Messages/`)
      .child(uid)
      .child(receiver_id)
      .on("value", (snapshot) => {
        var li = [];
        snapshot.forEach((child) => {
          li.push({
            key: child.key,
            body: child.val().body,
            messageid: child.val().messageid,
            timestamp: child.val().timestamp,
            from: child.val().from,
            to: child.val().to,
          });
        });
        setChatsList(li.reverse());
        //setChatsList(li);
        //messageFlatlist.scrollToEnd();
      });
  };

  const handlePost = async () => {
    setPostButton(true);
    if (txtPost != null) {
      const senderMessageKeyRef = "/Chat Messages/" + uid + receiver_id;
      const receiverMessageKeyRef = "/Chat Messages/" + receiver_id + uid;

      var userMessageKeyRef = firebase
        .database()
        .ref("/Chat Messages/" + uid + "/" + receiver_id)
        .push();
      const messageid = userMessageKeyRef.key;
      const timestamp = Firebase.database.ServerValue.TIMESTAMP;

      firebase
        .database()
        .ref("/Chat Messages/")
        .child(receiver_id)
        .child(uid)
        .child(messageid)
        .update({
          body: txtPost,
          type: "text",
          from: uid,
          to: receiver_id,
          messageid: messageid,
          timestamp: timestamp,
        });

      firebase
        .database()
        .ref("/Chat Messages/")
        .child(uid)
        .child(receiver_id)
        .child(messageid)
        .update({
          body: txtPost,
          type: "text",
          from: uid,
          to: receiver_id,
          messageid: messageid,
          timestamp: timestamp,
        })
        .then(() => {
          SendPushNotification(txtPost);
        });

      textInput.clear();
      // Cancel enumeration
      //return true;
    } else {
      Platform.OS === "android"
        ? ToastAndroid.show("Please write a message.", ToastAndroid.SHORT)
        : Alert.alert("Please write a message.");
      textInput.clear();
      setPostButton(false);
    }

    setPostButton(false);
  };

  const SendPushNotification = (message) => {
    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("chat-messages", {
        name: "Chat messages",
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
        to: userPushToken,
        sound: "default",
        title: currentUsername,
        body: message,
      }),
      vibrate: true,
      android: {
        channelId: "chat-messages",
        sound: true,
      },
      ios: {
        sound: true,
      },
      priority: "max",
    });
  };

  const handleMenu = () => {
    Alert.alert(
      "Relationship",
      "Set status",
      [
        { text: "Block", onPress: () => handleBlock() },
        { text: "Unblock", onPress: () => handleUnblock() },
        { text: "Cancel" },
      ],
      { cancelable: true }
    );
  };
  const handleUnblock = () => {
    var timestamp = Firebase.database.ServerValue.TIMESTAMP;

    firebase
      .database()
      .ref("/Users/")
      .child(uid)
      .child("Contacts")
      .child(receiver_id)
      .update({
        status: "unblock",
        timestamp: timestamp,
      })
      .then(() => {
        Alert.alert("User unblocked");
      });
  };

  const handleBlock = () => {
    var timestamp = Firebase.database.ServerValue.TIMESTAMP;
    firebase
      .database()
      .ref("/Users/")
      .child(uid)
      .child("Contacts")
      .child(receiver_id)
      .update({
        status: "block",
        timestamp: timestamp,
      })
      .then(() => {
        Alert.alert("User blocked");
      });
  };

  const handleAttachmentPost = () => {
    Alert.alert(
      "Attachment",
      "Choose file",
      [
        { text: "Image", onPress: () => handleImagePost() },
        { text: "Document", onPress: () => handleDocumentPost() },
        { text: "Cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleImagePost = () => {};

  const handleDocumentPost = () => {};

  return (
    <View style={styles.container}>
      {/*<MessagesView />*/}
      <View>
        <ChatHeader
          onPress={() => navigation.goBack()}
          username={username}
          imageSrc={userimage}
          onlineStatus={userstate}
          menuPress={() => handleMenu()}
          onOpenProfile={() => {
            navigation.navigate(routes.USERVIEWPROFILE, {
              ref_uid: receiver_id,
            });
          }}
        />
      </View>
      <View style={{ flex: 0.9 }}>
        <FlatList
          //ref={(flatlist) => setMessageFlatlist(flatlist)}
          inverted={-1}
          data={chatsList}
          keyExtractor={(chat) => chat.messageid.toString()}
          renderItem={({ item }) => (
            <ChatCard
              time={new Date(item.timestamp).toDateString()}
              chat={item.body}
              to={receiver_id}
              //from={item.from}
              isLeft={item.from !== uid ? item.from : uid}
              //isLeft={item.from !== uid ? item.from : uid}
            />
          )}
        />
      </View>

      {/* Chat input */}

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
      <View style={{ flex: 0.1, bottom: show === true ? 20 : 0 }}>
        <View style={styles.chatboxcontainer}>
          <View style={styles.chatboxinnerContainer}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.chatboxinputAndMicrophoneStyle}>
                <TouchableOpacity onPress={handleEmojiKeyboard}>
                  <MaterialCommunityIcons
                    color={colors.primary}
                    name="sticker-emoji"
                    size={24}
                    style={{ paddingLeft: 10 }}
                  />
                </TouchableOpacity>
                <TextInput
                  ref={(input) => {
                    setTextInput(input);
                  }}
                  placeholder="Type something..."
                  style={styles.chatboxinputStyle}
                  editable
                  value={txtPost}
                  //blurOnSubmit={false}
                  //onSubmitEditing={Keyboard.dismiss()}
                  onChangeText={handleAddMore}
                  multiline={true}
                  autoFocus={true}
                  //clearTextOnFocus={true}
                  selectionColor={colors.white}
                  dataDetectorTypes="all"
                  selectionColor={colors.primary}
                  placeholderTextColor={colors.primary}
                  //forceStrutHeight={true}
                />
                {/*} <TouchableOpacity onPress={handleAttachmentPost}>
                  <MaterialIcons
                    color={colors.primary}
                    name="attach-file"
                    size={24}
                    style={{ paddingRight: 10 }}
                  />
                </TouchableOpacity>*/}
              </View>
              <View
                style={{
                  backgroundColor: colors.primary,
                  width: 50,
                  height: 50,
                  borderRadius: 50 / 2,
                  marginLeft: 10,
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  disabled={postButton}
                  onPress={handlePost}
                  style={styles.chatboxmicrophoneButtonStyle}
                >
                  <Feather name="send" size={25} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Chat input */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatboxcontainer: {
    justifyContent: "center",
    width: "100%",
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
    maxHeight: 100,
    flex: 3,
    fontSize: 15,
    //maxHeight: 100,
    alignSelf: "center",
  },
  chatboxmicrophoneButtonStyle: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 15,
    paddingLeft: 10,
    //borderLeftWidth: 1,
    //borderLeftColor: "white",
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

export default OneToOneChatScreen;
