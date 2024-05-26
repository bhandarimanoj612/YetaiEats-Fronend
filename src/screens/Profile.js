import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { BackspaceIcon } from "react-native-heroicons/solid";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../ContextHook/AuthProvider";
import AddressChangeModal from "../components/AddressChangeModal";
import { BaseUrl, ProfileUrl } from "../../Database/BaseUrl";
import { useState } from "react";
import axios from "axios";
import UsernameChangeModal from "../components/UsernameChangeModal";
import PhoneChangeModal from "../components/PhoneChnageModal";
import ProfileImageChangeModal from "../components/ProfileImageChangeModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import PasswordChnageModal from "../components/PasswordChangeModal";
import PasswordChangeModal from "../components/PasswordChangeModal";

const Profile = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();

  console.log("user profile", user.userProfile);
  console.log("address", user.address);
  console.log("address", user.address);
  console.log("userid", user.userId);
  console.log("userid", user.phoneNumber);
  console.log("email", user.email);
  console.log("token", user.token);
  const [openModal, setOpenModal] = useState(false);
  const [openPModal, setOpenPModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Function to handle address change
  const handleChangeAddress = async (newAddress) => {
    try {
      // Make API call to update address
      const response = await axios.post(
        `${BaseUrl}Account/add-address?address=${newAddress}&userId=${user.userId}`
      );

      // Handle response
      if (response.status === 200) {
        // Update user's address locally
        updateUser({ ...user, address: newAddress });
        Alert.alert("Success", "Address updated successfully.");
      } else {
        Alert.alert("Error", "Failed to update address.");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      Alert.alert("Error", "An error occurred while updating address.");
    }
  };

  // Use the useFocusEffect hook to handle navigation logic when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (!user) {
        navigation.navigate("SignIn");
      }
    }, [user, navigation])
  );

  // change username

  const [openUsernameModal, setOpenUsernameModal] = useState(false);

  const handleChangeUsername = async (newUsername) => {
    try {
      // Make API call to update username
      const response = await axios.put(
        `${BaseUrl}Account/change-username/${user.userId}`,
        { newUsername }
      );

      if (response.status === 200) {
        // Update user's username locally
        updateUser({ ...user, username: newUsername });
        Alert.alert("Success", "Username updated successfully.");
      } else {
        Alert.alert("Error", "Failed to update username.");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      Alert.alert("Error", "An error occurred while updating username.");
    }
  };

  // change phone number
  // Function to handle address change
  const handleChangePhone = async (newPhone) => {
    try {
      // Make API call to update address
      const response = await axios.post(
        `${BaseUrl}Account/add-phoneNumber?phone=${newPhone}&userId=${user.userId}`
      );

      // Handle response
      if (response.status === 200) {
        // Update user's address locally
        updateUser({ ...user, phoneNumber: newPhone });
        Alert.alert("Success", "Address updated successfully.");
      } else {
        Alert.alert("Error", "Failed to update address.");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      Alert.alert("Error", "An error occurred while updating address.");
    }
  };

  // for image change

  // Function to handle profile image change
  const handleChangeProfileImage = async (newProfileImage) => {
    try {
      setOpenImageModal(true); // Open the ProfileImageChangeModal
    } catch (error) {
      console.error("Error updating profile image:", error);
      Alert.alert("Error", "An error occurred while updating profile image.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(
        `${BaseUrl}Account/delete-user/${user.userId}`
      );
      if (response.status === 200) {
        // Log out the user after successful deletion
        updateUser(null);
        // Remove all access tokens
        // Example: authStorage.removeAccessToken();
        onClose(); // Close the delete account modal
        // Navigate to login screen
        navigation.navigate("SignIn");
        Alert.alert("Success", "User deleted successfully.");
      } else {
        Alert.alert("Error", "Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Alert.alert(
        "Error",
        "An error occurred while deleting the user. Please try again."
      );
    }
  };

  const handleChnagePassword = () => {
    setOpenPasswordModal(true);
  };

  return (
    <View>
      <View className="mt-14 flex-row">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{ marginLeft: 15 }}
        >
          <BackspaceIcon strokeWidth={3} size={30} color={"red"} />
        </TouchableOpacity>
        <Text className="font-medium text-2xl ml-28">My Profile</Text>
      </View>

      <View className="items-center">
        <View className="flex flex-row">
          <Image
            source={{ uri: `${ProfileUrl}${user.userProfile}` }}
            className="w-24 h-24 rounded-full ml-7 mt-8"
          />
          <TouchableOpacity onPress={() => setOpenImageModal(true)}>
            <Text className="mt-10 font-bold">Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Image change modal */}
        <ProfileImageChangeModal
          visible={openImageModal}
          onClose={() => setOpenImageModal(false)}
          onSave={handleChangeProfileImage}
        />
        <View className="mt-4 ml-3">
          <Text className="text-lg">{user.username}</Text>
        </View>
      </View>

      <View>
        <TouchableOpacity
          className="mt-20 ml-8 mr-8"
          onPress={() => setOpenUsernameModal(true)}
        >
          <View className="items-center flex-row justify-between">
            <Text className="text-xl">My Name</Text>
            <Text className="font-thin">{user.username}</Text>
          </View>
        </TouchableOpacity>
        {/* Username change modal */}
        <UsernameChangeModal
          visible={openUsernameModal}
          onClose={() => setOpenUsernameModal(false)}
          onSave={handleChangeUsername}
        />
        <TouchableOpacity
          className="mt-10 ml-8 mr-8"
          onPress={() => setOpenPModal(true)}
        >
          <View className="items-center flex-row justify-between">
            <Text className="text-xl">Phone Number</Text>
            <Text className="font-thin">{user.phoneNumber}</Text>
          </View>
        </TouchableOpacity>
        {/* Phone number change*/}
        <PhoneChangeModal
          visible={openPModal}
          onClose={() => setOpenPModal(false)}
          onSave={handleChangePhone}
        />

        <TouchableOpacity className="mt-10 ml-8 mr-8">
          <View className="items-center flex-row justify-between">
            <Text className="text-xl">Email</Text>
            <Text className="font-thin">{user.email}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-10 ml-8 mr-8"
          onPress={() => setOpenModal(true)}
        >
          <View className="items-center flex-row justify-between">
            <Text className="text-xl">Address</Text>
            <Text className="font-thin">{user.address}</Text>
          </View>
        </TouchableOpacity>
        {/* Address change modal */}
        <AddressChangeModal
          visible={openModal}
          onClose={() => setOpenModal(false)}
          onSave={handleChangeAddress}
        />
      </View>
      {/* change password */}
      <TouchableOpacity
        className="mt-10 ml-8 mr-8"
        onPress={() => setOpenPasswordModal(true)}
      >
        <View className="items-center flex-row justify-between">
          <Text className="text-xl">Change Password</Text>
          <Text className="font-thin">New password</Text>
        </View>
      </TouchableOpacity>
      <PasswordChangeModal
        visible={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
        onSave={handleChnagePassword}
      />

      <TouchableOpacity
        className="bg-red-500 rounded-2xl h-12 w-52 ml-24 mt-20"
        onPress={() => setOpenDeleteModal(true)}
      >
        <Text className="text-xl font-medium text-white text-center pt-2">
          Delete Account
        </Text>
      </TouchableOpacity>

      {/* Delete modal */}
      <DeleteAccountModal
        visible={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onSave={handleDeleteAccount}
      />
    </View>
  );
};

export default Profile;
