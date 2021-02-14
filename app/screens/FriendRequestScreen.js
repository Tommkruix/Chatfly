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
import routes from "../navigation/routes";
import ScreenHeader from "../components/ScreenHeader";

function FriendRequestScreen({ navigation }) {
  const uid = firebase.auth().currentUser.uid;

  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";

  const [userLists, setUserLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserLists();
  }, []);

  const loadUserLists = () => {
    setIsLoading(true);

    // check friend requests
    var query = firebase
      .database()
      .ref(`/Users/${uid}/Friend Requests`)
      .orderByChild("status")
      .equalTo("unaccepted");
    query.once("value").then(function (snapshot) {
      var li = [];
      snapshot.forEach(function (childSnapshot) {
        var usersID = childSnapshot.key;

        // check users list
        firebase
          .database()
          .ref("Users")
          .orderByChild("uid")
          .equalTo(usersID)
          .on("value", (snapshot) => {
            snapshot.forEach((child) => {
              li.push({
                key: child.key,
                image: child.val().image,
                status: child.val().status,
                expoPushToken: child.val().expoPushToken,
                uid: child.val().uid,
                name: child.val().name,
              });
            });
            setUserLists(li.reverse());
          });
      });
    });
    setIsLoading(false);
    return true;
  };

  const handleAcceptFriendRequest = (refuid, expoPushToken) => {
    // saving request to the current user
    firebase.database().ref(`Users/${uid}/Friend Requests/${refuid}`).update({
      status: "accepted",
    });
    // saving request to the ref user
    firebase.database().ref(`Users/${refuid}/Friend Requests/${uid}`).update({
      status: "accepted",
    });

    navigation.goBack();
  };
  const handleRejectFriendRequest = (uid, expoPushToken) => {
    // saving request to the current user
    firebase.database().ref(`Users/${uid}/Friend Requests/${refuid}`).update({
      status: "unaccepted",
    });
    // saving request to the ref user
    firebase.database().ref(`Users/${refuid}/Friend Requests/${uid}`).update({
      status: "unaccepted",
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader navigation={navigation} headerName="Follow Requests" />

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
            <Text style={{ color: colors.primary }}>
              No Friend Requests Found
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={Divider}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Respond to Follow Request",
                "",
                [
                  {
                    text: "Accept",
                    onPress: () =>
                      handleAcceptFriendRequest(item.uid, item.expoPushToken),
                  },
                  {
                    text: "Reject",
                    onPress: () =>
                      handleRejectFriendRequest(item.uid, item.expoPushToken),
                  },
                  { text: "Cancel" },
                ],
                { cancelable: true }
              )
            }
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

export default FriendRequestScreen;
