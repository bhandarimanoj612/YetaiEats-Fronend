import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "../src/screens/SignUp";
import SignupHelp from "../src/screens/SignupHelp";
import LogIn from "../src/screens/LogIn";
import BuyerSignUp from "../src/screens/BuyerSignUp";
import IndividualSignUp from "../src/screens/IndividualSignUp";
import BusinessSignUp from "../src/screens/BusinessSignUp";
import DeliveryRiderSighup from "../src/screens/DeliveryRiderSighup";
import Route from "./Route";
import ProductDetails from "../src/screens/ProductDetails";
import Profile from "../src/screens/Profile";
import AuthStorage from "../src/components/AuthStorage";
import Search from "../src/components/Search";
import OrderHistory from "../src/components/OrderHistory";
import RateOrderItem from "../src/components/RateOrderItem";
import AboutUs from "../src/screens/AboutUs";

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authStorage = new AuthStorage();
      const token = await authStorage.getAccessToken();
      setIsLoggedIn(!!token);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return null; // You may want to show a loading indicator here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isLoggedIn ? "HomeScreen" : "LogIn"}
      >
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignupHelp" component={SignupHelp} />
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="HomeScreen" component={Route} />
        <Stack.Screen name="BuyerSignUp" component={BuyerSignUp} />
        <Stack.Screen name="IndividualSignUp" component={IndividualSignUp} />
        <Stack.Screen name="BusinessSignUp" component={BusinessSignUp} />
        {/* for seller */}
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="OrderHistory" component={OrderHistory} />
        <Stack.Screen name="RateOrderItem" component={RateOrderItem} />
        <Stack.Screen name="AboutUs" component={AboutUs} />
        <Stack.Screen
          name="DeliveryRiderSighup"
          component={DeliveryRiderSighup}
        />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
