import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { useAuth } from "../ContextHook/AuthProvider";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const HomeHeader = () => {
  // Use the useAuth hook to access the user object
  const { user, refreshUser } = useAuth(); // Assuming there's a function to refresh user data
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      // Fetch user data when the screen gains focus
      refreshUser().then(() => {
        setUsername(user ? user.username : null);
      });

      // Clean up function to clear the interval when the component unmounts
      return () => {};
    }, [])
  );

  return (
    <View className="bg-yellow-400 w-80 rounded-2xl ml-9 h-14 flex-row justify-around">
      {/*This is for the location section*/}
      <View className=" flex mr-14 ">
        <Text className="text-lg text-gray-400 ml-2">Hello</Text>
        <Text className="font-medium text-blue-400 text-lg ml-2 mb-2">
          {user?.username}
        </Text>
      </View>
      {/*This is for the search section*/}
      <View className="ml-20 mt-4">
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <MagnifyingGlassIcon size={33} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;
