import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

const SearchBar = () => (
  <View style={styles.searchContainer}>
    <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
    <TextInput
      style={styles.searchInput}
      placeholder="Search"
      placeholderTextColor="gray"
    />
  </View>
);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
});

export default SearchBar;
