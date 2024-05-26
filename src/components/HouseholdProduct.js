import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BaseUrl, ProfileUrl } from "../../Database/BaseUrl";
import { Image } from "expo-image";
const RenderAllProducts = ({ item, index }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProductDetails", { product: item })}
      className="ml-1 mr-3 "
      style={{ height: 230, width: 180 }}
    >
      <View className="">
        <View className="">
          <Image
            className="rounded-3xl"
            source={{ uri: `${ProfileUrl} ${item.image} ` }}
            style={{ height: 155, width: 170 }}
          />
        </View>
        <View className="">
          <Text>{item.itemName}</Text>
          <Text>Rs.{item.price}</Text>
          <Text>{item.businessName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HouseholdProduct = () => {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BaseUrl}IndividualMenuItem`);
      setAllProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={allProducts}
        renderItem={({ item }) => <RenderAllProducts item={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default HouseholdProduct;
