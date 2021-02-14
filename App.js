import React, { useState, useEffect } from "react";
import { View, Text, YellowBox } from "react-native";
import { AppLoading } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AppNavigator from "./app/navigation/AppNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";

import firebase from "./app/config/init";
import Screen from "./app/components/Screen";
import AuthContext from "./app/config/auth/context";
import OfflineNotice from "./app/components/OfflineNotice";
import { navigationRef } from "./app/navigation/rootNavigation";

function App() {
  YellowBox.ignoreWarnings(["Setting a timer"]);
  YellowBox.ignoreWarnings(["Animated: `useNativeDriver` was not specified."]);

  let [fontsLoaded] = useFonts({
    Helvetica: require("./app/assets/fonts/Helvetica.ttf"),
  });

  //const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);

  const [initializing, setInitializing] = useState(true);
  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);

    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  /*if (!isReady)
  return (
    <AppLoading
    startAsync={onAuthStateChanged(null)}
    onFinish={() => setIsReady(true)}
    />
    );*/
  if (!fontsLoaded) return <AppLoading />;
  // Set an initializing state whilst Firebase connects
  if (initializing) return null;

  const linking = {
    prefixes: ["https://chatfly.com"],
  };

  return (
    <>
      <OfflineNotice />
      <NavigationContainer
        ref={navigationRef}
        theme={navigationTheme}
        linking={linking}
        fallback={<Text>Loading...</Text>}
      >
        {!user ? (
          <AuthNavigator />
        ) : (
          <>
            <Screen style={{ backgroundColor: colors.primary }}>
              <StatusBar style="light" />
              <AppNavigator />
            </Screen>
          </>
        )}
      </NavigationContainer>
    </>
  );
}

export default App;
