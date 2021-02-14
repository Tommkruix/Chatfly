import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  Platform,
  Alert,
  ToastAndroid,
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import * as Contacts from "expo-contacts";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as SMS from "expo-sms";
import Firebase from "firebase";

import SearchInput from "../components/common/SearchInput";
import colors from "../constants/colors";
import ContactsRow from "../components/ContactsRow";
import Divider from "../components/lists/Divider";
import firebase from "../config/init";
import routes from "../navigation/routes";

function ContactsScreen({ navigation }) {
  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";

  const uid = firebase.auth().currentUser.uid;

  const [contactsList, setContactsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inMemoryContact, setInMemoryContact] = useState([]);

  const requestPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Image,
          Contacts.Fields.ImageAvailable,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Emails,
        ],
        //pageSize: 10000,
        // pageOffset: 0,
      });

      if (data.length > 0) {
        const contact = data[0];
        setContactsList(data);
        setInMemoryContact(data);
        setIsLoading(false);
      }
    } else {
      alert("You need to enable permission to access your contacts");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    requestPermission();
  }, []);

  const SearchContacts = (value) => {
    const filteredContacts = inMemoryContact.filter((contact) => {
      // {homes.map(home => <div>{home.name}</div>)}
      /*let contactLowercase = (
        JSON.stringify(contact).firstName +
        " " +
        JSON.stringify(contact).lastName
      ).toLowerCase();*/
      /*let contactLowercase = (
        contact.map((cont) => {
          cont.firstName;
        }) +
        " " +
        contact.map((cont) => {
          cont.lastName;
        })
      ).toLowerCase();*/
      let contactLowercase = (
        contact.firstName +
        " " +
        contact.lastName
      ).toLowerCase();

      let searchTermLowercase = value.toLowerCase();

      return contactLowercase.indexOf(searchTermLowercase) > -1;
    });
    setContactsList(filteredContacts);
  };

  const handleContactName = (fn, ln, p1, p2, p3, p4) => {
    //p3 = p3.val().replace(" ", "");
    //p4 = p4.val().replace(" ", "");
    var valan = "";
    var valio = "";
    if (p1 != null) {
      if (p2 != null) {
        if (p3 != null || p4 != null) {
          if (Platform.OS === "android") {
            firebase
              .database()
              .ref("Users")
              .orderByChild("phoneno")
              .equalTo(p4)
              .on("value", (snapshot) => {
                if (snapshot.exists()) {
                  valan = snapshot.child("name");
                } else {
                  valan = fn + " " + ln;
                }
              });
          } else {
            firebase
              .database()
              .ref("Users")
              .orderByChild("phoneno")
              .equalTo(p3)
              .on("value", (snapshot) => {
                if (snapshot.exists()) {
                  valio = snapshot.child("name");
                } else {
                  valio = fn + " " + ln;
                }
              });
          }
        }
      }
    }

    return valan, valio;
  };

  const handleContactImage = (num) => {
    var p4 = num;
    var value = "";

    if (p4 != null) {
      firebase
        .database()
        .ref("Users")
        .orderByChild("phoneno")
        .equalTo(p4)
        .on("value", (snapshot) => {
          if (snapshot.exists()) {
            value = snapshot.child("image");
          } else {
            value = placeholderUserImage;
          }
        });
    }

    return value;
  };

  const handleContactStatus = (num) => {
    //var o = n.replace(/ /g, "");

    var p4 = JSON.stringify(num);
    if (Platform.OS === "android") {
      //p4 = p4.split(" ").join("");
      p4 = String(p4).replace(/ /g, "");
    }
    p4 = p4.replace(/\"/g, "");

    var value = "";

    if (p4 != null) {
      var query = firebase
        .database()
        .ref("/Users/")
        .orderByChild("phoneno")
        .equalTo(p4);
      query.once("value").then(function (snapshot) {
        if (!snapshot.exists()) {
          value = "Not available";
        }
        snapshot.forEach(function (childSnapshot) {
          var key = childSnapshot.key;
          var childData = childSnapshot.child("phoneno").val();
          if (childData === p4) {
            var p4status = childSnapshot.child("status").val();
            value = p4status;
          } else {
            value = "Not available";
          }

          // Cancel enumeration
          return true;
        });
      });
    }

    return value;
  };

  const handleContactNavigation = (num) => {
    //p3 = p3.val().replace(" ", "");
    //p4 = p4.val().replace(" ", "");
    //p4 = p4.replace(/\s/g, "");
    var p4 = JSON.stringify(num);
    if (Platform.OS === "android") {
      //p4 = p4.split(" ").join("");
      p4 = String(p4).replace(/ /g, "");
    }
    p4 = p4.replace(/\"/g, "");

    var value = "";

    if (p4 != null) {
      //var query = firebase.database().ref("/Users/").orderByKey();
      var query = firebase
        .database()
        .ref("/Users/")
        .orderByChild("phoneno")
        .equalTo(p4);
      query.once("value").then(function (snapshot) {
        if (!snapshot.exists()) {
          Alert.alert(
            "Invitation",
            "Invite your friend to Chatfly?",
            [
              { text: "Yes", onPress: () => OpenPhoneMessage(p4) },
              { text: "No" },
            ],

            { cancelable: true }
          );
        }
        snapshot.forEach(function (childSnapshot) {
          var key = childSnapshot.key;
          var childData = childSnapshot.child("phoneno").val();
          if (childData == p4) {
            var p4uid = childSnapshot.child("uid").val();
            const timestamp = Firebase.database.ServerValue.TIMESTAMP;
            // saving to contacts
            firebase
              .database()
              .ref("/Users/")
              .child(p4uid)
              .child("/Contacts")
              .child(uid)
              .update({
                status: "unblock",
                timestamp: timestamp,
                uid: uid,
              });

            firebase
              .database()
              .ref("/Users/")
              .child(uid)
              .child("Contacts")
              .child(p4uid)
              .update({
                status: "unblock",
                timestamp: timestamp,
                uid: p4uid,
              });

            firebase
              .database()
              .ref("/Users/")
              .child(uid)
              .child("Contacts")
              .child(uid)
              .update({
                status: "unblock",
                timestamp: timestamp,
                uid: uid,
              });

            value = navigation.navigate(routes.ONETOONECHAT, {
              id: childSnapshot.child("uid").val(),
            });
          } else {
            Alert.alert(
              "Invitation",
              "Invite your friend to Chatfly?",
              [
                { text: "Yes", onPress: () => OpenPhoneMessage(p4) },
                { text: "No" },
              ],

              { cancelable: true }
            );
          }

          // Cancel enumeration
          return true;
        });
      });
    }

    return value;
  };

  const OpenPhoneMessage = async (number) => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      // do your SMS stuff here
      const { result } = await SMS.sendSMSAsync(
        number,
        "Let's chat on Chatfly! It's a fast, simple, and secure app we can message each other for free. Get it at https://chatfly.com"
      );
    } else {
      // misfortune... there's no SMS available on this device
      Platform.OS === "android"
        ? ToastAndroid.show(
            "There's no SMS available on this device",
            ToastAndroid.SHORT
          )
        : Alert.alert("There's no SMS available on this device");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            color={colors.white}
            name="keyboard-backspace"
            size={24}
          />
        </TouchableOpacity>
        <Text
          style={{
            alignSelf: "flex-end",
            fontWeight: "500",
            color: colors.white,
            fontSize: 18,
          }}
        >
          Select Contact
        </Text>
        <TouchableOpacity></TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <MaterialIcons size={20} name="search" color={colors.primary} />
          <TextInput
            maxLength={10}
            placeholder="Search"
            placeholderTextColor={colors.dark}
            style={styles.searchInputStyle}
            onChangeText={(value) => SearchContacts(value)}
          />
        </View>
      </View>
      {isLoading ? (
        <View
          style={{
            ...StyleSheet.absoluteFill,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}
      <FlatList
        /*windowSize={100}
        maxToRenderPerBatch={50}
        updateCellsBatchingPeriod={1000}*/
        //initialNumToRender={50}
        data={contactsList}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              marginTop: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: colors.primary }}>No Contacts Found</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={Divider}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              {
                Platform.OS === "android" &&
                item.phoneNumbers &&
                item.phoneNumbers[0] &&
                item.phoneNumbers[0].number
                  ? handleContactNavigation(
                      item.phoneNumbers &&
                        item.phoneNumbers[0] &&
                        item.phoneNumbers[0].number
                    )
                  : handleContactNavigation(
                      item.phoneNumbers &&
                        item.phoneNumbers[0] &&
                        item.phoneNumbers[0].digits
                    );
              }
            }}
          >
            <View style={styles.row}>
              <Image
                style={styles.pic}
                uri={placeholderUserImage}
                /*uri={
                  Platform.OS === "android" &&
                  item.phoneNumbers &&
                  item.phoneNumbers[0] &&
                  item.phoneNumbers[0].number
                    ? handleContactImage(
                        item.phoneNumbers &&
                          item.phoneNumbers[0] &&
                          item.phoneNumbers[0].number
                      )
                    : handleContactImage(
                        item.phoneNumbers &&
                          item.phoneNumbers[0] &&
                          item.phoneNumbers[0].digits
                      )
                }*/
              />
              <View>
                <View style={styles.nameContainer}>
                  <Text
                    style={styles.nameTxt}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.firstName &&
                      item.lastName &&
                      item.firstName + " " + item.lastName}
                  </Text>
                  <Text style={styles.mblTxt}>
                    {Platform.OS === "android"
                      ? item.phoneNumbers &&
                        item.phoneNumbers[0] &&
                        item.phoneNumbers[0].number
                      : item.phoneNumbers &&
                        item.phoneNumbers[0] &&
                        item.phoneNumbers[0].digits}
                  </Text>
                </View>
                <View style={styles.msgContainer}>
                  <Text style={styles.msgTxt}>
                    {Platform.OS === "android" &&
                    item.phoneNumbers &&
                    item.phoneNumbers[0] &&
                    item.phoneNumbers[0].number
                      ? handleContactStatus(
                          item.phoneNumbers &&
                            item.phoneNumbers[0] &&
                            item.phoneNumbers[0].number
                        )
                      : handleContactStatus(
                          item.phoneNumbers &&
                            item.phoneNumbers[0] &&
                            item.phoneNumbers[0].digits
                        )}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    backgroundColor: colors.primary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#DCDCDC",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    padding: 10,
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 280,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: "600",
    color: "#222",
    fontSize: 18,
    width: 170,
  },
  mblTxt: {
    fontWeight: "200",
    color: colors.primary,
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  msgTxt: {
    fontWeight: "400",
    color: colors.primary,
    fontSize: 12,
    marginLeft: 15,
  },
  searchContainer: {
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  searchRow: {
    backgroundColor: colors.searchBackground,
    flexDirection: "row",
    borderRadius: 5,
    height: 45,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  searchInputStyle: {
    paddingHorizontal: 30,
    backgroundColor: colors.searchBackground,
    fontSize: 15,
    height: 45,
    flex: 1,
    color: colors.searchText,
  },
});

export default ContactsScreen;
