import React from "react";
import {
  TouchableOpacity,
  View,
  StatusBar,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import { FontAwesome as Icon } from "@expo/vector-icons";
import colors from "../../constants/colors";
import routes from "../../navigation/routes";

const styles = StyleSheet.create({
  /* ============= MODAL STYLES ============= */
  modalMainContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0)",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalInnerContainer: {
    backgroundColor: colors.tabPageBackground,
    borderRadius: 20,
    elevation: 3,
    overflow: "hidden",
  },
  modalUsernameContainer: {
    position: "absolute",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#5557",
    width: "100%",
    alignItems: "center",
  },
  modalUsernameStyle: {
    color: "white",
    backgroundColor: "transparent",
  },
  modalImageStyle: {
    width: 200,
    height: 200,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  modalOptionsContainer: {
    backgroundColor: colors.tabPageBackground,
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  modalIconContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

const { modalIconContainer } = styles;

function MiniProfile({
  bio,
  isBlocked,
  isMuted,
  navigation,
  imageSrc,
  username,
  hide,
}) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => hide()}
      style={styles.modalMainContainer}
    >
      <View style={styles.modalInnerContainer}>
        <StatusBar backgroundColor="rgba(0,0,0,0.1)" barStyle="dark-content" />
        <TouchableOpacity activeOpacity={1}>
          <Image style={styles.modalImageStyle} source={{ uri: imageSrc }} />
          <View style={styles.modalUsernameContainer}>
            <Text numberOfLines={2} style={styles.modalUsernameStyle}>
              {username}
            </Text>
          </View>
          <View style={styles.modalOptionsContainer}>
            {/* Button: tap it and it opens The message Section with that person */}
            <TouchableOpacity
              onPress={() => {
                hide();
                navigation.navigate("MessagePage", {
                  username: username,
                  bio: bio,
                  imageSrc: imageSrc,
                  isBlocked: isBlocked,
                  isMuted: isMuted,
                });
              }}
              style={modalIconContainer}
            >
              {/* <Icon name="align-left" size={25} color={colors.primary} /> */}
            </TouchableOpacity>
            {/* Button: tap on it and it will call the selected individual */}
            <TouchableOpacity
              /*onPress={() => {
                hide();
                navigation.navigate(routes.ONETOONECHAT, {
                  username: username,
                  imageSrc: imageSrc,
                });
              }}*/
              style={modalIconContainer}
            >
              <Icon name="info-circle" size={25} color={colors.primary} />
            </TouchableOpacity>
            {/* Button: tap on it and it will open the selectd contact info */}
            <TouchableOpacity
              style={modalIconContainer}
              onPress={() => {
                hide();
                navigation.navigate("FriendsProfilePage", {
                  username: username,
                  bio: bio,
                  imageSrc: imageSrc,
                  isBlocked: isBlocked,
                  isMuted: isMuted,
                });
              }}
            >
              {/* <Icon name="info-circle" size={25} color={colors.primary} /> */}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default MiniProfile;
