import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { EU } from "react-native-mentions-editor";
import { Image } from "react-native-expo-image-cache";
import { Card, CardItem, Thumbnail, Body, Left, Button } from "native-base";
import colors from "../constants/colors";
import HyperLink from "react-native-hyperlink";
import routes from "../navigation/routes";
import RNUrlPreview from "react-native-url-preview";
import PreviewLink from "./PreviewLink";

function FeedComponent({
  navigation,
  username,
  userimage,
  useraccounttype,
  postdate,
  postimage,
  postlike,
  postid,
  postbody,
  likestatus,
  visible = true,
  onLikePress,
  onProfilePress,
  onCommentPress,
  onDeletePress,
  onEditPress,
  postimagePress,
  postbodyPress,
  postactions = true,
  editStatus = false,
  deletePost = false,
}) {
  const formatMentionNode = (txt, key) => (
    <Text key={key} style={styles.mention}>
      {txt}
    </Text>
  );

  return (
    <Card
      style={{
        padding: 10,
        borderColor: "#fff",
      }}
    >
      <TouchableOpacity onPress={onProfilePress}>
        <CardItem style={{ marginTop: -10 }}>
          <Left style={{ marginLeft: -12 }}>
            <Thumbnail source={userimage} />

            <Body>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text numberOfLines={1} ellipsizeMode="tail">
                  {username}{" "}
                </Text>
                {useraccounttype === "normal" ? (
                  <MaterialIcons
                    name="stars"
                    size={16}
                    color={colors.primary}
                  />
                ) : null}
                {useraccounttype === "vip" ? (
                  <Octicons name="verified" size={16} color={colors.primary} />
                ) : null}
                {useraccounttype === "vvip" ? (
                  <MaterialIcons
                    name="verified-user"
                    size={16}
                    color={colors.primary}
                  />
                ) : null}
              </View>
              <Text note>{postdate}</Text>
            </Body>
          </Left>
        </CardItem>
      </TouchableOpacity>
      <TouchableOpacity onPress={postimagePress}>
        <CardItem cardBody style={{ margin: 5 }}>
          {!visible && (
            <Image
              uri={postimage}
              style={{
                borderColor: "#fff",
                height: 200,
                width: null,
                flex: 1,
                borderRadius: 10,
              }}
            />
          )}
        </CardItem>
      </TouchableOpacity>
      <CardItem style={{ marginLeft: -5 }}>
        <TouchableOpacity onPress={postbodyPress}>
          <PreviewLink text={postbody} />
          <Body>
            <HyperLink
              linkStyle={{ color: "#2980b9" }}
              onLongPress={(url, text) =>
                navigation.navigate(routes.LOCALBROWSER, {
                  url: url,
                  text: text,
                })
              }
              linkDefault={true}
            >
              <Text style={{ lineHeight: 22 }}>{postbody}</Text>
            </HyperLink>
          </Body>
        </TouchableOpacity>
      </CardItem>
      {postactions === true ? (
        <CardItem style={{ height: 45, marginLeft: -6 }}>
          <Left>
            <Button transparent onPress={onLikePress}>
              {likestatus == "true" ? (
                <MaterialCommunityIcons
                  name="heart"
                  style={{ color: colors.primary, fontSize: 28 }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="heart-outline"
                  style={{ color: colors.primary, fontSize: 28 }}
                />
              )}
            </Button>
            <Button transparent onPress={onCommentPress}>
              <MaterialCommunityIcons
                name="comment-text-outline"
                size={28}
                color={colors.primary}
              />
            </Button>
            {editStatus === true ? (
              <Button transparent onPress={onEditPress}>
                <MaterialCommunityIcons
                  name="circle-edit-outline"
                  size={28}
                  color={colors.primary}
                />
              </Button>
            ) : null}
            {deletePost === true ? (
              <Button transparent onPress={onDeletePress}>
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={28}
                  color={colors.primary}
                />
              </Button>
            ) : null}
            {/*<Button transparent>
            <MaterialCommunityIcons
              name="share-outline"
              size={28}
              color={colors.primary}
            />
          </Button>*/}
          </Left>
        </CardItem>
      ) : null}
      <CardItem
        style={{
          marginBottom: -12,
          marginTop: -12,
          marginLeft: -5,
        }}
      >
        <Text style={{ fontWeight: "600", color: colors.dark }}>
          {postlike}
        </Text>
      </CardItem>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mention: {
    fontSize: 16,
    fontWeight: "400",
    backgroundColor: "rgba(36, 77, 201, 0.05)",
    color: "#244dc9",
  },
});

export default FeedComponent;
