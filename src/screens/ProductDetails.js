import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { StarIcon, BackspaceIcon } from "react-native-heroicons/solid";
import {
  ClockIcon,
  PlusCircleIcon,
  MinusCircleIcon,
} from "react-native-heroicons/outline";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import PopularItems from "../components/PopularItems";
import VirtualizedScroll from "../components/VirtualizedScroll";
import { useEffect } from "react";
import axios from "axios";
import { BaseUrl, ProfileUrl } from "../../Database/BaseUrl";
import { Image } from "expo-image";

const ProductDetails = ({ route }) => {
  const navigation = useNavigation();
  const { product } = route.params;

  // Define state variables
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [popularItems, setPopularItems] = useState([]);

  // Function to fetch cart items from AsyncStorage
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

  // Use the useFocusEffect hook to fetch cart items when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchCartItems();
    }, [])
  );

  // Function to handle adding the product to the cart
  const handleAddToCart = async () => {
    const productWithQuantity = { ...product, quantity: 1 }; // Initialize quantity to 1
    let updatedCart = [];

    try {
      // Get existing cart data from AsyncStorage
      const cartData = await AsyncStorage.getItem("@cart_items");
      if (cartData !== null) {
        // If cart data exists, parse it
        updatedCart = JSON.parse(cartData);

        // Check if the product already exists in the cart
        const existingProductIndex = updatedCart.findIndex(
          (item) =>
            item.itemName === product.itemName &&
            item.businessName === product.businessName &&
            item.price === product.price
        );

        if (existingProductIndex !== -1) {
          // Product already exists in the cart, increase its quantity
          updatedCart[existingProductIndex].quantity += 1;
        } else {
          // Product doesn't exist in the cart, add it
          updatedCart.push(productWithQuantity);
        }
      } else {
        // Cart is empty, add the product directly
        updatedCart.push(productWithQuantity);
      }

      // Save updated cart to AsyncStorage
      await AsyncStorage.setItem("@cart_items", JSON.stringify(updatedCart));

      navigation.navigate("Cart"); // Navigate to the cart screen
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  console.log("business name ", product.businessName);
  //for similar item
  useEffect(() => {
    // Fetch popular items from the backend API
    axios
      .get(
        `${BaseUrl}Search/business-items?businessName=${product.businessName}`
      )
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
          {console.log(ProfileUrl, item.image)}
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
    <View className="absolute">
      <View>
        <Image
          source={{ uri: `${ProfileUrl}${product.image}` }}
          className="rounded-b-3xl"
          style={{ height: 340, width: 415 }}
        />
      </View>
      <View
        style={{ width: "90%" }}
        className="bg-gray-200 relative left-5 bottom-9 h-40 rounded-3xl"
      >
        <View className="items-center">
          <Image
            source={{ uri: `${ProfileUrl}${product.storeProfile} ` }}
            className="rounded-full mt-2"
            style={{ height: 70, width: 70 }}
          />
          <Text className="font-bold text-xl">{product.businessName}</Text>
        </View>

        <View className="ml-7 mt-2 flex-row items-center">
          <ClockIcon />
          <Text className="text-lg ml-2">{product.time}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{ bottom: "49%", position: "relative", marginLeft: 10 }}
      >
        <BackspaceIcon strokeWidth={3} size={30} color={"red"} />
      </TouchableOpacity>

      <Text className="bottom-12 ml-6 font-semibold text-xl text-yellow-400">
        {product.itemName}
      </Text>

      <View className="ml-7 mt-2 flex-row items-center bottom-12">
        <Text className="text-lg mr-2">Rating</Text>
        <StarIcon color={"yellow"} stroke={"black"} />
        <Text className=" ml-2 text-lg">{product.itemRating}</Text>
        <Text className="ml-44 text-lg text-red-600">Rs.{product.price}</Text>
      </View>
      <View className="flex-row justify-evenly bottom-2">
        <TouchableOpacity
          onPress={handleAddToCart}
          style={{ borderColor: "yellow" }}
          className="bg-yellow-400 rounded-2xl h-12 w-80"
        >
          <Text className="text-xl font-medium text-white text-center pt-2">
            Add to Cart
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-center text-base top-2">
        More from {product.businessName}
      </Text>
      <VirtualizedScroll className="top-7 ">
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
      </VirtualizedScroll>
      {/* <View className="top-7 "> */}
      {/* <MoreItems email={product.email} /> */}
      {/* <PopularItems /> */}
      {/* </View> */}
    </View>
  );
};

export default ProductDetails;
