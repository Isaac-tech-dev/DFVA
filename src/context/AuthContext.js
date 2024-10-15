import React, { createContext, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const register = async (username, fullName, password, confirmPassword) => {
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please check your passwords.");
      return;
    }

    try {
      const response = await fetch(
        "https://optiweb.optimusbank.com:8025/dfvm/api/Auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: username,
            fullName: fullName,
            password: password,
            confirmPassword: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Handle success (e.g., navigate to login or home)
        alert("Registration Successful! Welcome!");
        console.log("SignUp Succesful");
        // Optionally navigate to the login screen or other
      } else {
        // Handle error (e.g., show error message)
        alert(JSON.stringify(data.message));
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    }
  };

  const login = async (username, password) => {
    // Check for admin credentials
    if (username === "Admin" && password === "admin") {
      try {
        const response = await fetch(
          "https://optiweb.optimusbank.com:8025/dfvm/api/Auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
              password: password,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Handle successful login
          setIsAuthenticated(true);
          setIsAdmin(true);

          // Store the access token (assumes accessToken is returned in the response)
          const accessToken = data.data.accessToken; // Update this based on your API response structure
          const User = data.data.displayName; // Update this based on your API response structure

          console.log("AccessToken------", accessToken);

          // Store token in AsyncStorage
          await AsyncStorage.setItem("accessToken", accessToken);

          //alert("Login Successful! Welcome!");
          console.log("Login Successful");
          // Optionally navigate to user home screen or other
        } else {
          // Handle login error
          alert(data.message || "Login failed. Please check your credentials.");
        }
      } catch (error) {
        alert("An error occurred. Please try again later.");
        console.error("Login Error:", error);
      }
    } else if (username && password) {
      try {
        const response = await fetch(
          "https://optiweb.optimusbank.com:8025/dfvm/api/Auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
              password: password,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Handle successful login
          setIsAuthenticated(true);
          setIsAdmin(false);

          // Store the access token (assumes accessToken is returned in the response)
          const accessToken = data.data.accessToken; // Update this based on your API response structure
          const User = data.data.displayName;

          // Store token in AsyncStorage
          await AsyncStorage.setItem("accessToken", accessToken);
          await AsyncStorage.setItem("user", User);

          console.log("AccessToken------", accessToken);
          console.log("User------", User);

          //alert("Login Successful! Welcome!");
          console.log("Login Successful");
          // Optionally navigate to user home screen or other
        } else {
          // Handle login error
          alert(data.message || "Login failed. Please check your credentials.");
        }
      } catch (error) {
        alert("An error occurred. Please try again later.");
        console.error("Login Error:", error);
      }
    } else {
      alert("Please enter both username and password.");
    }
  };

  const removeToken = async () => {
    try {
      // Remove the accessToken from AsyncStorage
      await AsyncStorage.clear(); // Use this carefully
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("user");
      console.log("Token removed successfully");
      // Optionally, you can show an alert or update state after removing the token
      //Alert.alert("Success", "Access token has been removed.");
    } catch (error) {
      // Handle any errors that occur during the removal
      console.error("Error removing token:", error);
      //Alert.alert("Error", "Failed to remove access token.");
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    await AsyncStorage.clear();
    console.log("Token removed successfully");
   //await removeToken();
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAdmin, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
