import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";

import ScreenHeader from "../components/ScreenHeader";
import firebase from "../config/init";
import ConversationItem from "../components/ConversationItem";

function AdministrationTransactionViewScreen({ navigation, route }) {
  const role = route.params.role;
  const type = route.params.type;

  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";

  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    TransactionList(role, type);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    TransactionList(role, type);
  };

  const TransactionList = (ref_role, ref_type) => {
    firebase
      .database()
      .ref(`/User Transfers/`)
      .orderByChild("role")
      .equalTo(ref_role)
      .on("value", (snapshot) => {
        var li = [];
        snapshot.forEach((child) => {
          var identifier = "";
          var traType;
          if (child.child("type").val() == "added_funds") {
            identifier = "Added Funds";
          } else {
            identifier = "Coins";
          }

          if (child.child("type").val() == "credit") {
            traType = "Credited";
          } else {
            traType = "Debited";
          }

          if (child.child("type").val() == ref_type) {
            li.push({
              key: child.key,
              amount: child.val().converted_coins,
              name: traType,
              sender_id: child.val().sender_id,
              receiver_id: child.val().receiver_id,
              timestamp: child.val().timestamp,
              type: identifier,
            });
          }
        });
        setData(li.reverse());
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
      <ScreenHeader headerName="Transaction View" navigation={navigation} />
      <FlatList
        style={{ marginTop: 30 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={20}
        keyExtractor={(item) => item.key.toString()}
        stickySectionHeadersEnabled={false}
        data={data}
        renderItem={({ item }) => (
          <ConversationItem
            imageSrc={PostUserImage(item.sender_id)}
            username={PostUserName(item.sender_id)}
            description={`"${item.name}" ${item.amount} ${
              item.type
            } to "${PostUserName(item.receiver_id)}"`}
            otherDescription={
              "Date: " +
              new Date(item.timestamp).toLocaleDateString() +
              ", " +
              new Date(item.timestamp).toLocaleTimeString()
            }
            hasStory={true}
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

export default AdministrationTransactionViewScreen;
