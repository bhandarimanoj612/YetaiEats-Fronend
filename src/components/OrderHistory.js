import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { BaseUrl } from "../../Database/BaseUrl";
import { useAuth } from "../ContextHook/AuthProvider";
import { AirbnbRating } from "react-native-ratings";

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Use the useAuth hook to access the user object
  const { user } = useAuth();
  // Check if user is available before accessing username
  const username = user ? user.username : null;

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get(`${BaseUrl}Order/userList/${username}`);
      setOrderHistory(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order history:", error);
      setLoading(false);
    }
  };

  const handleRating = (orderId, rating) => {
    // Here you can send the rating to your backend
    // For simplicity, we'll just update the local state
    setRatings({ ...ratings, [orderId]: rating });
    setSelectedOrderId(null);
    // You can uncomment the following line to show an alert
    // Alert.alert("Rating", `You rated order ${orderId} as ${rating} stars`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={orderHistory}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.orderText}>
                Category:
                {item.category === "MenuItems"
                  ? " Rasturant Seller Items"
                  : "Individual Sellers Items"}
              </Text>

              <Text style={styles.orderText}>Seller: {item.sellerName}</Text>
              <Text style={styles.orderText}>Items: {item.itemName}</Text>
              <Text style={styles.orderText}>Quantity: {item.quantity}</Text>
              <Text style={styles.orderText}>
                Total Price: Rs.{item.totalPrice}
              </Text>

              <Text style={styles.orderText}>
                Order Time:{" "}
                {new Date(item.orderTime).toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </Text>
              <Text style={styles.orderText}>Payment : {item.stripe}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  orderItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default OrderHistory;
