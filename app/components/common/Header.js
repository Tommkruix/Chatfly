import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import colors from "../../constants/colors";

/* Stylesheets: You can style Everything Here */
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.tabBackground,
    paddingBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    position: "relative",
    justifyContent: "space-between",
    marginHorizontal: 15,
    paddingVertical: 10,
  },
  /* Here you can change The styles for the Text (HEADER) */
  headerTitleStyle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.activeTabTitle,
    alignSelf: "center",
  },
  imageStyle: {
    height: 40,
    width: 40,
  },
  imageContainer: {
    borderRadius: 20,
    height: 40,
    width: 40,
    overflow: "hidden",
  },
});

/* DECONSTRUCTION: styles */
const {
  headerContainer,
  headerTitleStyle,
  imageStyle,
  container,
  imageContainer,
} = styles;

function Header({ navigation, title }) {
  return (
    /* Main Container: it contains everything related to header */
    <View style={container}>
      <View style={headerContainer}>
        {/* The header Text */}
        <Text style={headerTitleStyle}>{title}</Text>
        {/* Your Profile Button: tap it and you will see settings related to your profile  */}
        <TouchableOpacity
          style={[imageContainer]}
          onPress={() => {
            navigation.navigate("ProfilePage");
          }}
        >
          <Image
            style={imageStyle}
            source={{
              uri:
                "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Header;
