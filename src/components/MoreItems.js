import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BaseUrl } from "../../Database/BaseUrl";
import { useAuth } from "../ContextHook/AuthProvider";
import { Image } from "expo-image";

const RenderAllProducts = ({ item, index }) => {
  const { user } = useAuth();

  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProductDetails", { product: item })}
      style={{ marginLeft: 10, marginRight: 10 }}
    >
      <View>
        <Image
          source={{ uri: item.image }}
          style={{ height: 100, width: 100, borderRadius: 10 }}
        />
        <Text>{item.itemName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const MoreItems = ({ email }) => {
  const [loading, setLoading] = useState(true);
  const [sellerItems, setSellerItems] = useState([]);

  useEffect(() => {
    fetchSellerItems();
  }, []);

  const fetchSellerItems = async () => {
    try {
      console.log({ email });
      const response = await fetch(
        `${BaseUrl}Search/specific-seller-items?userEmail=${email}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch seller items");
      }
      const data = await response.json();
      setSellerItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          horizontal
          data={sellerItems}
          renderItem={({ item }) => <RenderAllProducts item={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

export default MoreItems;
