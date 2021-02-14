import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function ScreenHeader({
  navigation,
  headerName,
  rightHandPress,
  rightHandTitle,
}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons
          color={colors.white}
          name="keyboard-backspace"
          size={24}
        />
      </TouchableOpacity>
      <Text
        style={{
          alignSelf: "flex-end",
          fontWeight: "500",
          color: colors.white,
          fontSize: 18,
        }}
      >
        {headerName}
      </Text>
      <TouchableOpacity onPress={rightHandPress}>
        <Text
          style={{
            alignSelf: "flex-end",
            fontWeight: "500",
            color: colors.white,
            fontSize: 18,
          }}
        >
          {rightHandTitle}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    backgroundColor: colors.primary,
  },
});

export default ScreenHeader;
