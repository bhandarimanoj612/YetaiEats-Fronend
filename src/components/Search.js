import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { BaseUrl, ProfileUrl } from "../../Database/BaseUrl";
import { useNavigation } from "@react-navigation/native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { Image } from "expo-image";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const navigation = useNavigation();
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BaseUrl}Search/popular`);
      if (response.status === 200) {
        const filteredResults = response.data.filter((item) =>
          item.itemName.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchResults(filteredResults);
        setFetchError(null);
      } else {
        setFetchError("Failed to fetch search results");
      }
    } catch (error) {
      setFetchError("Failed to fetch search results: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          style={styles.input}
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <View className="pr-8">
          <MagnifyingGlassIcon size={33} />
        </View>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e6b400" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : fetchError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{fetchError}</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProductDetails", { product: item })
              }
              style={styles.itemContainer}
            >
              <View style={styles.itemInnerContainer}>
                {/* <Image source={{ uri: item.image }} style={styles.itemImage} /> */}
                <Image
                  source={{ uri: `${ProfileUrl}${item.image}` }}
                  style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.itemName}</Text>
                  <Text style={styles.itemAddress}>Price: {item.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  searchContainer: {
    marginTop: 10,
    marginBottom: 10,
    marginRight: 30,
    marginLeft: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fcd34d",
    borderRadius: 20,
  },
  input: {
    width: "90%",
    marginLeft: "5%",
    backgroundColor: "#fcd34d",
    borderRadius: 20,
    paddingLeft: 15,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  itemContainer: {
    marginLeft: 3,
    marginRight: 3,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
  },

  itemInnerContainer: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    height: 120,
    width: 130,
    borderRadius: 10,
  },
  itemDetails: {
    marginLeft: 40,
  },
  itemName: {
    fontSize: 28,
    fontWeight: "bold",
  },
  itemAddress: {
    fontSize: 16,
  },
  separator: {
    height: 10,
  },
});

export default Search;
