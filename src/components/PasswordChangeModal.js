import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useAuth } from "../ContextHook/AuthProvider";
import { BaseUrl } from "../../Database/BaseUrl";

const PasswordChangeModal = ({ visible, onClose }) => {
  const { user, updateUser } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChangePassword = async () => {
    try {
      const response = await axios.post(
        `${BaseUrl}Account/change-passwordWithOldPassword/${user.userId}`,
        {
          oldPassword,
          newPassword,
          confirmPassword,
        }
      );

      if (response.status === 200) {
        // Password changed successfully
        Alert.alert("Success", "Password changed successfully.");
        onClose(); // Close the modal
      } else {
        // Handle error response
        Alert.alert("Error", response.data.message); // Assuming the error response has a 'message' property
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "An error occurred while changing the password.");
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            placeholder="Old Password"
            value={oldPassword}
            placeholderTextColor={"gray"}
            onChangeText={setOldPassword}
            style={styles.input}
            secureTextEntry={!showPassword}
          />
          <TextInput
            placeholder="New Password"
            placeholderTextColor={"gray"}
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            secureTextEntry={!showPassword}
          />
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            placeholderTextColor={"gray"}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeButtonText}>
              {showPassword ? "Hide" : "Show"} Password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-yellow-400"
            onPress={handleChangePassword}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.button, { backgroundColor: "red" }]}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    padding: 20,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  eyeButton: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  eyeButtonText: {
    color: "blue",
  },
});

export default PasswordChangeModal;
