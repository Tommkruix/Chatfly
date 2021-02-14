import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "react-native-expo-image-cache";
import {
  FontAwesome as Icon,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import colors from "../../constants/colors";

/* Styles for the components */
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingVertical: 5,
  },
  backButtonStyle: {
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  profileAndOptionsStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    paddingHorizontal: 10,
  },
  profileStyle: {
    flexDirection: "row",
    flex: 4,
  },
  imageStyle: {
    height: 55,
    width: 55,
    borderRadius: 55 / 2,
  },
  usernameAndDescriptionStyle: {
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  usernameStyle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  descriptionStyle: {
    color: colors.white,
    fontSize: 16,
  },
  optionsStyle: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1.5,
  },
});

/* Deconstruction: Styles */
const {
  container,
  profileStyle,
  backButtonStyle,
  profileAndOptionsStyle,
  usernameAndDescriptionStyle,
  optionsStyle,
  imageStyle,
  usernameStyle,
  descriptionStyle,
} = styles;

function ChatHeader({
  navigation,
  onPress,
  username,
  onlineStatus,
  imageSrc,
  onOpenProfile,
  menuPress,
}) {
  return (
    /* The parent Container: holds Every Component in this class */
    <View style={container}>
      {/* BACK BUTTON to go back to the page where it came from  */}
      <TouchableOpacity onPress={() => onPress()} style={backButtonStyle}>
        <MaterialCommunityIcons
          color={colors.white}
          name="keyboard-backspace"
          size={24}
        />
      </TouchableOpacity>
      {/* ProfileAndOptions Container: contains The Profile Image and 
        the username and Seen status */}
      <View style={profileAndOptionsStyle}>
        {/* BUTTON: when pressed It will take you to the profile page */}
        <TouchableOpacity onPress={() => onOpenProfile()} style={profileStyle}>
          <Image style={imageStyle} uri={imageSrc} />
          <View style={usernameAndDescriptionStyle}>
            <Text style={usernameStyle}>{username}</Text>
            <Text style={descriptionStyle}>{onlineStatus}</Text>
          </View>
        </TouchableOpacity>
        {/* OPTIONS Container: Contain All of the options buttons (Calls, Attachment, options) */}
        <View style={optionsStyle}>
          {/* Call Button Container: contains The call Icon */}
          {/* <TouchableOpacity style={{ paddingHorizontal: 5 }}>
            <Icon
              onPress={() => {
                navigation.navigate("OnCallPage", {
                  username: username,
                  imageSrc: imageSrc,
                });
              }}
              name="phone"
              size={30}
              color={colors.white}
            />
          </TouchableOpacity> */}
          {/* Attachments Button Container: contains The Attachments Icon */}
          {/* <TouchableOpacity style={{ paddingHorizontal: 5 }}>
            <Icon name="paperclip" size={30} color={colors.white} />
          </TouchableOpacity> */}
          {/* Options Button Container: contains The Options Icon */}
          <TouchableOpacity
            onPress={() => menuPress()}
            style={{ paddingHorizontal: 10 }}
          >
            <Icon name="ellipsis-v" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default ChatHeader;
