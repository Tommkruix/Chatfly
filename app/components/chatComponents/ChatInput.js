import React from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../constants/colors";

/* STYLESHEETS */
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  innerContainer: {
    backgroundColor: "transparent",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    //marginVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
  },
  inputAndMicrophoneStyle: {
    flexDirection: "row",
    backgroundColor: colors.light,
    flex: 3,
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputStyle: {
    backgroundColor: "transparent",
    paddingLeft: 20,
    color: colors.primary,
    flex: 3,
    fontSize: 15,
    maxHeight: 100,
    alignSelf: "center",
  },
  microphoneButtonStyle: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 15,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "white",
  },
  sendButtonStyle: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
});

/* DECONSTRUCTION: Styles */
const {
  container,
  innerContainer,
  inputAndMicrophoneStyle,
  inputStyle,
  microphoneButtonStyle,
  sendButtonStyle,
} = styles;

function ChatInput({
  onSendPress,
  sendDisabled,
  txtInput,
  txtMessage,
  handleEmojiKeyboard,
  postButton,
  handlePost,
}) {
  return (
    /* Main Container: Holds Everything in this Class */
    <View style={container}>
      {/* Inner Container: Holds (Chat Input, and Microphone Button) and (Send Button) */}
      <View style={innerContainer}>
        {/* Input And MicrophoneButton Container: Contains Chat Input and Microphone Button */}
        <View style={inputAndMicrophoneStyle}>
          <TextInput
            multiline
            placeholder="Type something..."
            style={inputStyle}
          />
          <TouchableOpacity
            onPress={handleEmojiKeyboard}
            style={microphoneButtonStyle}
          >
            <MaterialCommunityIcons
              name="sticker-emoji"
              size={25}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
        {/* Send Button: Contains Send Icon */}
        <TouchableOpacity
          disabled={postButton}
          onPress={handlePost}
          style={sendButtonStyle}
        >
          <Feather name="send" size={25} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ChatInput;
