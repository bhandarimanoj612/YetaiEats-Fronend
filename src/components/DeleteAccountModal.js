import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import axios from "axios";
import { useAuth } from "../ContextHook/AuthProvider";
import { BaseUrl } from "../../Database/BaseUrl";

const DeleteAccountModal = ({ visible, onClose }) => {
  const { user, updateUser } = useAuth();

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(
        `${BaseUrl}Account/delete-user/${user.userId}`
      );
      if (response.status === 200) {
        Alert.alert("Success", "User deleted successfully.", [
          {
            text: "OK",
            onPress: () => {
              // Log out the user after successful deletion
              updateUser(null);
            },
          },
        ]);
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

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            width: "80%",
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 20 }}>
            Are you sure you want to delete your account?
          </Text>
          <TouchableOpacity
            onPress={handleDeleteAccount}
            style={{
              padding: 10,
              borderRadius: 5,
              alignItems: "center",
              backgroundColor: "#FF3B30",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "white" }}>Delete Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            style={{
              padding: 10,
              borderRadius: 5,
              alignItems: "center",
              backgroundColor: "#007AFF",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "white" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteAccountModal;
