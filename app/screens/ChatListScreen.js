import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, StyleSheet, AsyncStorage } from "react-native";

import routes from "../navigation/routes";
import ConversationItem from "../components/ConversationItem";
import firebase from "../config/init";
import cache from "../utility/cache";

/*const chats = [
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
];*/

function ChatListScreen({ navigation, route }) {
  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";

  var uid = null;
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      uid = firebase.auth().currentUser.uid;
    } else {
      // No user is signed in.
    }
  });

  const [chatsList, setChatsList] = useState([]);
  const [change, setChange] = useState(false);

  useEffect(() => {
    // adding event listeners on mount here
    DisplayChats();
    return () => {
      // cleaning up the listeners here
    };
  }, [change]);

  /*const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    //console.log("Effect was run");
  });
  useEffect(() => {
    // second useEffect
    if (!isFirstRun) {
      DisplayChats();
      console.log("Effect was run");
    }
  });*/

  /*const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      //DisplayChats();
    } else {
      didMountRef.current = true;
      DisplayChats();
    }
  });*/

  /*useEffect(() => {
    cachingLayer();
  }, []);*/

  /*const cachingLayer = async () => {
    if (chatsList != null || chatsList != "") {
      cache.store(DisplayChats(), chatsList);
      return chatsList;
    }
    const data = await cache.get(DisplayChats());
    return data ? { ok: true, data } : chatsList;
  };*/

  const DisplayChats = () => {
    var query = firebase.database().ref(`/Users/${uid}/Contacts`).orderByKey();
    query.once("value").then(function (snapshot) {
      var li = [];
      snapshot.forEach(function (childSnapshot) {
        var usersID = childSnapshot.key;
        if (usersID != uid) {
          // checking messages
          var m_body;
          var m_timestamp;
          var m_id;
          firebase
            .database()
            .ref(`/Chat Messages/${uid}/${usersID}`)
            .limitToLast(1)
            .on("value", (snapshot) => {
              snapshot.forEach(function (childSnapshotM) {
                var data = childSnapshotM.val();
                m_body = data.body;
                m_timestamp = data.timestamp;
                m_id = data.messageid;
              });
            });
          // /checking messages

          li.push({
            key: childSnapshot.key,
            body: m_body,
            messageid: m_id,
            timestamp: m_timestamp,
            //from: childSnapshot.val().from,
            //to: childSnapshot.val().to,
            users_id: usersID,
            username: RetrieveUsername(usersID),
            //userimage: image,
          });
          // Cancel enumeration
        }
      });
      setChatsList(li.reverse());
      return true;
    });
  };

  const RetrieveMessageBody = (usersID, type) => {
    var m_body;
    var m_timestamp;
    var m_id;
    // checking messages
    firebase
      .database()
      .ref(`/Chat Messages/${uid}/${usersID}`)
      .limitToLast(1)
      .on("value", (snapshot) => {
        snapshot.forEach(function (childSnapshotM) {
          var data = childSnapshotM.val();
          m_body = data.body;
          m_timestamp = data.timestamp;
          m_id = data.messageid;
        });
      });
    // /checking messages
    if (type === "desc") {
      return m_body;
    } else if (type === "time") {
      return new Date(m_timestamp).toLocaleTimeString();
    }
    setChange(true);
  };

  const RetrieveUsername = (users_id) => {
    var name;
    firebase
      .database()
      .ref(`/Users/${users_id}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("name") && snapshot.child("name").exists) {
          name = snapshot.child("name").val();
        } else {
          name = "";
        }
      });

    return name;
  };

  const RetrieveUserimage = (users_id) => {
    var image;
    firebase
      .database()
      .ref(`/Users/${users_id}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("image") && snapshot.child("image").exists) {
          image = snapshot.child("image").val();
        } else {
          image = placeholderUserImage;
        }
      });

    return image;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatsList}
        keyExtractor={(chat) => chat.key.toString()}
        renderItem={({ item }) => (
          <ConversationItem
            imageSrc={RetrieveUserimage(item.users_id)}
            username={
              //item.username
              RetrieveUsername(item.users_id)
            }
            //bio={"item.bio"}
            description={RetrieveMessageBody(item.users_id, "desc")}
            time={
              //new Date(item.timestamp).toLocaleTimeString()
              RetrieveMessageBody(item.users_id, "time") === "Invalid Date"
                ? null
                : RetrieveMessageBody(item.users_id, "time")
            }
            notification={"3"}
            isBlocked={true}
            isMuted={true}
            hasStory={true}
            onPress={() =>
              navigation.navigate(routes.ONETOONECHAT, {
                id: item.users_id,
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
});

export default ChatListScreen;
