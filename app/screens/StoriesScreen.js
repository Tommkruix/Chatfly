import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Stories from "../components/storiesComponents/Stories";
import colors from "../constants/colors";
import routes from "../navigation/routes";

function StoriesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Stories navigation={navigation} />
      <TouchableOpacity
        onPress={() => navigation.navigate(routes.STORIESADDTEXT)}
        style={[
          styles.fabStyle,
          { marginBottom: 80, width: 50, height: 50, marginRight: 5 },
        ]}
      >
        <MaterialCommunityIcons
          name="circle-edit-outline"
          size={25}
          color={colors.white}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.fabStyle}
        onPress={() => navigation.navigate(routes.STORIESADDIMAGE)}
      >
        <MaterialCommunityIcons
          name="camera-enhance"
          size={25}
          color={colors.white}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fabStyle: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: colors.primary,
    borderRadius: 100,
    elevation: 5,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default StoriesScreen;
