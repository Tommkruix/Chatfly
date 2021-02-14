import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../constants/colors";
import { Form } from "formik";

/* Styles for the components */
const styles = StyleSheet.create({
  mainContainer: {
    paddingVertical: 10,
    marginVertical: 5,
  },
  chatContainer: {
    backgroundColor: colors.primary,
    maxWidth: "80%",
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: 15,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 10,
  },
  MessageViewStyle: {
    backgroundColor: "transparent",
    maxWidth: "80%",
  },
  timeViewStyle: {
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    paddingLeft: 10,
  },
  messageTextStyle: {
    color: "white",
    alignSelf: "flex-start",
    fontSize: 15,
  },
  timeTextStyle: {
    color: "lightgray",
    alignSelf: "flex-end",
    fontSize: 10,
  },
});

/* Deconstruction: Styles */
const {
  mainContainer,
  chatContainer,
  MessageViewStyle,
  timeViewStyle,
  messageTextStyle,
  timeTextStyle,
} = styles;

function ChatCard({ chat, time, isLeft, onPress, to, from }) {
  return (
    /* MAIN CONTAINER: it is the parent that contains the chat container  */
    <View style={mainContainer}>
      {/* CHAT CONTAINER: contains the Message view and Time view */}
      <View
        style={[
          chatContainer,
          isLeft === to
            ? {
                alignSelf: "flex-start",
                backgroundColor: "#f0f0f0",
                maxWidth: "80%",
                paddingRight: 25,
              }
            : "",
        ]}
      >
        {/* MESSAGE VIEW: the Message is located in here */}
        <View style={MessageViewStyle}>
          <Text
            style={[messageTextStyle, isLeft === to ? { color: "black" } : ""]}
          >
            {chat}
          </Text>
        </View>

        {/* TIME VIEW: the time Text is located in here*/}
        <View style={timeViewStyle}>
          <Text
            style={[timeTextStyle, isLeft === to ? { color: "black" } : ""]}
          >
            {time}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default ChatCard;
