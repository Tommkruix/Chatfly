import React from "react";
import { ScrollView, FlatList } from "react-native";
import ConversationItem from "./ConversationItem";

const chats = [
  {
    id: 1,
    imageSrc:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    username: "Bruce Mars",
    bio: "my name is someone, i work",
    description: "Hello, how are you??",
    time: "5:00 PM",
    notification: "3",
    isBlocked: true,
    isMuted: true,
    hasStory: true,
  },
  {
    id: 2,
    imageSrc:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    username: "Bruce Mars",
    bio: "my name is someone, i work",
    description: "Hello, how are you??",
    time: "5:00 PM",
    notification: "3",
    isBlocked: true,
    isMuted: true,
    hasStory: true,
  },
  {
    id: 3,
    imageSrc:
      "https://images.pexels.com/photos/1845534/pexels-photo-1845534.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    username: "Bruce Mars",
    bio: "my name is someone, i work",
    description: "Hello, how are you??",
    time: "5:00 PM",
    notification: "3",
    isBlocked: true,
    isMuted: true,
    hasStory: true,
  },
  {
    id: 4,
    imageSrc:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    username: "Bruce Mars",
    bio: "my name is someone, i work",
    description: "Hello, how are you??",
    time: "5:00 PM",
    notification: "3",
    isBlocked: true,
    isMuted: true,
    hasStory: true,
  },
  {
    id: 5,
    imageSrc:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    username: "Bruce Mars",
    bio: "my name is someone, i work",
    description: "Hello, how are you??",
    time: "5:00 PM",
    notification: "3",
    isBlocked: true,
    isMuted: true,
    hasStory: true,
  },
];

function Conversations() {
  return (
    <FlatList
      data={chats}
      keyExtractor={(chat) => chat.id.toString()}
      renderItem={({ item }) => (
        <ConversationItem
          imageSrc={item.imageSrc}
          username={item.username}
          bio={item.bio}
          description={item.description}
          time={item.time}
          notification={item.notification}
          isBlocked={item.isBlocked}
          isMuted={item.isMuted}
          hasStory={item.hasStory}
        />
      )}
    />
  );
}

export default Conversations;
