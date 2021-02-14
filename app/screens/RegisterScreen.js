import React, { useState } from "react";
import { StyleSheet, Image, Text, View, TouchableOpacity } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import { Form, FormField, SubmitButton } from "../components/forms";
import routes from "../navigation/routes";
import ErrorMessage from "../components/forms/ErrorMessage";
import firebase from "../config/init";
import AuthContext from "../config/auth/context";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  phoneno: Yup.string().required().label("Phone No"),
  password: Yup.string().required().min(4).label("Password"),
});

function RegisterScreen({ navigation }) {
  const [registerFailed, setRegisterFailed] = useState(false);
  const [mes, setMes] = useState();
  const [user, setUser] = useState();
  const [viewPass, setViewPass] = useState(false);

  //const UsersRef = firebase.database().ref("/Users").push();
  //const UserID = UsersRef.key;

  const handleSubmit = ({ name, email, phoneno, password }) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        /*return userCredentials.user.updateProfile({
          username: name,
        });*/
        //this.update(name, userCredentials.user.uid);
        firebase.database().ref(`/Users/${userCredentials.user.uid}`).update({
          phoneno: phoneno,
          email: email,
          uid: userCredentials.user.uid,
          name: name,
        });
      })
      .catch((error) => {
        setMes(error.message);
        setRegisterFailed(true);
      });
    //referLink: name.substring(0, 3) + Math.round(Math.random() * 9999),
    /*firebase
      .database()
      .ref(`/Users/${uid}`)
      .update({
        age: 32,
        uid: uid,
        name: name,
      })
      .then(() => console.log("Data updated."));

    /*firebase
      .database()
      .ref("/Users")
      .push()
      .set({
        username: name,
        uid: UserID,
      })
      .then(() => console.log("Data updated"));*/
  };
  // console.log("user id outside fn", handleSubmit().uid);

  return (
    <Screen style={styles.container}>
      <Text style={styles.greeting}>{"Sign up to get started."}</Text>

      <View style={styles.form}>
        <Form
          initialValues={{ name: "", email: "", phoneno: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <ErrorMessage error={mes} visible={registerFailed} />
          <FormField
            autoCorrect={false}
            icon="account"
            name="name"
            placeholder="Name"
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
          />

          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="phone"
            keyboardType="number-pad"
            maxLength={11}
            name="phoneno"
            placeholder="Phone Number"
            textContentType="telephoneNumber"
          />

          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            onViewPass={() =>
              viewPass === true ? setViewPass(false) : setViewPass(true)
            }
            viewPass={viewPass === true ? "eye" : "eye-off"}
            secureTextEntry={viewPass === true ? false : true}
            icon="lock"
            name="password"
            placeholder="Password"
            textContentType="password"
          />
          <SubmitButton title="Register" />
        </Form>
        <TouchableOpacity
          style={styles.linkcontainer}
          onPress={() => navigation.navigate(routes.LOGIN)}
        >
          <Text style={styles.linktext}>
            Already Registered?
            <Text style={styles.linktextref}> Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greeting: {
    marginTop: 50,
    padding: 45,
    fontSize: 30,
    color: colors.primary,
    fontWeight: "800",
    textAlign: "center",
    alignSelf: "flex-start",
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
  },
  linkcontainer: {
    alignSelf: "center",
    marginTop: 32,
  },
  linktext: {
    color: colors.dark,
    fontSize: 13,
  },
  linktextref: {
    fontWeight: "500",
    color: colors.primary,
  },
});

export default RegisterScreen;
