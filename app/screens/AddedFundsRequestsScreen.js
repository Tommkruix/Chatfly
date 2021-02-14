import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";

import ScreenHeader from "../components/ScreenHeader";
import firebase from "../config/init";
import ConversationItem from "../components/ConversationItem";

function AddedFundsRequestsScreen({ navigation }) {
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
      .ref(`/Add Fund Requests/`)
      .on("value", (snapshot) => {
        var li = [];
        snapshot.forEach((child) => {
          if (child.child("status").val() != "cancelled") {
            li.push({
              key: child.key,
              image: child.val().image,
              user_id: child.val().userid,
              withdraw_id: child.val().postid,
              timestamp: child.val().timestamp,
              amount: child.val().amount,
              extraInfo: child.val().extraInfo,
            });
          }
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

  const handleWithdraw = (withdrawid) => {
    firebase
      .database()
      .ref(`/Add Fund Requests/${withdrawid}`)
      .remove()
      .then(() => {
        Platform.OS === "android"
          ? ToastAndroid.show("Funds Added", ToastAndroid.SHORT)
          : Alert.alert("Funds Added");
      });

    return true;
  };

  const deleteWithdraw = (withdrawid) => {
    firebase
      .database()
      .ref(`/Add Fund Requests/${withdrawid}`)
      .remove()
      .then(() => {
        Platform.OS === "android"
          ? ToastAndroid.show("Funds Rejected", ToastAndroid.SHORT)
          : Alert.alert("Funds Rejected");
      });

    return true;
  };

  return (
    <View style={styles.container}>
      <ScreenHeader navigation={navigation} headerName="Added Funds Requests" />
      <FlatList
        style={{ marginTop: 10 }}
        showsVerticalScrollIndicator={false}
        data={posts}
        keyExtractor={(post) => post.key.toString()}
        renderItem={({ item }) => (
          <ConversationItem
            imageSrc={PostUserImage(item.user_id)}
            username={PostUserName(item.user_id)}
            //bio={"item.bio"}
            description={`wants to add ₦ ${item.amount}.`}
            time={new Date(item.timestamp).toLocaleDateString()}
            otherDescription={item.extraInfo}
            otherImageSrc={item.image}
            //notification={"3"}
            //isBlocked={true}
            //isMuted={true}
            hasStory={true}
            onPress={() =>
              Alert.alert(
                "Added Funds",
                "Choose response",
                [
                  {
                    text: "Accept",
                    onPress: () => handleWithdraw(item.withdraw_id),
                  },
                  {
                    text: "Reject",
                    onPress: () => deleteWithdraw(item.withdraw_id),
                  },
                  { text: "Cancel" },
                ],
                { cancelable: true }
              )
            }
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

export default AddedFundsRequestsScreen;
