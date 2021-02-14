import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "react-native-expo-image-cache";
import Firebase from "firebase";

import colors from "../../constants/colors";
import defaultStyles from "../../constants/theme";
import routes from "../../navigation/routes";
import firebase from "../../config/init";

const styles = StyleSheet.create({
  /* The Whole Components Style */
  containerStyle: {
    backgroundColor: colors.white,
  },
  /* The components Style */
  buttonStyle: {
    flexDirection: "row",
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 10,
  },
  /* Profile Image Container */
  imageContainer: {
    marginRight: 15,
    borderRadius: 25,
    height: 50,
    width: 50,
    overflow: "hidden",
    borderColor: colors.storyBorder,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  /* The profile Picture Style */
  imageStyle: {
    height: 55,
    width: 55,
  },
  textsContainer: {
    justifyContent: "center",
  },
  usernameTextStyle: {
    color: colors.title,
    fontSize: defaultStyles.fontSize.title,
  },
  timeTextStyle: {
    color: colors.subtitle,
    fontSize: defaultStyles.fontSize.description,
  },
});

function StoryItem({
  navigation,
  imageSrc,
  username,
  time,
  stories,
  body,
  uid,
  postid,
  otherStyles,
}) {
  const [dailyLimitEarningPoint, setDailyLimitEarningPoint] = useState(0);
  const [
    dailyNormalLimitEarningPoint,
    setDailyNormalLimitEarningPoint,
  ] = useState(0);
  const [dailyVIPLimitEarningPoint, setDailyVIPLimitEarningPoint] = useState(0);
  const [dailyVVIPLimitEarningPoint, setDailyVVIPLimitEarningPoint] = useState(
    0
  );

  const last24hour = new Date().getTime() - 24 * 3600 * 1000;

  useEffect(() => {
    handleDefaultSettings();
  }, []);

  const handleDefaultSettings = () => {
    firebase
      .database()
      .ref(`/Administration/`)
      .on("value", (snapshot) => {
        if (
          snapshot.hasChild("daily_limit_earning_point") &&
          snapshot.child("daily_limit_earning_point").exists
        ) {
          setDailyLimitEarningPoint(
            snapshot.child("daily_limit_earning_point").val()
          );
        } else {
          setDailyLimitEarningPoint(0);
        }
        if (
          snapshot.hasChild("daily_normallimit_earning_point") &&
          snapshot.child("daily_normallimit_earning_point").exists
        ) {
          setDailyNormalLimitEarningPoint(
            snapshot.child("daily_normallimit_earning_point").val()
          );
        } else {
          setDailyNormalLimitEarningPoint(0);
        }
        if (
          snapshot.hasChild("daily_viplimit_earning_point") &&
          snapshot.child("daily_viplimit_earning_point").exists
        ) {
          setDailyVIPLimitEarningPoint(
            snapshot.child("daily_viplimit_earning_point").val()
          );
        } else {
          setDailyVIPLimitEarningPoint(0);
        }
        if (
          snapshot.hasChild("daily_vviplimit_earning_point") &&
          snapshot.child("daily_vviplimit_earning_point").exists
        ) {
          setDailyVVIPLimitEarningPoint(
            snapshot.child("daily_vviplimit_earning_point").val()
          );
        } else {
          setDailyVVIPLimitEarningPoint(0);
        }
      });
  };

  const AddPostEarning = (POSTID, USERID) => {
    const earningid = firebase.database().ref("/Forum Post Earnings").push()
      .key;
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;
    // check user account type
    firebase
      .database()
      .ref(`Users/${USERID}`)
      .once("value")
      .then(function (usnapshot) {
        //console.log(usnapshot);
        //console.log("userid: ",USERID, " account type: ",uat)
        var uat = usnapshot.child("account_type").val();

        firebase
          .database()
          .ref("/Forum Post Earnings")
          .orderByChild("userid")
          .equalTo(uid)
          .once("value")
          .then(function (snapshot) {
            if (snapshot.exists()) {
              var total = 0;
              snapshot.forEach((child) => {
                if (child.val().timestamp >= last24hour) {
                  total++;
                }
              });
              if (total <= dailyNormalLimitEarningPoint && uat == "normal") {
                // Add Earning
                firebase
                  .database()
                  .ref("Forum Post Earnings")
                  .child(earningid)
                  .update({
                    earningid: earningid,
                    userid: uid,
                    postid: POSTID,
                    userid_earningid: uid + earningid,
                    userid_postid: uid + POSTID,
                    timestamp: timestamp,
                  });
                // /Add Earning
              }
              if (total <= dailyVIPLimitEarningPoint && uat == "vip") {
                // Add Earning
                firebase
                  .database()
                  .ref("Forum Post Earnings")
                  .child(earningid)
                  .update({
                    earningid: earningid,
                    userid: uid,
                    postid: POSTID,
                    userid_earningid: uid + earningid,
                    userid_postid: uid + POSTID,
                    timestamp: timestamp,
                  });
                // /Add Earning
              }
              if (total <= dailyVVIPLimitEarningPoint && uat == "vvip") {
                // Add Earning
                firebase
                  .database()
                  .ref("Forum Post Earnings")
                  .child(earningid)
                  .update({
                    earningid: earningid,
                    userid: uid,
                    postid: POSTID,
                    userid_earningid: uid + earningid,
                    userid_postid: uid + POSTID,
                    timestamp: timestamp,
                  });
                // /Add Earning
              }
              if (
                (total <= dailyLimitEarningPoint && uat != "normal") ||
                uat != "vip" ||
                uat != "vvip"
              ) {
                // Add Earning
                firebase
                  .database()
                  .ref("Forum Post Earnings")
                  .child(earningid)
                  .update({
                    earningid: earningid,
                    userid: uid,
                    postid: POSTID,
                    userid_earningid: uid + earningid,
                    userid_postid: uid + POSTID,
                    timestamp: timestamp,
                  });
                // /Add Earning
              }
            } else {
              // add earning
              firebase
                .database()
                .ref("Forum Post Earnings")
                .child(earningid)
                .update({
                  earningid: earningid,
                  userid: uid,
                  postid: POSTID,
                  userid_earningid: uid + earningid,
                  userid_postid: uid + POSTID,
                  timestamp: timestamp,
                });
            }
          });
      });
  };

  const handleNavigation = () => {
    stories[0].url != null && body == null && stories != null
      ? navigation.navigate(routes.STORIESVIEW, {
          imageSrc: imageSrc,
          storyImage: imageSrc,
          username: username,
          time: time,
          stories: stories,
        })
      : navigation.navigate(routes.FORUMPOSTVIEW, {
          ref_postid: postid,
          ref_postuid: uid,
        });
    AddPostEarning(postid, uid);
  };

  return (
    /* The whole Container */
    <View style={[styles.containerStyle, otherStyles]}>
      {/* The Button  */}
      <TouchableOpacity
        onPress={() => handleNavigation()}
        style={styles.buttonStyle}
      >
        {/* The Profile Pic View */}
        <View style={styles.imageContainer}>
          <Image style={[styles.imageStyle]} uri={imageSrc} />
        </View>
        <View style={styles.textsContainer}>
          <Text numberOfLines={1} style={styles.usernameTextStyle}>
            {username}
          </Text>
          <Text numberOfLines={1} style={styles.timeTextStyle}>
            {time}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default StoryItem;
