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

function UserAdvertisementsScreen({ navigation }) {
  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";
  const uid = firebase.auth().currentUser.uid;
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
          if (child.child("adsState").val() === "true") {
            adsState = "true";
          } else {
            adsState = "false";
          }

          li.push({
            key: child.key,
            body: child.val().body,
            image: child.val().image,
            ads: adsState,
            postid: child.val().postid,
            status: child.val().status,
            timestamp: child.val().timestamp,
            userid: child.val().userid,
            userid_postid: child.val().userid_postid,
          });
        });
        setPosts(li.reverse());
      });
    setIsRefreshing(false);
  };

  const SearchPosts = (value) => {
    const filteredContacts = inMemoryContact.filter((contact) => {
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

  return (
    <View style={styles.container}>
      <ScreenHeader navigation={navigation} headerName="Promote a post" />

      <FlatList
        /* ListHeaderComponent={
          <View style={styles.searchContainer}>
            <View style={styles.searchRow}>
              <MaterialIcons size={20} name="search" color={colors.primary} />
              <TextInput
                maxLength={10}
                placeholder="Search"
                placeholderTextColor={colors.dark}
                style={styles.searchInputStyle}
                onChangeText={(value) => SearchPosts(value)}
              />
            </View>
          </View>
        }*/
        showsVerticalScrollIndicator={false}
        data={posts}
        keyExtractor={(post) => post.key.toString()}
        renderItem={({ item }) => {
          if (item.ads === "true") {
            return (
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
                    Promoted Post
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
                    navigation.navigate(routes.USERADVERTISEMENTACTIONS, {
                      ref_postid: item.postid,
                    })
                  }
                  postbodyPress={() =>
                    navigation.navigate(routes.USERADVERTISEMENTACTIONS, {
                      ref_postid: item.postid,
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
                    navigation.navigate(routes.USERADVERTISEMENTACTIONS, {
                      ref_postid: item.postid,
                    })
                  }
                />
              </View>
            );
          }
          if (item.ads === "false") {
            return (
              <FeedComponent
                useraccounttype={PostUserAccountType(item.userid)}
                userimage={{
                  uri: PostUserImage(item.userid),
                }}
                username={PostUserName(item.userid)}
                postdate={TimeAgo(item.timestamp)}
                postlike={CalculateLikes(item.postid)}
                postimage={item.image && item.image}
                navigation={navigation}
                postimagePress={() =>
                  navigation.navigate(routes.USERADVERTISEMENTACTIONS, {
                    ref_postid: item.postid,
                  })
                }
                postbodyPress={() =>
                  navigation.navigate(routes.USERADVERTISEMENTACTIONS, {
                    ref_postid: item.postid,
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
                  navigation.navigate(routes.USERADVERTISEMENTACTIONS, {
                    ref_postid: item.postid,
                  })
                }
              />
            );
          }
        }}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        extraData={posts}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate(routes.USERADVERTISEMENTLISTS)}
        style={styles.fabStyle}
      >
        <MaterialCommunityIcons
          name="chart-tree"
          size={30}
          color={colors.white}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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

export default UserAdvertisementsScreen;
