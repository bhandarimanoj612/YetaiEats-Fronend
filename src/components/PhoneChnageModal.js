import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";

const PhoneChangeModal = ({ visible, onClose, onSave }) => {
  const [newAddress, setNewAddress] = useState("");

  // Function to handle save changes
  const handleSaveChanges = () => {
    // Validate new address
    if (!newAddress.trim()) {
      Alert.alert("Error", "Please enter a valid address.");
      return;
    }
    // Call onSave function with new address
    onSave(newAddress);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: "white", padding: 20 }}>
          {/* Input field for new address */}
          <TextInput
            placeholder="Enter new Phone Number"
            placeholderTextColor={"gray"}
            value={newAddress}
            onChangeText={setNewAddress}
            style={{
              borderWidth: 1,
              borderColor: "lightgray",
              borderRadius: 5,
              padding: 10,
              marginBottom: 50,
            }}
          />
          {/* Button to save changes */}
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
          {/* Button to close modal */}
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

export default PhoneChangeModal;
