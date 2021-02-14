import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../../constants/colors";

function ListItemSeparatorComponent() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: colors.light,
  },
});
export default ListItemSeparatorComponent;
