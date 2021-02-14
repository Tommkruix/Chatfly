import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Alert, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import ScreenHeader from "../components/ScreenHeader";
import ListItemComponent from "../components/lists/ListItemComponent";
import IconComponent from "../components/IconComponent";
import colors from "../constants/colors";
import firebase from "../config/init";
import routes from "../navigation/routes";

function NotificationsScreen({ navigation }) {
  const uid = firebase.auth().currentUser.uid;

  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    RetrieveNotification();
  }, []);
  const RetrieveNotification = () => {
    firebase
      .database()
      .ref(`/Notifications/`)
      .orderByChild("to")
      .equalTo(uid)
      .on("value", (snapshot) => {
        var li = [];
        snapshot.forEach((child) => {
          li.push({
            key: child.key,
            nid: child.val().nid,
            title: child.val().title,
            to: child.val().to,
            body: child.val().body,
            status: child.val().status,
            type_id: child.val().type_id,
            type: child.val().type,
            timestamp: child.val().timestamp,
          });
        });
        setNotificationList(li.reverse());
      });
  };

  const UpdateNotification = (nid, type, type_id, type_uid) => {
    firebase.database().ref(`/Notifications/${nid}`).update({
      status: "read",
    });
    if (type === "comments") {
      navigation.navigate(routes.FORUMPOSTVIEW, {
        ref_postid: type_id,
        ref_postuid: type_uid,
      });
    } else if (type === "transfers") {
      navigation.navigate(routes.WALLET);
    } else if (type === "friend request") {
      Alert.alert(
        "Friend Request",
        "Accept",
        [
          { text: "Accept", onPress: () => handleAcceptRequest() },
          { text: "Cancel" },
        ],
        { cancelable: true }
      );
    }
  };

  const handleAcceptRequest = () => {
    // query firebase
  };

  const renderIconType = (type) => {
    if (type === "comments") {
      return <IconComponent name="comment" backgroundColor={colors.primary} />;
    } else if (type === "transfers") {
      return (
        <IconComponent name="wallet-plus" backgroundColor={colors.secondary} />
      );
    } else if (type === "friend request") {
      return (
        <IconComponent name="bag-personal-outline" backgroundColor="tomato" />
      );
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <ScreenHeader headerName="Notifications" navigation={navigation} />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        data={notificationList}
        keyExtractor={(notification) => notification.key.toString()}
        renderItem={({ item }) => (
          <ListItemComponent
            onPress={() =>
              UpdateNotification(item.nid, item.type, item.type_id, item.to)
            }
            status={item.status}
            title={item.title}
            subTitle={item.body}
            ImageComponent={renderIconType(item.type)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default NotificationsScreen;
