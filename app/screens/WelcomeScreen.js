import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, ImageBackground } from "react-native";

import Button from "../components/Button";
import colors from "../constants/colors";
import theme from "../constants/theme";
import routes from "../navigation/routes";

import firebase from "../config/init";

function WelcomeScreen({ navigation }) {
  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  /*useEffect(() => {
    !user
      ? setTimeout(() => {
          navigation.navigate(routes.LOGIN);
        }, 5000)
      : "";
  });*/

  return (
    <ImageBackground
      blurRadius={100}
      style={styles.background}
      source={require("../assets/images/welcome.png")}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/images/welcome.png")}
        />
        <Text style={styles.tagline}>Let's Connect</Text>
      </View>
      {!initializing ? (
        <View style={styles.buttonsContainer}>
          <Button
            title="Sign In"
            onPress={() => navigation.navigate(routes.LOGIN)}
          />
          <Button
            title="Create Account"
            color="secondary"
            onPress={() => navigation.navigate(routes.REGISTER)}
          />
        </View>
      ) : (
        <View style={styles.buttonsContainer}></View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
  },
  logo: {
    width: 300,
    height: 290,
  },
  logoContainer: {
    position: "absolute",
    top: 150,
    alignItems: "center",
  },
  tagline: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 25,
    paddingVertical: 20,
    textAlign: "center",
    fontFamily: theme.fontFamily,
  },
});

export default WelcomeScreen;
