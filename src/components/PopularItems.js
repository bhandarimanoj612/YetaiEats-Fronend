import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import { BaseUrl, ProfileUrl } from "../../Database/BaseUrl";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";

const PopularItems = () => {
  const navigation = useNavigation();
  const [popularItems, setPopularItems] = useState([]);

  useEffect(() => {
    // Fetch popular items from the backend API
    axios
      .get(`${BaseUrl}Search/popular`)
      .then((response) => {
        // Set the popular items state with the data from the response
        setPopularItems(response.data);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error fetching popular items:", error);
      });
  }, []);

  const renderPopularItems = ({ item }) => {
    return (
      <View className="items-center">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProductDetails", { product: item })
          }
        >
          <Image
            className="rounded-3xl ml-3 mr-2"
            source={{ uri: `${ProfileUrl}${item.image}` }}
            style={{ height: 110, width: 120 }}
          />
        </TouchableOpacity>
        <Text>{item.itemName}</Text>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={popularItems}
        renderItem={renderPopularItems}
        keyExtractor={(item, index) => index.toString()} // Update keyExtractor
        horizontal
        pagingEnabled
      />
    </View>
  );
};

export default PopularItems;
