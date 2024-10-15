import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Admin from "../screens/main/admin/Admin";

const RootAdminStack = createStackNavigator();

const RootAdminStackNavigation = () => {
  return (
    <RootAdminStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RootAdminStack.Screen
        name="admin"
        options={{ headerShown: false }}
        component={Admin}
      />
    </RootAdminStack.Navigator>
  );
};

export default RootAdminStackNavigation;

const styles = StyleSheet.create({});
