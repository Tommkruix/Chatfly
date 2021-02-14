import React from "react";
import { FlatList } from "react-native";

import Divider from "../components/lists/Divider";
import ContactsRowDelete from "./ContactsRowDelete";

function ContactsRow({ calls, onPress }) {
  return (
    <FlatList
      data={calls}
      keyExtractor={(call) => call.name}
      ItemSeparatorComponent={Divider}
      renderItem={({ item }) => (
        <ContactsRowDelete onPress={onPress} item={item} />
      )}
    />
  );
}

export default ContactsRow;
