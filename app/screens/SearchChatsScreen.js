import React from "react";
import { View, StyleSheet } from "react-native";

import ContactsRow from "../components/ContactsRow";
import routes from "../navigation/routes";

const calls = [
  {
    id: 1,
    name: "Mark Doe",
    status: "active",
    image: "https://bootdey.com/img/Content/avatar/avatar7.png",
  },
  {
    id: 2,
    name: "Clark Man",
    status: "active",
    image: "https://bootdey.com/img/Content/avatar/avatar6.png",
  },
  {
    id: 3,
    name: "Jaden Boor",
    status: "active",
    image: "https://bootdey.com/img/Content/avatar/avatar5.png",
  },
  {
    id: 4,
    name: "Srick Tree",
    status: "active",
    image: "https://bootdey.com/img/Content/avatar/avatar4.png",
  },
  {
    id: 5,
    name: "Erick Doe",
    status: "active",
    image: "https://bootdey.com/img/Content/avatar/avatar3.png",
  },
  {
    id: 6,
    name: "Francis Doe",
    status: "active",
    image: "https://bootdey.com/img/Content/avatar/avatar2.png",
  },
  {
    id: 8,
    name: "Matilde Doe",
    status: "active",
    image: "https://bootdey.com/img/Content/avatar/avatar1.png",
  },
  {
    id: 9,
    name: "John Doe",
    status: "active",
    image: "https://bootdey.com/img/Content/avatar/avatar4.png",
  },
  {
    id: 10,
    name: "Fermod Doe",
    status: "active",
    image: "https://bootdey.com/img/Content/avatar/avatar7.png",
  },
  {
    id: 11,
    name: "Danny Doe",
    status: "active",
    image: "https://bootdey.com/img/Content/avatar/avatar1.png",
  },
];

function SearchChatsScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <ContactsRow
        calls={calls}
        onPress={() =>
          navigation.navigate(routes.ONETOONECHAT, { visible: "false" })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default SearchChatsScreen;
