import React from "react";
import RNUrlPreview from "react-native-url-preview";
import { View, StyleSheet } from "react-native";

function PreviewLink({ text }) {
  return (
    <View style={styles.container}>
      <RNUrlPreview
        imageStyle={{
          height: 250,
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: 10,
        }}
        imageProps={{ resizeMode: "contain" }}
        text={text}
        onError={() => null}
      />
      <RNUrlPreview
        containerStyle={{
          marginTop: -15,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          backgroundColor: colors.light,
          marginBottom: 20,
          paddingBottom: 10,
        }}
        imageStyle={{ width: 0 }}
        text={text}
        onError={() => null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    borderRadius: 20,
  },
});

export default PreviewLink;
