import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
} from "react-native-heroicons/outline";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { BaseUrl } from "../../Database/BaseUrl";

const BuyerSignUp = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleSignUp = () => {
    const signUpData = {
      username,
      email,
      password,
      phonenumber: phoneNumber, // Adjusting for backend field name
      role: "Customer", // Assuming this is a default value
    };

    axios
      .post(`${BaseUrl}Account/food-register`, signUpData, {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      })
      .then((response) => {
        console.log("Signup successful:", response.data);
        Alert.alert("Success", "Account created successfully.", [
          { text: "OK", onPress: () => navigation.navigate("LogIn") },
        ]);
      })
      .catch((error) => {
        console.error("Signup error:", error);
        Alert.alert("Error", "Failed to create account. Please try again.");
      });
  };

  return (
    <View className="flex-1 flex-col">
      <View>
        <Text className="mt-20 ml-6 font-extrabold text-yellow-400 text-3xl">
          YetaiEats
        </Text>
        <Text className="ml-6 mt-3 font-thin text-lg">Join YetaiEats Now!</Text>
        <View className="h-[85%] bg-yellow-400 rounded-[50px] rounded-b-none">
          <View className="bg-white w-[80%] h-12 rounded-[20px] mt-16 ml-10 flex-row items-center ">
            <UserIcon
              strokeWidth={2}
              size={30}
              color={"black"}
              style={{ marginLeft: 7 }}
            />
            <TextInput
              className="pl-1 w-[83%] h-7"
              placeholder="Enter Your UserName"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <View className="bg-white w-[80%] h-12 rounded-[20px] mt-8 ml-10 flex-row items-center">
            <EnvelopeIcon
              strokeWidth={2}
              size={30}
              color={"black"}
              style={{ marginLeft: 7 }}
            />
            <TextInput
              className="pl-1 w-[83%] h-7"
              placeholder="Enter Your Email"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View className="bg-white w-[80%] h-12 rounded-[20px] mt-8 ml-10 flex-row items-center ">
            <LockClosedIcon
              strokeWidth={2}
              size={30}
              color={"black"}
              style={{ marginLeft: 7 }}
            />
            <TextInput
              className="pl-1 w-[70%] h-7"
              placeholder="Enter Your Password"
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={{ marginRight: 20, fontSize: 16 }}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="bg-white w-[80%] h-12 rounded-[20px] mt-8 ml-10 flex-row items-center">
            <PhoneIcon
              strokeWidth={2}
              size={30}
              color={"black"}
              style={{ marginLeft: 7 }}
            />
            <TextInput
              className="pl-1 w-[83%] h-7"
              placeholder="Enter Your PhoneNumber"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          <TouchableOpacity
            onPress={handleSignUp}
            className="bg-white mt-24 w-60 mx-20 h-12 rounded-2xl flex justify-center items-center"
          >
            <Text className="text-yellow-400 font-bold text-xl">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BuyerSignUp;
