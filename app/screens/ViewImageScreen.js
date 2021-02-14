import React, { useState } from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ImageView from "react-native-image-view";

import colors from "../constants/colors";

function ViewImageScreen({ navigation, route }) {
  const { image } = route.params;

  const [imageVisible, setImageVisible] = useState(true);

  const images = [
    {
      source: {
        uri: image,
      },
      title: "",
      width: 806,
      height: 720,
    },
  ];
  const renderImageFooter = (currentImage) => {
    if (images.length > 1) {
      return (
        <View>
          <Text>{currentImage.title}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/*<View style={styles.deleteIcon}>
        <MaterialCommunityIcons
          name="trash-can-outline"
          color="white"
          size={35}
        />
      </View>*/}
      <ImageView
        images={images}
        imageIndex={0}
        isVisible={imageVisible}
        isPinchZoomEnabled={imageVisible}
        isSwipeCloseEnabled={imageVisible}
        isTapZoomEnabled={imageVisible}
        /*backgroundColor={colors.grey}
        animationType="fade"*/
        onClose={() => navigation.goBack()}
        renderFooter={(currentImage) => renderImageFooter(currentImage)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  closeIcon: {
    position: "absolute",
    top: 40,
    left: 30,
  },
  container: {
    backgroundColor: colors.black,
    flex: 1,
  },
  deleteIcon: {
    position: "absolute",
    top: 40,
    right: 30,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ViewImageScreen;
