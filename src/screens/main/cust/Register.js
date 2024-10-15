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
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../context/AuthContext";
import CustomInput from "../../../components/textInput";
import { SvgXml } from "react-native-svg";

const Register = ({ route }) => {
  const { eventId } = route.params;
  const [image, setImage] = useState("");
  const [base64, setBase64] = useState("");
  const [loading, setLoading] = useState(false);

  const { logout } = useAuth();
  const navigation = useNavigation();

  console.log("Event ID", eventId);

  const CAMERA = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.2792 3C15.1401 3 15.9044 3.55086 16.1766 4.36754L16.7208 6H19C20.6569 6 22 7.34315 22 9V17C22 18.6569 20.6569 20 19 20H5C3.34315 20 2 18.6569 2 17V9C2 7.34315 3.34315 6 5 6H7.27924L7.82339 4.36754C8.09562 3.55086 8.8599 3 9.72076 3H14.2792ZM14.2792 5H9.72076L9.17661 6.63246C8.90438 7.44914 8.1401 8 7.27924 8H5C4.44772 8 4 8.44772 4 9V17C4 17.5523 4.44772 18 5 18H19C19.5523 18 20 17.5523 20 17V9C20 8.44772 19.5523 8 19 8H16.7208C15.8599 8 15.0956 7.44914 14.8234 6.63246L14.2792 5ZM9.5 12.5C9.5 11.1193 10.6193 10 12 10C13.3807 10 14.5 11.1193 14.5 12.5C14.5 13.8807 13.3807 15 12 15C10.6193 15 9.5 13.8807 9.5 12.5ZM12 8C9.51472 8 7.5 10.0147 7.5 12.5C7.5 14.9853 9.51472 17 12 17C14.4853 17 16.5 14.9853 16.5 12.5C16.5 10.0147 14.4853 8 12 8Z" fill="white"/>
</svg>
`;
  const LIBRARY = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.3091 3.35455L6.00909 0H0V20H20V3.35455H10.3091ZM18.1818 18.1818H1.81818V1.81818H5.39091L9.69091 5.17273H18.1818V18.1818Z" fill="white"/>
</svg>
`;

  //API CALL
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
      setBase64(base64String);

      console.log("Image", imageUri);

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

      setBase64(base64String);

      console.log("Image", imageUri);

      setImage(imageUri); // Assuming `setImage` is defined elsewhere
    }
  };

  const addEvent = async () => {
    setLoading(true);
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        Alert.alert("Error", "No token found");
        return;
      }

      const fileExtension = image.split(".").pop();

      // Construct the request payload
      const requestBody = {
        eventId: eventId,
        imageReq: {
          base64Content: base64,
          extension: "png",
          fileName: "Image",
        },
      };

      const response = await fetch(
        "https://optiweb.optimusbank.com:8025/dfvm/api/Event/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass Bearer token here
          },
          body: JSON.stringify(requestBody), // Pass the JSON payload here
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Event Registered Successfully", data.data);
        navigation.navigate("Home");
        // Handle success, e.g., update state or navigate
      } else {
        Alert.alert("Error", data.message || "Failed to register event");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while registering the event");
    } finally {
      setLoading(false);
    }
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
        {/* IMAGE */}
        <View className={`mb-[40px]`}>
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
          {/* ACTION */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
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
        </View>

        {/* ADD EVENT */}
        <View>
          <TouchableOpacity
            className={`flex items-center justify-center px-[20px] py-[20px] rounded-[20px] bg-[#A020F0]`}
            onPress={addEvent}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
                Register
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({});
