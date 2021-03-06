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

function AdministrationUserListsScreen({ navigation }) {
  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";

  const [userLists, setUserLists] = useState([]);
  const [searchUserLists, setSearchUserLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserLists();
  }, []);

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
          Select User
        </Text>
        <TouchableOpacity></TouchableOpacity>
      </View>
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
            onPress={() =>
              navigation.navigate(routes.ADMINISTRATIONUSERACTIONS, {
                ref_uid: item.uid,
              })
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

export default AdministrationUserListsScreen;
