import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

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

const switchl = false;

function SettingsSwitchItem({ title, subtitle }) {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.titleAndToggleContainer}>
          <Text style={styles.titleStyle}>{title}</Text>
          <Switch value={switchl} />
        </View>
        <View style={{ maxWidth: "80%" }}>
          <Text numberOfLines={3}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

export default SettingsSwitchItem;
