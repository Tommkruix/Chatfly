import React, { useState, useContext } from "react";
import { StyleSheet, Image, Text, View } from "react-native";
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
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen({ navigation }) {
  const authContext = useContext(AuthContext);

  const [loginFailed, setLoginFailed] = useState(false);
  const [viewPass, setViewPass] = useState(false);

  const handleSubmit = ({ email, password }) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => setLoginFailed(true));
  };

  return (
    <Screen style={styles.container}>
      <Text style={styles.greeting}>Login</Text>

      <View style={styles.form}>
        <Form
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <ErrorMessage
            error="Invalid email and/or password."
            visible={loginFailed}
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
          <SubmitButton title="Login" />
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
          onPress={() => navigation.navigate(routes.FORGOTPASSWORD)}
        >
          <Text style={styles.linktext}>
            Forgot Password?
            <Text style={styles.linktextref}> Click here</Text>
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

export default LoginScreen;
