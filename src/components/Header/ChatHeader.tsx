import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, Text } from "react-native";

const HeaderSection: React.FC<any> = ({ avatarUri, username }) => (
  <View style={styles.container}>
    <Image source={{ uri: avatarUri }} style={styles.image} />
    <Text style={styles.name}>{username}</Text>
    <Text style={styles.text}>Facebook</Text>
    <Text style={styles.textSecondary}>You're friends on Facebook</Text>
    <Text style={styles.textSecondary}>
      Primus to the King of Kandor in Krypton
    </Text>
    <Text style={styles.textSecondary}>Fighter from the El's family</Text>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>VIEW PROFILE</Text>
    </TouchableOpacity>
    <Text style={styles.date}>JAN 05 2021 AT 4:45PM</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 18,
  },
  textSecondary: {
    fontSize: 18,
    color: "#4d4d4d",
  },
  button: {
    backgroundColor: "#4d4d4d",
    borderRadius: 20,
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
  },
  date: {
    fontSize: 18,
    color: "#4d4d4d",
  },
});

export default HeaderSection;
