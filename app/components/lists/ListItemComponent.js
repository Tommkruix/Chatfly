import React from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";
import { Image } from "react-native-expo-image-cache";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "../AppText";
import colors from "../../constants/colors";

function ListItemComponent({
  title,
  subTitle,
  image,
  onPress,
  renderRightActions,
  ImageComponent,
  status,
  extraTime,
}) {
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableHighlight underlayColor={colors.light} onPress={onPress}>
        <View style={styles.container}>
          {ImageComponent}
          {image && <Image style={styles.image} uri={image} />}
          <View style={styles.detailsContainer}>
            {status === "unread" ? (
              <AppText
                numberOfLines={1}
                style={[styles.title, { fontWeight: "bold" }]}
              >
                {title}
              </AppText>
            ) : (
              <AppText numberOfLines={1} style={styles.title}>
                {title}
              </AppText>
            )}

            {subTitle != null ? (
              status === "unread" ? (
                <AppText
                  numberOfLines={2}
                  style={[styles.subTitle, { fontWeight: "bold" }]}
                >
                  {subTitle}
                </AppText>
              ) : (
                <AppText numberOfLines={2} style={styles.subTitle}>
                  {subTitle}
                </AppText>
              )
            ) : null}
          </View>
          <MaterialCommunityIcons
            color={colors.medium}
            name="chevron-right"
            size={25}
          />
        </View>
      </TouchableHighlight>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    backgroundColor: colors.light,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  subTitle: {
    color: colors.medium,
  },
  title: {
    fontWeight: "500",
  },
});

export default ListItemComponent;
