import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { FontAwesome as Icon } from "@expo/vector-icons";
import colors from "../../constants/colors";

//STYLES
const styles = StyleSheet.create({
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
/* Deconstruction */
const { searchContainer, searchInputStyle, searchRow } = styles;

function SearchInput() {
  return (
    /* The main Container component */
    <View style={searchContainer}>
      {/* The Row Container component */}
      <View style={searchRow}>
        {/* The text Input which we write in it */}
        <Icon size={20} name={"search"} color={colors.searchIcon} />
        <TextInput
          maxLength={10}
          placeholder="Search"
          style={searchInputStyle}
        />
      </View>
    </View>
  );
}

export default SearchInput;
