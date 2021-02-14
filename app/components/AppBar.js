import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import routes from "../navigation/routes";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import firebase from "../config/init";
import OfflineNotice from "./OfflineNotice";

function AppBar() {
  const navigation = useNavigation();

  const { email, name } = firebase.auth().currentUser;
  const uid = firebase.auth().currentUser.uid;

  useState({ email });

  useEffect(() => {
    handleSesion();
  });

  const handleSesion = () => {
    if (uid != null) {
      var ref = firebase.database().ref(`Users/${uid}`);
      ref.update({
        state: "online",
      });
      ref.onDisconnect().update({
        state: "offline",
      });
      return true;
    }
  };

  /*const handleLogout = () => {
    firebase.auth().signOut();
  };*/

  return (
    <>
      <View style={styles.toolbar}>
        <View style={styles.container}>
          <Text style={styles.title}>Chat Fly {/*email*/}</Text>
          <View style={styles.icon}>
            <TouchableOpacity
              onPress={() => navigation.navigate(routes.USERSLIST)}
              style={{ marginRight: 20 }}
            >
              <FontAwesome name="user-plus" size={24} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(routes.NOTIFICATIONS)}
              style={{ marginRight: 20 }}
            >
              <Ionicons
                name="ios-notifications"
                size={28}
                color={colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(routes.CONTACTS)}
              style={{ marginRight: 10 }}
            >
              <FontAwesome name="search" size={24} color={colors.white} />
            </TouchableOpacity>
            {/* <TouchableWithoutFeedback onPress={handleLogout}>
              <SimpleLineIcons
                name="user"
                style={{ marginLeft: 20 }}
                size={24}
                color={colors.white}
              />
            </TouchableWithoutFeedback> */}
            {/*<SimpleLineIcons
              name="options-vertical"
              style={{ marginLeft: 20 }}
              size={24}
              color={colors.white}
            />*/}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  icon: {
    paddingRight: 20,
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  toolbar: {
    width: "100%",
    height: 65,
    backgroundColor: colors.primary,
    justifyContent: "center",
  },
  title: {
    color: colors.white,
    marginLeft: 15,
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 10,
  },
});

export default AppBar;
