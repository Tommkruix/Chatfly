import React from "react";
import { ScrollView, FlatList } from "react-native";
import ChatCard from "../chatComponents/ChatCard";
import colors from "../../constants/colors";

const chats = [
  {
    id: 1,
    user: 0,
    time: "12:00",
    content: "Hey",
  },
  {
    id: 2,
    user: 1,
    time: "12:05",
    content: "What's up?",
  },
  {
    id: 3,
    user: 1,
    time: "12:07",
    content: "How is it going?",
  },
  {
    id: 4,
    user: 0,
    time: "12:09",
    content: "things are going great",
  },
  {
    id: 5,
    user: 0,
    time: "12:00",
    content: "Good :)",
  },
  {
    id: 6,
    user: 1,
    time: "12:05",
    content:
      "Should we hang out tommorow? i was thinking of going somewhere which has drinks",
  },
  {
    id: 7,
    user: 0,
    time: "12:07",
    content: "sure!",
  },
  {
    id: 8,
    user: 1,
    time: "12:09",
    content: "Great",
  },
  {
    id: 9,
    user: 0,
    time: "12:07",
    content: "7 o'clock?",
  },
  {
    id: 10,
    user: 1,
    time: "12:09",
    content: "sounds Good",
  },
];
/* To define Which User is Me
0 = ME
1 = other Person */
const myUser = 0;

function MessagesView() {
  return (
    /* SCROLLABLE VIEW Container: Contains ALl the ConversationItems(Users you talk to) */
    <FlatList
      data={chats}
      keyExtractor={(chat) => chat.id.toString()}
      renderItem={({ item }) => (
        <ChatCard
          time={item.time}
          chat={item.content}
          isLeft={item.user !== myUser ? item.user : myUser}
        />
      )}
    />
  );
}

export default MessagesView;
