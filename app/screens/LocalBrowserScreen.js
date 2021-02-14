import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  Alert,
  RefreshControl,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import colors from "../constants/colors";

function LocalBrowserScreen({ navigation, route }) {
  const mainUrl = route.params.url;
  const mainText = route.params.text;

  const maxlimit = 25;

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const webviewRef = useRef(null);

  const renderLoading = () => (
    <ActivityIndicator
      color={colors.primary}
      style={{ flex: 6 }}
      animating
      size="large"
    />
  );

  /*
backButtonHandler = () => {
    if (webviewRef.current) webviewRef.current.goBack()
  }

  frontButtonHandler = () => {
    if (webviewRef.current) webviewRef.current.goForward()
  }
*/

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            color={colors.white}
            name="window-close"
            size={24}
          />
        </TouchableOpacity>
        <Text
          style={{
            marginVertical: -2,
            fontWeight: "500",
            color: colors.white,
            fontSize: 18,
          }}
        >
          {mainUrl.length > maxlimit
            ? mainUrl.substring(0, maxlimit - 3) + "..."
            : mainUrl}
        </Text>
        <TouchableOpacity onPress={() => webviewRef.current.reload()}>
          <MaterialCommunityIcons
            color={colors.white}
            name="refresh"
            size={24}
          />
        </TouchableOpacity>
      </View>

      <WebView
        source={{ uri: mainUrl }}
        originWhitelist={["*"]}
        ref={webviewRef}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
          setCanGoForward(navState.canGoForward);
          setCurrentUrl(navState.url);
        }}
        onError={() =>
          Platform.OS === "android"
            ? ToastAndroid.show("Error loading url", ToastAndroid.SHORT)
            : Alert.alert("Error loading url")
        }
        cacheEnabled={true}
        thirdPartyCookiesEnabled={true}
        javaScriptEnabled={true}
        renderLoading={renderLoading}
        startInLoadingState={true}
        automaticallyAdjustContentInsets={false}
        domStorageEnabled={true}
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
});

export default LocalBrowserScreen;
