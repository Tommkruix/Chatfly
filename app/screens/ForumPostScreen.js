import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Platform,
  Text,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Firebase from "firebase";

import FeedComponent from "../components/FeedComponent";
import Screen from "../components/Screen";
import AddStoryCard from "../components/storiesComponents/AddStoryCard";
import routes from "../navigation/routes";
import Divider from "../components/lists/Divider";
import colors from "../constants/colors";
import firebase from "../config/init";

function ForumPostScreen({ navigation }) {
  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";
  const uid = firebase.auth().currentUser.uid;
  const [userimage, setUserImage] = useState();
  const [username, setUserName] = useState();

  const [posts, setPosts] = useState([]);
  const [postUserAccountType, setPostUserAccountType] = useState();
  const [postsListLikeID, setPostsListLikeID] = useState([]);
  const [dailyLimitEarningPoint, setDailyLimitEarningPoint] = useState(0);
  const [
    dailyNormalLimitEarningPoint,
    setDailyNormalLimitEarningPoint,
  ] = useState(0);
  const [dailyVIPLimitEarningPoint, setDailyVIPLimitEarningPoint] = useState(0);
  const [dailyVVIPLimitEarningPoint, setDailyVVIPLimitEarningPoint] = useState(
    0
  );
  const [earningPerPostOwner, setEarningPerPostOwner] = useState(0);
  const [earningPerPostViewer, setEarningPerPostViewer] = useState(0);

  //const [postsListLikeStatus, setPostsListLikeStatus] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [change, setChange] = useState(false);

  const last24hour = new Date().getTime() - 24 * 3600 * 1000;

  /*function onRefresh() {
    setIsFetching(true);
    if (isFetching === true) {
      forumPosts();
    }
  }*/

  //const isInitialMount = useRef(true);
  useEffect(() => {
    userDetails();
  }, []);

  useEffect(() => {
    forumPosts();
  }, [change]);

  /*const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      //DisplayChats();
    } else {
      didMountRef.current = true;
      forumPosts();
    }
  });*/

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
        if (
          snapshot.hasChild("earning_per_postlike_owner") &&
          snapshot.child("earning_per_postlike_owner").exists
        ) {
          setEarningPerPostOwner(
            snapshot.child("earning_per_postlike_owner").val()
          );
        } else {
          setEarningPerPostOwner(0);
        }
        if (
          snapshot.hasChild("earning_per_postlike_viewer") &&
          snapshot.child("earning_per_postlike_viewer").exists
        ) {
          setEarningPerPostViewer(
            snapshot.child("earning_per_postlike_viewer").val()
          );
        } else {
          setEarningPerPostViewer(0);
        }
      });
  };

  const userDetails = () => {
    firebase
      .database()
      .ref(`/Users/${uid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("image") && snapshot.child("image").exists) {
          setUserImage(snapshot.child("image").val());
        } else {
          setUserImage(placeholderUserImage);
        }
      });
  };

  function PostUserName(guid) {
    var name;
    firebase
      .database()
      .ref(`/Users/${guid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("name") && snapshot.child("name").exists) {
          name = snapshot.child("name").val();
        } else {
          name = "";
        }
      });

    return name;
  }

  function PostUserAccountType(uid) {
    var type;
    firebase
      .database()
      .ref(`/Users/${uid}`)
      .on("value", (snapshot) => {
        if (
          snapshot.hasChild("account_type") &&
          snapshot.child("account_type").exists
        ) {
          type = snapshot.child("account_type").val();
        } else {
          type = "";
        }
      });

    return type;
  }

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
    setChange(true);
    return image;
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    forumPosts();
  };

  const ManageLikes = (POSTID, USERID) => {
    firebase
      .database()
      .ref("Forum Post Likes")
      .orderByChild("userid_postid")
      .equalTo(uid + POSTID)
      .once("value")
      .then(function (snapshot) {
        if (snapshot.exists()) {
          DeletePostLike(POSTID, USERID);
        } else {
          AddPostLike(POSTID, USERID);
        }
      });

    //  forumPosts();
  };

  const AddPostLike = (POSTID, USERID) => {
    const likeid = firebase.database().ref("/Forum Post Likes").push().key;
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;

    firebase
      .database()
      .ref("Forum Post Likes")
      .child(likeid)
      .update({
        likeid: likeid,
        postid: POSTID,
        userid_likeid: uid + likeid,
        userid_postid: uid + POSTID,
        timestamp: timestamp,
      })
      .then(() => {
        //AddPostOwnerEarning(POSTID, USERID);
        AddPostEarning(POSTID, USERID);
        forumPosts();
      });
  };

  const AddPostEarning = (POSTID, USERID) => {
    // inserting the post earning
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
              if (total <= dailyNormalLimitEarningPoint && uat === "normal") {
                // Add Earning
                var i = 1;
                while (i <= earningPerPostViewer) {
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
                  i++;
                }
                // /Add Earning
              }
              if (total <= dailyVIPLimitEarningPoint && uat == "vip") {
                // Add Earning
                var i = 1;
                while (i <= earningPerPostViewer) {
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
                  i++;
                }
                // /Add Earning
              }

              if (total <= dailyVVIPLimitEarningPoint && uat == "vvip") {
                // Add Earning
                var i = 1;
                while (i <= earningPerPostViewer) {
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
                  i++;
                }
                // /Add Earning
              }
              if (
                total <= dailyLimitEarningPoint &&
                uat != "normal" &&
                uat != "vip" &&
                uat != "vvip"
              ) {
                // Add Earning
                var i = 1;
                while (i <= earningPerPostViewer) {
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
                  i++;
                }
                // /Add Earning
              }
            } else {
              // add earning
              /* var i = 1;
              while (i <= earningPerPostViewer) {
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
                i++;
              }*/
            }
          });
      });
    // /inserting the post earning
  };
  const AddPostOwnerEarning = (POSTID, USERID) => {
    // inserting the post earning
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
          .equalTo(USERID)
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
                var i = 1;
                while (i <= earningPerPostOwner) {
                  firebase
                    .database()
                    .ref("Forum Post Earnings")
                    .child(earningid)
                    .update({
                      earningid: earningid,
                      userid: USERID,
                      postid: POSTID,
                      userid_earningid: USERID + earningid,
                      userid_postid: USERID + POSTID,
                      timestamp: timestamp,
                    });
                  i++;
                }
                // /Add Earning
              }
              if (total <= dailyVIPLimitEarningPoint && uat == "vip") {
                // Add Earning
                var i = 1;
                while (i <= earningPerPostOwner) {
                  firebase
                    .database()
                    .ref("Forum Post Earnings")
                    .child(earningid)
                    .update({
                      earningid: earningid,
                      userid: USERID,
                      postid: POSTID,
                      userid_earningid: USERID + earningid,
                      userid_postid: USERID + POSTID,
                      timestamp: timestamp,
                    });
                  i++;
                }
                // /Add Earning
              }
              if (total <= dailyVVIPLimitEarningPoint && uat == "vvip") {
                // Add Earning
                var i = 1;
                while (i <= earningPerPostOwner) {
                  firebase
                    .database()
                    .ref("Forum Post Earnings")
                    .child(earningid)
                    .update({
                      earningid: earningid,
                      userid: USERID,
                      postid: POSTID,
                      userid_earningid: USERID + earningid,
                      userid_postid: USERID + POSTID,
                      timestamp: timestamp,
                    });
                  i++;
                }
                // /Add Earning
              }
              if (
                (total <= dailyLimitEarningPoint && uat != "normal") ||
                uat != "vip" ||
                uat != "vvip"
              ) {
                // Add Earning
                var i = 1;
                while (i <= earningPerPostOwner) {
                  firebase
                    .database()
                    .ref("Forum Post Earnings")
                    .child(earningid)
                    .update({
                      earningid: earningid,
                      userid: USERID,
                      postid: POSTID,
                      userid_earningid: USERID + earningid,
                      userid_postid: USERID + POSTID,
                      timestamp: timestamp,
                    });
                  i++;
                }
                // /Add Earning
              }
            } else {
              // add earning
              var i = 1;
              while (i <= earningPerPostOwner) {
                firebase
                  .database()
                  .ref("Forum Post Earnings")
                  .child(earningid)
                  .update({
                    earningid: earningid,
                    userid: USERID,
                    postid: POSTID,
                    userid_earningid: USERID + earningid,
                    userid_postid: USERID + POSTID,
                    timestamp: timestamp,
                  });
                i++;
              }
            }
          });
      });
    // /inserting the post earning
  };

  const DeletePostLike = (POSTID, USERID) => {
    firebase
      .database()
      .ref("Forum Post Likes")
      .orderByChild("userid_postid")
      .equalTo(uid + POSTID)
      .once("value")
      .then(function (snapshot) {
        snapshot.forEach((child) => {
          child.ref.set(null);
        });
        DeletePostOwnerEarning(POSTID, USERID);
        DeletePostEarning(POSTID);
      });
  };
  const DeletePostEarning = (POSTID, USERID) => {
    var i = 1;
    while (i <= earningPerPostViewer) {
      firebase
        .database()
        .ref("Forum Post Earnings")
        .orderByChild("userid_postid")
        .equalTo(uid + POSTID)
        .once("value")
        .then(function (snapshot) {
          snapshot.forEach((child) => {
            child.ref.set(null);
          });
          forumPosts();
        });
      i++;
    }
  };

  const DeletePostOwnerEarning = (POSTID, USERID) => {
    var i = 1;
    while (i <= earningPerPostOwner) {
      firebase
        .database()
        .ref("Forum Post Earnings")
        .orderByChild("userid_postid")
        .equalTo(USERID + POSTID)
        .once("value")
        .then(function (snapshot) {
          snapshot.forEach((child) => {
            child.ref.set(null);
          });
          //forumPosts();
        });
      i++;
    }
  };

  function TimeAgo(time) {
    return (
      new Date(time).toDateString() + ", " + new Date(time).toLocaleTimeString()
    );
  }

  function CalculateLikes(POSTID) {
    var count;
    firebase
      .database()
      .ref(`Forum Post Likes/`)
      .orderByChild("userid_postid")
      .equalTo(uid + POSTID)
      .on("value", (snapshot) => {
        if (snapshot.exists()) {
          count = snapshot.numChildren().toString();
        } else {
          count = 0;
        }
      });

    if (count == 1) {
      count = count + " like";
    } else if (count > 1) {
      count = count + " likes";
    } else {
      count = "No likes";
    }
    return count;
  }

  function likeChecker(POSTID) {
    var status;
    firebase
      .database()
      .ref(`Forum Post Likes/`)
      .orderByChild("userid_postid")
      .equalTo(uid + POSTID)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          status = "true";
        } else {
          status = "false";
        }
      });
    return status;
  }

  const forumPosts = () => {
    // posts
    firebase
      .database()
      .ref(`/Forum Posts/`)
      .on("value", (snapshot) => {
        var li = [];

        snapshot.forEach((child) => {
          var bpostid = child.child("postid").val();
          var buserid = child.child("userid").val();
          /*var lstate;
          var lcounts;
          
          if(likeChecker(bpostid) == "true"){
            lcounts = "true"
          }*/

          li.push({
            key: child.key,
            body: child.val().body,
            image: child.val().image,
            ads: child.val().adsState,
            postid: child.val().postid,
            status: child.val().status,
            timestamp: child.val().timestamp,
            userid: child.val().userid,
            userid_postid: child.val().userid_postid,
            likestatus: likeChecker(bpostid),
            likecount: CalculateLikes(bpostid),
            userimage: PostUserImage(buserid),
          });
        });
        setPosts(li.reverse());
      });

    setIsRefreshing(false);
  };

  const handleNavigation = (postid, userid) => {
    navigation.navigate(routes.FORUMPOSTVIEW, {
      ref_postid: postid,
      ref_postuid: userid,
    });
    //AddPostEarning(postid, uid);
  };

  return (
    <Screen>
      <View style={{ backgroundColor: colors.light }}>
        <FlatList
          style={{ marginTop: Platform.OS === "android" ? -30 : 0 }}
          ListHeaderComponent={
            <>
              <View
                style={{
                  backgroundColor: colors.white,
                }}
              >
                <AddStoryCard
                  userimage={userimage}
                  style={{
                    marginLeft: 6,
                  }}
                  onPress={() =>
                    navigation.navigate(routes.FORUMADDPOST, {
                      visible: "false",
                    })
                  }
                />
              </View>
              <Divider />
            </>
          }
          showsVerticalScrollIndicator={false}
          initialNumToRender={20}
          keyExtractor={(item) => item.key.toString()}
          stickySectionHeadersEnabled={false}
          data={posts}
          renderItem={({ item }) => (
            <View>
              {item.ads == "true" ? (
                <View
                  style={{
                    backgroundColor: colors.white,
                    padding: 10,
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "flex-start",
                      color: colors.primary,
                      fontWeight: "bold",
                    }}
                  >
                    Promoted Post
                  </Text>
                </View>
              ) : null}

              <FeedComponent
                useraccounttype={PostUserAccountType(item.userid)}
                userimage={{
                  uri: item.userimage,
                }}
                username={PostUserName(item.userid)}
                postdate={TimeAgo(item.timestamp)}
                postlike={item.likecount}
                postimage={item.image && item.image}
                postimagePress={() =>
                  navigation.navigate(routes.FORUMPOSTVIEW, {
                    ref_postid: item.postid,
                    ref_postuid: item.userid,
                  })
                }
                postbodyPress={() => handleNavigation(item.postid, item.userid)}
                likestatus={item.likestatus}
                visible={item.image == null ? true : false}
                navigation={navigation}
                postbody={item.body}
                onLikePress={() => {
                  //setSelectedId(item.postid);
                  //if (item.postid === selectedId && selectedId != null) {
                  ManageLikes(item.postid, item.userid);
                  //CalculateLikes(item.postid);
                  // }
                }}
                onCommentPress={() =>
                  navigation.navigate(routes.FORUMPOSTVIEW, {
                    ref_postid: item.postid,
                    ref_postuid: item.userid,
                  })
                }
                onProfilePress={() => {
                  navigation.navigate(routes.USERVIEWPROFILE, {
                    ref_uid: item.userid,
                  });
                }}
              />
            </View>
          )}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          extraData={posts}
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate(routes.STORIESADDTEXT)}
        style={[
          styles.fabStyle,
          { marginBottom: 80, width: 50, height: 50, marginRight: 5 },
        ]}
      >
        <MaterialCommunityIcons
          name="circle-edit-outline"
          size={25}
          color={colors.white}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(routes.STORIESADDIMAGE)}
        style={styles.fabStyle}
      >
        <MaterialCommunityIcons
          name="camera-enhance"
          size={25}
          color={colors.white}
        />
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
  fabStyle: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: colors.primary,
    borderRadius: 100,
    elevation: 5,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default ForumPostScreen;
