import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Firebase from "firebase";

import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

import ScreenHeader from "../components/ScreenHeader";
import firebase from "../config/init";
import colors from "../constants/colors";
import InputSpinner from "react-native-input-spinner";
import TextInputComponent from "../components/TextInputComponent";

function UserAddFundScreen({ navigation }) {
  const uid = firebase.auth().currentUser.uid;
  const [txtPaymentAddress, setTxtPaymentAddress] = useState();
  const [txtAmount, setTxtAmount] = useState(0);
  const [txtExtraInfo, setTxtExtraInfo] = useState("");
  const [imageUri, setImageUri] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleDefaultSettings();
  }, []);

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      if (!result.cancelled) {
        setImageUri(result.uri);
      }
    } catch (error) {
      Alert.alert("Error reading image");
    }
  };

  const handleDefaultSettings = () => {
    firebase
      .database()
      .ref(`/Administration/`)
      .on("value", (snapshot) => {
        if (
          snapshot.hasChild("added_fund_payment_address") &&
          snapshot.child("added_fund_payment_address").exists
        ) {
          setTxtPaymentAddress(
            snapshot.child("added_fund_payment_address").val()
          );
        } else {
          setTxtPaymentAddress("");
        }
      });
  };

  const handlePost = async () => {
    setIsLoading(true);
    const uri = imageUri;
    if (uri != null && txtAmount > 0) {
      const uniqid = () => Math.random().toString(36).substr(2, 9);
      const ext = uri.split(".").pop(); // Extract image extension
      const filename = `${uniqid()}.${ext}`; // Generate unique name
      const ref = firebase
        .storage()
        .ref()
        .child("Add Fund Images/" + filename);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          //console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const snapshot = await ref.put(blob);

      blob.close();
      const imgUrl = await snapshot.ref.getDownloadURL();

      // save to forum posts
      const postid = firebase.database().ref("/Add Fund Requests").push().key;
      /*firebase.database().ref(`/Forum Posts/${postId}`).update({
        image: imgUrl,
      });*/

      const timestamp = Firebase.database.ServerValue.TIMESTAMP;

      firebase
        .database()
        .ref("/Add Fund Requests")
        .child(postid)
        .update({
          image: imgUrl,
          amount: txtAmount,
          userid: uid,
          postid: postid,
          userid_postid: uid + postid,
          timestamp: timestamp,
          extraInfo: txtExtraInfo,
        })
        .catch((error) => {
          Platform.OS === "android"
            ? ToastAndroid.show("Error occured", ToastAndroid.SHORT)
            : Alert.alert("Error occured");
        });
      // /save to forum posts
      //setPostButton(false);
      //console.log(imgUrl);
      setIsLoading(false);
      navigation.goBack();
      return imgUrl;
    } else {
      setIsLoading(false);
      Platform.OS === "android"
        ? ToastAndroid.show(
            "You need to upload an image and specify requested amount.",
            ToastAndroid.SHORT
          )
        : Alert.alert(
            "You need to upload an image and specify requested amount."
          );
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader headerName="Add Fund" navigation={navigation} />
      <ScrollView>
        <View style={styles.cardBox}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.light,
                height: "100%",
                paddingBottom: 20,
              },
            ]}
          >
            <View style={[styles.row, { padding: 10 }]}>
              <Text
                style={{
                  fontSize: 18,
                  color: colors.primary,
                }}
              >
                Please follow the instructions to add funds and make sure to
                upload a proof of payment once successful:
              </Text>
            </View>
            <View style={[styles.row, { margin: -10, padding: 10 }]}>
              <Text
                style={{
                  fontSize: 18,
                  color: colors.primary,
                  fontWeight: "bold",
                }}
              >
                {txtPaymentAddress}
              </Text>
            </View>
          </View>
        </View>
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
            Amount to be added:
          </Text>
          <View style={([styles.row], { marginHorizontal: 25 })}>
            <InputSpinner
              max={10000000000000000}
              min={0}
              step={10}
              value={txtAmount}
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
                setTxtAmount(num);
              }}
            />
          </View>
        </View>
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
            Extra Information (Optional):
          </Text>
          <View
            style={([styles.row], { marginHorizontal: 25, marginTop: -50 })}
          >
            <View
              style={{
                marginTop: 45,
                marginBottom: 15,
                backgroundColor: colors.light,
              }}
            >
              <TextInputComponent
                iconName="info"
                onChangeText={(text) => setTxtExtraInfo(text)}
                defaultValue={""}
                multiline={true}
                autoCompleteType="off"
                placeholderTextColor={colors.primary}
              />
            </View>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity style={styles.photo} onPress={selectImage}>
            {!imageUri && (
              <MaterialCommunityIcons
                size={40}
                name="camera"
                colors={colors.medium}
                style={{
                  alignSelf: "center",
                  marginTop: 130,
                  position: "absolute",
                }}
              />
            )}
            {imageUri && (
              <Image
                name="image"
                style={styles.imageStyle}
                source={{ uri: imageUri }}
              />
            )}
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <View
            style={{
              ...StyleSheet.absoluteFill,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.light,
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : null}
        <TouchableOpacity onPress={() => handlePost()}>
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
                  Upload{" "}
                </Text>
                <FontAwesome name="upload" size={24} color={colors.white} />
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
  cardBox: {
    flexDirection: "row",
    padding: 10,
    marginTop: 20,
  },
  card: {
    width: "100%",
    height: "100%",
    paddingBottom: 20,
    borderRadius: 10,
    backgroundColor: colors.light,
  },
  row: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  imageStyle: {
    width: 310,
    height: 310,
    borderRadius: 20,
  },
  photo: {
    alignSelf: "center",
    width: 310,
    height: 310,
    backgroundColor: colors.light,
    borderRadius: 20,
  },
  cardBox: {
    flexDirection: "row",
    padding: 10,
    marginTop: 20,
  },
  card: {
    width: "100%",
    height: 400,
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
});

export default UserAddFundScreen;
