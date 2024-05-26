import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../src/screens/HomeScreen";
import Cart from "../src/screens/Cart";
import Maps from "../src/screens/Maps";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Account from "../src/screens/Account";
import { Text } from "react-native";

const Tab = createBottomTabNavigator();

const BottomNav = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={focused ? 28 : 20}
              color={focused ? "#FFD700" : "gray"}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color: focused ? "#FFD700" : "gray" }}>Home</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Maps"
        component={Maps}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="google-maps"
              size={focused ? 28 : 20}
              color={focused ? "#FFD700" : "gray"}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color: focused ? "#FFD700" : "gray" }}>Maps</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="cart-arrow-down"
              size={focused ? 28 : 20}
              color={focused ? "#FFD700" : "gray"}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color: focused ? "#FFD700" : "gray" }}>Cart</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="account"
              size={focused ? 28 : 20}
              color={focused ? "#FFD700" : "gray"}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color: focused ? "#FFD700" : "gray" }}>Account</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNav;
