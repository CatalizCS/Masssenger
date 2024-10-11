import React from "react";
import { View, TextInput, Image, StyleSheet } from "react-native";

const SearchBar: React.FC<any> = () => {
  return (
    <View style={styles.searchBar}>
      <Image
        source={require("./assets/image-1.svg")}
        style={styles.searchIcon}
      />
      <TextInput
        placeholder="Search"
        placeholderTextColor="#424242"
        style={styles.searchInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#121212",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#bdbdbd",
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
});


export default SearchBar;
