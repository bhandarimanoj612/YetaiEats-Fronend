import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";

const UsernameChangeModal = ({ visible, onClose, onSave }) => {
  const [newUsername, setNewUsername] = useState("");

  const handleSaveChanges = () => {
    // Validate new username
    if (!newUsername.trim()) {
      Alert.alert("Error", "Please enter a valid username.");
      return;
    }
    onSave(newUsername);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: "white", padding: 20 }}>
          <TextInput
            placeholderTextColor={"gray"}
            placeholder="Enter new username"
            value={newUsername}
            onChangeText={setNewUsername}
            style={{
              borderWidth: 1,
              borderColor: "lightgray",
              borderRadius: 5,
              padding: 10,
              marginBottom: 50,
            }}
          />
          <TouchableOpacity
            onPress={handleSaveChanges}
            style={{
              padding: 10,
              borderRadius: 5,
              alignItems: "center",
            }}
            className="bg-yellow-400"
          >
            <Text style={{ color: "white" }}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ borderRadius: 15 }}>
            <Text
              className="bg-red-500 text-white  "
              style={{
                textAlign: "center",
                marginTop: 10,
                marginBottom: 350,
                padding: 10,
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UsernameChangeModal;
