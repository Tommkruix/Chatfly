import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  ToastAndroid,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";
import Divider from "../components/lists/Divider";
import InputSpinner from "react-native-input-spinner";
import firebase from "../config/init";
import TextInputComponent from "../components/TextInputComponent";
import routes from "../navigation/routes";

function AdministrationWalletScreen({ navigation }) {
  const uid = firebase.auth().currentUser.uid;

  const [totalPoint, setTotalPoint] = useState(0);
  const [totalCoin, setTotalCoin] = useState(0);
  const [totalFunds, setTotalFunds] = useState(0);
  const [eqvPointCoin, setEqvPointCoin] = useState(0);
  const [eqvCoinDollar, setEqvCoinDollar] = useState(0);
  const [eqvReferralBonus, setEqvReferralBonus] = useState(0);
  const [earningPerPostLikeOwner, setEarningPerPostLikeOwner] = useState(0);
  const [earningPerPostLikeViewer, setEarningPerPostLikeViewer] = useState(0);
  const [earningPerPostCommentOwner, setEarningPerPostCommentOwner] = useState(
    0
  );
  const [
    earningPerPostCommentViewer,
    setEarningPerPostCommentViewer,
  ] = useState(0);
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
  const [dailyLimitEarningPoint, setDailyLimitEarningPoint] = useState(0);
  const [
    dailyNormalLimitEarningPoint,
    setDailyNormalLimitEarningPoint,
  ] = useState(0);
  const [dailyVIPLimitEarningPoint, setDailyVIPLimitEarningPoint] = useState(0);
  const [dailyVVIPLimitEarningPoint, setDailyVVIPLimitEarningPoint] = useState(
    0
  );
  const [paymentAddressText, setPaymentAddressText] = useState("");
  const [paymentAddressRetrieve, setPaymentAddressRetrieve] = useState("");

  useEffect(() => {
    handleDefaultSettings();
  }, []);

  useEffect(() => {
    handleUsersEarnings();
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
          snapshot.hasChild("earning_per_postlike_owner") &&
          snapshot.child("earning_per_postlike_owner").exists
        ) {
          setEarningPerPostLikeOwner(
            snapshot.child("earning_per_postlike_owner").val()
          );
        } else {
          setEarningPerPostLikeOwner(0);
        }
        if (
          snapshot.hasChild("earning_per_postcomment_owner") &&
          snapshot.child("earning_per_postcomment_owner").exists
        ) {
          setEarningPerPostCommentOwner(
            snapshot.child("earning_per_postcomment_owner").val()
          );
        } else {
          setEarningPerPostCommentOwner(0);
        }

        if (
          snapshot.hasChild("earning_per_postlike_viewer") &&
          snapshot.child("earning_per_postlike_viewer").exists
        ) {
          setEarningPerPostLikeViewer(
            snapshot.child("earning_per_postlike_viewer").val()
          );
        } else {
          setEarningPerPostLikeViewer(0);
        }
        if (
          snapshot.hasChild("earning_per_postcomment_viewer") &&
          snapshot.child("earning_per_postcomment_viewer").exists
        ) {
          setEarningPerPostCommentViewer(
            snapshot.child("earning_per_postcomment_viewer").val()
          );
        } else {
          setEarningPerPostCommentViewer(0);
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

        if (
          snapshot.hasChild("daily_limit_earning_point") &&
          snapshot.child("daily_limit_earning_point").exists
        ) {
          setDailyLimitEarningPoint(
            snapshot.child("daily_limit_earning_point").val()
          );
        } else {
          setDailyLimitEarningPoint(0);
        }
        if (
          snapshot.hasChild("daily_normallimit_earning_point") &&
          snapshot.child("daily_normallimit_earning_point").exists
        ) {
          setDailyNormalLimitEarningPoint(
            snapshot.child("daily_normallimit_earning_point").val()
          );
        } else {
          setDailyNormalLimitEarningPoint(0);
        }
        if (
          snapshot.hasChild("daily_viplimit_earning_point") &&
          snapshot.child("daily_viplimit_earning_point").exists
        ) {
          setDailyVIPLimitEarningPoint(
            snapshot.child("daily_viplimit_earning_point").val()
          );
        } else {
          setDailyVIPLimitEarningPoint(0);
        }
        if (
          snapshot.hasChild("daily_vviplimit_earning_point") &&
          snapshot.child("daily_vviplimit_earning_point").exists
        ) {
          setDailyVVIPLimitEarningPoint(
            snapshot.child("daily_vviplimit_earning_point").val()
          );
        } else {
          setDailyVVIPLimitEarningPoint(0);
        }

        if (
          snapshot.hasChild("added_fund_payment_address") &&
          snapshot.child("added_fund_payment_address").exists
        ) {
          setPaymentAddressRetrieve(
            snapshot.child("added_fund_payment_address").val()
          );
        } else {
          setPaymentAddressRetrieve("");
        }
      });
  };

  const handleUsersEarnings = () => {
    /*firebase
      .database()
      .ref("Forum Post Earnings")
      .orderByKey()
      .on("value", (snapshot) => {
        let amt = 0;
        snapshot.forEach(function (childSnapshot) {
          var data = childSnapshot.val();
          if (data.amount != null) amt += parseInt(data.amount);
        });
        setTotalPoint(amt);
      });*/
    firebase
      .database()
      .ref("Forum Post Earnings")
      .orderByKey()
      .on("value", function (snapshot) {
        var count = 0;
        snapshot.forEach(function () {
          count++;
        });
        //count is now safe to use.
        setTotalPoint(count);
      });

    firebase
      .database()
      .ref("Users")
      .orderByKey()
      .on("value", (snapshot) => {
        let amt = 0;
        snapshot.forEach(function (childSnapshot) {
          var data = childSnapshot.val();
          if (data.converted_coins != null)
            amt += parseFloat(data.converted_coins);
        });
        setTotalCoin(amt);
      });

    firebase
      .database()
      .ref("Users")
      .orderByKey()
      .on("value", (snapshot) => {
        let amt = 0;
        snapshot.forEach(function (childSnapshot) {
          var data = childSnapshot.val();
          if (data.added_funds != null) amt += parseFloat(data.added_funds);
        });
        setTotalFunds(amt);
      });
  };

  const handleSettingsUpdate = () => {
    firebase
      .database()
      .ref("Administration")
      .update({
        point_to_coin_eqv: eqvPointCoin,
        coin_to_dollar_eqv: eqvCoinDollar,
        referral_bonus: eqvReferralBonus,
        earning_per_postlike_owner: earningPerPostLikeOwner,
        earning_per_postlike_viewer: earningPerPostLikeViewer,
        earning_per_postcomment_owner: earningPerPostCommentOwner,
        earning_per_postcomment_viewer: earningPerPostCommentViewer,
        upgrade_fee_normal: upgradeFeeNormal,
        upgrade_fee_vip: upgradeFeeVIP,
        upgrade_fee_vvip: upgradeFeeVVIP,
        minimum_convert_point: minimumConvertPoint,
        minimum_transfer_coin: minimumTransferCoin,
        minimum_transfer_added_funds: minimumTransferAddedFunds,
        minimum_withdraw_coin: minimumWithdrawCoin,
        minimum_withdraw_referral_bonus: minimumWithdrawReferralBonus,
        daily_limit_earning_point: dailyLimitEarningPoint,
        daily_normallimit_earning_point: dailyNormalLimitEarningPoint,
        daily_viplimit_earning_point: dailyVIPLimitEarningPoint,
        daily_vviplimit_earning_point: dailyVVIPLimitEarningPoint,
      })
      .then(() =>
        Platform.OS === "ios"
          ? Alert.alert("Conversions updated.")
          : ToastAndroid.show("Conversions updated.", ToastAndroid.SHORT)
      );

    return true;
  };

  const handlePaymentAddressUpdate = () => {
    firebase.database().ref(`/Administration`).update({
      added_fund_payment_address: paymentAddressText,
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader headerName="Wallet Settings" navigation={navigation} />
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            padding: 25,
            paddingTop: 25,
            paddingBottom: 10,
          }}
        >
          <Text style={{ fontSize: 18 }}>
            Total available points in user's wallet
          </Text>
        </View>
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
                {totalPoint + " POINTS"}
              </Text>
            </View>
          </View>
        </View>
        <Divider />
        <View
          style={{
            flexDirection: "row",
            padding: 25,
            paddingTop: 25,
            paddingBottom: 10,
          }}
        >
          <Text style={{ fontSize: 18 }}>
            Total available coins in user's wallet
          </Text>
        </View>
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
                {totalCoin.toFixed(2) + " COINS"}
              </Text>
            </View>
          </View>
        </View>
        <Divider />
        <View
          style={{
            flexDirection: "row",
            padding: 25,
            paddingTop: 25,
            paddingBottom: 10,
          }}
        >
          <Text style={{ fontSize: 18 }}>
            Total available added funds in user's wallet
          </Text>
        </View>
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
                {`₦ ${totalFunds.toFixed(2)}`}
              </Text>
            </View>
          </View>
        </View>
        <Divider />
        <View
          style={{
            flexDirection: "row",
            padding: 25,
            paddingTop: 25,
            paddingBottom: 10,
          }}
        >
          <Text style={{ fontSize: 18 }}>User's Wallet Management</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(routes.ADMINISTRATIONUSERLISTS)}
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
          <Text style={{ fontSize: 18 }}>Payment address:</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            padding: 25,
            paddingTop: 25,
            paddingBottom: 10,
          }}
        >
          <TextInputComponent
            title="Write payment address"
            iconName="address-card"
            //maxLength={40}
            onChangeText={(text) => setPaymentAddressText(text)}
            onPress={handlePaymentAddressUpdate}
            defaultValue={paymentAddressRetrieve}
            //value={paymentAddressRetrieve}
            placeholder="Write payment address."
            autoCompleteType="off"
            placeholderTextColor={colors.primary}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(routes.COINWITHDRAWREQUESTS)}
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
                  View Coin Withdrawal Requests
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(routes.REFERRALBONUSWITHDRAWREQUESTS)
          }
        >
          <View style={[styles.cardSmallBox, { flexDirection: "column" }]}>
            <View style={styles.cardSmall}>
              <View style={[styles.row, { justifyContent: "center" }]}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.white,
                    fontWeight: "bold",
                  }}
                >
                  View Referral Withdrawal Requests
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(routes.ADDEDFUNDSREQUESTS)}
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
                  View Added Fund Requests
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <Divider />

        {/* Process */}
        <Text
          style={{
            padding: 25,
            fontSize: 18,
          }}
        >
          Set "Point to Coin" conversion
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={100000}
            min={0}
            step={1}
            value={eqvPointCoin}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            append={<Text style={{ padding: 10 }}>%</Text>}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={eqvPointCoin}
            onChange={(num) => {
              setEqvPointCoin(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set "Coin to Dollar" conversion
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={100000}
            min={0}
            step={1}
            value={eqvCoinDollar}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            append={<Text style={{ padding: 10 }}>$</Text>}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={eqvCoinDollar}
            onChange={(num) => {
              setEqvCoinDollar(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set Bonus Per User Referral
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={100000}
            min={0}
            step={1}
            value={eqvReferralBonus}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={eqvReferralBonus}
            onChange={(num) => {
              setEqvReferralBonus(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set "Normal Account" Upgrade Fee
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={10000000000000}
            min={10}
            step={10}
            value={upgradeFeeNormal}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            append={<Text style={{ padding: 10 }}>₦</Text>}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={upgradeFeeNormal}
            onChange={(num) => {
              setUpgradeFeeNormal(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set "VIP Account" Upgrade Fee
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={100000000000}
            min={10}
            step={10}
            value={upgradeFeeVIP}
            append={<Text style={{ padding: 10 }}>₦</Text>}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={upgradeFeeVIP}
            onChange={(num) => {
              setUpgradeFeeVIP(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set "VVIP Account" Upgrade Fee
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={100000000000000}
            min={10}
            step={10}
            value={upgradeFeeVVIP}
            append={<Text style={{ padding: 10 }}>₦</Text>}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={upgradeFeeVVIP}
            onChange={(num) => {
              setUpgradeFeeVVIP(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set User "Minimum Point Conversion"
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={100000000000000}
            min={10}
            step={10}
            value={minimumConvertPoint}
            append={<Text style={{ padding: 10 }}>POINTS</Text>}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={minimumConvertPoint}
            onChange={(num) => {
              setMinimumConvertPoint(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set User "Minimum Transferable Coin"
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={100000000000000}
            min={10}
            step={10}
            value={minimumTransferCoin}
            append={<Text style={{ padding: 10 }}>COINS</Text>}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={minimumTransferCoin}
            onChange={(num) => {
              setMinimumTransferCoin(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set User "Minimum Transferable Added Funds"
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={100000000000000}
            min={10}
            step={10}
            value={minimumTransferAddedFunds}
            append={<Text style={{ padding: 10 }}>₦</Text>}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={minimumTransferAddedFunds}
            onChange={(num) => {
              setMinimumTransferAddedFunds(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set User "Minimum Withdrawable Coins"
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={100000000000000}
            min={10}
            step={10}
            value={minimumWithdrawCoin}
            append={<Text style={{ padding: 10 }}>COINS</Text>}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={minimumWithdrawCoin}
            onChange={(num) => {
              setMinimumWithdrawCoin(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set User "Minimum Withdrawable Referral Bonus"
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={100000000000000}
            min={10}
            step={10}
            value={minimumWithdrawReferralBonus}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={minimumWithdrawReferralBonus}
            onChange={(num) => {
              setMinimumWithdrawReferralBonus(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set Non-Verified User "Daily Limit Earning Point"
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={100000000000000}
            min={1}
            step={1}
            value={dailyLimitEarningPoint}
            append={<Text style={{ padding: 10 }}>POINTS</Text>}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={dailyLimitEarningPoint}
            onChange={(num) => {
              setDailyLimitEarningPoint(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set Normal-Verified User "Daily Limit Earning Point"
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={100000000000000}
            min={1}
            step={1}
            value={dailyNormalLimitEarningPoint}
            append={<Text style={{ padding: 10 }}>POINTS</Text>}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={dailyNormalLimitEarningPoint}
            onChange={(num) => {
              setDailyNormalLimitEarningPoint(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set VIP-Verified User "Daily Limit Earning Point"
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={100000000000000}
            min={1}
            step={1}
            value={dailyVIPLimitEarningPoint}
            append={<Text style={{ padding: 10 }}>POINTS</Text>}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={dailyVIPLimitEarningPoint}
            onChange={(num) => {
              setDailyVIPLimitEarningPoint(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set VVIP-Verified User "Daily Limit Earning Point"
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={100000000000000}
            min={1}
            step={1}
            value={dailyVVIPLimitEarningPoint}
            append={<Text style={{ padding: 10 }}>POINTS</Text>}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={dailyVVIPLimitEarningPoint}
            onChange={(num) => {
              setDailyVVIPLimitEarningPoint(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set "Earning Per Post Like" for Author
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={10}
            min={0}
            step={1}
            value={earningPerPostLikeOwner}
            append={<Text style={{ padding: 10 }}>POINTS</Text>}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={earningPerPostLikeOwner}
            onChange={(num) => {
              setEarningPerPostLikeOwner(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set "Earning Per Post Comment" for Author
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={10}
            min={0}
            step={1}
            value={earningPerPostCommentOwner}
            append={<Text style={{ padding: 10 }}>POINTS</Text>}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={earningPerPostCommentOwner}
            onChange={(num) => {
              setEarningPerPostCommentOwner(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set "Earning Per Post Like" for Viewer
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={10}
            min={0}
            step={1}
            value={earningPerPostLikeViewer}
            append={<Text style={{ padding: 10 }}>POINTS</Text>}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={earningPerPostLikeViewer}
            onChange={(num) => {
              setEarningPerPostLikeViewer(num);
            }}
          />
        </View>
        <Text style={{ padding: 25, fontSize: 18 }}>
          Set "Earning Per Post Comment" for Viewer
        </Text>
        <View style={([styles.row], { marginHorizontal: 25 })}>
          <InputSpinner
            max={10}
            min={0}
            step={1}
            value={earningPerPostCommentViewer}
            append={<Text style={{ padding: 10 }}>POINTS</Text>}
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignContent: "center",
            }}
            height={40}
            editable={true}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={earningPerPostCommentViewer}
            onChange={(num) => {
              setEarningPerPostCommentViewer(num);
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            handleSettingsUpdate();
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
                  Update Conversions{" "}
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
      </ScrollView>
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

export default AdministrationWalletScreen;
