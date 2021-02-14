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

function ReferralBonusWithdrawRequestsScreen({ navigation }) {
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
      .ref(`/Referral Bonus Withdrawal/`)
      .on("value", (snapshot) => {
        var li = [];
        snapshot.forEach((child) => {
          if (child.child("status").val() != "cancelled") {
            li.push({
              key: child.key,
              amount: child.val().amount,
              user_id: child.val().user_id,
              payment_address: child.val().payment_address,
              withdraw_id: child.val().withdraw_id,
              timestamp: child.val().timestamp,
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
      .ref(`/Referral Bonus Withdrawal/${withdrawid}`)
      .remove()
      .then(() => {
        Platform.OS === "android"
          ? ToastAndroid.show("Withdraw Accepted", ToastAndroid.SHORT)
          : Alert.alert("Withdraw Accepted");
      });

    return true;
  };

  const deleteWithdraw = (withdrawid) => {
    firebase
      .database()
      .ref(`/Referral Bonus Withdrawal/${withdrawid}`)
      .remove()
      .then(() => {
        Platform.OS === "android"
          ? ToastAndroid.show("Withdraw Rejected", ToastAndroid.SHORT)
          : Alert.alert("Withdraw Rejected");
      });

    return true;
  };

  const handleReject = (withdrawid, userid, amt) => {
    var defaultAmt = 0;

    firebase
      .database()
      .ref("Users")
      .child(userid)
      .once("value", (snapshot) => {
        if (
          snapshot.hasChild("referral_bonus") &&
          snapshot.child("referral_bonus").exists
        ) {
          defaultAmt = snapshot.child("referral_bonus").val();

          firebase
            .database()
            .ref("Users")
            .child(userid)
            .child("referral_bonus")
            .ref.set(parseInt(defaultAmt) + amt);

          handleWithdraw(withdrawid);
        } else {
          firebase
            .database()
            .ref("Users")
            .child(userid)
            .child("referral_bonus")
            .ref.set(amt);

          deleteWithdraw(withdrawid);
        }
      });

    return true;
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        navigation={navigation}
        headerName="Referral Bonus Withdraws"
      />
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
            description={`wants to withdraw ${item.amount} referrals bonus`}
            time={new Date(item.timestamp).toLocaleDateString()}
            otherDescription={item.payment_address}
            //notification={"3"}
            //isBlocked={true}
            //isMuted={true}
            hasStory={true}
            onPress={() =>
              Alert.alert(
                "Withdraw",
                "Choose response",
                [
                  {
                    text: "Accept",
                    onPress: () => handleWithdraw(item.withdraw_id),
                  },
                  {
                    text: "Reject",
                    onPress: () =>
                      handleReject(item.withdraw_id, item.user_id, item.amount),
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

export default ReferralBonusWithdrawRequestsScreen;
