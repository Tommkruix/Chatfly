import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Platform } from "react-native";

import firebase from "../config/init";
import Screen from "../components/Screen";
import ListItemComponent from "../components/lists/ListItemComponent";
import colors from "../constants/colors";
import IconComponent from "../components/IconComponent";
import ListItemSeparatorComponent from "../components/lists/ListItemSeparatorComponent";
import routes from "../navigation/routes";

const menuItems = [
  {
    title: "My Wallet",
    icon: {
      name: "wallet-outline",
      backgroundColor: colors.primary,
    },
    targetScreen: "Wallet",
  },
  {
    title: "Advertisements",
    icon: {
      name: "trending-up",
      backgroundColor: "#ffe66d",
    },
    targetScreen: routes.USERADVERTISEMENTS,
  },
  /* {
    title: "Follow Requests",
    icon: {
      name: "bag-personal-outline",
      backgroundColor: "tomato",
    },
    targetScreen: routes.FRIENDREQUEST,
  },*/

  {
    title: "Settings",
    icon: {
      name: "settings",
      backgroundColor: "tomato",
    },
    targetScreen: routes.SETTINGS,
  },
];

function AccountScreen({ navigation }) {
  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";

  const uid = firebase.auth().currentUser.uid;
  const [imageUri, setImageUri] = useState();
  const [userimage, setUserImage] = useState();
  const [username, setUserName] = useState();
  const [userstatus, setUserStatus] = useState();
  const [userrole, setUserRole] = useState();
  const [userAccountType, setUserAccountType] = useState();

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
          setUserImage(placeholderUserImage);
        }

        if (snapshot.hasChild("name") && snapshot.child("name").exists) {
          setUserName(snapshot.child("name").val());
        } else {
          setUserName("");
        }

        if (snapshot.hasChild("role") && snapshot.child("role").exists) {
          setUserRole(snapshot.child("role").val());
        } else {
          setUserRole("");
        }

        if (snapshot.hasChild("status") && snapshot.child("status").exists) {
          setUserStatus(snapshot.child("status").val());
        } else {
          setUserStatus("");
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

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <View style={styles.container}>
              <ListItemComponent
                title={username}
                subTitle={userstatus}
                image={userimage}
                onPress={() => navigation.navigate(routes.PROFILE)}
              />
            </View>
          }
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparatorComponent}
          renderItem={({ item }) => (
            <ListItemComponent
              title={item.title}
              ImageComponent={
                <IconComponent
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={() => navigation.navigate(item.targetScreen)}
            />
          )}
          ListFooterComponent={
            userrole === "admin" ? (
              <ListItemComponent
                onPress={() => navigation.navigate(routes.ADMINISTRATIONHOME)}
                title="Administration"
                ImageComponent={
                  <IconComponent
                    name="home-analytics"
                    backgroundColor={colors.secondary}
                  />
                }
              />
            ) : null
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
    flex: 1,
  },
  screen: {
    backgroundColor: colors.light,
    marginTop: Platform.OS === "android" ? -10 : 0,
  },
});

export default AccountScreen;
