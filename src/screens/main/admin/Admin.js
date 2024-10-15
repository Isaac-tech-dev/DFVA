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
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { SvgXml } from "react-native-svg";
import { useAuth } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomInput from "../../../components/textInput";

const Admin = () => {
  const [greeting, setGreeting] = useState("");
  const [image, setImage] = useState("");
  const [base64, setBase64] = useState("");
  const [step, setStep] = useState(1);
  const [events, setEvents] = useState([]);
  const [eventname, setEventname] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventCard, setEventCard] = useState(false);
  const [eventId, setEventId] = useState("");
  const [eventN, setEventN] = useState("");
  const [result, setResult] = useState([]);

  const { logout } = useAuth();

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
    setResult([])
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

      setBase64(base64String);

      setImage(imageUri); // Assuming `setImage` is defined elsewhere
    }
  };

  const takePicture = async () => {
    setResult([])
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

      setBase64(base64String);

      setImage(imageUri); // Assuming `setImage` is defined elsewhere
    }
  };

  //API CALLS
  const addEvent = async () => {
    // Validate capacity
    if (capacity > 3) {
      Alert.alert("Error", "Capacity is set to a maximum of 3");
      return; // Return early to prevent further execution
    }

    setLoading(true);
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem("accessToken");

      console.log("Token", token);

      if (!token) {
        Alert.alert("Error", "No token found");
        return;
      }

      // Construct the request payload
      const requestBody = {
        eventName: eventname, // Assuming eventname is a string variable defined elsewhere
        capacity: parseInt(capacity, 10), // Ensure capacity is an integer
      };

      console.log("Request Body:", requestBody);

      // API call to register the event
      const response = await fetch(
        "https://optiweb.optimusbank.com:8025/dfvm/api/Event",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the Bearer token for authentication
          },
          body: JSON.stringify(requestBody), // Send the request payload as JSON
        }
      );

      const data = await response.json();

      // Check if the response is successful
      if (response.ok) {
        console.log("Event Registered Successfully", data.data);
        setStep(step - 2); // Adjust step on success
      } else {
        Alert.alert("Error", data.message || "Failed to register event");
      }
    } catch (error) {
      // Handle any errors during the API request
      Alert.alert("Error", "An error occurred while adding the event");
    } finally {
      // Stop loading indicator
      setLoading(false);
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

  const verifyEvent = async () => {
    // Validate capacity
    if (capacity > 3) {
      Alert.alert("Error", "Capacity is set to a maximum of 3");
      return; // Return early to prevent further execution
    }

    setLoading(true);
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem("accessToken");

      console.log("Token", token);

      if (!token) {
        Alert.alert("Error", "No token found");
        return;
      }

      // Construct the request payload
      const requestBody = {
        eventId: eventId, // Assuming eventname is a string variable defined elsewhere
        image: base64, // Ensure capacity is an integer
      };

      console.log("Request Body:", requestBody);

      // API call to register the event
      const response = await fetch(
        "https://optiweb.optimusbank.com:8025/dfvm/api/Event/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the Bearer token for authentication
          },
          body: JSON.stringify(requestBody), // Send the request payload as JSON
        }
      );

      const data = await response.json();

      // Check if the response is successful
      if (response.ok) {
        console.log("Verify Successfully", data.data);
        setResult(data.data);
        //setStep(step - 1); // Adjust step on success
      } else {
        Alert.alert("Error", data.responseMessage || "Failed to verify");
        console.log(data.responseMessage)
        setResult([])
      }
    } catch (error) {
      // Handle any errors during the API request
      Alert.alert("Error", "An error occurred while verifying");
    } finally {
      // Stop loading indicator
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents(); // Fetch events on component mount
  }, []);

  const renderEvent = ({ item }) => {
    return (
      <View className={`mb-[10px] py-[10px]`}>
        <TouchableOpacity
          className={`rounded-[20px] px-[20px] py-[20px] bg-[#A020F0]`}
          onPress={() => {
            setEventN(item.eventName), setEventId(item.id), setEventCard(false);
          }}
        >
          <Text className={`text-[#fff] text-[18px] font-bold`}>
            {item.eventName}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const CAMERA = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.2792 3C15.1401 3 15.9044 3.55086 16.1766 4.36754L16.7208 6H19C20.6569 6 22 7.34315 22 9V17C22 18.6569 20.6569 20 19 20H5C3.34315 20 2 18.6569 2 17V9C2 7.34315 3.34315 6 5 6H7.27924L7.82339 4.36754C8.09562 3.55086 8.8599 3 9.72076 3H14.2792ZM14.2792 5H9.72076L9.17661 6.63246C8.90438 7.44914 8.1401 8 7.27924 8H5C4.44772 8 4 8.44772 4 9V17C4 17.5523 4.44772 18 5 18H19C19.5523 18 20 17.5523 20 17V9C20 8.44772 19.5523 8 19 8H16.7208C15.8599 8 15.0956 7.44914 14.8234 6.63246L14.2792 5ZM9.5 12.5C9.5 11.1193 10.6193 10 12 10C13.3807 10 14.5 11.1193 14.5 12.5C14.5 13.8807 13.3807 15 12 15C10.6193 15 9.5 13.8807 9.5 12.5ZM12 8C9.51472 8 7.5 10.0147 7.5 12.5C7.5 14.9853 9.51472 17 12 17C14.4853 17 16.5 14.9853 16.5 12.5C16.5 10.0147 14.4853 8 12 8Z" fill="white"/>
</svg>
`;
  const LIBRARY = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.3091 3.35455L6.00909 0H0V20H20V3.35455H10.3091ZM18.1818 18.1818H1.81818V1.81818H5.39091L9.69091 5.17273H18.1818V18.1818Z" fill="white"/>
</svg>
`;

  return (
    <View
      className={`flex-1`}
      style={{ paddingTop: Platform.OS === "ios" ? 60 : 60 }}
    >
      {/* STEP 1 */}
      {step === 1 && (
        <View className={`flex-1 px-[20px]`}>
          <View className={`flex-[0.8]`}>
            {/* HEADER */}
            {/* HEADER */}
            <View className={`flex-row items-center justify-between mb-[40px]`}>
              <Text style={{ fontSize: 30, fontWeight: 900 }}>
                Welcome to DVFA
              </Text>
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
              <Text>{greeting}, Admin</Text>
            </View>
          </View>

          {/* BUTTON */}
          <View className={`flex-[0.2]`}>
            {/* RECOGNISE */}
            <View className={`mb-[20px] items-center justify-center`}>
              <TouchableOpacity
                onPress={() => setStep(step + 1)}
                style={{
                  backgroundColor: "#A020F0",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 20,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
                  Recognize
                </Text>
              </TouchableOpacity>
            </View>
            {/* ADD EVENT */}
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity
                onPress={() => setStep(step + 2)}
                style={{
                  backgroundColor: "#A020F0",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 20,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
                  Add Event
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <View style={{ paddingHorizontal: 20 }}>
          {/* HEADER */}
          <View className={`flex-row items-center justify-between mb-[40px]`}>
            <TouchableOpacity
              onPress={() => {
                setStep(step - 1),
                  setImage(""),
                  setResult([]),
                  setEventN(""),
                  setEventId("");
              }}
              className={`items-end justify-end`}
            >
              <Text style={{ fontSize: 15, fontWeight: 900, color: "red" }}>
                Back
              </Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 30, fontWeight: 900 }}>
              Welcome to DVFA
            </Text>
          </View>
          {/* GREETING */}
          <View style={{ marginBottom: 40 }}>
            <Text>{greeting}, Admin</Text>
          </View>
          {/* IMAGE*/}
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            {image ? (
              <View className={`mb-[40px]`}>
                <Image
                  source={{ uri: image }}
                  alt="Avatar"
                  style={{ width: 250, height: 250, borderRadius: 25 }}
                  className={`mb-[10px]`}
                />
                {result && (
                  <View className="flex-col space-y-2">
                    {/* Changed to flex-col for better vertical alignment */}
                    <View className="flex-row items-center space-x-2">
                      {/* Reduced space to a simpler value */}
                      <Text>Recognized Person:</Text>
                      <Text>{result.fullName || ""}</Text>
                      {/* Provide a fallback if fullName is not present */}
                    </View>
                    <View className="flex-row items-center space-x-2">
                      <Text>Event:</Text>
                      <Text>{result.eventName || ""}</Text>
                      {/* Provide a fallback if eventName is not present */}
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <Image
                source={require("../../../../assets/face.png")}
                alt="Avatar"
                style={{ width: 250, height: 250, borderRadius: 25 }}
                className={`mb-[40px]`}
              />
            )}
          </View>
          {/* PICK EVENT */}
          <View className={`mb-[20px]`}>
            <TouchableOpacity
              className={`px-[20px] py-[20px] bg-[#A020F0] rounded-[20px]`}
              onPress={() => setEventCard(true)}
            >
              <Text className={`text-[18px] text-[#fff] font-bold`}>
                {eventN ? eventN : "Pick Event"}
              </Text>
            </TouchableOpacity>
          </View>
          {/* ACTION */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
            className={`mb-[20px]`}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#A020F0",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 100,
                width: 80,
                height: 80,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={takePicture}
            >
              <SvgXml xml={CAMERA} width={50} height={50} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#A020F0",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 100,
                width: 80,
                height: 80,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={pickImage}
            >
              <SvgXml xml={LIBRARY} width={35} height={35} />
            </TouchableOpacity>
          </View>

          {/* BUTTON */}
          <View>
            <TouchableOpacity
              onPress={verifyEvent}
              className={`px-[20px] py-[20px] rounded-[20px] bg-[#A020F0] items-center justify-center`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
                  Verify
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 3 */}
      {/* ADD EVENTS */}
      {step === 3 && (
        <View style={{ paddingHorizontal: 20 }}>
          {/* HEADER */}
          <View className={`flex-row items-center justify-between mb-[40px]`}>
            <TouchableOpacity
              onPress={() => setStep(step - 2)}
              className={`items-end justify-end`}
            >
              <Text style={{ fontSize: 15, fontWeight: 900, color: "red" }}>
                Back
              </Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 30, fontWeight: 900 }}>
              Welcome to DVFA
            </Text>
          </View>

          {/* GREETING */}
          <View className={`mb-[20px]`}>
            <Text>Add Events</Text>
          </View>

          {/* FORM */}
          <View className={`space-y-[20px]`}>
            <CustomInput
              className={`px-[20px] py-[10px] border-[1px] border-[#2a2a2a]`}
              placeholder="Event Name"
              value={eventname}
              onChangeText={(text) => setEventname(text)}
            />
            <CustomInput
              className={`px-[20px] py-[10px] border-[1px] border-[#2a2a2a]`}
              value={capacity}
              placeholder="Capacity"
              onChangeText={(text) => setCapacity(text)}
            />

            <TouchableOpacity
              onPress={addEvent}
              className={`px-[20px] py-[20px] rounded-[20px] bg-[#A020F0] items-center justify-center`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
                  Add Event
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* MODAL */}
      <Modal transparent={true} animationType="fade" visible={eventCard}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setEventCard(false)}
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
          <View className={`w-[90%] rounded-xl p-3 bg-[#fff]`}>
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              renderItem={renderEvent}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Admin;

const styles = StyleSheet.create({});
