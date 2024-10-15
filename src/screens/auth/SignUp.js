import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import CustomInput from "../../components/textInput";
import { useAuth } from "../../context/AuthContext";

const SignUp = () => {
  const [username, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const navigation = useNavigation();

  // API Call function
  const registerUser = async () => {
    setLoading(true); // Set loading to true before registration
    await register(username, fullName, password, confirmpassword); // Call registerUser
    setLoading(false); // Set loading to false after registration
    setUserName("");
    setFullName("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === "ios" ? 20 : 40 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            width: "80%",
            lineHeight: 40,
            marginTop: 20,
          }}
        >
          Hello! Register to get started
        </Text>

        <View style={{ marginTop: 40 }}>
          <CustomInput
            placeholder="Enter Username"
            value={username}
            onChangeText={(value) => setUserName(value)}
          />
          <CustomInput
            placeholder="Enter Fullname"
            value={fullName}
            onChangeText={(value) => setFullName(value)}
          />
          <CustomInput
            placeholder="Enter your Password"
            value={password}
            onChangeText={(value) => setPassword(value)}
            secureTextEntry={true}
            showEyeToggle={true}
          />
          <CustomInput
            placeholder="Confirm Password"
            value={confirmpassword}
            onChangeText={(value) => setConfirmPassword(value)}
            secureTextEntry={true}
            showEyeToggle={true}
          />
        </View>

        <View>
          {loading ? (
            <ActivityIndicator size="large" color="A020F0" />
          ) : (
            <View
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  marginTop: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 15,
                  backgroundColor: "#A020F0",
                  width: "80%",
                  borderRadius: 8,
                }}
                onPress={registerUser}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "500",
                  }}
                >
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            flexDirection: "row",
          }}
        >
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("login")}>
            <Text style={{ color: "#A020F0", fontWeight: "bold" }}>
              Login Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
