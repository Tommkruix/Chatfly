import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Image } from "react-native-expo-image-cache";

import MiniProfile from "./common/MiniProfile";
import colors from "../constants/colors";
import defaultStyles from "../constants/theme";
import Divider from "./lists/Divider";

const styles = StyleSheet.create({
  /* The Whole Components Style */
  containerStyle: {
    backgroundColor: colors.white,
  },
  /* The components Style */
  buttonStyle: {
    flexDirection: "row",
    paddingBottom: 25,
    paddingRight: 20,
    paddingLeft: 10,
  },
  /* Profile Image Container */
  imageContainer: {
    marginRight: 15,
    borderRadius: 25,
    height: 50,
    width: 50,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  /* The profile Picture Style */
  imageStyle: {
    height: 55,
    width: 55,
  },
  /* The username Text Style */
  usernameTextStyle: {
    fontSize: defaultStyles.fontSize.title,
    color: colors.black,
    width: 210,
  },
  /* The messages Style */
  descriptionTextStyle: {
    fontSize: defaultStyles.fontSize.description,
    width: 240,
    color: colors.black,
  },
  /* The time that the message has been sent ---  Style */
  timeTextStyles: {
    fontSize: defaultStyles.fontSize.subtitle,
    color: colors.black,
    fontWeight: "300",
  },
  /* the notification Number__Container Style */
  notificationCircleStyle: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    height: 20,
    width: 20,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  /* THe notication number__Text Style */
  notificationTextStyle: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 10,
  },
});

const {
  containerStyle,
  buttonStyle,
  imageStyle,
  imageContainer,
  descriptionTextStyle,
  usernameTextStyle,
  timeTextStyles,
} = styles;

/* Function: check if theres notification:
  types: Number Circle  and image Circle  */
function showNotification({ type, notification }) {
  const { notificationCircleStyle, notificationTextStyle } = styles;
  /* The number Notification Style */
  if (notification && type === "number") {
    return (
      <View style={notificationCircleStyle}>
        <Text style={notificationTextStyle}>{notification}</Text>
      </View>
    );
    /* The Image Circle Notification Style */
  } else if (notification && type === "imageCircle") {
    return {
      borderColor: colors.primary,
    };
  }
}
function showOtherDescription(otherDescription) {
  /* The number Notification Style */
  if (otherDescription != "") {
    return <Text style={descriptionTextStyle}>{otherDescription}</Text>;
  }
}

function showStoryCircle({ hasStory }) {
  if (hasStory) {
    return {
      borderColor: colors.storyBorder,
      borderWidth: 2,
    };
  }
}

function ConversationItem({
  description,
  username,
  bio,
  imageSrc,
  isBlocked,
  time,
  isMuted,
  navigation,
  otherImageSrc,
  otherDescription,
  hasStory,
  onPress,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const disableModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    /* The whole Container */
    <View style={containerStyle}>
      {otherImageSrc && (
        <Image
          resizeMode={"contain"}
          style={{
            borderColor: "#fff",
            height: 450,
            width: "100%",
          }}
          uri={otherImageSrc}
        />
      )}
      {/* The Button  */}
      <TouchableOpacity onPress={onPress} style={buttonStyle}>
        {/* The Profile Pic Button */}
        <TouchableOpacity
          style={[imageContainer, showStoryCircle(hasStory)]}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        >
          {/* Image */}
          <Image style={imageStyle} uri={imageSrc} />
        </TouchableOpacity>
        {/* Username, message, Time, and notification number Container */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* Username And Time container */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text numberOfLines={1} style={usernameTextStyle}>
              {username}
            </Text>
            <Text style={timeTextStyles}>{time}</Text>
          </View>

          {/* Message and Notification Container */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text numberOfLines={1} style={descriptionTextStyle}>
              {description}
            </Text>

            {showNotification("number")}
          </View>
          {showOtherDescription(otherDescription)}
        </View>
      </TouchableOpacity>

      {/* MODAL: a pop up when you tap on a profile pic in message view,
         it shows you the user enlarged profile pic and some options(call, text, info) */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <MiniProfile
          username={username}
          imageSrc={imageSrc}
          bio={bio}
          isBlocked={isBlocked}
          isMuted={isMuted}
          hide={disableModal}
        />
      </Modal>
      {otherImageSrc && <Divider />}
    </View>
  );
}

export default ConversationItem;
