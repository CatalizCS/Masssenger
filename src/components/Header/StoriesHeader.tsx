import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

const StoriesHeader: React.FC<any> = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      >
        <Ionicons name="menu" size={30} color="blue" />
      </TouchableOpacity>
      <Text style={styles.title}>Stories</Text>

      <TouchableOpacity>
        {/* <Ionicons name="camera" size={24} color="blue" /> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default StoriesHeader;
