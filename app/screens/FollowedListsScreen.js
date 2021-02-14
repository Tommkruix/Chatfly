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

function FollowedListsScreen({ navigation }) {
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
    var query = firebase
      .database()
      .ref(`/Users/${uid}/Friend Requests/`)
      .orderByKey();
    query.once("value").then(function (snapshot) {
      var li = [];
      snapshot.forEach(function (childSnapshot) {
        if (
          childSnapshot.hasChild("status") &&
          (childSnapshot.child("status").val() == "0to1" ||
            childSnapshot.child("status").val() == "1to1")
        ) {
          li.push({
            key: childSnapshot.key,
            uid: childSnapshot.val().uid,
          });
        }
      });

      setUserLists(li.reverse());
      setSearchUserLists(li.reverse());
    });
    setIsLoading(false);
    return true;
  };

  function PostUserName(guid) {
    var name;
    firebase
      .database()
      .ref(`/Users/${guid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("name") && snapshot.child("name").exists) {
          name = snapshot.child("name").val();
        } else {
          name = "";
        }
      });

    return name;
  }
  function PostUserStatus(guid) {
    var status;
    firebase
      .database()
      .ref(`/Users/${guid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("status") && snapshot.child("status").exists) {
          status = snapshot.child("status").val();
        } else {
          status = "";
        }
      });

    return status;
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

  const SearchUsers = (value) => {
    const filteredUsers = searchUserLists.filter((user) => {
      let UsersLowercase = PostUserName(user.uid).toLowerCase();

      let searchTermLowercase = value.toLowerCase();

      return UsersLowercase.indexOf(searchTermLowercase) > -1;
    });
    setUserLists(filteredUsers);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader headerName="Users You Followed" navigation={navigation} />
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
            onPress={() => {
              navigation.navigate(routes.USERVIEWPROFILE, {
                ref_uid: item.uid,
              });
            }}
          >
            <View style={styles.row}>
              <Image style={styles.pic} uri={PostUserImage(item.uid)} />
              <View>
                <View style={styles.nameContainer}>
                  <Text
                    style={styles.nameTxt}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {PostUserName(item.uid)}
                  </Text>
                  <Text style={styles.mblTxt}></Text>
                </View>
                <View style={styles.msgContainer}>
                  <Text style={styles.msgTxt}>{PostUserStatus(item.uid)}</Text>
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

export default FollowedListsScreen;
