import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  backgroundImage: {
    width: width,
    height: height,
  },
  container: {
    flex: 1,
    width: width,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  loginContainer: {
    alignItems: "center",
    height: height * 0.6,
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  loginText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "OpenSans_400Regular",
  },
});
