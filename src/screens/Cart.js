import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, FlatList } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BaseUrl, ProfileUrl } from "../../Database/BaseUrl";
import { useAuth } from "../ContextHook/AuthProvider";
import { Swipeable } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useStripe } from "@stripe/stripe-react-native";
import { Image } from "expo-image";

const Cart = ({ route }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigation = useNavigation();

  // Use the useAuth hook to access the user object
  const { user } = useAuth();

  // Check if user is available before accessing username
  const username = user ? user.username : null;
  console.log(username);

  const { initPaymentSheet, presentPaymentSheet } = useStripe(); //this is given by stripe

  const onCheckOut = async () => {
    try {
      // 1. Create Payment Intent
      const createPaymentIntentResponse = await axios.post(
        `${BaseUrl}Payment/intents`,
        {
          amount: totalPrice * 100, // Amount in cents
        }
      );

      // Check if the request was successful
      if (createPaymentIntentResponse.status === 200) {
        const clientSecret = createPaymentIntentResponse.data.clientSecret;

        // 2. Initialize the Payment Sheet
        const { error: paymentSheetError } = await initPaymentSheet({
          merchantDisplayName: "yetaiEats",
          paymentIntentClientSecret:
            createPaymentIntentResponse.data.clientSecret,
        });

        if (paymentSheetError) {
          console.error("Error initializing payment sheet:", paymentSheetError);
          Alert.alert("Error", paymentSheetError.message);
          return;
        }

        // 3. Present Payment Sheet from Stripe
        const { error: paymentError } = await presentPaymentSheet();

        if (paymentError) {
          console.error("Error presenting payment sheet:", paymentError);
          Alert.alert("Error", paymentError.message);
          return;
        }

        // 4. If Payment is successful, place the order

        handlePlaceOrder();
      } else {
        console.error(
          "Error creating payment intent:",
          createPaymentIntentResponse.data
        );
        Alert.alert(
          "Error",
          "Failed to create payment intent. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      Alert.alert(
        "Error",
        "Failed to complete checkout. Please try again later."
      );
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchCartItems = async () => {
        try {
          // Fetch cart items from AsyncStorage
          const cartData = await AsyncStorage.getItem("@cart_items");
          if (cartData !== null) {
            const parsedCartItems = JSON.parse(cartData);
            setCartItems(parsedCartItems);

            // Calculate total price when cart items change
            let totalPrice = 0;
            parsedCartItems.forEach((item) => {
              totalPrice += item.price * item.quantity;
            });
            setTotalPrice(totalPrice);
          }
        } catch (error) {
          console.error("Error fetching cart items from AsyncStorage:", error);
        }
      };

      fetchCartItems();
    }, [])
  );

  const handleQuantityChange = async (itemIndex, newQuantity) => {
    try {
      // Get the cart items from AsyncStorage
      const cartData = await AsyncStorage.getItem("@cart_items");
      if (cartData !== null) {
        // Parse the cart items
        let updatedCartItems = JSON.parse(cartData);

        // If the new quantity is less than or equal to 0, remove the item from the cart
        if (newQuantity <= 0) {
          updatedCartItems.splice(itemIndex, 1);
        } else {
          // Otherwise, update the quantity of the specific item
          updatedCartItems[itemIndex].quantity = newQuantity;
        }

        // Set the updated cartItems state
        setCartItems(updatedCartItems);

        // Update backend with new cart data
        await updateCartInLocalStorage(updatedCartItems);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleDeleteItem = async (itemIndex) => {
    try {
      // Get the cart items from AsyncStorage
      const cartData = await AsyncStorage.getItem("@cart_items");
      if (cartData !== null) {
        // Parse the cart items
        let updatedCartItems = JSON.parse(cartData);

        // Remove the item from the cart
        updatedCartItems.splice(itemIndex, 1);

        // Set the updated cartItems state
        setCartItems(updatedCartItems);

        // Update backend with new cart data
        await updateCartInLocalStorage(updatedCartItems);
      }
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };

  const updateCartInLocalStorage = async (cartData) => {
    try {
      // Update the cart in AsyncStorage
      await AsyncStorage.setItem("@cart_items", JSON.stringify(cartData));

      // Calculate total price when cart items change
      let totalPrice = 0;
      cartData.forEach((item) => {
        totalPrice += item.price * item.quantity;
      });
      setTotalPrice(totalPrice);
    } catch (error) {
      console.error("Error updating cart in local storage:", error);
    }
  };

  // Unique key extractor function
  const keyExtractor = (item, index) => `${item.id}_${index}`;

  const handlePlaceOrder = async () => {
    try {
      const orderPayload = {
        sellerName: cartItems.map((item) => item.businessName).join(", "),
        userName: username,
        itemName: cartItems.map((item) => item.itemName).join(", "),
        quantity: cartItems.reduce(
          (totalQuantity, item) => totalQuantity + item.quantity,
          0
        ),
        stripe: "success", // Update this after successful payment
        email: cartItems.map((item) => item.email).join(", "),
        totalPrice: totalPrice,
        category: cartItems.map((item) => item.category).join(","),
        address: user.address,
        phoneNumber: user.phoneNumber,
      };

      const response = await axios.post(
        `${BaseUrl}Order/createOrderS`,
        orderPayload
      );

      if (response.status === 200) {
        // Order placed successfully
        console.log("Order placed successfully:", response.data);
        Alert.alert("Order Placed", "Your order has been placed successfully!");
        // Clear only the cart data from AsyncStorage
        await AsyncStorage.removeItem("@cart_items");

        // Clear the cart items state
        setCartItems([]);
      } else {
        // Handle error
        console.error("Error placing order:", response.data);
        Alert.alert("Error", "Failed to place order. Please try again later.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "Failed to place order. Please try again later.");
    }
  };

  return (
    <GestureHandlerRootView>
      {/* Wrap your component with GestureHandlerRootView */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 70,
        }}
      >
        {cartItems.length > 0 ? (
          <>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={cartItems}
              keyExtractor={keyExtractor} // Using unique key extractor
              renderItem={({ item, index }) => (
                <Swipeable
                  renderRightActions={() => (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "red",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 10,
                        borderRadius: 10,
                        height: 90, // Adjust height as needed
                        width: 90, // Adjust width as needed
                      }}
                      onPress={() => handleDeleteItem(index)}
                    >
                      <Text style={{ color: "white" }}>Delete</Text>
                    </TouchableOpacity>
                  )}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: "white",
                      borderRadius: 5,
                      width: 390,
                      padding: 6,
                      marginBottom: 20,
                      alignItems: "center",
                    }}
                    key={item.id} // Ensure unique key for each item
                  >
                    <Image
                      style={{ width: 100, height: 90, borderRadius: 40 }}
                      // source={{ uri: item.image }}
                      source={{ uri: `${ProfileUrl}${item.image}` }}
                    />
                    <View style={{ width: 150, marginLeft: 10 }}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: "900",
                          color: "orange",
                          marginBottom: 7,
                        }}
                      >
                        {item.itemName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          marginBottom: 7,
                          fontWeight: "200",
                        }}
                      >
                        {item.businessName}
                      </Text>
                      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        Rs.{item.price}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontWeight: "700", fontSize: 15 }}>
                        {item.quantity}
                      </Text>
                      <View
                        style={{
                          width: 100,
                          height: 40,
                          backgroundColor: "orange",
                          borderRadius: 30,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingHorizontal: 10,
                          marginTop: 10,
                        }}
                      >
                        <TouchableOpacity
                          disabled={item.quantity < 2}
                          onPress={() =>
                            handleQuantityChange(index, item.quantity - 1)
                          }
                        >
                          <Icon name="remove" size={25} color={"white"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={item.quantity > 9}
                          onPress={() =>
                            handleQuantityChange(index, item.quantity + 1)
                          }
                        >
                          <Icon name="add" size={25} color={"white"} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Swipeable>
              )}
            />
            <View style={{ flexDirection: "row", marginBottom: 14 }}>
              <Text style={{ fontSize: 18 }}>Total Price : </Text>
              <Text style={{ fontSize: 18, color: "red" }}>
                Rs.{totalPrice}
              </Text>
            </View>
            <TouchableOpacity
              style={{ borderColor: "yellow", marginBottom: 24 }}
              className="bg-yellow-400 rounded-2xl h-12 w-80"
              onPress={onCheckOut}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "white",
                  textAlign: "center",
                  paddingTop: 2,
                }}
              >
                Place Order
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View>
              <LottieView
                autoPlay
                style={{ width: 550, height: 450, marginTop: 40 }}
                source={require("../../assets/images/Cart.json")}
              />
            </View>
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Text
                style={{ fontSize: 35, fontWeight: "100", marginBottom: 20 }}
              >
                Your cart is empty
              </Text>
              <Text
                style={{ fontWeight: "100", fontSize: 18, marginBottom: 50 }}
              >
                Add something to start ordering
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                style={{
                  backgroundColor: "lightgreen",
                  height: 50,
                  width: 250,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
                >
                  Browse Menu Lists
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default Cart;
