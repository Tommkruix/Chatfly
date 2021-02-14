import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Picker,
  Platform,
  Alert,
  ToastAndroid,
} from "react-native";
import {
  Entypo,
  Octicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import InputSpinner from "react-native-input-spinner";
import { Image } from "react-native-expo-image-cache";
import Firebase from "firebase";

import firebase from "../config/init";
import routes from "../navigation/routes";
import ScreenHeader from "../components/ScreenHeader";

function AdministrationUserActionsScreen({ navigation, route }) {
  const ref_uid = route.params.ref_uid;
  const uid = firebase.auth().currentUser.uid;

  const [userimage, setUserImage] = useState();
  const [username, setUserName] = useState();
  const [userstatus, setUserStatus] = useState();
  const [userPaymentAddress, setUserPaymentAddress] = useState();
  const [useremail, setUserEmail] = useState();
  const [userAccountType, setUserAccountType] = useState();
  const [userPhoneno, setUserPhoneno] = useState();
  const [userCoins, setUserCoins] = useState(0);
  const [userAddedFunds, setUserAddedFunds] = useState(0);
  const [userTotalPoints, setUserTotalPoints] = useState(0);
  const placeholderUserImage = "https://yourcampushub.online/chatfly/a.png";

  const [editAccountType, setEditAccountType] = useState("");
  const [editCoinCredit, setEditCoinCredit] = useState(0);
  const [editCoinDebit, setEditCoinDebit] = useState(0);
  const [editAddedFund, setEditAddedFund] = useState(0);
  const [editAddedFundDebit, setEditAddedFundDebit] = useState(0);

  useEffect(() => {
    userDetails();
  }, []);

  const userDetails = () => {
    firebase
      .database()
      .ref("Forum Post Earnings")
      .orderByChild("userid")
      .equalTo(ref_uid)
      .on("value", function (snapshot) {
        var count = 0;
        snapshot.forEach(function () {
          count++;
        });
        //count is now safe to use.
        setUserTotalPoints(count);
      });

    firebase
      .database()
      .ref(`/Users/${ref_uid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("image") && snapshot.child("image").exists) {
          setUserImage(snapshot.child("image").val());
        } else {
          setUserImage("");
        }

        if (snapshot.hasChild("name") && snapshot.child("name").exists) {
          setUserName(snapshot.child("name").val());
        } else {
          setUserName("");
        }

        if (snapshot.hasChild("status") && snapshot.child("status").exists) {
          setUserStatus(snapshot.child("status").val());
        } else {
          setUserStatus("");
        }

        if (snapshot.hasChild("email") && snapshot.child("email").exists) {
          setUserEmail(snapshot.child("email").val());
        } else {
          setUserEmail("");
        }

        if (
          snapshot.hasChild("payment_address") &&
          snapshot.child("payment_address").exists
        ) {
          setUserPaymentAddress(snapshot.child("payment_address").val());
        } else {
          setUserPaymentAddress("");
        }

        if (snapshot.hasChild("phoneno") && snapshot.child("phoneno").exists) {
          setUserPhoneno(snapshot.child("phoneno").val());
        } else {
          setUserPhoneno("");
        }

        if (
          snapshot.hasChild("account_type") &&
          snapshot.child("account_type").exists
        ) {
          setUserAccountType(snapshot.child("account_type").val());
        } else {
          setUserAccountType("");
        }

        if (
          snapshot.hasChild("converted_coins") &&
          snapshot.child("converted_coins").exists
        ) {
          setUserCoins(parseInt(snapshot.child("converted_coins").val()));
        } else {
          setUserCoins(parseInt(0));
        }

        if (
          snapshot.hasChild("added_funds") &&
          snapshot.child("added_funds").exists
        ) {
          setUserAddedFunds(parseInt(snapshot.child("added_funds").val()));
        } else {
          setUserAddedFunds(parseInt(0));
        }
      });
  };

  const handleAccountTypeUpdate = () => {
    firebase
      .database()
      .ref(`/Users/${ref_uid}`)
      .update({
        account_type: editAccountType,
      })
      .then(() =>
        Platform.OS === "ios"
          ? Alert.alert("Account Type updated.")
          : ToastAndroid.show("Account Type updated.", ToastAndroid.SHORT)
      );
    userDetails();
  };

  const handleCreditCoinToUser = () => {
    const total = editCoinCredit + userCoins;
    firebase
      .database()
      .ref(`/Users/${ref_uid}`)
      .update({
        converted_coins: total,
      })
      .then(() =>
        Platform.OS === "ios"
          ? Alert.alert("Coin credited successfully.")
          : ToastAndroid.show("Coin credited successfully.", ToastAndroid.SHORT)
      );
    SaveTransfers("coin", "credit", editCoinCredit);
    userDetails();
  };
  const handleCreditAddedFundsToUser = () => {
    const total = editAddedFund + userAddedFunds;
    firebase
      .database()
      .ref(`/Users/${ref_uid}`)
      .update({
        added_funds: total,
      })
      .then(() =>
        Platform.OS === "ios"
          ? Alert.alert("Funds credited successfully.")
          : ToastAndroid.show(
              "Funds credited successfully.",
              ToastAndroid.SHORT
            )
      );
    SaveTransfers("added_funds", "credit", editAddedFund);
    userDetails();
  };

  const handleDebitCoinToUser = () => {
    if (userCoins >= editCoinDebit) {
      const total = userCoins - editCoinDebit;
      firebase
        .database()
        .ref(`/Users/${ref_uid}`)
        .update({
          converted_coins: total,
        })
        .then(() =>
          Platform.OS === "ios"
            ? Alert.alert("Coin debited successfully.")
            : ToastAndroid.show(
                "Coin debited successfully.",
                ToastAndroid.SHORT
              )
        );
      SaveTransfers("coin", "debit", editCoinDebit);
    } else {
      Platform.OS === "ios"
        ? Alert.alert("You cannot debit below the user coin balance.")
        : ToastAndroid.show(
            "You cannot debit below the user coin balance.",
            ToastAndroid.SHORT
          );
    }
    userDetails();
  };
  const handleDebitAddedFundToUser = () => {
    if (userAddedFunds >= editAddedFundDebit) {
      const total = userAddedFunds - editAddedFundDebit;
      firebase
        .database()
        .ref(`/Users/${ref_uid}`)
        .update({
          added_funds: total,
        })
        .then(() =>
          Platform.OS === "ios"
            ? Alert.alert("Added Fund debited successfully.")
            : ToastAndroid.show(
                "Added Fund debited successfully.",
                ToastAndroid.SHORT
              )
        );
      SaveTransfers("added_funds", "debit", editAddedFundDebit);
    } else {
      Platform.OS === "ios"
        ? Alert.alert("You cannot debit below the user added fund balance.")
        : ToastAndroid.show(
            "You cannot debit below the user added fund balance.",
            ToastAndroid.SHORT
          );
    }
    userDetails();
  };

  const handleDeleteUser = () => {
    firebase
      .database()
      .ref(`/Users/${ref_uid}`)
      .remove()
      .then(() =>
        Platform.OS === "ios"
          ? Alert.alert("User deleted successfully.")
          : ToastAndroid.show("User deleted successfully.", ToastAndroid.SHORT)
      );
    navigation.goBack();
  };

  const getUserAccountType = () => {
    if (userAccountType === "normal") {
      return (
        <Picker
          selectedValue={editAccountType}
          style={{ height: 50, width: "100%" }}
          onValueChange={(itemValue, itemIndex) =>
            setEditAccountType(itemValue)
          }
        >
          <Picker.Item label="Normal" value="normal" />
          <Picker.Item label="Unverified" value="" />
          <Picker.Item label="VIP" value="vip" />
          <Picker.Item label="VVIP" value="vvip" />
        </Picker>
      );
    } else if (userAccountType === "vip") {
      return (
        <Picker
          selectedValue={editAccountType}
          style={{ height: 50, width: "100%" }}
          onValueChange={(itemValue, itemIndex) =>
            setEditAccountType(itemValue)
          }
        >
          <Picker.Item label="VIP" value="vip" />
          <Picker.Item label="Unverified" value="" />
          <Picker.Item label="Normal" value="normal" />
          <Picker.Item label="VVIP" value="vvip" />
        </Picker>
      );
    } else if (userAccountType === "vvip") {
      return (
        <Picker
          selectedValue={editAccountType}
          style={{ height: 50, width: "100%" }}
          onValueChange={(itemValue, itemIndex) =>
            setEditAccountType(itemValue)
          }
        >
          <Picker.Item label="VVIP" value="vvip" />
          <Picker.Item label="Unverified" value="" />
          <Picker.Item label="Normal" value="normal" />
          <Picker.Item label="VIP" value="vip" />
        </Picker>
      );
    } else {
      return (
        <Picker
          selectedValue={editAccountType}
          style={{ height: 50, width: "100%" }}
          onValueChange={(itemValue, itemIndex) =>
            setEditAccountType(itemValue)
          }
        >
          <Picker.Item label="Unverified" value="" />
          <Picker.Item label="Normal" value="normal" />
          <Picker.Item label="VIP" value="vip" />
          <Picker.Item label="VVIP" value="vvip" />
        </Picker>
      );
    }
  };

  const SaveTransfers = (type, name, amount) => {
    const transferid = firebase.database().ref("/Transfers").push().key;
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;

    firebase
      .database()
      .ref("/User Transfers/")
      .child(transferid)
      .update({
        sender_id: uid,
        receiver_id: ref_uid,
        converted_coins: parseInt(amount),
        transfer_id: transferid,
        timestamp: timestamp,
        type: type,
        name: name,
        role: "admin",
      });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader headerName="Manage this user" navigation={navigation} />
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image
            name="image"
            style={styles.imageStyle}
            uri={userimage != "" ? userimage : placeholderUserImage}
          />

          {userAccountType === "normal" ? (
            <View
              style={{
                position: "absolute",
                alignSelf: "flex-end",
                marginTop: 180,
                height: 60,
                width: 60,
                borderRadius: 30,
                backgroundColor: colors.primary,
                justifyContent: "center",
              }}
            >
              <MaterialIcons
                name="stars"
                size={30}
                style={{ alignSelf: "center" }}
                color={colors.white}
              />
            </View>
          ) : null}
          {userAccountType === "vip" ? (
            <View
              style={{
                position: "absolute",
                alignSelf: "flex-end",
                marginTop: 180,
                height: 60,
                width: 60,
                borderRadius: 30,
                backgroundColor: colors.primary,
                justifyContent: "center",
              }}
            >
              <Octicons
                name="verified"
                size={30}
                style={{ alignSelf: "center" }}
                color={colors.white}
              />
            </View>
          ) : null}
          {userAccountType === "vvip" ? (
            <View
              style={{
                position: "absolute",
                alignSelf: "flex-end",
                marginTop: 180,
                height: 60,
                width: 60,
                borderRadius: 30,
                backgroundColor: colors.primary,
                justifyContent: "center",
              }}
            >
              <MaterialIcons
                name="verified-user"
                size={30}
                style={{ alignSelf: "center" }}
                color={colors.white}
              />
            </View>
          ) : null}
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernameStyle}>{`Name: ${username}`}</Text>
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernameStyle}>{`Email: ${useremail}`}</Text>
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernameStyle}>
            {`Payment Address: ${userPaymentAddress}`}
          </Text>
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernameStyle}>{`Phone No: ${userPhoneno}`}</Text>
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernameStyle}>
            {`Coin balance: ${userCoins}`}
          </Text>
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernameStyle}>
            {`Added Fund balance: ${userAddedFunds}`}
          </Text>
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernameStyle}>
            {`Point balance: ${userTotalPoints}`}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(routes.ONETOONECHAT, {
              id: ref_uid,
            })
          }
        >
          <View style={[styles.cardSmallBox, { marginTop: 10 }]}>
            <View style={styles.cardSmall}>
              <View style={[styles.row, { justifyContent: "center" }]}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.white,
                    fontWeight: "bold",
                  }}
                >
                  Message{" "}
                </Text>
                <Entypo name="chat" size={24} color={colors.white} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(routes.ADMINISTRATIONUSERPOSTACTIONS, {
              ref_uid: ref_uid,
            })
          }
        >
          <View style={[styles.cardSmallBox, { marginTop: 10 }]}>
            <View style={styles.cardSmall}>
              <View style={[styles.row, { justifyContent: "center" }]}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.white,
                    fontWeight: "bold",
                  }}
                >
                  Manage Posts{" "}
                </Text>
                <MaterialCommunityIcons
                  name="post"
                  size={24}
                  color={colors.white}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View
          style={{
            alignItems: "center",
            marginTop: 10,
            marginBottom: Platform.OS === "ios" ? 20 : 0,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: colors.primary,
              fontWeight: "bold",
            }}
          >
            Account Type
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            marginTop: Platform.OS === "android" ? 10 : -50,
          }}
        >
          {getUserAccountType()}
        </View>
        <TouchableOpacity
          onPress={() => {
            handleAccountTypeUpdate();
          }}
          style={{ marginTop: Platform.OS === "ios" ? 150 : 0 }}
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
                  Update Account Type{" "}
                </Text>
                <MaterialCommunityIcons
                  name="update"
                  size={24}
                  color={colors.white}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {/* Process */}
        <View
          style={{
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              padding: 25,
              fontSize: 18,
            }}
          >
            Credit Coin to user
          </Text>
          <View style={([styles.row], { marginHorizontal: 25 })}>
            <InputSpinner
              max={100000}
              min={0}
              step={1}
              value={editCoinCredit}
              style={{
                width: "100%",
                justifyContent: "space-evenly",
                alignContent: "center",
              }}
              height={40}
              editable={true}
              append={<Text style={{ padding: 10 }}>COIN</Text>}
              colorMax={"#f04048"}
              colorMin={"#40c5f4"}
              onChange={(num) => {
                setEditCoinCredit(num);
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              handleCreditCoinToUser();
            }}
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
                    Credit User{" "}
                  </Text>
                  <MaterialCommunityIcons
                    name="update"
                    size={24}
                    color={colors.white}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* Process */}
        <View
          style={{
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              padding: 25,
              fontSize: 18,
            }}
          >
            Credit Added Fund to user
          </Text>
          <View style={([styles.row], { marginHorizontal: 25 })}>
            <InputSpinner
              max={1000000000000}
              min={0}
              step={1}
              value={editAddedFund}
              style={{
                width: "100%",
                justifyContent: "space-evenly",
                alignContent: "center",
              }}
              height={40}
              editable={true}
              append={<Text style={{ padding: 10 }}>₦</Text>}
              colorMax={"#f04048"}
              colorMin={"#40c5f4"}
              onChange={(num) => {
                setEditAddedFund(num);
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              handleCreditAddedFundsToUser();
            }}
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
                    Credit User{" "}
                  </Text>
                  <MaterialCommunityIcons
                    name="update"
                    size={24}
                    color={colors.white}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* Process */}
        <View
          style={{
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              padding: 25,
              fontSize: 18,
            }}
          >
            Debit Coin from user
          </Text>
          <View style={([styles.row], { marginHorizontal: 25 })}>
            <InputSpinner
              max={100000}
              min={0}
              step={1}
              value={editCoinDebit}
              style={{
                width: "100%",
                justifyContent: "space-evenly",
                alignContent: "center",
              }}
              height={40}
              editable={true}
              append={<Text style={{ padding: 10 }}>COIN</Text>}
              colorMax={"#f04048"}
              colorMin={"#40c5f4"}
              onChange={(num) => {
                setEditCoinDebit(num);
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              handleDebitCoinToUser();
            }}
          >
            <View style={styles.cardSmallBox}>
              <View style={[styles.cardSmall, { backgroundColor: "tomato" }]}>
                <View style={[styles.row, { justifyContent: "center" }]}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.white,
                      fontWeight: "bold",
                    }}
                  >
                    Debit User{" "}
                  </Text>
                  <MaterialCommunityIcons
                    name="update"
                    size={24}
                    color={colors.white}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* Process */}
        <View
          style={{
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              padding: 25,
              fontSize: 18,
            }}
          >
            Debit Added Fund from user
          </Text>
          <View style={([styles.row], { marginHorizontal: 25 })}>
            <InputSpinner
              max={100000}
              min={0}
              step={1}
              value={editAddedFundDebit}
              style={{
                width: "100%",
                justifyContent: "space-evenly",
                alignContent: "center",
              }}
              height={40}
              editable={true}
              append={<Text style={{ padding: 10 }}>₦</Text>}
              colorMax={"#f04048"}
              colorMin={"#40c5f4"}
              onChange={(num) => {
                setEditAddedFundDebit(num);
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              handleDebitAddedFundToUser();
            }}
          >
            <View style={styles.cardSmallBox}>
              <View style={[styles.cardSmall, { backgroundColor: "tomato" }]}>
                <View style={[styles.row, { justifyContent: "center" }]}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.white,
                      fontWeight: "bold",
                    }}
                  >
                    Debit User{" "}
                  </Text>
                  <MaterialCommunityIcons
                    name="update"
                    size={24}
                    color={colors.white}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* Process */}
        <View
          style={{
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              padding: 25,
              fontSize: 18,
              color: "#922B21",
            }}
          >
            Delete User off
          </Text>

          <TouchableOpacity
            onPress={() => {
              handleDeleteUser();
            }}
          >
            <View style={styles.cardSmallBox}>
              <View style={[styles.cardSmall, { backgroundColor: "#922B21" }]}>
                <View style={[styles.row, { justifyContent: "center" }]}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.white,
                      fontWeight: "bold",
                    }}
                  >
                    Delete User{" "}
                  </Text>
                  <MaterialCommunityIcons
                    name="update"
                    size={24}
                    color={colors.white}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  imageContainer: {
    marginTop: 45,
    alignItems: "center",
    marginHorizontal: 80,
    borderRadius: 125,
    marginBottom: 10,
  },
  imageStyle: {
    width: 250,
    height: 250,
    borderRadius: 250 / 2,
    borderWidth: 10,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  usernameContainer: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  usernameStyle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AdministrationUserActionsScreen;
