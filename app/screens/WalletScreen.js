import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome,
  MaterialIcons,
  Feather,
  Entypo,
} from "@expo/vector-icons";
import Firebase from "firebase";
import colors from "../constants/colors";
import firebase from "../config/init";
import { Notifications } from "expo";
import routes from "../navigation/routes";
import ScreenHeader from "../components/ScreenHeader";

function WalletScreen({ navigation }) {
  const uid = firebase.auth().currentUser.uid;
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentUserAccountType, setCurrentUserAccountType] = useState("");
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [userAddedFunds, setUserAddedFunds] = useState(0);
  const [userCoinsEarning, setUserCoinsEarning] = useState(0);
  const [userReferralBonus, setUserReferralBonus] = useState(0);
  const [eqvPointCoin, setEqvPointCoin] = useState(0);
  const [eqvCoinDollar, setEqvCoinDollar] = useState(0);
  const [eqvReferralBonus, setEqvReferralBonus] = useState(0);
  const [upgradeFeeNormal, setUpgradeFeeNormal] = useState(0);
  const [upgradeFeeVIP, setUpgradeFeeVIP] = useState(0);
  const [upgradeFeeVVIP, setUpgradeFeeVVIP] = useState(0);
  const [minimumConvertPoint, setMinimumConvertPoint] = useState(0);
  const [minimumTransferCoin, setMinimumTransferCoin] = useState(0);
  const [minimumTransferAddedFunds, setMinimumTransferAddedFunds] = useState(0);
  const [minimumWithdrawCoin, setMinimumWithdrawCoin] = useState(0);
  const [
    minimumWithdrawReferralBonus,
    setMinimumWithdrawReferralBonus,
  ] = useState(0);

  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawReferralBonusModal, setWithdrawReferralBonusModal] = useState(
    false
  );
  const [transferModal, setTransferModal] = useState(false);
  const [transferAddedFundsModal, setTransferAddedFundsModal] = useState(false);
  const [referralModal, setReferralModal] = useState(false);
  const [withdrawTextInput, setWithdrawTextInput] = useState("");
  const [textWRefInput, setWRefTextInput] = useState("");
  const [
    withdrawReferralBonusTextInput,
    setWithdrawReferralBonusTextInput,
  ] = useState("");
  const [textWRBRefInput, setWRBRefTextInput] = useState("");
  const [transferAmountTextInput, setTransferAmountTextInput] = useState("");
  const [textTAmountRefInput, setTAmountRefTextInput] = useState("");
  const [
    transferAddedFundsAmountTextInput,
    setTransferAddedFundsAmountTextInput,
  ] = useState("");
  const [textTAFAmountRefInput, setTAFAmountRefTextInput] = useState("");
  const [transferEmailTextInput, setTransferEmailTextInput] = useState("");
  const [textTEmailRefTextInput, setTEmailRefTextInput] = useState("");
  const [
    transferAddedFundsEmailTextInput,
    setTransferAddedFundsEmailTextInput,
  ] = useState("");
  const [textTAFEmailRefTextInput, setTAFEmailRefTextInput] = useState("");
  const [referralEmailTextInput, setReferralEmailTextInput] = useState("");
  const [textREmailRefTextInput, setREmailRefTextInput] = useState("");

  useEffect(() => {
    RetrieveCurrentUserDetails();
  }, []);

  const RetrieveCurrentUserDetails = () => {
    firebase
      .database()
      .ref(`Users/${uid}`)
      .on("value", (snapshot) => {
        if (snapshot.hasChild("name") && snapshot.child("name").exists) {
          setCurrentUsername(snapshot.child("name").val());
        } else {
          setCurrentUsername("");
        }

        if (
          snapshot.hasChild("account_type") &&
          snapshot.child("account_type").exists
        ) {
          setCurrentUserAccountType(snapshot.child("account_type").val());
        } else {
          setCurrentUserAccountType("");
        }
      });
  };

  useEffect(() => {
    handleDefaultSettings();
  }, []);

  const handleDefaultSettings = () => {
    firebase
      .database()
      .ref(`/Administration/`)
      .on("value", (snapshot) => {
        if (
          snapshot.hasChild("point_to_coin_eqv") &&
          snapshot.child("point_to_coin_eqv").exists
        ) {
          setEqvPointCoin(snapshot.child("point_to_coin_eqv").val());
        } else {
          setEqvPointCoin(0);
        }

        if (
          snapshot.hasChild("coin_to_dollar_eqv") &&
          snapshot.child("coin_to_dollar_eqv").exists
        ) {
          setEqvCoinDollar(snapshot.child("coin_to_dollar_eqv").val());
        } else {
          setEqvCoinDollar(0);
        }

        if (
          snapshot.hasChild("referral_bonus") &&
          snapshot.child("referral_bonus").exists
        ) {
          setEqvReferralBonus(snapshot.child("referral_bonus").val());
        } else {
          setEqvReferralBonus(0);
        }

        if (
          snapshot.hasChild("upgrade_fee_normal") &&
          snapshot.child("upgrade_fee_normal").exists
        ) {
          setUpgradeFeeNormal(snapshot.child("upgrade_fee_normal").val());
        } else {
          setUpgradeFeeNormal(0);
        }

        if (
          snapshot.hasChild("upgrade_fee_vip") &&
          snapshot.child("upgrade_fee_vip").exists
        ) {
          setUpgradeFeeVIP(snapshot.child("upgrade_fee_vip").val());
        } else {
          setUpgradeFeeVIP(0);
        }

        if (
          snapshot.hasChild("upgrade_fee_vvip") &&
          snapshot.child("upgrade_fee_vvip").exists
        ) {
          setUpgradeFeeVVIP(snapshot.child("upgrade_fee_vvip").val());
        } else {
          setUpgradeFeeVVIP(0);
        }

        if (
          snapshot.hasChild("minimum_convert_point") &&
          snapshot.child("minimum_convert_point").exists
        ) {
          setMinimumConvertPoint(snapshot.child("minimum_convert_point").val());
        } else {
          setMinimumConvertPoint(0);
        }

        if (
          snapshot.hasChild("minimum_transfer_coin") &&
          snapshot.child("minimum_transfer_coin").exists
        ) {
          setMinimumTransferCoin(snapshot.child("minimum_transfer_coin").val());
        } else {
          setMinimumTransferCoin(0);
        }

        if (
          snapshot.hasChild("minimum_transfer_added_funds") &&
          snapshot.child("minimum_transfer_added_funds").exists
        ) {
          setMinimumTransferAddedFunds(
            snapshot.child("minimum_transfer_added_funds").val()
          );
        } else {
          setMinimumTransferAddedFunds(0);
        }

        if (
          snapshot.hasChild("minimum_withdraw_coin") &&
          snapshot.child("minimum_withdraw_coin").exists
        ) {
          setMinimumWithdrawCoin(snapshot.child("minimum_withdraw_coin").val());
        } else {
          setMinimumWithdrawCoin(0);
        }

        if (
          snapshot.hasChild("minimum_withdraw_referral_bonus") &&
          snapshot.child("minimum_withdraw_referral_bonus").exists
        ) {
          setMinimumWithdrawReferralBonus(
            snapshot.child("minimum_withdraw_referral_bonus").val()
          );
        } else {
          setMinimumWithdrawReferralBonus(0);
        }
      });
  };

  useEffect(() => {
    if (userForumEarnings() === undefined) {
      setTotalEarnings(0 + userAccountEarnings());
      //setUserCoinsEarning(ConvertPointToCoin())
    } else {
      setTotalEarnings(userForumEarnings() + userAccountEarnings());
      //setUserCoinsEarning(ConvertPointToCoin())
    }
  }, []);

  useEffect(() => {
    userAccountCoinFundEarnigs();
  }, []);

  const userForumEarnings = () => {
    var aForum;
    firebase
      .database()
      .ref("Forum Post Earnings")
      .orderByChild("userid")
      .equalTo(uid)
      .on("value", (snapshot) => {
        if (
          snapshot.exists() &&
          snapshot.numChildren() >= 1 &&
          snapshot.val() !== null
        ) {
          aForum = snapshot.numChildren();
        } else {
          aForum = 0;
        }
      });

    return aForum;
  };

  const userAccountCoinFundEarnigs = () => {
    firebase
      .database()
      .ref("Users")
      .child(uid)
      .on("value", (snapshot) => {
        if (
          snapshot.exists() &&
          snapshot != null &&
          snapshot.hasChild("converted_coins")
        ) {
          setUserCoinsEarning(
            parseFloat(snapshot.child("converted_coins").val())
          );
        } else {
          setUserCoinsEarning(parseFloat(0));
        }

        if (
          snapshot.exists() &&
          snapshot != null &&
          snapshot.hasChild("referral_bonus")
        ) {
          setUserReferralBonus(
            parseFloat(snapshot.child("referral_bonus").val())
          );
        } else {
          setUserReferralBonus(parseFloat(0));
        }

        if (
          snapshot.exists() &&
          snapshot != null &&
          snapshot.hasChild("added_funds")
        ) {
          setUserAddedFunds(parseFloat(snapshot.child("added_funds").val()));
        } else {
          setUserAddedFunds(parseFloat(0));
        }
      });
  };

  const userAccountEarnings = () => {
    var a;
    firebase
      .database()
      .ref("Users")
      .child(uid)
      .on("value", (snapshot) => {
        if (
          snapshot.exists() &&
          snapshot != null &&
          snapshot.hasChild("amount")
        ) {
          a = snapshot.child("amount").val();
          a = parseInt(a);
          //setTotalEarnings(totalEarnings + a);
        } else {
          a = 0;
        }
      });

    return a;
  };

  const handleWithdraw = () => {
    if (withdrawTextInput != null && withdrawTextInput != "") {
      const withdrawid = firebase.database().ref("/Withdrawal").push().key;
      const timestamp = Firebase.database.ServerValue.TIMESTAMP;
      // saving to contacts
      firebase
        .database()
        .ref("/Withdrawal/")
        .child(withdrawid)
        .update({
          user_id: uid,
          amount: parseFloat(userCoinsEarning),
          payment_address: withdrawTextInput,
          withdraw_id: withdrawid,
          timestamp: timestamp,
        })
        .then(() => {
          Notifications.presentLocalNotificationAsync({
            title: "Congratulations",
            body: "Your withdraw was successful!",
            data: { type: "withdraw" },
          });
          textWRefInput.clear();
          DeleteEarnings();
        });
      return true;
    } else {
      Alert.alert("Please enter your payment address");
    }
  };

  const handleWithdrawReferralBonus = () => {
    if (
      withdrawReferralBonusTextInput != null &&
      withdrawReferralBonusTextInput != ""
    ) {
      const withdrawid = firebase
        .database()
        .ref("/Referral Bonus Withdrawal")
        .push().key;
      const timestamp = Firebase.database.ServerValue.TIMESTAMP;
      // saving to contacts
      firebase
        .database()
        .ref("/Referral Bonus Withdrawal/")
        .child(withdrawid)
        .update({
          user_id: uid,
          amount: parseFloat(userReferralBonus),
          payment_address: withdrawReferralBonusTextInput,
          withdraw_id: withdrawid,
          timestamp: timestamp,
        })
        .then(() => {
          Notifications.presentLocalNotificationAsync({
            title: "Congratulations",
            body: "Your referral bonus withdraw was successful!",
            data: { type: "withdraw" },
          });
          textWRBRefInput.clear();

          // Delete Referral Bonus
          firebase
            .database()
            .ref("Users")
            .child(uid)
            .once("value")
            .then((snapshot) => {
              if (snapshot.hasChild("referral_bonus")) {
                snapshot.child("referral_bonus").ref.set(0);
                setWithdrawReferralBonusModal(false);
              } else {
                // do nothing
              }
            });

          userAccountCoinFundEarnigs();
          // /Delete Referral Bonus
        });
      return true;
    } else {
      Alert.alert("Please enter your payment address");
    }
  };
  const handleReferral = () => {
    if (referralEmailTextInput != null && referralEmailTextInput != "") {
      var query = firebase
        .database()
        .ref("/Users/")
        .orderByChild("email")
        .equalTo(referralEmailTextInput);
      query.once("value").then(function (snapshot) {
        if (!snapshot.exists()) {
          Alert.alert("This user does not exists");
        }
        snapshot.forEach(function (childSnapshot) {
          // saving to beneficiary account
          var key = childSnapshot.key;
          var childData = childSnapshot.child("email").val();
          var buid = childSnapshot.child("uid").val();
          var baccountType = childSnapshot.child("account_type").val();

          // checking if user has already been referred by you
          firebase
            .database()
            .ref("/User Referrals/")
            .orderByChild("referred_by_referred_user")
            .equalTo(uid + buid)
            .once("value")
            .then(function (refsnapshot) {
              if (!refsnapshot.exists()) {
                console.log("here");
                if (childData == referralEmailTextInput) {
                  if (
                    (baccountType != null && baccountType == "normal") ||
                    baccountType == "vip" ||
                    baccountType == "vvip"
                  ) {
                    // saving to user referral bonus
                    firebase
                      .database()
                      .ref(`Users/${uid}`)
                      .update({
                        referral_bonus: userReferralBonus + eqvReferralBonus,
                      });
                    // saving to referrals
                    const referralid = firebase
                      .database()
                      .ref("/User Referrals")
                      .push().key;

                    const timestamp_refer =
                      Firebase.database.ServerValue.TIMESTAMP;
                    firebase
                      .database()
                      .ref("/User Referrals/")
                      .child(referralid)
                      .update({
                        referred_by: uid,
                        referred_user: buid,
                        referred_by_referred_user: uid + buid,
                        referral_id: referralid,
                        timestamp: timestamp_refer,
                      });

                    setReferralModal(false);
                    textREmailRefTextInput.clear();
                    userAccountCoinFundEarnigs();
                    Alert.alert("Success.");

                    return true;
                  } else {
                    Alert.alert(
                      "This user must upgrade his/her account before you can earn your referral bonus"
                    );
                  }
                } else {
                  Alert.alert("This user does not exists");
                }
              } else {
                Alert.alert("User already referred by you.");
              }
            });

          // Cancel enumeration
          return true;
        });
      });
    } else {
      Alert.alert("Please enter a user email address");
    }
  };

  const DeleteEarnings = () => {
    firebase
      .database()
      .ref("Users")
      .child(uid)
      .once("value")
      .then((snapshot) => {
        if (snapshot.hasChild("converted_coins")) {
          snapshot.child("converted_coins").ref.set(0);
          setWithdrawModal(false);
        } else {
          // do nothing
        }
      });

    userAccountCoinFundEarnigs();
  };

  const handleTransfer = () => {
    if (
      transferAmountTextInput != null &&
      transferAmountTextInput != "" &&
      transferEmailTextInput != null &&
      transferEmailTextInput != ""
    ) {
      if (userCoinsEarning >= transferAmountTextInput) {
        var query = firebase
          .database()
          .ref("/Users/")
          .orderByChild("email")
          .equalTo(transferEmailTextInput);
        query.once("value").then(function (snapshot) {
          if (!snapshot.exists()) {
            Alert.alert("This beneficiary does not exists");
          }
          snapshot.forEach(function (childSnapshot) {
            // saving to beneficiary account
            var key = childSnapshot.key;
            var bamount;
            var childData = childSnapshot.child("email").val();
            var buid = childSnapshot.child("uid").val();
            var bname = childSnapshot.child("name").val();
            var bpushToken = childSnapshot.child("expoPushToken").val();
            if (childData == transferEmailTextInput) {
              if (uid != buid) {
                if (childSnapshot.hasChild("converted_coins")) {
                  bamount = childSnapshot.child("converted_coins").val();
                } else {
                  bamount = 0;
                }
                firebase
                  .database()
                  .ref("Users")
                  .child(buid)
                  .child("converted_coins")
                  .ref.set(parseInt(transferAmountTextInput) + bamount);
                // /saving to beneficiary account
                // saving to transfers
                const transferid = firebase.database().ref("/Transfers").push()
                  .key;
                const timestamp = Firebase.database.ServerValue.TIMESTAMP;

                firebase
                  .database()
                  .ref("/User Transfers/")
                  .child(transferid)
                  .update({
                    sender_id: uid,
                    receiver_email: transferEmailTextInput,
                    receiver_id: buid,
                    converted_coins: parseInt(transferAmountTextInput),
                    transfer_id: transferid,
                    timestamp: timestamp,
                    type: "coin",
                    name: "credit",
                    role: "user",
                  })
                  .then(() => {
                    Notifications.presentLocalNotificationAsync({
                      title: "Congratulations",
                      body:
                        "You've successfully transferred " +
                        transferAmountTextInput +
                        " COINS to " +
                        bname,
                    });

                    MinusAndResetEarnings();
                    SendUserNotification(
                      transferAmountTextInput,
                      buid,
                      bpushToken,
                      "coins"
                    );
                  });
                textTAmountRefInput.clear();
                textTEmailRefTextInput.clear();
                // /saving to transfers
              } else {
                Alert.alert("You cannot transfer to yourself");
              }
            } else {
              Alert.alert("This beneficiary does not exists");
            }

            // Cancel enumeration
            return true;
          });
        });
      } else {
        Alert.alert("No enough earnings");
      }
    } else {
      Alert.alert("Fields cannot be empty");
    }
  };
  const handleAddedFundsTransfer = () => {
    if (
      transferAddedFundsAmountTextInput != null &&
      transferAddedFundsAmountTextInput != "" &&
      transferAddedFundsEmailTextInput != null &&
      transferAddedFundsEmailTextInput != ""
    ) {
      if (userAddedFunds >= transferAddedFundsAmountTextInput) {
        var query = firebase
          .database()
          .ref("/Users/")
          .orderByChild("email")
          .equalTo(transferAddedFundsEmailTextInput);
        query.once("value").then(function (snapshot) {
          if (!snapshot.exists()) {
            Alert.alert("This beneficiary does not exists");
          }
          snapshot.forEach(function (childSnapshot) {
            // saving to beneficiary account
            var key = childSnapshot.key;
            var bamount;
            var childData = childSnapshot.child("email").val();
            var buid = childSnapshot.child("uid").val();
            var bname = childSnapshot.child("name").val();
            var bpushToken = childSnapshot.child("expoPushToken").val();
            if (childData == transferAddedFundsEmailTextInput) {
              if (uid != buid) {
                if (childSnapshot.hasChild("added_funds")) {
                  bamount = childSnapshot.child("added_funds").val();
                } else {
                  bamount = 0;
                }
                firebase
                  .database()
                  .ref("Users")
                  .child(buid)
                  .child("added_funds")
                  .ref.set(
                    parseInt(transferAddedFundsAmountTextInput) + bamount
                  );
                // /saving to beneficiary account
                // saving to transfers
                const transferid = firebase.database().ref("/Transfers").push()
                  .key;
                const timestamp = Firebase.database.ServerValue.TIMESTAMP;

                firebase
                  .database()
                  .ref("/User Transfers/")
                  .child(transferid)
                  .update({
                    sender_id: uid,
                    receiver_email: transferAddedFundsEmailTextInput,
                    receiver_id: buid,
                    converted_coins: parseInt(
                      transferAddedFundsAmountTextInput
                    ),
                    transfer_id: transferid,
                    timestamp: timestamp,
                    type: "added_funds",
                    name: "credit",
                    role: "user",
                  })
                  .then(() => {
                    Notifications.presentLocalNotificationAsync({
                      title: "Congratulations",
                      body:
                        "You've successfully transferred " +
                        transferAddedFundsAmountTextInput +
                        " Naira to " +
                        bname,
                    });

                    // DEDUCT current user funds
                    firebase
                      .database()
                      .ref(`Users/${uid}`)
                      .update({
                        added_funds: parseInt(
                          userAddedFunds - transferAddedFundsAmountTextInput
                        ),
                      });
                    // /DEDUCT current user funds

                    SendUserNotification(
                      transferAddedFundsAmountTextInput,
                      buid,
                      bpushToken,
                      "Naira"
                    );
                  });
                textTAFAmountRefInput.clear();
                textTAFEmailRefTextInput.clear();
                // /saving to transfers
              } else {
                Alert.alert("You cannot transfer to yourself");
              }
            } else {
              Alert.alert("This beneficiary does not exists");
            }

            // Cancel enumeration
            return true;
          });
        });
      } else {
        Alert.alert("No enough added funds");
      }
    } else {
      Alert.alert("Fields cannot be empty");
    }
  };

  const MinusAndResetEarnings = () => {
    firebase
      .database()
      .ref("Forum Post Earnings")
      .orderByChild("userid")
      .equalTo(uid)
      .once("value")
      .then((snapshot) => {
        snapshot.ref.set(null);
      });

    firebase
      .database()
      .ref("Users")
      .child(uid)
      .once("value", (snapshot) => {
        if (
          snapshot.exists() &&
          snapshot != null &&
          snapshot.hasChild("converted_coins")
        ) {
          snapshot
            .child("converted_coins")
            .ref.set(userCoinsEarning - transferAmountTextInput);
        } else {
          // do nothing
        }
      });

    setTransferModal(false);
    if (userForumEarnings() === undefined) {
      //setTotalEarnings(0 + userAccountEarnings());
      setUserCoinsEarning(0 + userCoinsEarning);
    } else {
      setUserCoinsEarning(userCoinsEarning);
      //setTotalEarnings(userForumEarnings() + userAccountEarnings());
    }
    userAccountCoinFundEarnigs();
  };

  const handlePointToCoinConversion = () => {
    if (totalEarnings >= minimumConvertPoint) {
      if (totalEarnings != 0) {
        const c = (totalEarnings * eqvPointCoin) / 100;

        firebase
          .database()
          .ref("Users")
          .child(uid)
          .once("value", (snapshot) => {
            if (snapshot.exists() && snapshot != null) {
              snapshot.child("amount").ref.set(0);
              snapshot.child("converted_coins").ref.set(c);
              setTotalEarnings(0);
              setUserCoinsEarning(parseFloat(c));
            } else {
              // do nothing
            }
            return true;
          });
      } else {
        Alert.alert("Cannot convert 0 point");
      }
    } else {
      Alert.alert(
        "You need to reach minimum of " +
          minimumTransferAddedFunds +
          " POINTS in order to convert to coins"
      );
    }
  };

  const SendUserNotification = (amount, userid, usertoken, type) => {
    const nid = firebase.database().ref("/Notifications").push().key;
    const timestamp = Firebase.database.ServerValue.TIMESTAMP;

    firebase
      .database()
      .ref("Notifications")
      .child(nid)
      .update({
        nid: nid,
        type: "transfers",
        //type_id: ref_postid,
        to: userid,
        from: uid,
        title: `New transfer from ${currentUsername}`,
        body: `${amount} ${type} credited`,
        status: "unread",
        timestamp: timestamp,
      });

    // sending remote notification
    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("notification", {
        name: "Notification",
        sound: true,
      });
    }
    let response = fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: usertoken,
        sound: "default",
        title: `New transfer from ${currentUsername}`,
        body: `${amount} points credited`,
        data: { type: "transfers" },
      }),
      vibrate: true,
      android: {
        channelId: "transfers",
        sound: true,
      },
      ios: {
        sound: true,
      },
      priority: "max",
    });
    // /sending remote notification
  };

  const handleUpgrade = () => {
    if (currentUserAccountType == "" || currentUserAccountType == null) {
      if (userAddedFunds >= upgradeFeeNormal) {
        firebase
          .database()
          .ref(`Users/${uid}`)
          .update({
            account_type: "normal",
            added_funds: userAddedFunds - upgradeFeeNormal,
          })
          .then(() => Alert.alert("Successfully upgraded"));
        userAccountCoinFundEarnigs();
      } else {
        Alert.alert(`You need ₦ ${upgradeFeeNormal} to upgrade your account`);
      }
    } else if (currentUserAccountType == "normal") {
      if (userAddedFunds >= upgradeFeeVIP) {
        firebase
          .database()
          .ref(`Users/${uid}`)
          .update({
            account_type: "vip",
            added_funds: userAddedFunds - upgradeFeeVIP,
          })
          .then(() => Alert.alert("Successfully upgraded"));
        userAccountCoinFundEarnigs();
      } else {
        Alert.alert(`You need ₦ ${upgradeFeeVIP} to upgrade your account`);
      }
    } else if (currentUserAccountType == "vip") {
      if (userAddedFunds >= upgradeFeeVVIP) {
        firebase
          .database()
          .ref(`Users/${uid}`)
          .update({
            account_type: "vvip",
            added_funds: userAddedFunds - upgradeFeeVVIP,
          })
          .then(() => Alert.alert("Successfully upgraded"));
        userAccountCoinFundEarnigs();
      } else {
        Alert.alert(`You need ₦ ${upgradeFeeVVIP} to upgrade your account`);
      }
    } else if (currentUserAccountType == "vvip") {
      Alert.alert(`Your account doesn't need an update yet.`);
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <ScreenHeader navigation={navigation} headerName="My Wallet" />
      <ScrollView>
        {withdrawModal === true ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={withdrawModal}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Payment Details</Text>
                <TextInput
                  ref={(input) => {
                    setWRefTextInput(input);
                  }}
                  style={{ maxHeight: 60, margin: 15 }}
                  multiline
                  onChangeText={(text) => setWithdrawTextInput(text)}
                  placeholder="Payment address"
                  value={withdrawTextInput}
                />
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: colors.primary,
                    marginVertical: 15,
                  }}
                  onPress={() => {
                    if (userCoinsEarning >= minimumWithdrawCoin) {
                      handleWithdraw();
                    } else {
                      Alert.alert(
                        "You need to reach minimum of " +
                          minimumWithdrawCoin +
                          " coins in order to make a withdrawal"
                      );
                    }
                  }}
                >
                  <Text style={styles.textStyle}>Submit</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: colors.danger,
                  }}
                  onPress={() => {
                    textWRefInput.clear();
                    setWithdrawModal(false);
                  }}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        ) : null}
        {withdrawReferralBonusModal === true ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={withdrawReferralBonusModal}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Payment Details</Text>
                <TextInput
                  ref={(input) => {
                    setWRBRefTextInput(input);
                  }}
                  style={{ maxHeight: 60, margin: 15 }}
                  multiline
                  onChangeText={(text) =>
                    setWithdrawReferralBonusTextInput(text)
                  }
                  placeholder="Payment address"
                  value={withdrawReferralBonusTextInput}
                />
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: colors.primary,
                    marginVertical: 15,
                  }}
                  onPress={() => {
                    if (userReferralBonus >= minimumWithdrawReferralBonus) {
                      handleWithdrawReferralBonus();
                    } else {
                      Alert.alert(
                        "You need to reach minimum of " +
                          minimumWithdrawReferralBonus +
                          " in order to make a withdrawal"
                      );
                    }
                  }}
                >
                  <Text style={styles.textStyle}>Submit</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: colors.danger,
                  }}
                  onPress={() => {
                    textWRBRefInput.clear();
                    setWithdrawReferralBonusModal(false);
                  }}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        ) : null}
        {transferModal === true ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={transferModal}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Enter Beneficiary Amount and Email Address
                </Text>
                <TextInput
                  ref={(input) => {
                    setTAmountRefTextInput(input);
                  }}
                  style={{ maxHeight: 60, margin: 15 }}
                  onChangeText={(text) => setTransferAmountTextInput(text)}
                  placeholder="Amount"
                  value={transferAmountTextInput}
                />
                <TextInput
                  ref={(input) => {
                    setTEmailRefTextInput(input);
                  }}
                  style={{ maxHeight: 60, margin: 15 }}
                  onChangeText={(text) => setTransferEmailTextInput(text)}
                  placeholder="Email Address"
                  value={transferEmailTextInput}
                />
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: colors.primary,
                    marginVertical: 15,
                  }}
                  onPress={() => {
                    if (userCoinsEarning >= minimumTransferCoin) {
                      handleTransfer();
                    } else {
                      Alert.alert(
                        "You need to reach minimum of " +
                          minimumTransferCoin +
                          " coins in order to transfer"
                      );
                    }
                  }}
                >
                  <Text style={styles.textStyle}>Submit</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: colors.danger,
                  }}
                  onPress={() => {
                    textTAmountRefInput.clear();
                    textTEmailRefTextInput.clear();
                    setTransferModal(false);
                  }}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        ) : null}
        {transferAddedFundsModal === true ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={transferAddedFundsModal}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Enter Beneficiary Amount and Email Address
                </Text>
                <TextInput
                  ref={(input) => {
                    setTAFAmountRefTextInput(input);
                  }}
                  style={{ maxHeight: 60, margin: 15 }}
                  onChangeText={(text) =>
                    setTransferAddedFundsAmountTextInput(text)
                  }
                  placeholder="Amount"
                  value={transferAddedFundsAmountTextInput}
                />
                <TextInput
                  ref={(input) => {
                    setTAFEmailRefTextInput(input);
                  }}
                  style={{ maxHeight: 60, margin: 15 }}
                  onChangeText={(text) =>
                    setTransferAddedFundsEmailTextInput(text)
                  }
                  placeholder="Email Address"
                  value={transferAddedFundsEmailTextInput}
                />
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: colors.primary,
                    marginVertical: 15,
                  }}
                  onPress={() => {
                    if (userAddedFunds >= minimumTransferAddedFunds) {
                      handleAddedFundsTransfer();
                    } else {
                      Alert.alert(
                        "You need to reach minimum of ₦ " +
                          minimumTransferAddedFunds +
                          " in order to transfer"
                      );
                    }
                  }}
                >
                  <Text style={styles.textStyle}>Submit</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: colors.danger,
                  }}
                  onPress={() => {
                    textTAFAmountRefInput.clear();
                    textTAFEmailRefTextInput.clear();
                    setTransferAddedFundsModal(false);
                  }}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        ) : null}
        {referralModal === true ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={referralModal}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Enter User Email Address</Text>
                <TextInput
                  ref={(input) => {
                    setREmailRefTextInput(input);
                  }}
                  style={{ maxHeight: 60, margin: 15 }}
                  onChangeText={(text) => setReferralEmailTextInput(text)}
                  placeholder="Email Address"
                  value={referralEmailTextInput}
                />
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: colors.primary,
                    marginVertical: 15,
                  }}
                  onPress={() => {
                    handleReferral();
                  }}
                >
                  <Text style={styles.textStyle}>Submit</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: colors.danger,
                  }}
                  onPress={() => {
                    textREmailRefTextInput.clear();
                    setReferralModal(false);
                  }}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        ) : null}
        <View style={styles.cardBox}>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 18,
                  color: colors.white,
                  fontWeight: "bold",
                }}
              >
                Available Balance
              </Text>
            </View>

            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.white,
                  marginTop: 15,
                }}
              >
                POINTS
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                style={{
                  fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
                  fontSize: 38,
                  color: colors.white,
                  marginTop: -15,
                  fontWeight: Platform.OS === "android" ? "bold" : "bold",
                }}
              >
                {totalEarnings}
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.white,
                  marginTop: 15,
                }}
              >
                COINS
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                style={{
                  fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
                  fontSize: 38,
                  color: colors.white,
                  marginTop: -15,
                  fontWeight: Platform.OS === "android" ? "bold" : "bold",
                }}
              >
                {userCoinsEarning.toFixed(2)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.white,
                  marginTop: 15,
                }}
              >
                ADDED FUNDS
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                style={{
                  fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
                  fontSize: 38,
                  color: colors.white,
                  marginTop: -15,
                  fontWeight: Platform.OS === "android" ? "bold" : "bold",
                }}
              >
                {"₦ " + userAddedFunds}
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.white,
                  marginTop: 15,
                }}
              >
                COIN EQUIVALENT
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                style={{
                  fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
                  fontSize: 38,
                  color: colors.white,
                  marginTop: -15,
                  fontWeight: Platform.OS === "android" ? "bold" : "bold",
                }}
              >
                {userCoinsEarning != undefined &&
                userCoinsEarning != null &&
                eqvCoinDollar != undefined &&
                eqvCoinDollar != null
                  ? (userCoinsEarning / eqvCoinDollar).toFixed(2)
                  : "Loading"}
                {" $"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.white,
                  marginTop: 15,
                }}
              >
                REFERRAL BONUS
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                style={{
                  fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
                  fontSize: 38,
                  color: colors.white,
                  marginTop: -15,
                  fontWeight: Platform.OS === "android" ? "bold" : "bold",
                }}
              >
                {userReferralBonus != undefined && userReferralBonus != null
                  ? userReferralBonus
                  : "Loading"}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => setWithdrawModal(true)}>
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
                  Withdraw Coins{" "}
                </Text>
                <MaterialCommunityIcons
                  name="arrow-up-circle-outline"
                  size={24}
                  color={colors.white}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setWithdrawReferralBonusModal(true)}>
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
                  Withdraw Referral Bonus{" "}
                </Text>
                <MaterialCommunityIcons
                  name="arrow-up-circle-outline"
                  size={24}
                  color={colors.white}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTransferModal(true)}>
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
                  Transfer Coins{" "}
                </Text>
                <MaterialCommunityIcons
                  name="transit-transfer"
                  size={24}
                  color={colors.white}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTransferAddedFundsModal(true)}>
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
                  Transfer Added Funds{" "}
                </Text>
                <MaterialCommunityIcons
                  name="transit-transfer"
                  size={24}
                  color={colors.white}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePointToCoinConversion()}>
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
                  Convert Point to Coin{" "}
                </Text>
                <FontAwesome name="exchange" size={24} color={colors.white} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(routes.TRANSACTIONHISTORY)}
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
                  Transaction History{" "}
                </Text>
                <MaterialCommunityIcons
                  name="history"
                  size={24}
                  color={colors.white}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(routes.USERADDFUND)}
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
                  Add Funds{" "}
                </Text>
                <Entypo name="add-to-list" size={24} color={colors.white} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setReferralModal(true)}>
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
                  Refer User{" "}
                </Text>
                <MaterialIcons
                  name="insert-invitation"
                  size={24}
                  color={colors.white}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleUpgrade()}>
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
                  Upgrade Account{" "}
                </Text>
                <Feather name="move" size={24} color={colors.white} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    backgroundColor: colors.primary,
  },
  cardBox: {
    flexDirection: "row",
    padding: 10,
    marginTop: 20,
  },
  card: {
    width: "100%",
    height: 500,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    width: "70%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default WalletScreen;
