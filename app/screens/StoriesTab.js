import React, { Component } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import Stories from "../components/storiesComponents/Stories";
import { FontAwesome as Icon } from "@expo/vector-icons";
import colors from "../constants/colors";

/* STYLESHEET */
const styles = StyleSheet.create({
  /* FLOATING ACTION BUTTON Style */
  fabStyle: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: colors.tabBackground,
    borderRadius: 100,
    elevation: 5,
    shadowColor: colors.secondary,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
});

function StoriesTab() {
  return (
    <View style={{ backgroundColor: colors.tabPageBackground, flex: 1 }}>
      <ScrollView>
        <Stories />
      </ScrollView>
      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity style={styles.fabStyle}>
        <Icon name="camera" size={25} color={colors.secondary} />
      </TouchableOpacity>
    </View>
  );
}

export default StoriesTab;
