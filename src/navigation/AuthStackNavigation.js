import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import SignUp from "../screens/auth/SignUp";
import SignIn from "../screens/auth/SignIn";

const AuthStack = createStackNavigator();
const AuthStackNavigation = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
        <AuthStack.Screen name="register" options={{ headerShown: false }} component={SignUp}/>
        <AuthStack.Screen name="login" options={{ headerShown: false }} component={SignIn}/>
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigation;

const styles = StyleSheet.create({});
