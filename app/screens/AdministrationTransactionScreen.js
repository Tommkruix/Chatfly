import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import colors from "../constants/colors";
import Divider from "../components/lists/Divider";
import routes from "../navigation/routes";

function AdministrationTransactionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScreenHeader navigation={navigation} headerName="Choose Transaction" />
      <View
        style={{
          flexDirection: "row",
          padding: 25,
          paddingTop: 25,
          paddingBottom: 10,
        }}
      >
        <Text style={{ fontSize: 18 }}>User's Coin Transactions</Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(routes.ADMINISTRATIONTRANSACTIONVIEW, {
            type: "coin",
            role: "user",
          })
        }
      >
        <View style={styles.cardSmallBox}>
          <View style={styles.cardSmall}>
            <View style={[styles.row, { justifyContent: "center" }]}>
              <Text
                style={{
                  fontSize: 18,
                  color: colors.white,
                  fontWeight: "bold",
                }}
              >
                VIEW
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Divider />
      <View
        style={{
          flexDirection: "row",
          padding: 25,
          paddingTop: 25,
          paddingBottom: 10,
        }}
      >
        <Text style={{ fontSize: 18 }}>User's Added Fund Transactions</Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(routes.ADMINISTRATIONTRANSACTIONVIEW, {
            type: "added_funds",
            role: "user",
          })
        }
      >
        <View style={styles.cardSmallBox}>
          <View style={styles.cardSmall}>
            <View style={[styles.row, { justifyContent: "center" }]}>
              <Text
                style={{
                  fontSize: 18,
                  color: colors.white,
                  fontWeight: "bold",
                }}
              >
                VIEW
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Divider />
      <View
        style={{
          flexDirection: "row",
          padding: 25,
          paddingTop: 25,
          paddingBottom: 10,
        }}
      >
        <Text style={{ fontSize: 18 }}>Admin's Coin Transactions</Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(routes.ADMINISTRATIONTRANSACTIONVIEW, {
            type: "coin",
            role: "admin",
          })
        }
      >
        <View style={styles.cardSmallBox}>
          <View style={styles.cardSmall}>
            <View style={[styles.row, { justifyContent: "center" }]}>
              <Text
                style={{
                  fontSize: 18,
                  color: colors.white,
                  fontWeight: "bold",
                }}
              >
                VIEW
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Divider />
      <View
        style={{
          flexDirection: "row",
          padding: 25,
          paddingTop: 25,
          paddingBottom: 10,
        }}
      >
        <Text style={{ fontSize: 18 }}>Admin's Added Fund Transactions</Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(routes.ADMINISTRATIONTRANSACTIONVIEW, {
            type: "added_funds",
            role: "admin",
          })
        }
      >
        <View style={styles.cardSmallBox}>
          <View style={styles.cardSmall}>
            <View style={[styles.row, { justifyContent: "center" }]}>
              <Text
                style={{
                  fontSize: 18,
                  color: colors.white,
                  fontWeight: "bold",
                }}
              >
                VIEW
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Divider />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  cardSmallBox: {
    flexDirection: "row",
    padding: 20,
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

export default AdministrationTransactionScreen;
