import React from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
import AppText from "./AppText";

function TextInputComponent({
  iconName,
  value,
  onPress,
  title,
  ...otherProps
}) {
  return (
    <View style={styles.container}>
      <FontAwesome
        color={colors.medium}
        name={iconName}
        size={25}
        style={styles.title}
      />

      <TextInput
        style={styles.textInput}
        {...otherProps}
        selectionColor={colors.primary}
        editable
        value={value}
      />
      {title && (
        <TouchableOpacity onPress={onPress}>
          <MaterialCommunityIcons
            color={colors.medium}
            name="circle-edit-outline"
            size={25}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    backgroundColor: colors.light,
  },
  textInput: {
    paddingLeft: 6,
    paddingRight: 6,
    height: 40,
    fontSize: 18,
    width: "65%",
  },
  title: {
    width: "25%",
    justifyContent: "center",
    color: colors.primary,
  },
});

export default TextInputComponent;
