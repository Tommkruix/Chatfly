import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome as Icon } from "@expo/vector-icons";
import colors from "../../constants/colors";
import defaultStyles from "../../constants/theme";

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 20,
  },
  innerContainer: {
    flexDirection: "row",
  },
  iconContainer: {
    paddingHorizontal: 10,
    overflow: "hidden",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBackground: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary,
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
});

function SearchChatAddItem({ icon, title }) {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={styles.innerContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Icon color="white" size={25} name={icon} />
          </View>
        </View>
        <View style={styles.TextContainer}>
          <Text style={styles.titleStyle} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default SearchChatAddItem;
