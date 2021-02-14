import React, { useState, useContext } from "react";
import { StyleSheet, Image, Text, View, Alert } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import {
  Form,
  FormField,
  SubmitButton,
  ErrorMessage,
} from "../components/forms";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../constants/colors";

import firebase from "../config/init";
import routes from "../navigation/routes";
import AuthContext from "../config/auth/context";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
});

function ForgotPasswordScreen({ navigation }) {
  const authContext = useContext(AuthContext);

  const [loginFailed, setLoginFailed] = useState(false);

  const handleSubmit = ({ email }) => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(function (user) {
        Alert.alert("Email Sent.");
      })
      .catch(function (e) {
        setLoginFailed(true);
      });
  };

  return (
    <Screen style={styles.container}>
      <Text style={styles.greeting}>Forgot Password</Text>

      <View style={styles.form}>
        <Form
          initialValues={{ email: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <ErrorMessage error="Invalid email." visible={loginFailed} />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
          />

          <SubmitButton title="Reset password" />
        </Form>

        <TouchableOpacity
          style={styles.linkcontainer}
          onPress={() => navigation.navigate(routes.REGISTER)}
        >
          <Text style={styles.linktext}>
            New To Chat Fly?
            <Text style={styles.linktextref}> Sign Up</Text>
          </Text>
        </TouchableOpacity>
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

export default ForgotPasswordScreen;
