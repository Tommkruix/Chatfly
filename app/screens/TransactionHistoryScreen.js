import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Firebase from "firebase";
import colors from "../constants/colors";
import firebase from "../config/init";
import ConversationItem from "../components/ConversationItem";
import ScreenHeader from "../components/ScreenHeader";

function TransactionHistoryScreen({ navigation }) {
  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";
  const uid = firebase.auth().currentUser.uid;

  const [posts, setPosts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    forumPosts();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    forumPosts();
  };

  const forumPosts = () => {
    var traType;
    firebase
      .database()
      .ref(`/User Transfers/`)
      .orderByChild("sender_id")
      .equalTo(uid)
      .on("value", (snapshot) => {
        if (snapshot.exists) {
          traType = "Sent";
        }
        var li = [];
        snapshot.forEach((child) => {
          if (child.child("receiver_id").val() === uid) {
            traType = "Received";
          }
          var identifier = "";
          if (child.child("type").val() === "added_funds") {
            identifier = "Added Funds";
          } else {
            identifier = "Coins";
          }

          li.push({
            key: child.key,
            amount: child.val().converted_coins,
            type: traType,
            sender_id: child.val().sender_id,
            receiver_id: child.val().receiver_id,
            timestamp: child.val().timestamp,
            identifier: identifier,
          });
        });
        setPosts(li.reverse());
      });
    setIsRefreshing(false);
  };

  function PostUserImage(uid) {
    var image;
    firebase
      .database()
      .ref(`/Users/${uid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("image") && snapshot.child("image").exists) {
          image = snapshot.child("image").val();
        } else {
          image = placeholderUserImage;
        }
      });

    return image;
  }

  function PostUserName(uid) {
    var name;
    firebase
      .database()
      .ref(`/Users/${uid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("name") && snapshot.child("name").exists) {
          name = snapshot.child("name").val();
        } else {
          name = "";
        }
      });

    return name;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader navigation={navigation} headerName="Transaction History" />
      <FlatList
        style={{ marginTop: 30 }}
        showsVerticalScrollIndicator={false}
        data={posts}
        keyExtractor={(post) => post.key.toString()}
        renderItem={({ item }) => (
          <ConversationItem
            imageSrc={PostUserImage(item.receiver_id)}
            username={PostUserName(item.receiver_id)}
            //bio={"item.bio"}
            description={
              item.type == "Received"
                ? item.amount + ` ${item.identifier} Received`
                : item.amount + ` ${item.identifier} Sent`
            }
            time={new Date(item.timestamp).toLocaleDateString()}
            //notification={"3"}
            //isBlocked={true}
            //isMuted={true}
            hasStory={true}
            /*onPress={() =>
              navigation.navigate(routes.ONETOONECHAT, {
                id: item.users_id,
              })
            }*/
          />
        )}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default TransactionHistoryScreen;
