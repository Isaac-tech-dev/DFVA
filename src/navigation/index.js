import React from "react";
import { NavigationContainer } from "@react-navigation/native";
//import { AuthProvider, useAuth } from './AuthContext'; // Import your AuthContext
import AuthStackNavigation from "./AuthStackNavigation";
import RootStackNavigation from "./RootStackNavigation";
import RootAdminStackNavigation from "./RootAdminStackNavigation";
import { AuthProvider, useAuth } from "../context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

const AuthNavigator = () => {
  const { isAuthenticated, isAdmin } = useAuth(); // Get authentication status from context

  // If not authenticated, show AuthStack for login/registration
  if (!isAuthenticated) {
    return <AuthStackNavigation />;
  }

  // If authenticated and admin, show RootAdminStack
  if (isAdmin) {
    return <RootAdminStackNavigation />;
  }

  // If authenticated as a regular user, show RootStack
  return <RootStackNavigation />;
};

export default App;
