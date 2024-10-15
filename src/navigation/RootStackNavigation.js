import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import Home from "../screens/main/cust/Home";
import Register from "../screens/main/cust/Register";

const RootStack = createStackNavigator();

const RootStackNavigation = () => {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RootStack.Screen
        name="Home"
        options={{ headerShown: false }}
        component={Home}
      />
      <RootStack.Screen
        name="Register"
        options={{ headerShown: false }}
        component={Register}
      />
    </RootStack.Navigator>
  );
};

export default RootStackNavigation;

const styles = StyleSheet.create({});
