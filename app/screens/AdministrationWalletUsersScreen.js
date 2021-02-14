import React from "react";
import { View, StyleSheet } from "react-native";
import ScreenHeader from "../components/ScreenHeader";

function AdministrationWalletUsersScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScreenHeader headerName="Choose User" navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default AdministrationWalletUsersScreen;
