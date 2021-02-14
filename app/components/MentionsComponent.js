import React, { Component, useState } from "react";
import {
  ScrollView,
  Text,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

import Editor, { EU } from "react-native-mentions-editor";

const users = [
  { id: 1, name: "Raza Dar", username: "mrazadar", gender: "male" },
  { id: 3, name: "Atif Rashid", username: "atif.rashid", gender: "male" },
  { id: 4, name: "Peter Pan", username: "peter.pan", gender: "male" },
  { id: 5, name: "John Doe", username: "john.doe", gender: "male" },
  { id: 6, name: "Meesha Shafi", username: "meesha.shafi", gender: "female" },
];

function MentionsComponent({ props }) {
  const [initialValue, setInitialValue] = useState(
    "Hey @[mrazadar](id:1) this is good work. Tell @[john.doe](id:5) to use this package."
  );
  const [showEditor, setShowEditor] = useState(true);
  const [message, setMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [clearInput, setClearInput] = useState(false);
  const [showMentions, setShowMentions] = useState(false);

  const formatMentionNode = (txt, key) => (
    <Text key={key} style={styles.mention}>
      {txt}
    </Text>
  );

  const onChangeHandler = (message) => {
    /**
     * this callback will be called whenever input value change and will have
     * formatted value for mentioned syntax
     * @message : {text: 'Hey @(mrazadar)(id:1) this is good work.', displayText: `Hey @mrazadar this is good work`}
     * */
    setMessage(message);
    setClearInput(false);
  };
  const sendMessage = () => {
    if (!message) return;
    const messages = [message, ...messages];

    setMessage(messages);
    setMessage(null);
    setClearInput(true);
  };

  const toggleEditor = () => {
    /**
     * This callback will be called
     * once user left the input field.
     * This will handle blur event.
     */
    // this.setState({
    //   showEditor: false,
    // })
  };

  const onHideMentions = () => {
    /**
     * This callback will be called
     * When MentionsList hide due to any user change
     */

    setShowMentions(false);
  };

  const renderMessageListItem = ({ item: message, index }) => {
    return (
      <View style={styles.messageListItem}>
        <Text style={styles.messageText}>
          {EU.displayTextWithMentions(message.text, formatMentionNode)}
        </Text>
      </View>
    );
  };
  const renderMessageList = () => {
    return (
      <FlatList
        style={styles.messageList}
        keyboardShouldPersistTaps={"always"}
        horizontal={false}
        inverted
        enableEmptySections={true}
        data={messages}
        keyExtractor={(message, index) => `${message.text}-${index}`}
        renderItem={(rowData) => {
          return renderMessageListItem(rowData);
        }}
      />
    );
  };

  return (
    <View style={styles.main}>
      <KeyboardAvoidingView behavior="position">
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.heading}>React-Native Mentions Package</Text>
            <Text style={styles.sub}>Built by @mrazadar</Text>
          </View>
          <ScrollView style={styles.messageList}>
            {renderMessageList()}
          </ScrollView>
          <View style={styles.footer}>
            <Editor
              list={users}
              initialValue={initialValue}
              clearInput={clearInput}
              onChange={onChangeHandler}
              showEditor={showEditor}
              toggleEditor={toggleEditor}
              showMentions={showMentions}
              onHideMentions={onHideMentions}
              placeholder="You can write here..."
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
              <Text style={styles.sendBtnText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,

    backgroundColor: "#fff",
    height: 900,

    marginTop: 100,
  },
  container: {
    height: 900,

    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    // height: 200,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    // color: 'green'
  },
  sub: {
    color: "rgba(0, 0, 0, 0.4)",
    fontSize: 12,
    textAlign: "center",
  },
  messageList: {
    paddingVertical: 50,
  },
  messageText: {},

  footer: {
    backgroundColor: "lightgreen",
    height: 200,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 100,
    padding: 15,
  },
  sendBtn: {
    width: 50,
    height: 40,
    backgroundColor: "green",
    borderRadius: 6,
    marginLeft: 5,
    justifyContent: "center",
    textAlign: "center",
  },
  sendBtnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  mention: {
    fontSize: 16,
    fontWeight: "400",
    backgroundColor: "rgba(36, 77, 201, 0.05)",
    color: "#244dc9",
  },
});

export default MentionsComponent;
