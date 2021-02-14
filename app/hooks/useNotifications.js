import { useEffect } from "react";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import firebase from "../config/init";

export default useNotifications = (notificationListener) => {
  useEffect(() => {
    registerForPushNotifications();

    if (notificationListener) Notifications.addListener(notificationListener);
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (!permission.granted) return;

      const token = await Notifications.getExpoPushTokenAsync();
      const uid = firebase.auth().currentUser.uid;
      firebase.database().ref(`/Users/${uid}`).update({
        expoPushToken: token,
      });
    } catch (error) {
      console.log("Error getting a push token", error);
      Alert.alert();
    }
  };
};
