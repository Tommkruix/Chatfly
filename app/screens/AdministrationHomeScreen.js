import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons, Fontisto, Entypo } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";
import colors from "../constants/colors";
import routes from "../navigation/routes";

function AdministrationHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScreenHeader navigation={navigation} headerName="Administration" />
      <ScrollView>
        <View style={styles.cardBox}>
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => navigation.navigate(routes.ADMINISTRATIONWALLET)}
            >
              <View style={styles.row}>
                <View style={{ width: "40%", padding: 10 }}>
                  <Fontisto name="wallet" size={110} color={colors.light} />
                </View>
                <View style={{ width: "60%", padding: 10 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.white,
                      fontWeight: "bold",
                      marginVertical: 20,
                    }}
                  >
                    Wallet Settings
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.danger,
                      fontWeight: "bold",
                    }}
                  >
                    Manage
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* card */}
        <View style={styles.cardBox}>
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(routes.ADMINISTRATIONUSERLISTS)
              }
            >
              <View style={styles.row}>
                <View style={{ width: "40%", padding: 10 }}>
                  <Entypo name="users" size={110} color={colors.light} />
                </View>
                <View style={{ width: "60%", padding: 10 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.white,
                      fontWeight: "bold",
                      marginVertical: 20,
                    }}
                  >
                    User Settings
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.danger,
                      fontWeight: "bold",
                    }}
                  >
                    Manage
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* card */}
        <View style={styles.cardBox}>
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(routes.ADMINISTRATIONTRANSACTION)
              }
            >
              <View style={styles.row}>
                <View style={{ width: "40%", padding: 10 }}>
                  <MaterialCommunityIcons
                    name="history"
                    size={110}
                    color={colors.light}
                  />
                </View>
                <View style={{ width: "60%", padding: 10 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.white,
                      fontWeight: "bold",
                      marginVertical: 20,
                    }}
                  >
                    Transaction History
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.danger,
                      fontWeight: "bold",
                    }}
                  >
                    Manage
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* card */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  cardBox: {
    flexDirection: "row",
    padding: 10,
    marginTop: 20,
  },
  card: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  cardSmallBox: {
    flexDirection: "row",
    padding: 10,
  },
  cardSmall: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  row: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
  },
});

export default AdministrationHomeScreen;
