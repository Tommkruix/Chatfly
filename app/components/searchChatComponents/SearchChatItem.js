import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import colors from "../../constants/colors";
import defaultStyles from "../../constants/theme";

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 20,
  },
  innerContainer: {
    flexDirection: "row",
  },
  imageContainer: {
    paddingHorizontal: 10,
    overflow: "hidden",
    alignSelf: "center",
  },
  ImageStyle: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  TextContainer: {
    flexDirection: "column",
    maxWidth: "75%",
    justifyContent: "center",
    alignSelf: "center",
  },
  titleStyle: {
    fontSize: defaultStyles.fontSize.title,
    color: colors.title,
  },
  descriptionStyle: {
    fontSize: defaultStyles.fontSize.subtitle,
    color: colors.description,
  },
});

function SearchChatItem({
  navigation,
  username,
  bio,
  imageSrc,
  isBlocked,
  isMuted,
}) {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("MessagePage", {
            username: username,
            bio: bio,
            imageSrc: imageSrc,
            isBlocked: isBlocked,
            isMuted: isMuted,
          })
        }
        style={styles.innerContainer}
      >
        <View style={styles.imageContainer}>
          <Image style={styles.ImageStyle} source={{ uri: imageSrc }} />
        </View>
        <View style={styles.TextContainer}>
          <Text style={styles.titleStyle} numberOfLines={1}>
            {username}
          </Text>
          <Text style={styles.descriptionStyle} numberOfLines={1}>
            {bio}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default SearchChatItem;
