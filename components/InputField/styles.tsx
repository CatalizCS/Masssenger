import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    fontFamily: 'OpenSans_400Regular',
  },
  label: {
    color: "#000000",
    fontSize: 14,
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#BABABA",
    borderRadius: 8,
    height: 48,
    display: "flex",
    alignItems: "center",
    paddingLeft: 14,
  },
  input: {
    color: "#FFFFFF",
    fontSize: 16,
    backgroundColor: "transparent",
    flex: 1,
  },
  caption: {
    color: "#BABABA",
    fontSize: 12,
    marginTop: 4,
  },
});
