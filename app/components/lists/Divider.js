import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../../constants/colors";

function Divider() {
  return <View style={styles.separator}></View>;
}

const styles = StyleSheet.create({
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: colors.light,
  },
});

export default Divider;
