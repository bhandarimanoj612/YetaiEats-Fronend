// ProfileImageChangeModal.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../ContextHook/AuthProvider";
import { BaseUrl, ProfileUrl } from "../../Database/BaseUrl";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
const ProfileImageChangeModal = ({ visible, onClose, onSave }) => {
  const [image, setImage] = useState(null);
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Camera permission is required to take a photo."
        );
      }
    })();
  }, []);

  // Function to handle profile image selection
  const handleImageSelect = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Camera permission is required to take a photo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage({
        uri: result.assets[0].uri,
        type: "image/jpeg",
        name: "profile-image.jpg",
      });
    }
  };

  // Function to handle profile image upload
  const handleUpload = async () => {
    try {
      if (!image) {
        Alert.alert("Error", "Please select an image before uploading.");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("file", {
        uri: image.uri,
        name: `profile-image-${Date.now()}.jpg`,
        type: "image/jpeg",
      });

      const response = await axios.put(
        `${BaseUrl}Account/change-profile-image/${user.userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response && response.data && response.data.imageUrl) {
        // Update the user's profile image locally
        const updatedImage = { uri: response.data.imageUrl };
        updateUser({ ...user, userProfile: response.data.imageUrl });
        onSave(updatedImage);
        onClose();
        Alert.alert("Success", "Profile image updated successfully.");
      } else {
        Alert.alert("Error", "Failed to update profile image.");
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      Alert.alert(
        "Error",
        "An error occurred while updating profile image. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const deletePickedImage = () => {
    setImage(null);
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
          {/* Render default image or selected image */}
          {image && (
            <View>
              <Image
                source={
                  image
                    ? { uri: image.uri }
                    : { uri: `${ProfileUrl}${user.userProfile}` }
                }
                style={{ width: 200, height: 200, borderRadius: 10 }}
                className="rounded-full ml-10 mt-2"
              />
              <TouchableOpacity
                onPress={deletePickedImage}
                style={{
                  padding: 10,
                  borderRadius: 5,
                  alignItems: "center",
                  backgroundColor: "#FF3B30",
                  marginBottom: 20,
                  marginTop: 20,
                }}
              >
                <Icon name="delete-empty" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            onPress={handleImageSelect}
            style={{
              padding: 10,
              borderRadius: 5,
              alignItems: "center",
              marginBottom: 20,
            }}
            className="bg-yellow-500"
          >
            <Icon name="image-edit" size={20} color="white" />
            {/* Adjust size and color as needed */}
          </TouchableOpacity>
          {/* Button to upload image */}
          <TouchableOpacity
            onPress={handleUpload}
            style={{
              padding: 10,
              borderRadius: 5,
              alignItems: "center",
              backgroundColor: "green",
            }}
          >
            <Text style={{ color: "white" }}>Upload Image</Text>
          </TouchableOpacity>
          {/* Button to close modal */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              padding: 10,
              borderRadius: 5,
              alignItems: "center",
              backgroundColor: "#FF3B30",
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

export default ProfileImageChangeModal;
