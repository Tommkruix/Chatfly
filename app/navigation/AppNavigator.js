import React, { useEffect } from "react";
import { Image, View, Button, Text, Alert } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

import ChatListScreen from "../screens/ChatListScreen";
import OneToOneChatScreen from "../screens/OneToOneChatScreen";
import AppBar from "../components/AppBar";
import colors from "../constants/colors";
import ForumPostViewScreen from "../screens/ForumPostViewScreen";
import ForumAddPost from "../screens/ForumAddPost";
import ProfileScreen from "../screens/ProfileScreen";
import WalletScreen from "../screens/WalletScreen";
import ContactsScreen from "../screens/ContactsScreen";
import StoriesScreen from "../screens/StoriesScreen";
import StoriesViewScreen from "../screens/StoriesViewScreen";
import StoriesAddTextScreen from "../screens/StoriesAddTextScreen";
import StoriesAddImageScreen from "../screens/StoriesAddImageScreen";
import ForumPostScreen from "../screens/ForumPostScreen";
import LocalBrowserScreen from "../screens/LocalBrowserScreen";
import TransactionHistoryScreen from "../screens/TransactionHistoryScreen";
import useNotifications from "../hooks/useNotifications";
import navigation from "./rootNavigation";
import routes from "./routes";
import { Notifications } from "expo";
import firebase from "../config/init";
import * as Permissions from "expo-permissions";
import AccountScreen from "../screens/AccountScreen";
import UserAdvertisementsScreen from "../screens/UserAdvertisementsScreen";
import UserAdvertisementActions from "../screens/UserAdvertisementActionsScreen";
import UserAdvertisementActionsScreen from "../screens/UserAdvertisementActionsScreen";
import UserAdvertisementListsScreen from "../screens/UserAdvertisementListsScreen";
import AdministrationHomeScreen from "../screens/AdministrationHomeScreen";
import AdministrationWalletScreen from "../screens/AdministrationWalletScreen";
import AdministrationWalletUsersScreen from "../screens/AdministrationWalletUsersScreen";
import UserViewProfileScreen from "../screens/UserViewProfileScreen";
import EditUserPostScreen from "../screens/EditUserPostScreen";
import UserAddFundScreen from "../screens/UserAddFundScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import AdministrationUserListsScreen from "../screens/AdministrationUserListsScreen";
import AdministrationUserActionsScreen from "../screens/AdministrationUserActionsScreen";
import TestingScreen from "../screens/TestingScreen";
import FriendRequestScreen from "../screens/FriendRequestScreen";
import UsersListScreen from "../screens/UsersListScreen";
import CoinWithdrawRequestsScreen from "../screens/CoinWithdrawRequestsScreen";
import ReferralBonusWithdrawRequestsScreen from "../screens/ReferralBonusWithdrawRequestsScreen";
import AddedFundsRequestsScreen from "../screens/AddedFundsRequestsScreen";
import AdministrationTransactionScreen from "../screens/AdministrationTransactionScreen";
import AdministrationTransactionViewScreen from "../screens/AdministrationTransactionViewScreen";
import ViewImageScreen from "../screens/ViewImageScreen";
import ImageBrowserScreen from "../screens/ImageBrowserScreen";
import AdministrationUserPostActionsScreen from "../screens/AdministrationUserPostActionsScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import FollowingListsScreen from "../screens/FollowingListsScreen";
import FollowedListsScreen from "../screens/FollowedListsScreen";

const UsersListStack = createStackNavigator();

const UsersListStackNavigator = () => (
  <UsersListStack.Navigator>
    <UsersListStack.Screen
      name="UsersList"
      options={{ headerShown: false }}
      component={UsersListScreen}
    />
  </UsersListStack.Navigator>
);

const SearchStack = createStackNavigator();

const SearchStackNavigator = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen
      name="Contacts"
      options={{ headerShown: false }}
      component={ContactsScreen}
    />
  </SearchStack.Navigator>
);

/*const ForumStack = createStackNavigator();

const ForumStackNavigator = () => (
  <ForumStack.Navigator>
    <ForumStack.Screen
      options={{ headerShown: false }}
      name="ForumAddPost"
      component={ForumAddPost}
    />
  </ForumStack.Navigator>
);*/

/*const ForumPostViewStack = createStackNavigator();

const ForumPostViewNavigator = () => (
  <ForumPostViewStack.Navigator>
    <ForumPostViewStack.Screen
      options={{ headerShown: false }}
      name="ForumPostView"
      component={ForumPostViewScreen}
    />
  </ForumPostViewStack.Navigator>
);*/

const AppTab = createMaterialTopTabNavigator();

const AppTabNavigator = () => {
  /*useNotifications((notification) => {
    navigation.navigate(routes.CHATLIST);
  });*/

  useEffect(() => {
    registerForPushNotifications();

    Notifications.addListener((notification) => {
      if (notification.data.type === "withdraw") {
        navigation.navigate("Wallet");
      } else if (notification.data.type === "notifications") {
        navigation.navigate("Notifications");
      } else if (notification.data.type === "transfers") {
        navigation.navigate("Wallet");
      } else if (notification.data.type === "friend request") {
        navigation.navigate("FriendRequest");
      } else {
        navigation.navigate("Chats");
      }
    });
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (!permission.granted) return;

      const token = await Notifications.getExpoPushTokenAsync();
      const uid = firebase.auth().currentUser.uid;
      firebase.database().ref(`/Users/${uid}`).update({
        expoPushToken: token,
      });
    } catch (error) {
      console.log("Error getting a push token", error);
      Alert.alert();
    }
  };

  return (
    <AppTab.Navigator
      tabBarPosition="top"
      mode="modal"
      initialRouteName="Forum"
      tabBarOptions={{
        labelStyle: {
          fontSize: 14,
          fontWeight: "500",
          margin: 0,
          padding: 0,
        },
        activeTintColor: colors.white,
        inactiveTintColor: colors.light,
        indicatorStyle: {
          backgroundColor: colors.white,
          borderColor: "rgb(189,189,189)",
          borderWidth: 1,
          borderBottomWidth: 0,
          borderRadius: 5,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        },
        pressColor: colors.light,
        style: {
          backgroundColor: colors.primary,
        },
      }}
    >
      <AppTab.Screen
        name="Stories"
        options={{ headerShown: false, title: "STORIES" }}
        component={StoriesScreen}
      />
      <AppTab.Screen
        name="Chats"
        options={{ headerShown: false, title: "CHATS" }}
        component={ChatListScreen}
      />
      <AppTab.Screen
        name="ForumPost"
        options={{ headerShown: false, title: "TIMELINE" }}
        component={ForumPostScreen}
      />
      <AppTab.Screen
        name="Account"
        options={{
          headerShown: false,
          tabBarLabel: ({ focused, color, size }) => {
            return (
              <MaterialCommunityIcons
                name={focused ? "account-circle" : "account-circle-outline"}
                size={24}
                color={color}
              />
            );
          },
        }}
        component={AccountScreen}
      />
    </AppTab.Navigator>
  );
};

function wrap() {
  return (
    <>
      <AppBar />
      <AppTabNavigator />
    </>
  );
}

const ES = createStackNavigator();

const ESN = () => (
  <ES.Navigator screenOptions={{ headerShown: false }}>
    <ES.Screen
      name="BottomTab"
      component={wrap}
      options={{ headerShown: false }}
    />
    <ES.Screen name="OneToOneChat" component={OneToOneChatScreen} />
    <ES.Screen name="ForumPostView" component={ForumPostViewScreen} />
    <ES.Screen name="ForumAddPost" component={ForumAddPost} />
    <ES.Screen name="StoriesView" component={StoriesViewScreen} />
    <ES.Screen name="Profile" component={ProfileScreen} />
    <ES.Screen name="Wallet" component={WalletScreen} />
    <ES.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
    <ES.Screen name="StoriesAddText" component={StoriesAddTextScreen} />
    <ES.Screen name="StoriesAddImage" component={StoriesAddImageScreen} />
    <ES.Screen name="LocalBrowser" component={LocalBrowserScreen} />
    <ES.Screen name="UserAdvertisements" component={UserAdvertisementsScreen} />
    <ES.Screen name="UserViewProfile" component={UserViewProfileScreen} />
    <ES.Screen name="EditUserPost" component={EditUserPostScreen} />
    <ES.Screen name="EditProfile" component={EditProfileScreen} />
    <ES.Screen name="Settings" component={SettingsScreen} />
    <ES.Screen name="UserAddFund" component={UserAddFundScreen} />
    <ES.Screen name="Notifications" component={NotificationsScreen} />
    <ES.Screen name="ViewImage" component={ViewImageScreen} />
    <ES.Screen name="FollowingLists" component={FollowingListsScreen} />
    <ES.Screen name="FollowedLists" component={FollowedListsScreen} />
    <ES.Screen name="Testing" component={TestingScreen} />
    <ES.Screen
      name="ImageBrowser"
      component={ImageBrowserScreen}
      options={{
        title: "Selected 0 files",
        headerShown: true,
      }}
    />
    <ES.Screen
      name="UserAdvertisementLists"
      component={UserAdvertisementListsScreen}
    />
    <ES.Screen name="AdministrationHome" component={AdministrationHomeScreen} />
    <ES.Screen
      name="AdministrationWallet"
      component={AdministrationWalletScreen}
    />
    <ES.Screen
      name="AdministrationWalletUsers"
      component={AdministrationWalletUsersScreen}
    />
    <ES.Screen
      name="AdministrationTransaction"
      component={AdministrationTransactionScreen}
    />
    <ES.Screen
      name="AdministrationTransactionView"
      component={AdministrationTransactionViewScreen}
    />
    <ES.Screen
      name="UserAdvertisementActions"
      component={UserAdvertisementActionsScreen}
    />
    <ES.Screen name="FriendRequest" component={FriendRequestScreen} />

    <ES.Screen
      name="CoinWithdrawRequests"
      component={CoinWithdrawRequestsScreen}
    />

    <ES.Screen name="AddedFundsRequests" component={AddedFundsRequestsScreen} />

    <ES.Screen
      name="ReferralBonusWithdrawRequests"
      component={ReferralBonusWithdrawRequestsScreen}
    />

    <ES.Screen
      name="AdministrationUserLists"
      component={AdministrationUserListsScreen}
    />
    <ES.Screen
      name="AdministrationUserActions"
      component={AdministrationUserActionsScreen}
    />
    <ES.Screen
      name="AdministrationUserPostActions"
      component={AdministrationUserPostActionsScreen}
    />
    <ES.Screen
      name="Contacts"
      component={SearchStackNavigator}
      options={{ headerShown: false }}
    />
    <ES.Screen
      name="UsersList"
      component={UsersListStackNavigator}
      options={{ headerShown: false }}
    />
  </ES.Navigator>
);

export default ESN;
