import React, { useState, useEffect } from "react";
import { ScrollView, FlatList, Text } from "react-native";
import StoryItem from "./StoryItem";
import AddStoryCard from "./AddStoryCard";
import routes from "../../navigation/routes";
import firebase from "../../config/init";

function Stories({ navigation }) {
  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";
  const uid = firebase.auth().currentUser.uid;
  const [userimage, setUserImage] = useState();
  const [username, setUserName] = useState();
  const [posts, setPosts] = useState([]);
  const [currentuserStatusImages, setCurrentuserStatusImages] = useState([]);
  const [currentuserStatusTimestamp, setCurrentuserStatusTimestamp] = useState(
    []
  );
  const [currentuserStatusPostID, setCurrentuserStatusPostID] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const now = new Date().getTime();
  const last24hour = new Date().getTime() - 24 * 3600 * 1000;

  useEffect(() => {
    userDetails();
  }, []);

  useEffect(() => {
    forumPosts();
  }, []);

  /*const handleRefresh = () => {
    setIsRefreshing(true);
    forumPosts();
  };*/

  const forumPosts = () => {
    var query = firebase
      .database()
      .ref(`Users/${uid}/Contacts`)
      .orderByChild("status")
      .equalTo("unblock");

    query.once("value").then(function (snapshot) {
      var li = [];
      snapshot.forEach(function (childSnapshot) {
        var usersID = childSnapshot.key;
        // checking forum list
        //var imagePU = PostUserImage(usersID);
        var image = PostUserImage(usersID);
        var name = PostUserName(usersID);
        firebase
          .database()
          .ref(`Forum Posts/`)
          .orderByChild("userid")
          .equalTo(usersID)
          .on("value", (snapshot) => {
            snapshot.forEach((child) => {
              if (
                child.val().userid == uid &&
                child.val().timestamp >= last24hour
              ) {
                currentuserStatusImages.push(child.val().image);
                currentuserStatusTimestamp.push(child.val().timestamp);
                currentuserStatusPostID.push(child.val().postid);
              }
              if (
                child.val().userid != uid &&
                child.val().timestamp >= last24hour
              ) {
                li.push({
                  key: child.key,
                  body: child.val().body,
                  image: child.val().image,
                  postid: child.val().postid,
                  status: child.val().status,
                  timestamp: child.val().timestamp,
                  userid: child.val().userid,
                  userid_postid: child.val().userid_postid,
                  username: name,
                  userimage: image,
                });
              }
            });
          });
        // / checking forum list

        setIsRefreshing(false);
        setPosts(li.reverse());
        // Cancel enumeration
      });
    });
    return true;
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
        if (snapshot.hasChild("name") && snapshot.child("name").exists) {
          setUserName(snapshot.child("name").val());
        } else {
          setUserName("No name");
        }
      });
  };

  function PostUserName(puid) {
    var name;
    firebase
      .database()
      .ref(`/Users/${puid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("name") && snapshot.child("name").exists) {
          name = snapshot.child("name").val();
        } else {
          name = "No name";
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

  function PostUserImage(puid) {
    var image;
    firebase
      .database()
      .ref(`/Users/${puid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("image") && snapshot.child("image").exists) {
          image = snapshot.child("image").val();
        } else {
          image = placeholderUserImage;
        }
      });

    return image;
  }

  const SortingUserImages = () => {
    var array = currentuserStatusImages;
    var outputArray = [];
    var count = 0;

    // Start variable is used to set true
    // if a repeated duplicate value is
    // encontered in the output array.
    var start = false;

    for (var j = 0; j < array.length; j++) {
      for (var k = 0; k < outputArray.length; k++) {
        if (array[j] == outputArray[k]) {
          start = true;
        }
      }
      count++;
      if (count == 1 && start == false) {
        outputArray.push(array[j]);
      }
      start = false;
      count = 0;
    }

    return outputArray;
  };

  const r = () => {
    var data = SortingUserImages();
    data = data.filter(function (element) {
      return element !== undefined;
    });

    return data;
  };

  const DisplayCurrentUserStatuses = () => {
    if (r().length == 0) {
      return (
        <StoryItem
          otherStyles={{ marginTop: 20 }}
          imageSrc={
            userimage
            //item.userimage
          }
          username={
            //item.username
            username
          }
          //body={item.body}
          postid={currentuserStatusPostID[currentuserStatusPostID.length - 1]}
          uid={uid}
          time={
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toDateString() +
            ", " +
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toLocaleTimeString()
          }
          stories={[
            {
              time: null,
              url: null,
            },
          ]}
          navigation={navigation}
        />
      );
    } else if (r().length == 1) {
      return (
        <StoryItem
          otherStyles={{ marginTop: 20 }}
          imageSrc={
            userimage
            //item.userimage
          }
          username={
            //item.username
            username
          }
          //body={item.body}
          //postid={item.postid}
          uid={uid}
          time={
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toDateString() +
            ", " +
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toLocaleTimeString()
          }
          stories={[
            {
              time:
                new Date(currentuserStatusTimestamp[0]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[0]).toLocaleTimeString(),
              url: r()[0],
            },
          ]}
          navigation={navigation}
        />
      );
    } else if (r().length == 2) {
      return (
        <StoryItem
          otherStyles={{ marginTop: 20 }}
          imageSrc={
            userimage
            //item.userimage
          }
          username={
            //item.username
            username
          }
          //body={item.body}
          //postid={item.postid}
          uid={uid}
          time={
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toDateString() +
            ", " +
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toLocaleTimeString()
          }
          stories={[
            {
              time:
                new Date(currentuserStatusTimestamp[0]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[0]).toLocaleTimeString(),
              url: r()[0],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[1]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[1]).toLocaleTimeString(),
              url: r()[1],
            },
          ]}
          navigation={navigation}
        />
      );
    } else if (r().length == 3) {
      return (
        <StoryItem
          otherStyles={{ marginTop: 20 }}
          imageSrc={
            userimage
            //item.userimage
          }
          username={
            //item.username
            username
          }
          //body={item.body}
          //postid={item.postid}
          uid={uid}
          time={
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toDateString() +
            ", " +
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toLocaleTimeString()
          }
          stories={[
            {
              time:
                new Date(currentuserStatusTimestamp[0]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[0]).toLocaleTimeString(),
              url: r()[0],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[1]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[1]).toLocaleTimeString(),
              url: r()[1],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[2]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[2]).toLocaleTimeString(),
              url: r()[2],
            },
          ]}
          navigation={navigation}
        />
      );
    } else if (r().length == 4) {
      return (
        <StoryItem
          otherStyles={{ marginTop: 20 }}
          imageSrc={
            userimage
            //item.userimage
          }
          username={
            //item.username
            username
          }
          //body={item.body}
          //postid={item.postid}
          uid={uid}
          time={
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toDateString() +
            ", " +
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toLocaleTimeString()
          }
          stories={[
            {
              time:
                new Date(currentuserStatusTimestamp[0]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[0]).toLocaleTimeString(),
              url: r()[0],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[1]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[1]).toLocaleTimeString(),
              url: r()[1],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[2]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[2]).toLocaleTimeString(),
              url: r()[2],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[3]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[3]).toLocaleTimeString(),
              url: r()[3],
            },
          ]}
          navigation={navigation}
        />
      );
    } else if (r().length == 5) {
      return (
        <StoryItem
          otherStyles={{ marginTop: 20 }}
          imageSrc={
            userimage
            //item.userimage
          }
          username={
            //item.username
            username
          }
          //body={item.body}
          //postid={item.postid}
          uid={uid}
          time={
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toDateString() +
            ", " +
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toLocaleTimeString()
          }
          stories={[
            {
              time:
                new Date(currentuserStatusTimestamp[0]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[0]).toLocaleTimeString(),
              url: r()[0],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[1]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[1]).toLocaleTimeString(),
              url: r()[1],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[2]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[2]).toLocaleTimeString(),
              url: r()[2],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[3]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[3]).toLocaleTimeString(),
              url: r()[3],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[4]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[4]).toLocaleTimeString(),
              url: r()[4],
            },
          ]}
          navigation={navigation}
        />
      );
    } else if (r().length == 6) {
      return (
        <StoryItem
          otherStyles={{ marginTop: 20 }}
          imageSrc={
            userimage
            //item.userimage
          }
          username={
            //item.username
            username
          }
          //body={item.body}
          //postid={item.postid}
          uid={uid}
          time={
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toDateString() +
            ", " +
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toLocaleTimeString()
          }
          stories={[
            {
              time:
                new Date(currentuserStatusTimestamp[0]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[0]).toLocaleTimeString(),
              url: r()[0],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[1]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[1]).toLocaleTimeString(),
              url: r()[1],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[2]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[2]).toLocaleTimeString(),
              url: r()[2],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[3]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[3]).toLocaleTimeString(),
              url: r()[3],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[4]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[4]).toLocaleTimeString(),
              url: r()[4],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[5]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[5]).toLocaleTimeString(),
              url: r()[5],
            },
          ]}
          navigation={navigation}
        />
      );
    } else if (r().length == 7) {
      return (
        <StoryItem
          otherStyles={{ marginTop: 20 }}
          imageSrc={
            userimage
            //item.userimage
          }
          username={
            //item.username
            username
          }
          //body={item.body}
          //postid={item.postid}
          uid={uid}
          time={
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toDateString() +
            ", " +
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toLocaleTimeString()
          }
          stories={[
            {
              time:
                new Date(currentuserStatusTimestamp[0]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[0]).toLocaleTimeString(),
              url: r()[0],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[1]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[1]).toLocaleTimeString(),
              url: r()[1],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[2]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[2]).toLocaleTimeString(),
              url: r()[2],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[3]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[3]).toLocaleTimeString(),
              url: r()[3],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[4]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[4]).toLocaleTimeString(),
              url: r()[4],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[5]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[5]).toLocaleTimeString(),
              url: r()[5],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[6]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[6]).toLocaleTimeString(),
              url: r()[6],
            },
          ]}
          navigation={navigation}
        />
      );
    } else if (r().length == 8) {
      return (
        <StoryItem
          otherStyles={{ marginTop: 20 }}
          imageSrc={
            userimage
            //item.userimage
          }
          username={
            //item.username
            username
          }
          //body={item.body}
          //postid={item.postid}
          uid={uid}
          time={
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toDateString() +
            ", " +
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toLocaleTimeString()
          }
          stories={[
            {
              time:
                new Date(currentuserStatusTimestamp[0]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[0]).toLocaleTimeString(),
              url: r()[0],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[1]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[1]).toLocaleTimeString(),
              url: r()[1],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[2]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[2]).toLocaleTimeString(),
              url: r()[2],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[3]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[3]).toLocaleTimeString(),
              url: r()[3],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[4]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[4]).toLocaleTimeString(),
              url: r()[4],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[5]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[5]).toLocaleTimeString(),
              url: r()[5],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[6]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[6]).toLocaleTimeString(),
              url: r()[6],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[7]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[7]).toLocaleTimeString(),
              url: r()[7],
            },
          ]}
          navigation={navigation}
        />
      );
    } else if (r().length == 9) {
      return (
        <StoryItem
          otherStyles={{ marginTop: 20 }}
          imageSrc={
            userimage
            //item.userimage
          }
          username={
            //item.username
            username
          }
          //body={item.body}
          //postid={item.postid}
          uid={uid}
          time={
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toDateString() +
            ", " +
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toLocaleTimeString()
          }
          stories={[
            {
              time:
                new Date(currentuserStatusTimestamp[0]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[0]).toLocaleTimeString(),
              url: r()[0],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[1]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[1]).toLocaleTimeString(),
              url: r()[1],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[2]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[2]).toLocaleTimeString(),
              url: r()[2],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[3]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[3]).toLocaleTimeString(),
              url: r()[3],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[4]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[4]).toLocaleTimeString(),
              url: r()[4],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[5]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[5]).toLocaleTimeString(),
              url: r()[5],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[6]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[6]).toLocaleTimeString(),
              url: r()[6],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[7]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[7]).toLocaleTimeString(),
              url: r()[7],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[8]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[8]).toLocaleTimeString(),
              url: r()[8],
            },
          ]}
          navigation={navigation}
        />
      );
    } else if (r().length == 10) {
      return (
        <StoryItem
          otherStyles={{ marginTop: 20 }}
          imageSrc={
            userimage
            //item.userimage
          }
          username={
            //item.username
            username
          }
          //body={item.body}
          //postid={item.postid}
          uid={uid}
          time={
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toDateString() +
            ", " +
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toLocaleTimeString()
          }
          stories={[
            {
              time:
                new Date(currentuserStatusTimestamp[0]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[0]).toLocaleTimeString(),
              url: r()[0],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[1]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[1]).toLocaleTimeString(),
              url: r()[1],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[2]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[2]).toLocaleTimeString(),
              url: r()[2],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[3]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[3]).toLocaleTimeString(),
              url: r()[3],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[4]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[4]).toLocaleTimeString(),
              url: r()[4],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[5]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[5]).toLocaleTimeString(),
              url: r()[5],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[6]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[6]).toLocaleTimeString(),
              url: r()[6],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[7]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[7]).toLocaleTimeString(),
              url: r()[7],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[8]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[8]).toLocaleTimeString(),
              url: r()[8],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[9]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[9]).toLocaleTimeString(),
              url: r()[9],
            },
          ]}
          navigation={navigation}
        />
      );
    } else if (r().length == 11) {
      return (
        <StoryItem
          otherStyles={{ marginTop: 20 }}
          imageSrc={
            userimage
            //item.userimage
          }
          username={
            //item.username
            username
          }
          //body={item.body}
          //postid={item.postid}
          uid={uid}
          time={
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toDateString() +
            ", " +
            new Date(
              currentuserStatusTimestamp[currentuserStatusTimestamp.length - 1]
            ).toLocaleTimeString()
          }
          stories={[
            {
              time:
                new Date(currentuserStatusTimestamp[0]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[0]).toLocaleTimeString(),
              url: r()[0],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[1]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[1]).toLocaleTimeString(),
              url: r()[1],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[2]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[2]).toLocaleTimeString(),
              url: r()[2],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[3]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[3]).toLocaleTimeString(),
              url: r()[3],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[4]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[4]).toLocaleTimeString(),
              url: r()[4],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[5]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[5]).toLocaleTimeString(),
              url: r()[5],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[6]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[6]).toLocaleTimeString(),
              url: r()[6],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[7]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[7]).toLocaleTimeString(),
              url: r()[7],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[8]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[8]).toLocaleTimeString(),
              url: r()[8],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[9]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[9]).toLocaleTimeString(),
              url: r()[9],
            },
            {
              time:
                new Date(currentuserStatusTimestamp[10]).toDateString() +
                ", " +
                new Date(currentuserStatusTimestamp[10]).toLocaleTimeString(),
              url: r()[10],
            },
          ]}
          navigation={navigation}
        />
      );
    }
  };

  return (
    <FlatList
      contentContainerStyle={{ paddingTop: 0 }}
      ListHeaderComponent={
        currentuserStatusImages === undefined ||
        currentuserStatusImages.length == 0 ? (
          <AddStoryCard
            userimage={userimage}
            onPress={() =>
              navigation.navigate(routes.STORIESADDTEXT, {
                visible: "false",
              })
            }
          />
        ) : (
          DisplayCurrentUserStatuses()
        )
      }
      showsVerticalScrollIndicator={false}
      data={posts}
      bounces={true}
      keyExtractor={(post) => post.key.toString()}
      renderItem={({ item }) => (
        <StoryItem
          imageSrc={
            PostUserImage(item.userid)
            //item.userimage
          }
          username={
            //item.username
            PostUserName(item.userid)
          }
          body={item.body}
          postid={item.postid}
          uid={item.userid}
          time={
            new Date(item.timestamp).toDateString() +
            ", " +
            new Date(item.timestamp).toLocaleTimeString()
          }
          /*stories={[
            {
              time: "3 Hours ago",
              url:
                "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            },
          ]}*/
          stories={[
            {
              time:
                new Date(item.timestamp).toDateString() +
                ", " +
                new Date(item.timestamp).toLocaleTimeString(),
              url: item.image,
            },
          ]}
          navigation={navigation}
        />
      )}
    />
  );
}

export default Stories;
