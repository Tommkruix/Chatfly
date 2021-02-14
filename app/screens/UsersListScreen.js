import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  Platform,
  Alert,
  ToastAndroid,
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import colors from "../constants/colors";
import Divider from "../components/lists/Divider";
import firebase from "../config/init";
import Firebase from "firebase";
import routes from "../navigation/routes";
import ScreenHeader from "../components/ScreenHeader";

function UsersListScreen({ navigation }) {
  const uid = firebase.auth().currentUser.uid;

  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";

  const [userLists, setUserLists] = useState([]);
  const [searchUserLists, setSearchUserLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentUsername, setCurrentUsername] = useState();

  useEffect(() => {
    loadUserLists();
  }, []);

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

  const loadUserLists = () => {
    setIsLoading(true);
    var query = firebase.database().ref(`/Users`).orderByKey();
    query.once("value").then(function (snapshot) {
      var li = [];
      snapshot.forEach(function (childSnapshot) {
        li.push({
          key: childSnapshot.key,
          image: childSnapshot.val().image,
          status: childSnapshot.val().status,
          uid: childSnapshot.val().uid,
          expoPushToken: childSnapshot.val().expoPushToken,
          name: childSnapshot.val().name,
        });
        // Cancel enumeration
      });
      setUserLists(li.reverse());
      setSearchUserLists(li.reverse());
    });
    setIsLoading(false);
    return true;
  };

  const SearchUsers = (value) => {
    const filteredUsers = searchUserLists.filter((user) => {
      let UsersLowercase = user.name.toLowerCase();

      let searchTermLowercase = value.toLowerCase();

      return UsersLowercase.indexOf(searchTermLowercase) > -1;
    });
    setUserLists(filteredUsers);
  };

  const checkFollowStatus = (to_uid, pushToken) => {
    firebase
      .database()
      .ref(`Users/${uid}/Friend Requests/${to_uid}`)
      .once("value", (snapshot) => {
        if (
          snapshot.hasChild("status") &&
          snapshot.child("status").val() == "1to0"
        ) {
          Alert.alert(
            "Unfollow?",
            "",
            [
              {
                text: "Yes",
                onPress: () => handleUnfollow(to_uid),
              },
              { text: "No" },
            ],
            { cancelable: true }
          );
        } else {
          Alert.alert(
            "Follow?",
            "",
            [
              {
                text: "Yes",
                onPress: () => handleFollowRequest(to_uid, pushToken),
              },
              { text: "No" },
            ],
            { cancelable: true }
          );
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
      });

    SendUserNotification(to_uid, pushToken);
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
        title: `${currentUsername}`,
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
        title: `${currentUsername}`,
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

  return (
    <View style={styles.container}>
      <ScreenHeader headerName="Select User" navigation={navigation} />
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <MaterialIcons size={20} name="search" color={colors.primary} />
          <TextInput
            maxLength={10}
            placeholder="Search"
            placeholderTextColor={colors.dark}
            style={styles.searchInputStyle}
            onChangeText={(value) => SearchUsers(value)}
          />
        </View>
      </View>
      {isLoading ? (
        <View
          style={{
            ...StyleSheet.absoluteFill,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}
      <FlatList
        /*windowSize={100}
maxToRenderPerBatch={50}
updateCellsBatchingPeriod={1000}*/
        //initialNumToRender={50}
        data={userLists}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              marginTop: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: colors.primary }}>No Users Found</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={Divider}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => checkFollowStatus(item.uid, item.expoPushToken)}
          >
            <View style={styles.row}>
              <Image
                style={styles.pic}
                uri={item.image != null ? item.image : placeholderUserImage}
              />
              <View>
                <View style={styles.nameContainer}>
                  <Text
                    style={styles.nameTxt}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </Text>
                  <Text style={styles.mblTxt}></Text>
                </View>
                <View style={styles.msgContainer}>
                  <Text style={styles.msgTxt}>{item.status}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#DCDCDC",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
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
    width: 170,
  },
  mblTxt: {
    fontWeight: "200",
    color: colors.primary,
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
  searchContainer: {
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  searchRow: {
    backgroundColor: colors.searchBackground,
    flexDirection: "row",
    borderRadius: 5,
    height: 45,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  searchInputStyle: {
    paddingHorizontal: 30,
    backgroundColor: colors.searchBackground,
    fontSize: 15,
    height: 45,
    flex: 1,
    color: colors.searchText,
  },
});

export default UsersListScreen;
