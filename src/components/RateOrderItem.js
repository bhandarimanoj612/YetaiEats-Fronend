import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { BaseUrl } from "../../Database/BaseUrl";
import { useAuth } from "../ContextHook/AuthProvider";
import { Rating } from "react-native-ratings";
import { useFocusEffect } from "@react-navigation/native";

const RateOrderItem = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [uniqueItems, setUniqueItems] = useState([]);
  const [userRatings, setUserRatings] = useState([]);

  const { user } = useAuth();
  const username = user ? user.username : null;

  useEffect(() => {
    fetchOrderHistory();
    fetchUserRatings();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchOrderHistory();
      fetchUserRatings();
    }, [])
  );

  const fetchUserRatings = async () => {
    try {
      const response = await axios.get(
        `${BaseUrl}Rating/RatingsByUsername/${username}`
      );
      setUserRatings(response.data);
    } catch (error) {
      console.error("Error fetching user ratings:", error);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get(`${BaseUrl}Order/userList/${username}`);
      setOrderHistory(response.data);
      setLoading(false);
      const uniqueItems = filterUniqueItems(response.data);
      setUniqueItems(uniqueItems);
    } catch (error) {
      console.error("Error fetching order history:", error);
      setLoading(false);
    }
  };

  const filterUniqueItems = (items) => {
    const uniqueItemsMap = new Map();
    items.forEach((item) => {
      const key = `${item.sellerName}-${item.itemName}`;
      if (!uniqueItemsMap.has(key)) {
        uniqueItemsMap.set(key, item);
      }
    });
    return Array.from(uniqueItemsMap.values());
  };

  const handleRating = async (orderId, rating) => {
    try {
      const selectedItem = uniqueItems.find((item) => item.id === orderId);
      if (!selectedItem) {
        console.error("Selected item not found");
        return;
      }
      const response = await axios.post(`${BaseUrl}Rating/AddRateOrderItem`, {
        sellerName: selectedItem.sellerName,
        userName: username,
        itemName: selectedItem.itemName,
        email: selectedItem.email,
        itemRating: rating,
        category: selectedItem.category,
      });
      setRatings({ ...ratings, [orderId]: rating });
      setSelectedOrderId(null);
      if (rating === 0) {
        Alert.alert(
          "Rating Deleted",
          "Your rating has been deleted successfully."
        );
      } else if (ratings[orderId] === undefined) {
        Alert.alert(
          "Rating Submitted",
          "Your rating has been submitted successfully."
        );
      } else {
        Alert.alert(
          "Rating Updated",
          "Your rating has been updated successfully."
        );
      }
    } catch (error) {
      console.error("Error updating rating:", error);
      Alert.alert("Error", "Failed to update rating. Please try again later.");
    }
  };

  const handleButtonPress = (orderId, itemRating) => {
    if (itemRating === undefined) {
      setSelectedOrderId(orderId);
    } else {
      Alert.alert(
        "Rating Options",
        "Choose an option:",
        [
          {
            text: "Update Rating",
            onPress: () => handleRating(orderId, itemRating),
          },
          {
            text: "Delete Rating",
            onPress: () => handleRating(orderId, 0),
            style: "destructive",
          },
          { text: "Cancel", onPress: () => {} },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Purchased item</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#e6b400" />
      ) : (
        <FlatList
          data={uniqueItems}
          renderItem={({ item }) => {
            const userRating = userRatings.find(
              (rating) => rating.itemName === item.itemName
            );
            const hasRated = userRating !== undefined;

            return (
              <View style={styles.orderItem}>
                <Text style={styles.orderText}>Seller: {item.sellerName}</Text>
                <Text style={styles.orderText}>Items: {item.itemName}</Text>
                <Text style={styles.orderText}>Quantity: {item.quantity}</Text>
                <Text style={styles.orderText}>
                  Total Price: Rs.{item.totalPrice}
                </Text>
                {hasRated ? (
                  <Rating
                    readonly
                    startingValue={userRating.itemRating}
                    imageSize={30}
                  />
                ) : (
                  <Rating
                    showRating
                    onFinishRating={(rating) => handleRating(item.id, rating)}
                    startingValue={ratings[item.id] ?? 0}
                    imageSize={30}
                  />
                )}
                {hasRated && (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      handleButtonPress(item.id, userRating.itemRating)
                    }
                  >
                    <Text style={styles.buttonText}>
                      {userRating ? "Update Rating" : "Delete Rating"}
                    </Text>
                  </TouchableOpacity>
                )}
                {!hasRated && (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleButtonPress(item.id, ratings[item.id])}
                  >
                    <Text style={styles.buttonText}>
                      {ratings[item.id] === undefined
                        ? "Submit Rating"
                        : "Update Rating"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
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
  button: {
    marginTop: 10,
    backgroundColor: "#e6b400",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RateOrderItem;
