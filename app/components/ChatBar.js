import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { useRoute } from "@react-navigation/native";

function ChatBar() {
  const route = useRoute();
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/images/logo.png")}
      />
      <View style={styles.name}>
        <Text>{route.params.visible}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  image: { width: 50, height: 50, alignItems: "flex-start" },
  name: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    textAlignVertical: "center",
  },
});

export default ChatBar;
