import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 215,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    maxWidth: 480,
    minHeight: 382,
    justifyContent: "center",
    alignItems: "stretch",
  },
  header: {
    alignItems: "center",
  },
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "SF Pro Display, sans-serif",
  },
  subtitle: {
    color: "rgba(31, 130, 242, 1)",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22,
    marginTop: 30,
    textAlign: "center",
    fontFamily: "SF Pro Display, sans-serif",
  },
});
