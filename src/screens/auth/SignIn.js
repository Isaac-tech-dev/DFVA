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

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const navigation = useNavigation();

  // API Call function
  const logUser = async () => {
    setLoading(true); // Set loading to true before registration
    await login(username, password); // Call registerUser
    setLoading(false); // Set loading to false after registration
    setUsername("");
    setPassword("");
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
            marginTop: 100,
          }}
        >
          Welcome back! Glad to see you, Again!
        </Text>

        <View style={{ marginTop: 40 }}>
          <CustomInput
            placeholder="Enter Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          {/* <CustomInput
            placeholder="Enter Username"
            value={username}
            onChangeText={(text) =>
              setUsername(text.charAt(0).toLowerCase() + text.slice(1))
            }
          /> */}
          <CustomInput
            placeholder="Enter your Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            showEyeToggle={true}
          />
        </View>

        <View>
          {loading ? (
            <ActivityIndicator size="large" color="#2a2a2a" />
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
                onPress={logUser}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "500", // Changed from 500 to "500"
                  }}
                >
                  Login
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
          <Text>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("register")}>
            <Text style={{ color: "#A020F0", fontWeight: "bold" }}>
              Register Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
