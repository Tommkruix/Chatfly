import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import defaultStyles from "../constants/theme";

function AppTextInput({
  icon,
  viewPass,
  onViewPass,
  width = "100%",
  ...otherProps
}) {
  return (
    <View style={[styles.container, { width }]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={defaultStyles.colors.medium}
          style={styles.icon}
        />
      )}

      <TextInput
        placeholderTextColor={defaultStyles.colors.medium}
        style={defaultStyles.text}
        {...otherProps}
      />
      {viewPass && (
        <TouchableOpacity
          style={{
            alignSelf: "center",
            position: "absolute",
            right: 10,
            marginTop: 3,
          }}
          onPress={onViewPass}
        >
          <MaterialCommunityIcons
            name={viewPass}
            size={20}
            color={defaultStyles.colors.medium}
            style={[
              styles.icon,
              {
                marginRight: 0,
              },
            ]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
    marginTop: 3,
  },
});

export default AppTextInput;
