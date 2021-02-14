import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "react-native-expo-image-cache";

import colors from "../constants/colors";
import defaultStyles from "../constants/theme";
import routes from "../navigation/routes";

function StoriesViewScreen({ navigation, route }) {
  /* Calling the props */
  //route.params.ref_postid;
  const username = route.params.username;
  const imageSrc = route.params.imageSrc;

  const [sstories, setStories] = useState(route.params.stories);
  const [scurrentStory, setCurrentStory] = useState(0);
  const [swidth, setWidth] = useState("0%");

  useEffect(() => {
    setStoryWidth();
  });

  function setStoryWidth() {
    const stories = sstories;
    const currentStory = scurrentStory;

    const length = stories.length;
    const current = currentStory + 1;
    const width = (current / length) * 100;
    setWidth(`${width}%`);
  }

  useEffect(() => {
    if (sstories.length === null)
      return navigation.navigate(routes.STORIESVIEW);
  }, []);

  function next() {
    const stories = sstories;
    const currentStory = scurrentStory;

    if (currentStory < stories.length - 1) {
      setCurrentStory(currentStory + 1);
      setStoryWidth();
    } else {
      navigation.goBack();
    }
  }

  function previous() {
    const currentStory = scurrentStory;
    if (currentStory > 0) {
      setCurrentStory(currentStory - 1);
      setStoryWidth();
    }
  }

  return (
    <View style={styles.container}>
      {/* The previous and next button */}
      <TouchableOpacity
        onPress={() => previous()}
        style={styles.previousTouchArea}
      />
      <TouchableOpacity onPress={() => next()} style={styles.nextTouchArea} />

      {/* The profile Container */}
      <View style={styles.innerContainer}>
        <View style={styles.profileContainer}>
          <Image style={styles.profilePicStyle} uri={imageSrc} />
          <View style={styles.titleAndSubtitleContainer}>
            <Text style={styles.titleTextStyle}>{username} </Text>
            <Text style={styles.subtitleTextStyle}>
              {sstories[scurrentStory].time}
            </Text>
          </View>
        </View>
        <View style={[styles.borderTimeContainer, { width: swidth }]} />
      </View>
      {/* The big story */}
      <View style={styles.storyImageContainer}>
        <Image
          resizeMode={"contain"}
          style={styles.storyImageStyle}
          uri={sstories[scurrentStory].url}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  innerContainer: {
    position: "absolute",
    zIndex: 10,
    width: "100%",
  },
  profileContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignContent: "center",
    overflow: "hidden",
    paddingVertical: 10,
  },
  profilePicStyle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginHorizontal: 10,
    alignSelf: "center",
  },
  titleAndSubtitleContainer: {
    justifyContent: "center",
  },
  titleTextStyle: {
    color: colors.white,
    fontSize: defaultStyles.fontSize.title,
  },
  subtitleTextStyle: {
    color: colors.white,
    fontSize: 14,
  },
  borderTimeContainer: {
    //backgroundColor: colors.primary,
    height: 3,
    width: "0%",
  },
  storyImageContainer: {
    backgroundColor: "black",
  },
  storyImageStyle: {
    height: "100%",
    maxWidth: "100%",
  },
  previousTouchArea: {
    backgroundColor: "#0000",
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "30%",
    zIndex: 1,
  },
  nextTouchArea: {
    backgroundColor: "#0000",
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    width: "30%",
    zIndex: 1,
  },
});

export default StoriesViewScreen;
