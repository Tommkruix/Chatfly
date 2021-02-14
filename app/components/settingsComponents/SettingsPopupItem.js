import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import colors from "../../constants/colors";
import defaultStyles from "../../constants/theme";

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 20,
  },
  innerContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  titleAndToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  titleStyle: {
    fontSize: defaultStyles.fontSize.title,
    color: colors.title,
  },
});

function SettingsPopupItem({ subtitle, title }) {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={styles.innerContainer}>
        <View style={styles.titleAndToggleContainer}>
          <Text style={styles.titleStyle}>{title}</Text>
        </View>
        <View style={{ maxWidth: "80%" }}>
          <Text numberOfLines={3}>{subtitle}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default SettingsPopupItem;
