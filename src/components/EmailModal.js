import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { BaseUrl } from "../../Database/BaseUrl";
import axios from "axios";

const EmailModal = ({ visible, onClose, onSend }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendEmail = (email, message) => {
    // // Validate email and message

    // Make a POST request to your backend API endpoint
    axios
      .post(`${BaseUrl}Account/send-email?email=${email}&body=${message}`)
      .then((response) => {
        // Handle success response
        Alert.alert("Sucess", "Email sent successfully:");
        console.log("Email sent successfully:", response.data);
        onClose(); // Close the modal
      })
      .catch((error) => {
        // Handle error
        console.error("Error sending email:", error);
        // Optionally, display an error message to the user
        Alert.alert("Error", "Failed to send email. Please try again later.");
      });
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: "white", padding: 20 }}>
          {/* Input field for email */}
          <TextInput
            placeholder="Enter email"
            value={email}
            placeholderTextColor={"gray"}
            onChangeText={setEmail}
            style={{
              borderWidth: 1,
              borderColor: "lightgray",
              borderRadius: 5,
              padding: 10,
              marginBottom: 20,
            }}
          />
          {/* Input field for message */}
          <TextInput
            placeholder="Enter message"
            value={message}
            placeholderTextColor={"gray"}
            onChangeText={setMessage}
            style={{
              borderWidth: 1,
              borderColor: "lightgray",
              borderRadius: 5,
              padding: 10,
              marginBottom: 20,
            }}
            multiline={true}
          />
          {/* Button to send email */}
          <TouchableOpacity
            onPress={() => handleSendEmail(email, message)} // Pass email and message parameters
            style={{
              padding: 10,
              borderRadius: 5,
              alignItems: "center",
              backgroundColor: "green",
            }}
          >
            <Text style={{ color: "white" }}>Send Email</Text>
          </TouchableOpacity>
          {/* Button to close modal */}
          <TouchableOpacity onPress={onClose} style={{ borderRadius: 15 }}>
            <Text
              style={{
                backgroundColor: "red",
                color: "white",
                textAlign: "center",
                padding: 10,
                marginBottom: 350,
                marginTop: 10,
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

export default EmailModal;
