import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Platform } from "react-native";

import firebase from "../config/init";
import Screen from "../components/Screen";
import ListItemComponent from "../components/lists/ListItemComponent";
import colors from "../constants/colors";
import IconComponent from "../components/IconComponent";
import ListItemSeparatorComponent from "../components/lists/ListItemSeparatorComponent";
import routes from "../navigation/routes";
import ScreenHeader from "../components/ScreenHeader";

function SettingsScreen({ navigation }) {
  const handleLogout = () => {
    firebase.auth().signOut();
  };
  const menuItems = [
    {
      title: "Logout",
      icon: {
        name: "wallet-outline",
        backgroundColor: colors.danger,
      },
      targetScreen: "",
    },
  ];

  return (
    <Screen style={styles.screen}>
      <ScreenHeader navigation={navigation} headerName="Settings" />
      <View style={styles.container}>
        <FlatList
          /*data={menuItems}
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
          )}*/
          ListFooterComponent={
            <ListItemComponent
              title="Logout"
              ImageComponent={
                <IconComponent name="logout" backgroundColor={colors.danger} />
              }
              onPress={() => handleLogout()}
            />
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

export default SettingsScreen;
