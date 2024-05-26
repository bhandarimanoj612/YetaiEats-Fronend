import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
import {
  ArrowLeftOnRectangleIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthStorage from "../components/AuthStorage";
import { useAuth } from "../ContextHook/AuthProvider";
import { ProfileUrl } from "../../Database/BaseUrl";

const Account = () => {
  const navigation = useNavigation();
  const authStorage = new AuthStorage();
  const { user } = useAuth();

  const handleLogout = async () => {
    // Remove user token from AsyncStorage
    await authStorage.removeAccessToken();
    // Navigate to login screen after logout
    navigation.navigate("LogIn");
  };

  // Prevent navigation back to Account screen after logout
  useFocusEffect(
    React.useCallback(() => {
      if (!user) {
        navigation.goBack();
      }
    }, [user, navigation])
  );

  return (
    <View>
      <View className="mt-14 justify-between items-center flex-row">
        <Text className="font-medium text-2xl ml-36">My Account</Text>
        <TouchableOpacity onPress={handleLogout}>
          <ArrowLeftOnRectangleIcon
            color={"black"}
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center">
        <View>
          <Image
            source={{ uri: `${ProfileUrl}${user.userProfile}` }}
            className="w-24 h-24 rounded-full ml-7 mt-8"
          />
        </View>
        <View className="mt-6 ml-3">
          <Text className="text-lg">{user?.username}</Text>
          <Text className="font-thin mt-2">{user?.email}</Text>
        </View>
      </View>

      {/*This view is for navigating to different account related things */}
      <View>
        <TouchableOpacity
          className="mt-12 ml-8"
          onPress={() => {
            navigation.navigate("Profile");
          }}
        >
          <View className="items-center flex-row justify-between">
            <Text className="text-xl">Profile</Text>
            <ChevronRightIcon color={"black"} style={{ marginRight: 15 }} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-12 ml-8"
          onPress={() => navigation.navigate("OrderHistory")}
        >
          <View className="items-center flex-row justify-between">
            <Text className="text-xl">Order History</Text>
            <ChevronRightIcon color={"black"} style={{ marginRight: 15 }} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-12 ml-8"
          onPress={() => navigation.navigate("RateOrderItem")}
        >
          <View className="items-center flex-row justify-between">
            <Text className="text-xl">Rate Items</Text>
            <ChevronRightIcon color={"black"} style={{ marginRight: 15 }} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-12 ml-8"
          onPress={() => navigation.navigate("AboutUs")}
        >
          <View className="items-center flex-row justify-between">
            <Text className="text-xl">About Us</Text>
            <ChevronRightIcon color={"black"} style={{ marginRight: 15 }} />
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={handleLogout} // Call handleLogout function on press
        className="bg-yellow-400 rounded-2xl h-12 w-52 ml-24 mt-20"
      >
        <Text className="text-xl font-medium text-white text-center pt-2">
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Account;
