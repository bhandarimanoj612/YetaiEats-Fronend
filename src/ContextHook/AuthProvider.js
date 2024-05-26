// AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthStorage from "../components/AuthStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    token: null,
    username: null,
    email: null,
    roles: [],
    userId: null,
    userProfile: null,
    phoneNumber: null,
    address: null,
  });
  const authStorage = new AuthStorage();

  useEffect(() => {
    // Fetch user data from AsyncStorage
    const fetchUserData = async () => {
      const storedUser = await authStorage.getAccessToken();
      if (storedUser) {
        setUser(storedUser);
        setUserData(storedUser); // Set user data state
      }
    };

    fetchUserData();
  }, []);

  // Define the refreshUser function
  const refreshUser = async () => {
    const storedUser = await authStorage.getAccessToken();
    if (storedUser) {
      setUser(storedUser);
      setUserData(storedUser); // Set user data state
    }
  };

  // Define the updateUser function
  const updateUser = async (updatedUserData) => {
    setUser(updatedUserData);
    setUserData(updatedUserData);
    authStorage.setAccessToken(updatedUserData); // Update AsyncStorage

    // Update profile image in AsyncStorage
    const storedUser = await authStorage.getAccessToken();
    if (storedUser) {
      storedUser.userProfile = updatedUserData.userProfile;
      authStorage.setAccessToken(storedUser); // Update AsyncStorage
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        updateUser, // Pass updateUser down through the context
        token: userData.token,
        username: userData.username,
        email: userData.email,
        roles: userData.roles,
        userId: userData.userId,
        userProfile: userData.userProfile,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
