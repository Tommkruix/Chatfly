import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Text,
  Alert,
  ScrollView,
} from "react-native";
import Firebase from "firebase";
import Hyperlink from "react-native-hyperlink";
import InputSpinner from "react-native-input-spinner";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenHeader from "../components/ScreenHeader";
import colors from "../constants/colors";
import firebase from "../config/init";
import { Image } from "react-native-expo-image-cache";
import Divider from "../components/lists/Divider";
import routes from "../navigation/routes";
import RNUrlPreview from "react-native-url-preview";

function UserAdvertisementActionsScreen({ navigation, route }) {
  const ref_postid = route.params.ref_postid;

  const uid = firebase.auth().currentUser.uid;
  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";

  const [refPostBody, setRefPostBody] = useState();
  const [refPostImage, setRefPostImage] = useState(null);
  const [refPostLikes, setRefPostLikes] = useState();
  const [refPostComments, setRefPostComments] = useState();
  const [refPostUserName, setRefPostUserName] = useState();
  const [refPostUserImage, setRefPostUserImage] = useState();
  const [refPostUserAccountType, setRefPostUserAccountType] = useState();
  const [refPostUserStatus, setRefPostUserStatus] = useState();
  const [refPostDate, setRefPostDate] = useState();
  const [totalEarnings, setTotalEarnings] = useState(0);

  const [durationValue, setDurationValue] = useState(0);
  const [budgetValue, setBudgetValue] = useState(0);

  useEffect(() => {
    RetrieveRefPostDetails();
  });

  useEffect(() => {
    userAccountEarnings();
  }, []);

  const userAccountEarnings = () => {
    firebase
      .database()
      .ref("Users")
      .child(uid)
      .on("value", (snapshot) => {
        if (
          snapshot.exists() &&
          snapshot != null &&
          snapshot.hasChild("added_funds")
        ) {
          setTotalEarnings(snapshot.child("added_funds").val());
        } else {
          setTotalEarnings(0);
        }
      });
  };

  const RetrieveRefPostDetails = () => {
    // post details
    firebase
      .database()
      .ref(`/Forum Posts/${ref_postid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("image") && snapshot.child("image").exists) {
          setRefPostImage(snapshot.child("image").val());
        } else {
          setRefPostImage(null);
        }

        if (snapshot.hasChild("body") && snapshot.child("body").exists) {
          setRefPostBody(snapshot.child("body").val());
        } else {
          setRefPostBody("");
        }

        if (
          snapshot.hasChild("timestamp") &&
          snapshot.child("timestamp").exists
        ) {
          setRefPostDate(snapshot.child("timestamp").val());
        } else {
          setRefPostDate("");
        }
      });

    // likes details
    firebase
      .database()
      .ref("Forum Post Likes")
      .orderByChild("postid")
      .equalTo(ref_postid)
      .on("value", (snapshot) => {
        if (
          snapshot.exists() &&
          snapshot != null &&
          snapshot.numChildren() >= 1
        ) {
          setRefPostLikes(snapshot.numChildren() + " likes");
        } else {
          setRefPostLikes("0 likes");
        }
      });

    // comments details
    firebase
      .database()
      .ref("Forum Post Comments")
      .orderByChild("postid")
      .equalTo(ref_postid)
      .on("value", (snapshot) => {
        if (
          snapshot.exists() &&
          snapshot != null &&
          snapshot.numChildren() >= 1
        ) {
          setRefPostComments(snapshot.numChildren() + " comments");
        } else {
          setRefPostComments("0 comments");
        }
      });
  };

  const handlePromote = () => {
    const adid = firebase.database().ref("/Advertisements").push().key;
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;

    if (budgetValue != null && durationValue != null) {
      if (budgetValue <= totalEarnings && durationValue >= 1) {
        firebase
          .database()
          .ref("Advertisements")
          .child(adid)
          .update({
            ad_id: adid,
            user_id: uid,
            budget: budgetValue,
            duration: durationValue,
            postid: ref_postid,
            userid_adid: uid + adid,
            userid_postid: uid + ref_postid,
            timestamp: timestamp,
          })
          .then(() => {
            MinusAndResetEarnings(budgetValue);
            UpdateForumPost(durationValue);
            Platform.OS === "android"
              ? ToastAndroid.show("Successful.", ToastAndroid.SHORT)
              : Alert.alert("Successful.");
          });
      } else {
        Platform.OS === "android"
          ? ToastAndroid.show(
              "Your duration cannot be less than 1 day and budget cannot be greater than your balance.",
              ToastAndroid.SHORT
            )
          : Alert.alert(
              "Your duration cannot be less than 1 day and budget cannot be greater than your balance."
            );
      }
    } else {
      Platform.OS === "android"
        ? ToastAndroid.show(
            "You need to set a budget and duration.",
            ToastAndroid.SHORT
          )
        : Alert.alert("You need to set a budget and duration.");
    }
  };

  const UpdateForumPost = (duration) => {
    //const last24hour = new Date().getTime() - 24 * 3600 * 1000;
    const now = new Date().getTime();
    const count = duration * 24;
    const adsDuration = now + count * 3600 * 1000;
    firebase.database().ref("Forum Posts").child(ref_postid).update({
      adsState: "true",
      adsDuration: adsDuration,
    });
    navigation.goBack();
  };

  const MinusAndResetEarnings = (amt) => {
    firebase
      .database()
      .ref("Users")
      .child(uid)
      .once("value", (snapshot) => {
        if (
          snapshot.exists() &&
          snapshot != null &&
          snapshot.hasChild("added_funds")
        ) {
          snapshot.child("added_funds").ref.set(totalEarnings - amt);
        } else {
          // do nothing
        }
      });
    userAccountEarnings();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <ScreenHeader
          navigation={navigation}
          headerName="Set Promotion Details"
        />
        {refPostImage && (
          <View style={{ flexDirection: "row", padding: 10 }}>
            <Image
              uri={refPostImage}
              style={{
                borderColor: "#fff",
                height: 350,
                width: "100%",
                resizeMode: "cover",
                borderRadius: 10,
                flex: 1,
              }}
            />
          </View>
        )}
        <View style={{ flexDirection: "row", padding: 25, paddingTop: 10 }}>
          <Hyperlink
            linkStyle={{ color: "#2980b9" }}
            onLongPress={(url, text) =>
              navigation.navigate(routes.LOCALBROWSER, {
                url: url,
                text: text,
              })
            }
            linkDefault={true}
          >
            <Text style={{ fontSize: 18 }}>{refPostBody}</Text>
          </Hyperlink>
        </View>
        <RNUrlPreview
          imageStyle={{ height: 100, width: 120, borderRadius: 10 }}
          containerStyle={{
            height: 100,
            width: 400,
            backgroundColor: colors.light,
          }}
          text={refPostBody}
          onError={() => null}
        />
        <Divider />

        <View
          style={{
            flexDirection: "row",
            padding: 25,
            justifyContent: "space-between",
            paddingTop: 25,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: colors.primary }}>
              {new Date(refPostDate).toDateString()}
              {", "}
              {new Date(refPostDate).toLocaleTimeString()}{" "}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: colors.primary }}>{refPostLikes} </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: colors.primary }}>{refPostComments}</Text>
          </View>
        </View>

        {/* Process */}
        <Text style={{ color: colors.primary, padding: 25 }}>Budget</Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={100000}
            min={0}
            step={1}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            append={<Text style={{ padding: 10 }}>Coins</Text>}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={budgetValue}
            onChange={(num) => {
              setBudgetValue(num);
            }}
          />
        </View>
        <Text style={{ color: colors.primary, padding: 25 }}>Duration</Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={100000}
            min={0}
            step={1}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            append={<Text style={{ padding: 10 }}>Days</Text>}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={durationValue}
            onChange={(num) => {
              setDurationValue(num);
            }}
          />
        </View>
        <Text
          style={{ color: colors.primary, padding: 25, fontWeight: "bold" }}
        >
          Available Balance:
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <Text>{"₦ " + totalEarnings.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            handlePromote();
          }}
        >
          <View style={styles.cardSmallBox}>
            <View style={styles.cardSmall}>
              <View style={[styles.row, { justifyContent: "center" }]}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.white,
                    fontWeight: "bold",
                  }}
                >
                  Promote Post{" "}
                </Text>
                <MaterialCommunityIcons
                  name="arrow-right-circle-outline"
                  size={24}
                  color={colors.white}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#DCDCDC",
    backgroundColor: "#fff",
    padding: 10,
  },
  cardSmallBox: {
    flexDirection: "row",
    padding: 20,
  },
  cardSmall: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  row: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
  },
});

export default UserAdvertisementActionsScreen;
