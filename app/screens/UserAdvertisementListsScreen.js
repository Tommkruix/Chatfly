import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  Platform,
} from "react-native";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import Firebase from "firebase";

import FeedComponent from "../components/FeedComponent";
import Screen from "../components/Screen";
import AddStoryCard from "../components/storiesComponents/AddStoryCard";
import routes from "../navigation/routes";
import Divider from "../components/lists/Divider";
import colors from "../constants/colors";
import firebase from "../config/init";
import ScreenHeader from "../components/ScreenHeader";

function UserAdvertisementListsScreen({ navigation }) {
  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";
  const uid = firebase.auth().currentUser.uid;
  const now = new Date().getTime();

  const [userimage, setUserImage] = useState();
  const [username, setUserName] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    forumPosts();
  }, []);

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

    return image;
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    forumPosts();
  };

  const ManageLikes = (POSTID) => {
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;
    firebase
      .database()
      .ref("Forum Post Likes")
      .orderByChild("userid_postid")
      .equalTo(uid + POSTID)
      .once("value")
      .then(function (snapshot) {
        if (snapshot.exists()) {
          DeletePostLike(POSTID);
          CalculateLikes(POSTID);
        } else {
          AddPostLike(POSTID);
          CalculateLikes(POSTID);
        }
      });
    forumPosts();
  };

  const AddPostLike = (POSTID) => {
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
      });

    AddPostEarning(POSTID);
  };

  const AddPostEarning = (POSTID) => {
    const earningid = firebase.database().ref("/Forum Post Earnings").push()
      .key;
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;

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
  };

  const DeletePostLike = (POSTID) => {
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
      });
    DeletePostEarning(POSTID);
  };
  const DeletePostEarning = (POSTID) => {
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
      });
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
      .orderByChild("postid")
      .equalTo(POSTID)
      .on("value", (snapshot) => {
        count = snapshot.numChildren().toString();
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
    //console.log(POSTID);

    var status;
    firebase
      .database()
      .ref(`Forum Post Likes/`)
      .orderByChild("userid_postid")
      .equalTo(uid + POSTID)
      .on("value", (snapshot) => {
        if (snapshot.exists()) {
          status = "true";
        } else {
          status = "false";
        }
      });

    return status;
  }

  const forumPosts = () => {
    firebase
      .database()
      .ref(`/Forum Posts/`)
      .orderByChild("userid")
      .equalTo(uid)
      .on("value", (snapshot) => {
        var li = [];
        var adsState;

        snapshot.forEach((child) => {
          const adsDuration = child.child("adsDuration").val();
          if (child.child("adsState").val() === "true") {
            adsState = "true";
          } else {
            adsState = "false";
          }

          if (adsState === "true") {
            li.push({
              key: child.key,
              body: child.val().body,
              image: child.val().image,
              ads: adsState,
              adsDuration: adsDuration,
              postid: child.val().postid,
              status: child.val().status,
              timestamp: child.val().timestamp,
              userid: child.val().userid,
              userid_postid: child.val().userid_postid,
            });
          }
        });
        setPosts(li.reverse());
      });
    setIsRefreshing(false);
  };

  function TimeAgo(time) {
    return (
      new Date(time).toDateString() + ", " + new Date(time).toLocaleTimeString()
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader headerName="Your Advertisements" navigation={navigation} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={posts}
        keyExtractor={(post) => post.key.toString()}
        renderItem={({ item }) => (
          <View>
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
                {item.adsDuration >= now ? (
                  <Text>Expired on: {TimeAgo(item.adsDuration)}</Text>
                ) : (
                  <Text> Ending in: {TimeAgo(item.adsDuration)}</Text>
                )}
              </Text>
            </View>
            <FeedComponent
              useraccounttype={PostUserAccountType(item.userid)}
              userimage={{
                uri: PostUserImage(item.userid),
              }}
              username={PostUserName(item.userid)}
              postdate={TimeAgo(item.timestamp)}
              postlike={CalculateLikes(item.postid)}
              postimage={item.image && item.image}
              postimagePress={() =>
                navigation.navigate(routes.FORUMPOSTVIEW, {
                  ref_postid: item.postid,
                  ref_postuid: item.userid,
                })
              }
              postbodyPress={() =>
                navigation.navigate(routes.FORUMPOSTVIEW, {
                  ref_postid: item.postid,
                  ref_postuid: item.userid,
                })
              }
              likestatus={likeChecker(item.postid)}
              visible={item.image == null ? true : false}
              postbody={item.body}
              onLikePress={() => {
                setSelectedId(item.postid);
                //if (item.postid === selectedId && selectedId != null) {
                ManageLikes(item.postid);
                CalculateLikes(item.postid);
                // }
              }}
              onCommentPress={() =>
                navigation.navigate(routes.FORUMPOSTVIEW, {
                  ref_postid: item.postid,
                  ref_postuid: item.userid,
                })
              }
            />
          </View>
        )}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        extraData={posts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default UserAdvertisementListsScreen;
