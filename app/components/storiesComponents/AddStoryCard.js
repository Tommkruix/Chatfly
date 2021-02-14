import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";

import colors from "../../constants/colors";
import defaultStyles from "../../constants/theme";

const styles = StyleSheet.create({
  mainContainer: { paddingBottom: 10 },
  innerContainer: {
    paddingRight: 20,
    paddingLeft: 10,
    flexDirection: "row",
  },
  imageContainer: {
    marginRight: 15,
    overflow: "hidden",
    paddingVertical: 10,
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  iconContainer: {
    position: "absolute",
    backgroundColor: colors.primary,
    borderRadius: 12.5,
    height: 25,
    width: 25,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    top: 45,
  },
  iconStyle: {},
  textContainer: {
    justifyContent: "center",
  },
  textStyle: {
    color: colors.primary,
    fontSize: defaultStyles.fontSize.title,
    fontWeight: "normal",
  },
});

function AddStoryCard({ userimage, onPress, style, ...otherProps }) {
  return (
    <View style={[styles.mainContainer, style]} {...otherProps}>
      <TouchableOpacity style={styles.innerContainer} onPress={onPress}>
        <View style={styles.imageContainer}>
          <Image style={styles.imageStyle} resizeMode="cover" uri={userimage} />
          <View style={styles.iconContainer}>
            <Icon
              name="plus"
              size={15}
              style={styles.iconStyle}
              color="white"
            />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>What's on your mind?</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default AddStoryCard;
