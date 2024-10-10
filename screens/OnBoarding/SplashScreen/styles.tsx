import {  StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "OpenSans_700Bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "OpenSans_400Regular",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  footer: {
    fontSize: 12,
    fontFamily: "OpenSans_400Regular",
    position: "absolute",
    bottom: 20,
  },
});
