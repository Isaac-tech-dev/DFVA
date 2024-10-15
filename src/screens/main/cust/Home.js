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
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const [greeting, setGreeting] = useState("");
  const [user, setUser] = useState(null);
  const [image, setImage] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const { logout } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData !== null) {
          const parsedUser = (userData);
          setUser(parsedUser);
        } else {
          console.log("No user found");
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Get the current hour
    const currentHour = new Date().getHours();

    // Determine the greeting based on the time of day
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour >= 12 && currentHour < 16) {
      setGreeting("Good Afternoon");
    } else if (currentHour >= 16 && currentHour < 20) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }
  }, []);

  const requestPermission = async (requestFunction, permissionType) => {
    const { status } = await requestFunction();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        `Nawo needs access to your ${permissionType} to proceed.`,
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission(
      ImagePicker.requestMediaLibraryPermissionsAsync,
      "media library"
    );
    if (!hasPermission) {
      Alert.alert(
        "Permission Denied",
        "You need to grant camera roll permissions to pick an image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      const base64String = result.assets[0].base64;

      setImage(imageUri); // Assuming `setImage` is defined elsewhere
    }
  };

  const takePicture = async () => {
    // Ask for permission to access the camera
    if (Platform.OS !== "web") {
      const hasPermission = await requestPermission(
        ImagePicker.requestCameraPermissionsAsync,
        "camera"
      );
      if (!hasPermission) {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera permissions to make this work!"
        );
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      const base64String = result.assets[0].base64;

      setImage(imageUri); // Assuming `setImage` is defined elsewhere
    }
  };

  const getEvents = async () => {
    setLoading(true);
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        Alert.alert("Error", "No token found");
        return;
      }

      const response = await fetch(
        "https://optiweb.optimusbank.com:8025/dfvm/api/Event",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass Bearer token here
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Data", data.data);
        setEvents(data.data);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch events");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while fetching events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents(); // Fetch events on component mount
  }, []);

  const renderEvent = ({ item }) => {
    return (
      <View style={styles.eventContainer}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#A020F0",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
          }}
          onPress={() => navigation.navigate("Register", { eventId: item.id })}
        >
          <Text style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ paddingTop: Platform.OS === "ios" ? 60 : 60 }}>
      <View style={{ paddingHorizontal: 20 }}>
        {/* HEADER */}
        <View className={`flex-row items-center justify-between mb-[40px]`}>
          <Text style={{ fontSize: 30, fontWeight: 900 }}>Welcome to DVFA</Text>
          <TouchableOpacity
            onPress={logout}
            className={`items-end justify-end`}
          >
            <Text style={{ fontSize: 15, fontWeight: 900, color: "red" }}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
        {/* GREETING */}
        <View>
          <Text style={{ fontSize: 18, fontWeight: 900 }}>
            {greeting}, {user}
          </Text>
        </View>
        {/* REGISTER FOR EVENT */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: 400 }}>
            Register for an Event
          </Text>
        </View>
        {/* EVENT */}
        <View className={``}>
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={renderEvent}
          />
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  eventContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  eventName: {
    fontSize: 18,
  },
});
